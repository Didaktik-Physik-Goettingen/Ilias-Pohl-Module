import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { DevModeService } from '../../../core/services/dev-mode';

declare global {
    interface Window { MathJax: any; }
}

@Component({
    selector: 'app-t-setup',
    imports: [CommonModule],
    templateUrl: './t-setup.html',
    styleUrl: './t-setup.css',
})
export class TSetup implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private trackingService: ResultsTracking,
        public devMode: DevModeService,
    ) {}

    ngOnInit() {
        this.trackingService.startModule('t-setup');
    }

    ngOnDestroy() {
        this.trackingService.endModule();
    }

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/learning/t4-driven-oscillations'], { queryParams: { page: '8' } });
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/target/tar-theory']);
    }
}
