// Server-side PDF report generator (Tier 2).
//
// Given a username, this:
//   1. loads that user's page visits from the PHP API,
//   2. reduces them to one entry per page in first-visit order,
//   3. renders each page in headless Chromium (real browser → MathJax + canvas
//      simulations render faithfully; canvas sims show their initial layout),
//   4. prints each to PDF and merges the pages into a single document.
//
// Pages are loaded with `?print=1&session_id=<username>` so the Angular app
// hydrates the user's answers but skips its resume-redirect and progress saving
// (see src/app/core/print-mode.ts).

import type { Browser, HTTPRequest } from 'puppeteer';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { firstVisitPages, RawVisit } from './report-pages';

export interface ReportOptions {
    username: string;
    /** Origin of the Angular app to render, e.g. "http://localhost:4000". */
    origin: string;
    /** Origin of the PHP API, e.g. "http://localhost:8000". */
    apiBaseUrl: string;
}

export class ReportUserNotFoundError extends Error {}

const PAGE_TIMEOUT_MS = 30_000;

// Proxies the app's own /api/* calls (progress hydration) through to the PHP API,
// and lets everything else (app assets, MathJax CDN, images) load normally.
function makeApiProxy(apiBaseUrl: string) {
    return async (request: HTTPRequest) => {
        const url = request.url();
        const apiIdx = url.indexOf('/api/');
        if (apiIdx < 0) {
            await request.continue();
            return;
        }
        try {
            const target = apiBaseUrl.replace(/\/$/, '') + url.slice(apiIdx);
            const res = await fetch(target, {
                method: request.method(),
                headers: request.headers() as Record<string, string>,
                body: ['GET', 'HEAD'].includes(request.method()) ? undefined : request.postData(),
            });
            const body = Buffer.from(await res.arrayBuffer());
            await request.respond({
                status: res.status,
                contentType: res.headers.get('content-type') ?? 'application/json',
                body,
            });
        } catch {
            // Treat an unreachable API as "no progress" — the content still renders.
            await request.respond({ status: 404, contentType: 'application/json', body: '{}' });
        }
    };
}

async function fetchPageVisits(opts: ReportOptions): Promise<RawVisit[]> {
    const url = `${opts.apiBaseUrl.replace(/\/$/, '')}/api/progress/${encodeURIComponent(opts.username)}`;
    const res = await fetch(url);
    if (res.status === 404) {
        throw new ReportUserNotFoundError(`No progress found for user "${opts.username}"`);
    }
    if (!res.ok) {
        throw new Error(`Failed to load progress: HTTP ${res.status}`);
    }
    const data = (await res.json()) as { pageVisits?: RawVisit[] };
    return data.pageVisits ?? [];
}

// Renders a single URL to a PDF page buffer. Returns null on failure so one bad
// page never aborts the whole report.
async function renderPage(
    browser: Browser,
    opts: ReportOptions,
    pageUrl: string,
): Promise<Uint8Array | null> {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1024, height: 1400, deviceScaleFactor: 2 });
        await page.setRequestInterception(true);
        page.on('request', makeApiProxy(opts.apiBaseUrl));

        const sep = pageUrl.includes('?') ? '&' : '?';
        const full = `${opts.origin}${pageUrl}${sep}session_id=${encodeURIComponent(opts.username)}&print=1`;

        await page.goto(full, { waitUntil: 'networkidle0', timeout: PAGE_TIMEOUT_MS });

        // Let MathJax finish typesetting and give imperative canvas draws (e.g. the
        // simulations' initial layout, drawn in ngAfterViewInit) a moment to paint.
        await page
            .evaluate(async () => {
                const mj = (window as unknown as { MathJax?: any }).MathJax;
                if (mj?.startup?.promise) await mj.startup.promise;
                if (mj?.typesetPromise) await mj.typesetPromise();
            })
            .catch(() => { /* no MathJax on this page */ });
        await new Promise((r) => setTimeout(r, 400));

        return await page.pdf({ format: 'A4', printBackground: true });
    } catch (err) {
        console.error(`Report: failed to render ${pageUrl}:`, err);
        return null;
    } finally {
        await page.close().catch(() => {});
    }
}

async function mergePdfs(buffers: Uint8Array[]): Promise<Uint8Array> {
    const merged = await PDFDocument.create();
    for (const buf of buffers) {
        const doc = await PDFDocument.load(buf);
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
    }
    return merged.save();
}

export async function generateReportPdf(opts: ReportOptions): Promise<Uint8Array> {
    const visits = await fetchPageVisits(opts);
    const pages = firstVisitPages(visits);
    if (pages.length === 0) {
        throw new ReportUserNotFoundError(`User "${opts.username}" has no page visits to report`);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const buffers: Uint8Array[] = [];
        // Sequential: canvas/MathJax rendering is CPU-heavy and each page also hits
        // the same Express instance, so parallelism buys little and risks flakiness.
        for (const p of pages) {
            const pdf = await renderPage(browser, opts, p.url);
            if (pdf) buffers.push(pdf);
        }
        if (buffers.length === 0) {
            throw new Error('No pages could be rendered for the report');
        }
        return await mergePdfs(buffers);
    } finally {
        await browser.close().catch(() => {});
    }
}
