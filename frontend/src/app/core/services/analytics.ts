import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Session } from './session';



export interface PageVisit {
    page: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    duration_s?: number;
    sessionId: string;
    timestamp: string;
}



export interface AnalyticsData {
    sessionId: string;
    visits: PageVisit[];
    currentVisit: PageVisit | null;
}



@Injectable({
    providedIn: 'root'
})



export class Analytics {
    private isBrowser: boolean;
    private currentVisit: PageVisit | null = null;
    private visits: PageVisit[] = [];


    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.loadFromLocalStorage();
        this.initTracking();
    }


    private get storageKey(): string {
        return 'analyticsData_' + (this.sessionService.sessionId() ?? 'unknown');
    }


    private initTracking() {
        if (!this.isBrowser) return;

        // Track route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.endCurrentVisit();
            this.startNewVisit(event.urlAfterRedirects);
        });

        // Track when user leaves the page
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.endCurrentVisit();
                this.saveToLocalStorage();
            });
        }
    }


    private startNewVisit(page: string) {
        const sessionId = this.sessionService.sessionId();
        if (!sessionId) {
            console.warn('No session ID available for analytics tracking');
            return;
        }

        this.currentVisit = {
            page: page,
            startTime: Date.now(),
            sessionId: sessionId,
            timestamp: new Date().toISOString()
        };
    }


    private endCurrentVisit() {
        if (this.currentVisit) {
            this.currentVisit.endTime = Date.now();
            this.currentVisit.duration = this.currentVisit.endTime - this.currentVisit.startTime;
            this.currentVisit.duration_s = this.currentVisit.duration / 1000;

            this.visits.push({ ...this.currentVisit });

            console.log(`${this.currentVisit.page} left after ${this.currentVisit.duration_s} seconds`);
            console.log('PATHLOG:', this.currentVisit);

            this.currentVisit = null;
            this.saveToLocalStorage();
        }
    }


    private saveToLocalStorage() {
        if (this.isBrowser) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.visits));
        }
    }


    private loadFromLocalStorage() {
        if (!this.isBrowser) return;
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.visits = JSON.parse(stored);
            }
        } catch { /* ignore corrupt data */ }
    }


    // Public API
    getSessionData(): AnalyticsData {
        return {
            sessionId: this.sessionService.sessionId() || 'unknown',
            visits: this.visits,
            currentVisit: this.currentVisit
        };
    }


    getAllVisits(): PageVisit[] {
        return [...this.visits];
    }
    
    
    exportData(): string {
        return JSON.stringify(this.getSessionData(), null, 2);
    }


    async sendToBackend(endpoint: string = 'http://localhost:3000/api/analytics') {
        if (!this.isBrowser || this.visits.length === 0) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.getSessionData())
            });

            const result = await response.json();
            console.log('Analytics data sent to backend:', result);
            
            // Clear visits after successful send
            this.visits = [];
        } catch (error) {
            console.error('Failed to send analytics data:', error);
        }
    }


    clearData() {
        this.visits = [];
        this.currentVisit = null;
        if (this.isBrowser) {
            localStorage.removeItem(this.storageKey);
        }
    }
}