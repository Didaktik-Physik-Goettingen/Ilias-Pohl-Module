import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';



// Triggers the server-side personalised learning-path PDF (/report/:username).
// Shared by the test end pages and the "Anleitung" (target) pages.
@Injectable({
    providedIn: 'root'
})
export class ReportDownload {
    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    // The report is built from DB data keyed by username, so it is only meaningful
    // for real (framework) users — rogue/standalone sessions have nothing saved.
    canDownload(): boolean {
        return this.sessionService.hasValidSession() && !this.sessionService.isRogueUser();
    }

    // Fetches the generated PDF and triggers a browser download. Fetched as a blob
    // (rather than a plain navigation) so callers can show progress and surface
    // errors while headless Chromium renders the pages. Throws on failure.
    async download(): Promise<void> {
        if (!this.isBrowser) return;

        const username = this.sessionService.getSessionId();
        if (!username) throw new Error('No session available for report download');

        // Resolve against <base href> so it works in dev ("/") and under the
        // production sub-path (e.g. "/pohl/").
        const reportUrl = new URL(`report/${encodeURIComponent(username)}`, document.baseURI).href;
        const res = await fetch(reportUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lernpfad-${username}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    }
}
