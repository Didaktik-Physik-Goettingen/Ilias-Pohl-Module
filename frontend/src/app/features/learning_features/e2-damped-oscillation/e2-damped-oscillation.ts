import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as e2Questions from './e2-damped-oscillation-questions';
import * as e2Content from './e2-damped-oscillation-content';



@Component({
	selector: 'app-e2-damped-oscillation',
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './e2-damped-oscillation.html',
	styleUrl: './e2-damped-oscillation.css',
})
export class E2DampedOscillation implements OnInit, AfterViewInit, OnDestroy {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay,
        public devMode: DevModeService
    ) {}

    private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;
    private pageSub: Subscription | null = null;

    @HostListener('click', ['$event'])
    onGlossaryLink(event: MouseEvent) {
        const link = (event.target as HTMLElement)
            ?.closest('a[data-glossary]') as HTMLAnchorElement | null;
        if (!link) return;
        
        const term = link.getAttribute('data-glossary')!;
        this.glossaryOverlay.open(term);
    }


	// +++ QA data +++
    question1 = e2Questions.question1;


	// track completion
	isCorrect1 = false;


	// QA states
	showResult1 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }



	// +++ TeX rendering +++
	dampedOscText1a!: SafeHtml;
	dampedOscText1b!: SafeHtml;
	dampedOscText1c!: SafeHtml;
	dampedOscText1d!: SafeHtml;
	dampedOscText1e!: SafeHtml;

	dampedOscText2a!: SafeHtml;
	dampedOscText2b!: SafeHtml;
	dampedOscText2c!: SafeHtml;
	dampedOscText2d!: SafeHtml;
	dampedOscText2e!: SafeHtml;

	dampedOscText3a!: SafeHtml;
	dampedOscText3b!: SafeHtml;


    ngOnInit() {
        // subscribe to page param so nav-bar jumps update the view reactively
        this.pageSub = this.route.queryParams.subscribe(params => {
            const page = params['page'];
            if (page && ['1','2','3'].includes(page)) {
                this.currentView = `damped_osc${page}`;
                this.renderMath();
            }
        });

        // read entry-flow so continue button can navigate correctly
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';

        // start tracking this module
        this.trackingService.startModule('e2-damped-oscillations-module');

        // restore completion states from previous session
        this.restoreCompletionState();

		// sanitized strings to enable LaTeX rendering
        this.dampedOscText1a = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText1a);
		this.dampedOscText1b = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText1b);
		this.dampedOscText1c = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText1c);
		this.dampedOscText1d = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText1d);
		this.dampedOscText1e = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText1e);

		this.dampedOscText2a = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText2a);
		this.dampedOscText2b = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText2b);
		this.dampedOscText2c = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText2c);
		this.dampedOscText2d = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText2d);
		this.dampedOscText2e = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText2e);

		this.dampedOscText3a = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText3a);
		this.dampedOscText3b = this.sanitizer.bypassSecurityTrustHtml(e2Content.dampedOscText3b);

    }


    ngAfterViewInit() {
        this.renderMath();
    }


    ngOnDestroy() {
        this.pageSub?.unsubscribe();
        if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
        this.trackingService.endModule();
    }


    private restoreCompletionState() {
        // check if questions were already answered correctly
        this.isCorrect1 = this.trackingService.isQuestionCompleted(this.question1.questionId);
    }


    // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
			this.mathJaxTimeout = setTimeout(() => {
				this.mathJaxTimeout = null;
				if (window.MathJax) {
					window.MathJax.typesetPromise();
				}
			}, 100);
		}
	}


// +++ in-page navigation +++

    private updateUrl() {
        const page = this.currentView.replace('damped_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'damped_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean {
        return this.currentView === 'damped_osc1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'damped_osc3';
    }



    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.router.navigate(["/decision/dec-e-damped"]);
            return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-e-damped', 'true');
                this.router.navigate(['/decision/dec-e-damped']);
            } else {
                this.router.navigate(['/decision/dec-e-driven']);
            }
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
