import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme';
import { Session } from '../../core/services/session';
import { DevModeService } from '../../core/services/dev-mode';
import { NavDrawerService } from '../../core/services/nav-drawer';
import { BUILD_TIMESTAMP } from '../../../build-info';



@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header implements OnInit {
    isScrolled = false;
    showBridgeConfirm = false;
    readonly buildTimestamp = BUILD_TIMESTAMP;


    constructor(
        public themeService: ThemeService,
        public sessionService: Session,
        public devMode: DevModeService,
        public router: Router,
        public drawer: NavDrawerService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}


    ngOnInit() {
        // Check initial scroll position
        if (isPlatformBrowser(this.platformId)) {
            this.checkScroll();
        }
    }


    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.checkScroll();
    }


    private checkScroll() {
        if (isPlatformBrowser(this.platformId)) {
            this.isScrolled = window.scrollY > 100; // Sticky after 50px scroll
        }
    }


    // mirrors the nav-bar, which is hidden on the start page outside dev mode
    get showMenuButton(): boolean {
        return this.devMode.isEnabled || this.router.url.split('?')[0] !== '/';
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    goToBridge() {
        this.showBridgeConfirm = true;
    }

    closeBridgeConfirm() {
        this.showBridgeConfirm = false;
    }

    confirmBridge() {
        if (isPlatformBrowser(this.platformId)) {
            const bridgeUrl = window.location.port === '4200'
                ? 'http://localhost:8000/ilias_bridge.html'
                : new URL('ilias_bridge.html', document.baseURI).href;
            window.location.href = bridgeUrl;
        }
    }
}