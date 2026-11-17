import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_PREFIX, MODULE_NAME } from './storage-prefix';



// Who is using the module: a logged-in student (sessionId = their username) or a guest (a generated
// 'rogue_user_…' id, nothing sent to the server).
//
// The login is shared by all modules: the portal's login page (/login/) sets a cookie for the whole site, and
// resolve() asks the server whose it is (api/auth/me) before the app starts (app.config.ts). The tracking
// services read this module's stored state once, keyed by sessionId, when they are created; so the identity is
// settled before them and doesn't change while the app runs. If the login runs out meanwhile, loginExpired is
// set and the student is asked to log in again.
//
// The resolved id is kept in localStorage, which is what the services read at startup and the fallback when
// the server can't be reached.
@Injectable({
    providedIn: 'root'
})
export class Session {
    private readonly _sessionId = signal<string | null>(null);
    private readonly isBrowser: boolean;
    private readonly SESSION_STORAGE_KEY = STORAGE_PREFIX + 'framework_session_id';
    private readonly ME_TIMEOUT_MS = 4000;

    readonly sessionId = this._sessionId.asReadonly();

    readonly hasValidSession = computed(() => {
        const id = this.sessionId();
        return id !== null && id.length > 0;
    });

    readonly isRogueUser = computed(() =>
        this.sessionId()?.startsWith('rogue_user_') ?? false
    );

    // the server answered 401 to a save or load: the login cookie ran out or was removed
    readonly loginExpired = signal(false);


    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (!this.isBrowser) return;

        const stored = this.loadFromStorage();
        this.use(stored ?? Session.guestId());
    }


    // Before the app starts: the server's word on who is logged in. Guest on 401; on a network error or
    // timeout the stored identity stays, so a registered student's answers are still queued and sent later.
    async resolve(): Promise<void> {
        if (!this.isBrowser) return;
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), this.ME_TIMEOUT_MS);
            const response = await fetch(`${Session.API_BASE}/auth/me`, { cache: 'no-store', signal: controller.signal })
                .finally(() => clearTimeout(timer));

            if (response.ok) {
                const user = await response.json();
                if (typeof user?.username === 'string' && user.username) this.use(user.username);
            } else if (response.status === 401 && !this.isRogueUser()) {
                this.use(Session.guestId());
            }
        } catch (err) {
            console.warn('Login state unknown, keeping the stored identity:', err);
        }
    }


    // The portal's login page, coming back to this module afterwards. Locally the portal runs on :8000.
    loginUrl(): string {
        const path = `login/?next=${MODULE_NAME}`;
        if (!this.isBrowser) return `../${path}`;
        return window.location.port === '4200' ? `http://localhost:8000/${path}` : new URL(`../${path}`, document.baseURI).href;
    }


    // Ends the login for all modules and restarts this one as a guest.
    async logout(): Promise<void> {
        if (!this.isBrowser) return;
        try {
            await fetch(`${Session.API_BASE}/auth/logout`, { method: 'POST' });
        } catch (err) {
            console.error('Logout failed:', err);
        }
        this.saveToStorage(Session.guestId());
        window.location.href = document.baseURI;
    }


    // The portal's API at the server root: relative to <base href> (/pohl/ → /api/), locally proxied to :8000.
    static readonly API_BASE = '../api';

    static guestId(): string {
        return 'rogue_user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }


    private use(id: string) {
        if (id === this._sessionId()) return;
        this._sessionId.set(id);
        this.saveToStorage(id);
    }

    private saveToStorage(sessionId: string) {
        try {
            localStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
        } catch { /* storage blocked: the id lives until the tab closes */ }
    }

    private loadFromStorage(): string | null {
        try {
            return localStorage.getItem(this.SESSION_STORAGE_KEY);
        } catch {
            return null;
        }
    }
}
