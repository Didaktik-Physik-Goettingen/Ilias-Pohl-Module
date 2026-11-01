import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Session } from './session';



// Sub-pages the student has opened: the nav-bar shows the path reached so far and lets them go back to the visited
// sub-pages of the current chapter (what was visited has passed its gates). Kept per session id in localStorage;
// DataExport adds the visits saved in the database, so a registered student keeps them on another device.
// Key: path + page, '/learning/e2-damped-oscillations|2'.
@Injectable({
    providedIn: 'root'
})
export class VisitedPages {
    private readonly visited = signal<ReadonlySet<string>>(new Set());
    private readonly isBrowser: boolean;

    constructor(
        router: Router,
        @Inject(PLATFORM_ID) platformId: Object,
        private session: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (!this.isBrowser) return;
        this.load();
        router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(e => this.add([e.urlAfterRedirects]));
    }

    // page: the ?page= value; none for pages without sub-pages (and sub-page 1 opened without the parameter)
    has(path: string, page: string = '1'): boolean {
        return this.visited().has(`${path}|${page}`);
    }

    add(urls: string[]) {
        const next = new Set(this.visited());
        for (const url of urls) next.add(VisitedPages.keyOf(url));
        if (next.size === this.visited().size) return;
        this.visited.set(next);
        this.save();
    }

    static keyOf(url: string): string {
        const [path, query = ''] = url.split('?');
        return `${path}|${new URLSearchParams(query).get('page') ?? '1'}`;
    }


    private get storageKey(): string {
        return 'visitedPages_' + (this.session.sessionId() ?? 'unknown');
    }

    private load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) this.visited.set(new Set(JSON.parse(stored)));
        } catch { /* ignore corrupt data */ }
    }

    private save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify([...this.visited()]));
        } catch { /* storage full or blocked: the nav-bar just stays locked */ }
    }
}
