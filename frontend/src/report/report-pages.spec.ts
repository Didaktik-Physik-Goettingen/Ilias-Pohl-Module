import { describe, it, expect } from 'vitest';
import { firstVisitPages, normalizePage, RawVisit } from './report-pages';

describe('normalizePage', () => {
    it('keeps content params and drops tracking params', () => {
        expect(normalizePage('/learning/e1?page=2&session_id=abc&flow=x&print=1')).toEqual({
            key: '/learning/e1?page=2',
            url: '/learning/e1?page=2',
        });
    });

    it('strips fragments', () => {
        expect(normalizePage('/glossary#top')).toEqual({ key: '/glossary', url: '/glossary' });
    });

    it('collapses a session-redirect root onto "/"', () => {
        expect(normalizePage('/?session_id=abc')).toEqual({ key: '/', url: '/' });
    });

    it('rejects non-content entries', () => {
        expect(normalizePage('')).toBeNull();
        expect(normalizePage('not-a-path')).toBeNull();
    });
});

describe('firstVisitPages', () => {
    it('keeps one entry per page, ordered by first visit', () => {
        const visits: RawVisit[] = [
            { page: '/learning/a', visited_at: '2026-01-01 10:00:00' },
            { page: '/learning/b', visited_at: '2026-01-01 10:05:00' },
            { page: '/learning/a', visited_at: '2026-01-01 10:10:00' }, // revisit — dropped
        ];
        const pages = firstVisitPages(visits);
        expect(pages.map((p) => p.url)).toEqual(['/learning/a', '/learning/b']);
    });

    it('uses the earliest visit even when a later duplicate is seen first in the array', () => {
        const visits: RawVisit[] = [
            { page: '/x', startTime: 2000 },
            { page: '/x', startTime: 1000 }, // earlier, but later in the array
            { page: '/y', startTime: 1500 },
        ];
        const pages = firstVisitPages(visits);
        expect(pages.map((p) => p.url)).toEqual(['/x', '/y']);
        expect(pages[0].firstVisit).toBe(1000);
    });

    it('treats subpages (?page=N) as distinct pages', () => {
        const visits: RawVisit[] = [
            { page: '/learning/e1?page=1', startTime: 1 },
            { page: '/learning/e1?page=2', startTime: 2 },
            { page: '/learning/e1?page=1', startTime: 3 },
        ];
        expect(firstVisitPages(visits).map((p) => p.url)).toEqual([
            '/learning/e1?page=1',
            '/learning/e1?page=2',
        ]);
    });

    it('collapses redirect variants of the same page', () => {
        const visits: RawVisit[] = [
            { page: '/?session_id=abc', startTime: 1 },
            { page: '/', startTime: 5 },
        ];
        const pages = firstVisitPages(visits);
        expect(pages).toHaveLength(1);
        expect(pages[0].firstVisit).toBe(1);
    });
});
