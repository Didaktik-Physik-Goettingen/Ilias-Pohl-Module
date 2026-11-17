import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
export class Header {
    showSessionDialog = false;
    readonly buildTimestamp = BUILD_TIMESTAMP;


    constructor(
        public themeService: ThemeService,
        public sessionService: Session,
        public devMode: DevModeService,
        public router: Router,
        public drawer: NavDrawerService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}


    // mirrors the nav-bar, which is hidden on the start page outside dev mode
    get showMenuButton(): boolean {
        return this.devMode.isEnabled || this.router.url.split('?')[0] !== '/';
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    openSessionDialog() {
        this.showSessionDialog = true;
    }

    closeSessionDialog() {
        this.showSessionDialog = false;
    }

    goToLogin() {
        if (isPlatformBrowser(this.platformId)) {
            window.location.href = this.sessionService.loginUrl();
        }
    }

    logout() {
        this.sessionService.logout();
    }
}