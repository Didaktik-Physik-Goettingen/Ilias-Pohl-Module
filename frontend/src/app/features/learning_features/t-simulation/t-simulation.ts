import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { DevModeService } from '../../../core/services/dev-mode';

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
    iterativeText!: SafeHtml;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private sanitizer: DomSanitizer,
        private trackingService: ResultsTracking,
        public devMode: DevModeService,
    ) {}

    ngOnInit() {
        this.trackingService.startModule('t-simulation');
        this.iterativeText = this.sanitizer.bypassSecurityTrustHtml(`
			Es gibt unterschiedliche numerische Ansätze zum Lösen von Differentialgleichungen. Zwei wichtige Aspekte sind vielen dieser Methoden ähnlich:
			<ul>
				<li>
					Hierbei wird iterativ verfahren, das heißt ausgehend von einem Startwert wird der jeweils folgende Wert 	berechnet: ` +
            		`Wenn \\(\\phi(t_i)\\) bekannt ist, dann definieren die unterschiedlichen Methoden eine Regel, um hieraus \\(\\phi(t_{i+1})\\) zu berechnen.
				</li>
                <li>
                    In der Regel beziehen sich die Lösungsverfahren auf Differentialgleichungen erster Ordnung -
                    DGLs höherer Ordnung müssen daher zunächst in ein System aus Differentialgleichungen erster Ordnung überführt werden.
                </li>
			`
        );
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
        this.router.navigate(['/test/t-driven-osc'], { queryParams: { page: '5' } });
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/learning/t-setup'], { queryParams: { next: 'simulation' } });
    }
}
