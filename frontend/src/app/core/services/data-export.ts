import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { Analytics, AnalyticsData } from './analytics';
import { ResultsTracking, ModuleProgress } from './results-tracking';
import { TestTracking, TestProgress } from './test-tracking';



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
    private readonly API_BASE = '/api';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sessionService: Session,
        private analyticsService: Analytics,
        private resultsService: ResultsTracking,
        private testService: TestTracking
    ) {
        if (isPlatformBrowser(this.platformId)) {
            window.addEventListener('beforeunload', () => this.saveProgress());
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

            if (data.moduleResults?.length) {
                this.resultsService.restoreFromBackend(data.moduleResults);
            }
            if (data.testResults?.length) {
                this.testService.restoreFromBackend(data.testResults);
            }

            // Find the last meaningful page (ignore root and session-redirect URLs).
            const meaningful = (data.pageVisits ?? []).filter(
                (v: any) => v.page && v.page.length > 1 && !v.page.startsWith('/?')
            );
            const lastPage: string | null = meaningful.length
                ? meaningful[meaningful.length - 1].page
                : null;

            console.log('Progress loaded from backend. Last page:', lastPage);
            return lastPage;
        } catch (err) {
            console.error('Failed to load progress:', err);
            return null;
        }
    }


    // Saves all progress to the backend. Silently skips rogue users.
    async saveProgress(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;
        if (this.sessionService.isRogueUser()) {
            console.log('Rogue user — progress not saved to database.');
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/progress/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.getCombinedData()),
                keepalive: true   // survives page unload
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            console.log('Progress saved to backend.');
        } catch (err) {
            console.error('Failed to save progress:', err);
        }
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
