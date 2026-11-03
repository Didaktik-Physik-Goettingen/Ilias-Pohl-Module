import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { Analytics, AnalyticsData, PageVisit } from './analytics';
import { ResultsTracking, ModuleProgress } from './results-tracking';
import { TestTracking, TestProgress } from './test-tracking';
import { VisitedPages } from './visited-pages';
import { AttemptOutbox, AttemptRow } from './attempt-outbox';



export interface CombinedData {
    username: string;
    sessionId: string;
    analytics: AnalyticsData;
    moduleResults: ModuleProgress[];
    testResults: TestProgress[];
    exportTime: string;
}



@Injectable({
    providedIn: 'root'
})
export class DataExport {
    private readonly API_BASE = 'api';              // relative: resolves against <base href>, also below /pohl/
    private readonly MAX_BODY_BYTES = 60000;        // browsers refuse keepalive requests above 64 KiB
    private saving = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sessionService: Session,
        private analyticsService: Analytics,
        private resultsService: ResultsTracking,
        private testService: TestTracking,
        private visitedPages: VisitedPages,
        private outbox: AttemptOutbox
    ) {
        if (isPlatformBrowser(this.platformId)) {
            // beforeunload doesn't fire reliably on phones; a tab sent to the background may never come back
            window.addEventListener('pagehide', () => this.saveProgress());
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') this.saveProgress();
            });
        }
    }


    getCombinedData(): CombinedData {
        const username = this.sessionService.sessionId() || 'unknown';
        return {
            username,
            sessionId: username,
            analytics: this.analyticsService.getSessionData(),
            moduleResults: this.resultsService.getAllResults(),
            testResults: this.testService.getAllTests(),
            exportTime: new Date().toISOString()
        };
    }


    exportToJSON(): string {
        return JSON.stringify(this.getCombinedData(), null, 2);
    }


    // Fetches saved progress from the backend and hydrates the tracking services.
    // Returns the last visited page for resuming, or null for new/rogue users.
    async loadProgress(): Promise<string | null> {
        if (!isPlatformBrowser(this.platformId)) return null;
        if (this.sessionService.isRogueUser()) return null;

        const username = this.sessionService.sessionId();
        if (!username) return null;

        try {
            const response = await fetch(`${this.API_BASE}/progress/${encodeURIComponent(username)}`);
            if (response.status === 404) return null;  // new user, no progress yet
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            const attempts: any[] = (data.attempts ?? []).map((a: any) => ({ ...a, answeredAt: Date.parse(a.answeredAt) }));
            this.resultsService.restoreFromBackend(attempts.filter(a => a.kind === 'learning'));
            this.testService.restoreFromBackend(attempts.filter(a => a.kind === 'test'));

            // Find the last meaningful page (ignore root and session-redirect URLs).
            const meaningful = (data.pageVisits ?? []).filter(
                (v: any) => v.page && v.page.length > 1 && !v.page.startsWith('/?')
            );
            const lastPage: string | null = meaningful.length
                ? meaningful[meaningful.length - 1].page
                : null;
            this.visitedPages.add(meaningful.map((v: any) => v.page));     // nav-bar: reached pages, also from another device

            console.log('Progress loaded from backend. Last page:', lastPage);
            return lastPage;
        } catch (err) {
            console.error('Failed to load progress:', err);
            return null;
        }
    }


    // Sends what the server hasn't confirmed yet, at most one keepalive request's worth; the rest follows with
    // the next save. Silently skips rogue users.
    async saveProgress(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;
        if (this.sessionService.isRogueUser()) {
            console.log('Rogue user — progress not saved to database.');
            return;
        }
        if (this.saving) return;

        const username = this.sessionService.sessionId();
        const batch = this.nextBatch();
        if (!username || (!batch.visits.length && !batch.attempts.length)) return;

        this.saving = true;
        try {
            const response = await fetch(`${this.API_BASE}/progress/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    visits: batch.visits.map(v => ({ page: v.page, startTime: v.startTime, duration_s: v.duration_s })),
                    attempts: batch.attempts
                }),
                keepalive: true   // survives page unload
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.analyticsService.markSent(batch.visits);
            this.outbox.remove(batch.attempts);
            console.log('Progress saved to backend.');
        } catch (err) {
            console.error('Failed to save progress:', err);
        } finally {
            this.saving = false;
        }
    }


    private nextBatch(): { visits: PageVisit[]; attempts: AttemptRow[] } {
        let budget = this.MAX_BODY_BYTES;
        const fits = (row: unknown) => {
            const size = new Blob([JSON.stringify(row)]).size;
            if (size > budget) return false;
            budget -= size;
            return true;
        };
        // answers first: they are the harder data to lose
        const attempts = this.outbox.getAll().filter(fits);
        const visits = this.analyticsService.getUnsentVisits().filter(fits);
        return { visits, attempts };
    }


    downloadAsFile(filename: string = 'session-data.json') {
        const dataStr = this.exportToJSON();
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }
}
