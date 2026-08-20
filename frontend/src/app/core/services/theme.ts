import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';



@Injectable({
    providedIn: 'root'
})


export class ThemeService {
    private readonly darkMode = signal(false);
    private isBrowser: boolean;
    
    readonly isDarkMode = this.darkMode.asReadonly();
    readonly themeIconPath = computed(() =>
        this.darkMode() ? 'assets/icons/moon.svg' : 'assets/icons/sun.svg'
    );


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(DOCUMENT) private doc: Document
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        
        if (this.isBrowser) {
            // Load saved preference only in browser
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                this.enableDarkMode();
            }
        }
    }

    toggleTheme() {
        if (this.darkMode()) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    private enableDarkMode() {
        if (this.isBrowser) {
            this.doc.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        this.darkMode.set(true);
    }

    private disableDarkMode() {
        if (this.isBrowser) {
            this.doc.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        this.darkMode.set(false);
    }
}