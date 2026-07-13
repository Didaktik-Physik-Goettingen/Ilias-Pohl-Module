// Turns a raw list of page visits (from the backend `page_visits` table, or the
// client-side Analytics service) into the ordered, de-duplicated list of pages
// that belong in a user's PDF report: every page appears exactly once, in the
// order it was *first* visited.

export interface RawVisit {
    /** Full router URL as recorded, e.g. "/learning/e1-intro-experiment?page=2". */
    page: string;
    /** DB timestamp (MySQL datetime) — present on backend rows. */
    visited_at?: string;
    /** ISO timestamp — present on client-side Analytics visits. */
    timestamp?: string;
    /** Epoch milliseconds — present on client-side Analytics visits. */
    startTime?: number;
}

export interface ReportPage {
    /** Stable de-dupe key (path + content-relevant query params). */
    key: string;
    /** Path + query to render (tracking params stripped, no session_id/print). */
    url: string;
    /** Epoch milliseconds of the first visit — also the report ordering key. */
    firstVisit: number;
}

// Query params that identify the *content* of a page and must be kept when
// distinguishing subpages (e.g. multi-page learning features use `?page=N`).
const CONTENT_PARAMS = ['page'];

// Splits a recorded URL into a normalized { key, url }, or returns null when the
// entry is not a real content page (empty, or a bare session-redirect like "/?...").
export function normalizePage(rawPage: string): { key: string; url: string } | null {
    if (!rawPage || !rawPage.startsWith('/')) return null;

    const hashIdx = rawPage.indexOf('#');
    const noHash = hashIdx >= 0 ? rawPage.slice(0, hashIdx) : rawPage;

    const qIdx = noHash.indexOf('?');
    const path = qIdx >= 0 ? noHash.slice(0, qIdx) : noHash;
    const rawQuery = qIdx >= 0 ? noHash.slice(qIdx + 1) : '';

    // Keep only content-relevant params (drops session_id, print, flow, …).
    const params = new URLSearchParams(rawQuery);
    const kept: Array<[string, string]> = [];
    for (const name of CONTENT_PARAMS) {
        const value = params.get(name);
        if (value !== null) kept.push([name, value]);
    }

    // A bare "/" that only ever carried tracking params is the bridge redirect,
    // not real content — but the genuine home page ("/") is. We keep "/" and let
    // de-duplication collapse the redirect variants into it.
    kept.sort((a, b) => a[0].localeCompare(b[0]));
    const query = kept.map(([k, v]) => `${k}=${v}`).join('&');

    const url = query ? `${path}?${query}` : path;
    return { key: url, url };
}

// Epoch-ms visit time, preferring the most precise field available.
function visitTime(v: RawVisit): number {
    if (typeof v.startTime === 'number' && !Number.isNaN(v.startTime)) return v.startTime;
    const iso = v.timestamp ?? v.visited_at;
    if (iso) {
        // MySQL datetimes ("YYYY-MM-DD HH:MM:SS") are UTC in this project; make
        // that explicit so Date parsing is deterministic across environments.
        const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(iso)
            ? iso.replace(' ', 'T') + 'Z'
            : iso;
        const t = Date.parse(normalized);
        if (!Number.isNaN(t)) return t;
    }
    return Number.MAX_SAFE_INTEGER; // undated visits sort last, but are still kept
}

/**
 * De-duplicates visits to one entry per page, keyed by content, and orders them
 * by first visit. The `firstVisit` timestamp is the earliest visit for that page.
 */
export function firstVisitPages(visits: RawVisit[]): ReportPage[] {
    const byKey = new Map<string, ReportPage>();

    for (const v of visits) {
        const normalized = normalizePage(v.page);
        if (!normalized) continue;

        const t = visitTime(v);
        const existing = byKey.get(normalized.key);
        if (!existing) {
            byKey.set(normalized.key, { key: normalized.key, url: normalized.url, firstVisit: t });
        } else if (t < existing.firstVisit) {
            existing.firstVisit = t;
        }
    }

    return [...byKey.values()].sort((a, b) => a.firstVisit - b.firstVisit);
}
