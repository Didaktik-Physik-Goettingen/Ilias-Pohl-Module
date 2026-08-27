import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import * as chaosContent from './t-chaos-content';

declare global {
	interface Window {
		MathJax: any;
    }
}

@Component({
  selector: 'app-t-chaos',
  imports: [CommonModule],
  templateUrl: './t-chaos.html',
  styleUrl: './t-chaos.css',
})

export class TChaos implements OnInit, OnDestroy {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay
    ) {}

    @HostListener('click', ['$event'])
    onGlossaryLink(event: MouseEvent) {
        const link = (event.target as HTMLElement)
            ?.closest('a[data-glossary]') as HTMLAnchorElement | null;
        if (!link) return;
        
        const term = link.getAttribute('data-glossary')!;
        this.glossaryOverlay.open(term);
    }

    private pageSub: Subscription | null = null;

    chaosText1a!: SafeHtml;
    chaosText1b!: SafeHtml;
    chaosText1c!: SafeHtml;
    chaosText2a!: SafeHtml;
    chaosText2b!: SafeHtml;
    chaosText2c!: SafeHtml;
    chaosText3a!: SafeHtml;

  ngOnInit() {
      this.pageSub = this.route.queryParams.subscribe(params => {
          const page = params['page'];
          if (page && ['1','2','3','4'].includes(page)) {
              this.currentView = `chaos_${page}`;
              this.renderMath();
          }
      });

      // start tracking this module
      this.trackingService.startModule('t-chaos-module');

      // sanitized strings to enable LaTeX rendering
      this.chaosText1a = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText1a);
      this.chaosText1b = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText1b);
      this.chaosText1c = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText1c);
      this.chaosText2a = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText2a);
      this.chaosText2b = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText2b);
      this.chaosText2c = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText2c);
      this.chaosText3a = this.sanitizer.bypassSecurityTrustHtml(chaosContent.chaosText3a);

      this.renderMath();
  }

  ngOnDestroy() {
      this.pageSub?.unsubscribe();
      this.trackingService.endModule();
  }

  // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (window.MathJax) {
					// Clear all previous MathJax processing
					const elements = document.querySelectorAll('.MathJax');
					elements.forEach(el => el.remove());
					
					window.MathJax.typesetPromise();
				}
			}, 100);
		}
	}

  	// +++ in-page navigation +++

    private updateUrl() {
        const page = this.currentView.replace('chaos_', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'chaos_1';
    get isFirstPage(): boolean {
        return this.currentView === 'chaos_1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'chaos_2';
    }

	// page completion tracking
	page1Complete = true;
	page2Complete = true;
	page3Complete = true;
  page4Complete = true;
	

    // ability to proceed in the module: depending on the Q+A performance (all questions have to be answered)
    get canProceed(): boolean {
        // if (this.currentView === 'intro_exp1') return this.page1Complete;
        // if (this.currentView === 'intro_exp2') return this.page2Complete;
        // if (this.currentView === 'intro_exp3') return this.page3Complete;
		// if (this.currentView === 'intro_exp4') return this.page4Complete;
        // return false;
        return true;
    }


    // going back always enabled (for now at least)
    get canGoBack(): boolean {
		// if (this.currentView === 'intro_exp1') return false;
        return true;
    }

    // going back shows the previous subpage / home page
    goBack() {
        if (this.currentView === 'chaos_1') {
            this.router.navigate(['/test/test-t-driven'], { queryParams: { page: '5' } });
            return;
        } else if (this.currentView === 'chaos_2') {
            this.currentView = 'chaos_1';
        }
        this.updateUrl();
        this.renderMath();
    }

    // go forward shows next subpage / page
    goForward() {
        if (this.canProceed) {
            if (this.currentView === 'chaos_1') {
                this.currentView = 'chaos_2';
            } else if (this.currentView === 'chaos_2') {
                this.router.navigate(['/learning/t-setup'], { queryParams: { next: 'chaos' } });
                return;
            }
            this.updateUrl();
            this.renderMath();
        }
    }
}
