// Authoring tool — generates the pre-rendered report template PDFs.
//
// For each learning route it opens the running app in headless Chromium, waits
// for MathJax + canvas to render, and prints the page to a PDF under
// api/report_templates/. A bottom page margin is reserved so the answer-zone
// that report.php stamps into (bottom of every page) stays blank.
//
// This runs ONLY at authoring time, in dev — Chromium/Puppeteer never ship to
// production (the server report path is pure PHP). Re-run it whenever page
// content changes.
//
// Usage:
//   1. Start the app dev server:            cd frontend && ng serve
//   2. Install the dev-only dependency:     npm install   (puppeteer is a devDependency)
//      then, once:                          npx puppeteer browsers install chrome
//   3. Generate templates:                  node tools/generate-report-templates.mjs
//
// Options (env vars):
//   BASE_URL   app origin to render      (default http://localhost:4200)
//   OUT_DIR    output directory          (default ../api/report_templates)

import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4200';
const OUT_DIR = process.env.OUT_DIR ?? join(__dirname, '../../api/report_templates');

// Query appended to every route while printing. `solutions=1` puts the
// evaluation components into solutions-reveal mode (correct answers shown +
// explanations) — see src/app/core/report-mode.ts. It is dev-only, so it works
// here (ng serve) but is ignored in production builds.
const CONTENT_QUERY = 'solutions=1';

// Reserve the answer-zone at the bottom of every page. Must match the y-offset
// of ANSWER_ZONE_DEFAULT in api/report.php (y = 245 mm on a 297 mm A4 page).
const BOTTOM_MARGIN = '52mm';

// Route → template base name + subpage count. Multi-subpage learning features
// are driven via the ?page=N query param (one output file per subpage). Keep
// `base` in sync with TEMPLATE_MAP, and `pages` with each route's subpage count.
const TARGETS = [
    { route: '/',                                base: 'home',                 pages: 1 },
    { route: '/learning/e1-intro-experiment',    base: 'e1-intro-experiment',  pages: 4 },
    { route: '/learning/e2-damped-oscillations', base: 'e2-damped-oscillations', pages: 3 },
    { route: '/learning/e3-driven-oscillations', base: 'e3-driven-oscillations', pages: 7 },
    { route: '/learning/t1-intro-theory',        base: 't1-intro-theory',      pages: 1 },
    { route: '/learning/t2-free-oscillations',   base: 't2-free-oscillations', pages: 2 },
    { route: '/learning/t3-damped-oscillations', base: 't3-damped-oscillations', pages: 5 },
    { route: '/learning/t4-driven-oscillations', base: 't4-driven-oscillations', pages: 8 },
];

// Renders one subpage to a PDF. Single-subpage routes → '<base>.pdf';
// multi-subpage routes → '<base>-<n>.pdf' (report.php resolves either form).
async function renderSubpage(browser, target, n) {
    const page = await browser.newPage();
    try {
        const params = new URLSearchParams(CONTENT_QUERY);
        if (target.pages > 1) params.set('page', String(n));
        const url = `${BASE_URL}${target.route}?${params.toString()}`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });

        // Let MathJax finish typesetting and canvas draws settle.
        await page
            .evaluate(async () => {
                const mj = window.MathJax;
                if (mj?.startup?.promise) await mj.startup.promise;
                if (mj?.typesetPromise) await mj.typesetPromise();
            })
            .catch(() => {});
        await new Promise((r) => setTimeout(r, 500));

        const file = target.pages > 1 ? `${target.base}-${n}.pdf` : `${target.base}.pdf`;
        await page.pdf({
            path: join(OUT_DIR, file),
            format: 'A4',
            printBackground: true,
            margin: { top: '12mm', right: '12mm', bottom: BOTTOM_MARGIN, left: '12mm' },
        });
        console.log(`✓ ${target.route}${target.pages > 1 ? ` (page ${n})` : ''} → ${file}`);
    } catch (err) {
        console.error(`✗ ${target.route}${target.pages > 1 ? ` (page ${n})` : ''}: ${err.message}`);
    } finally {
        await page.close();
    }
}

async function main() {
    await mkdir(OUT_DIR, { recursive: true });
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        for (const target of TARGETS) {
            for (let n = 1; n <= (target.pages ?? 1); n++) {
                await renderSubpage(browser, target, n);
            }
        }
    } finally {
        await browser.close();
    }
    console.log(`\nTemplates written to ${OUT_DIR}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
