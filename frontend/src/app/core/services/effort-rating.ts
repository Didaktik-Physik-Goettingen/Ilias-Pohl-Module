import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Session } from './session';
import { DevModeService } from './dev-mode';
import { STORAGE_PREFIX } from './storage-prefix';
import { EFFORT_UNITS } from './effort-units';



// Paas's single-item scale (1 = very, very low ... 9 = very, very high mental effort), in German.
// Keep the wording fixed once data is collected: ratings are only comparable under the same wording.
export const EFFORT_SCALE_LABELS: readonly string[] = [
    'sehr, sehr geringe geistige Anstrengung',
    'sehr geringe geistige Anstrengung',
    'geringe geistige Anstrengung',
    'eher geringe geistige Anstrengung',
    'weder geringe noch hohe geistige Anstrengung',
    'eher hohe geistige Anstrengung',
    'hohe geistige Anstrengung',
    'sehr hohe geistige Anstrengung',
    'sehr, sehr hohe geistige Anstrengung',
];


// One answer, as effort_ratings stores it. rating null = "Keine Angabe".
export interface EffortRatingRow {
    unitId: string;
    rating: number | null;
    shownAt: number;
    answeredAt: number;
    context: Record<string, string>;
}


interface StoredState {
    rated: string[];
    unsent: EffortRatingRow[];
}



// The mental-effort pop-up after a learning unit (design_notes.md, section 2). A unit's last "Weiter" calls
// rateThen(); the dialog (shared/effort-rating-dialog) shows while `pending` is set and calls submit().
// Asked once per unit and student; guests (nothing of theirs is sent) and dev mode are never asked.
// Answers wait in localStorage until DataExport has sent them, like the AttemptOutbox.
@Injectable({
    providedIn: 'root'
})
export class EffortRating {
    readonly pending = signal<{ unitId: string; title: string } | null>(null);

    private readonly isBrowser: boolean;
    private next: (() => void) | null = null;
    private shownAt = 0;
    private context: Record<string, string> = {};
    private loadedKey: string | null = null;
    private state: StoredState = { rated: [], unsent: [] };


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session,
        private devMode: DevModeService,
        private router: Router
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }


    // Calls next() right away when there is nothing to ask, otherwise once the student has answered or skipped.
    // Synchronous in the first case, so a page's "Weiter" behaves as before for guests and in dev mode.
    rateThen(unitId: string, next: () => void): void {
        if (!this.isDue(unitId)) {
            next();
            return;
        }
        this.next = next;
        this.shownAt = Date.now();
        this.context = this.currentContext();
        this.pending.set({ unitId, title: EFFORT_UNITS[unitId] });
    }


    // From the dialog: 1..9, or null for "Keine Angabe".
    submit(rating: number | null): void {
        const open = this.pending();
        if (!open) return;
        this.load();
        if (!this.state.rated.includes(open.unitId)) {
            this.state.rated.push(open.unitId);
            this.state.unsent.push({
                unitId: open.unitId,
                rating,
                shownAt: this.shownAt,
                answeredAt: Date.now(),
                context: this.context,
            });
            this.save();
        }
        this.pending.set(null);
        const next = this.next;
        this.next = null;
        next?.();
    }


    isRated(unitId: string): boolean {
        this.load();
        return this.state.rated.includes(unitId);
    }


    // Units rated before, on this or another device (from the saved progress).
    markRated(unitIds: string[]): void {
        this.load();
        const fresh = unitIds.filter(id => !this.state.rated.includes(id));
        if (!fresh.length) return;
        this.state.rated.push(...fresh);
        this.save();
    }


    getUnsent(): EffortRatingRow[] {
        this.load();
        return [...this.state.unsent];
    }


    markSent(sent: EffortRatingRow[]): void {
        this.load();
        this.state.unsent = this.state.unsent.filter(row => !sent.some(s => s.unitId === row.unitId));
        this.save();
    }


    private isDue(unitId: string): boolean {
        if (!this.isBrowser || this.devMode.isEnabled) return false;
        if (!(unitId in EFFORT_UNITS)) return false;
        if (!this.sessionService.hasValidSession() || this.sessionService.isRogueUser()) return false;
        return !this.isRated(unitId);
    }


    // How the unit was taken: the flow (learning-first, or none = simulation first / straight) and the nav path.
    private currentContext(): Record<string, string> {
        const params = this.router.parseUrl(this.router.url).queryParams;
        const context: Record<string, string> = {};
        for (const key of ['flow', 'path']) {
            if (typeof params[key] === 'string' && params[key]) context[key] = params[key];
        }
        return context;
    }


    // per student: on a shared computer the next student must not inherit (or send) these ratings
    private get storageKey(): string {
        return STORAGE_PREFIX + 'effortRatings_' + (this.sessionService.sessionId() ?? 'unknown');
    }


    private load() {
        const key = this.storageKey;
        if (key === this.loadedKey) return;
        this.loadedKey = key;
        this.state = { rated: [], unsent: [] };
        if (!this.isBrowser) return;
        try {
            const stored = JSON.parse(localStorage.getItem(key) ?? 'null');
            if (stored && Array.isArray(stored.rated) && Array.isArray(stored.unsent)) this.state = stored;
        } catch { /* ignore corrupt data */ }
    }


    private save() {
        if (!this.isBrowser) return;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch { /* storage full or blocked: the ratings still go out while the page stays open */ }
    }
}
