import { Injectable, Inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})


export class Session {
    // _sessionId is the writable signal
    private readonly _sessionId = signal<string | null>(null);
    private isBrowser: boolean;
    private readonly SESSION_STORAGE_KEY = 'framework_session_id';
    //  sessionId is the readonly facade returning the _sessionId from above
    readonly sessionId = this._sessionId.asReadonly();

    readonly hasValidSession = computed(() => {
        const id = this.sessionId();
        return id !== null && id.length > 0;
    });

    readonly isRogueUser = computed(() =>
        this.sessionId()?.startsWith('rogue_user_') ?? false
    );

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.initSession();
    }


    private initSession() {
        if (!this.isBrowser) return;

        // priority 1: check if session already exists in storage (from another tab)
        const storedSessionId = this.loadFromStorage();
        
        // priority 2: check URL for session_id parameter
        const urlSessionId = this.getSessionIdFromUrl();
        
        if (urlSessionId) {
			// URL has session_id - this takes priority (new framework access)
			if (urlSessionId !== storedSessionId) {
				// different session from URL - update storage
                this._sessionId.set(urlSessionId);
                this.saveToStorage(urlSessionId);
                console.log('New session from framework:', urlSessionId);
            } else {
                // same session - just use it
                this._sessionId.set(urlSessionId);
                console.log('Session ID from URL (matches storage):', this.sessionId);
            }
        } else if (storedSessionId) {
            // no URL param, but we have stored session - use it (new tab scenario)
            this._sessionId.set(storedSessionId);
            console.log('Session ID from storage (new tab):', this.sessionId);
        } else {
            // no URL param AND no storage - generate new (standalone access)
            console.warn('No session ID found in URL or storage.');
            const generatedSessionId = this.generateSessionId();
            this._sessionId.set(generatedSessionId);
            this.saveToStorage(generatedSessionId);
            console.log('Session ID generated and stored:', generatedSessionId);
        }


        // resolved session_id query param, refreshed after every completed navigation
        const urlSessionIdSignal = toSignal(
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.getSessionIdFromUrl())
            ),
            { initialValue: this.getSessionIdFromUrl() }
        );


        // react whenever a new navigation carries a (different) session_id
        effect(() => {
            const newSessionId = urlSessionIdSignal();
            if (newSessionId && newSessionId !== this._sessionId()) {
                // new session from URL
                this._sessionId.set(newSessionId);
                this.saveToStorage(newSessionId);
                console.log('Session ID updated from navigation:', newSessionId);
            }
        });


        // listen for storage changes from other tabs
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key === this.SESSION_STORAGE_KEY && event.newValue) {
                    // another tab updated the session
                    const newSessionId = event.newValue;
                    if (newSessionId !== this._sessionId()) {
                        console.log('Session ID updated from another tab:', newSessionId);
                        this._sessionId.set(newSessionId);
                    }
                }
            });
        }
    }


    private getSessionIdFromUrl(): string | null {
        // check route params
        const sessionFromRoute = this.route.snapshot.queryParamMap.get('session_id');
        if (sessionFromRoute) return sessionFromRoute;

        // also check if it's in the URL directly (fallback)
        if (this.isBrowser) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('session_id');
        }

        return null;
    }


	// save session ID in storage
    private saveToStorage(sessionId: string) {
        if (this.isBrowser) {
            localStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
        }
    }


    private loadFromStorage(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(this.SESSION_STORAGE_KEY);
        }
        return null;
    }
	
	
	// generate a session if no session detected
	private generateSessionId(): string {
		return 'rogue_user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
	}


    clearSession() {
        this._sessionId.set(null);
        if (this.isBrowser) {
            localStorage.removeItem(this.SESSION_STORAGE_KEY);
            sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
        }
        console.log('Session cleared');
    }
}