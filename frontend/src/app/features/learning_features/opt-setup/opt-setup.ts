import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { DevModeService } from '../../../core/services/dev-mode';

declare global {
    interface Window { MathJax: any; }
}

@Component({
    selector: 'app-opt-setup',
    imports: [CommonModule],
    templateUrl: './opt-setup.html',
    styleUrl: './opt-setup.css',
})
export class OptSetup implements OnInit, OnDestroy {
    private next = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: ResultsTracking,
        public devMode: DevModeService,
    ) {}

    ngOnInit() {
        this.next = this.route.snapshot.queryParamMap.get('next') ?? '';
        this.trackingService.startModule('opt-setup-module');
    }

    ngOnDestroy() {
        this.trackingService.endModule();
    }

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.next === 'chaos') {
            this.router.navigate(['/learning/opt-chaos'], { queryParams: { page: '2' } });
        } else if (this.next === 'simulation') {
            this.router.navigate(['/learning/opt-simulation']);
        } else {
            this.router.navigate(['/learning/t4-driven-oscillations'], { queryParams: { page: '8' } });
        }
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.next === 'chaos') {
            this.router.navigate(['/target/tar-chaos']);
        } else if (this.next === 'simulation') {
            this.router.navigate(['/target/tar-simulation']);
        } else {
            this.router.navigate(['/target/tar-theory']);
        }
    }
}
