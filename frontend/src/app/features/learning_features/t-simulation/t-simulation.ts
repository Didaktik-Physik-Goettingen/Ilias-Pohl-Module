import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { DevModeService } from '../../../core/services/dev-mode';
import * as simContent from './t-simulation-content';

declare global {
    interface Window { MathJax: any; }
}

@Component({
    selector: 'app-t-simulation',
    imports: [CommonModule],
    templateUrl: './t-simulation.html',
    styleUrl: './t-simulation.css',
})
export class TSimulation implements OnInit, OnDestroy {
    simText1a!: SafeHtml;
    simText1b!: SafeHtml;
    simText1c!: SafeHtml;
    simText1d!: SafeHtml;
    simText1e!: SafeHtml;
    simText1f!: SafeHtml;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private sanitizer: DomSanitizer,
        private trackingService: ResultsTracking,
        public devMode: DevModeService,
    ) {}

    ngOnInit() {
        this.trackingService.startModule('t-simulation-module');
        this.simText1a = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1a);
        this.simText1b = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1b);
        this.simText1c = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1c);
        this.simText1d = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1d);
        this.simText1e = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1e);
        this.simText1f = this.sanitizer.bypassSecurityTrustHtml(simContent.simText1f);
        this.renderMath();
    }

    ngOnDestroy() {
        this.trackingService.endModule();
    }

    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/test/test-t-driven'], { queryParams: { page: '5' } });
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/learning/t-setup'], { queryParams: { next: 'simulation' } });
    }
}
