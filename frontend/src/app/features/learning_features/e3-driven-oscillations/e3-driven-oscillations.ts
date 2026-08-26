import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageChoice } from '../../../shared/evaluation/image-choice/image-choice';
import { SingleChoice } from '../../../shared/evaluation/single-choice/single-choice';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as e3Questions from './e3-driven-oscillations-questions';
import * as e3Content from './e3-driven-oscillations-content';



@Component({
	selector: 'app-e3-driven-oscillations',
	imports: [CommonModule, RouterLink, SingleChoice, ImageChoice, MultipleChoice],
	templateUrl: './e3-driven-oscillations.html',
	styleUrl: './e3-driven-oscillations.css',
})
export class E3DrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
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
            ?.closest('a[href^="#glossary-"]') as HTMLAnchorElement | null;
        if (!link) return;
        event.preventDefault();
        const term = link.getAttribute('href')!.replace('#glossary-', '');
        this.glossaryOverlay.open(term);
    }

	// +++ QA data +++
    question1 = e3Questions.question1;
    question2 = e3Questions.question2;
    question3 = e3Questions.question3;
    question4 = e3Questions.question4;
    question5 = e3Questions.question5;
    question6 = e3Questions.question6;
    question7 = e3Questions.question7;
    question8 = e3Questions.question8;

	// track completion
	isCorrect1 = false;
	isCorrect2 = false;
	isCorrect3 = false;
	isCorrect4 = false;
	isCorrect5 = false;
	isCorrect6 = false;
	isCorrect7 = false;
	isCorrect8 = false;

	// QA states
	showResult1 = false;
	showResult2 = false;
	showResult3 = false;
	showResult4 = false;
	showResult5 = false;
	showResult6 = false;
	showResult7 = false;
	showResult8 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }

    onQuestion2Answered(isCorrect: boolean) {
		this.isCorrect2 = isCorrect;
    }

    onQuestion3Answered(isCorrect: boolean) {
		this.isCorrect3 = isCorrect;
    }

    onQuestion4Answered(isCorrect: boolean) {
		this.isCorrect4 = isCorrect;
    }

    onQuestion5Answered(isCorrect: boolean) {
		this.isCorrect5 = isCorrect;
    }

    onQuestion6Answered(isCorrect: boolean) {
		this.isCorrect6 = isCorrect;
    }

    onQuestion7Answered(isCorrect: boolean) {
		this.isCorrect7 = isCorrect;
    }

    onQuestion8Answered(isCorrect: boolean) {
		this.isCorrect8 = isCorrect;
    }


	// +++ TeX rendering +++
	drivenOscText1a!: SafeHtml;
	drivenOscText1b!: SafeHtml;
	drivenOscText1c!: SafeHtml;
	drivenOscText2a!: SafeHtml;
	drivenOscText2b!: SafeHtml;
	drivenOscText2c!: SafeHtml;
	drivenOscText3a!: SafeHtml;
	drivenOscText3b!: SafeHtml;
    drivenOscText4!: SafeHtml;
    drivenOscText5a!: SafeHtml;
    drivenOscText5b!: SafeHtml;
    drivenOscText6!: SafeHtml;
    drivenOscText7!: SafeHtml;


    ngOnInit() {
        // subscribe to page param so nav-bar jumps update the view reactively
        this.pageSub = this.route.queryParams.subscribe(params => {
            const page = params['page'];
            if (page && ['1','2','3','4','5','6','7'].includes(page)) {
                this.currentView = `driven_osc${page}`;
                this.renderMath();
            }
        });

        // read entry-flow so continue button can navigate correctly
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';

        // start tracking this module
        this.trackingService.startModule('e3-driven-oscillations-module');

        // restore completion states from previous session
        this.restoreCompletionState();

		// sanitized strings to enable LaTeX rendering
        this.drivenOscText1a = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText1a);
        this.drivenOscText1b = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText1b);
        this.drivenOscText1c = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText1c);
        this.drivenOscText2a = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText2a);
        this.drivenOscText2b = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText2b);
        this.drivenOscText2c = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText2c);
        this.drivenOscText3a = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText3a);
        this.drivenOscText4 = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText4);
        this.drivenOscText5a = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText5a);
        this.drivenOscText5b = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText5b);
        this.drivenOscText6 = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText6);
        this.drivenOscText7 = this.sanitizer.bypassSecurityTrustHtml(e3Content.drivenOscText7);

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
		this.isCorrect2 = this.trackingService.isQuestionCompleted(this.question2.questionId);
		this.isCorrect3 = this.trackingService.isQuestionCompleted(this.question3.questionId);
		this.isCorrect4 = this.trackingService.isQuestionCompleted(this.question4.questionId);
		this.isCorrect5 = this.trackingService.isQuestionCompleted(this.question5.questionId);
		this.isCorrect6 = this.trackingService.isQuestionCompleted(this.question6.questionId);
		this.isCorrect7 = this.trackingService.isQuestionCompleted(this.question7.questionId);
		this.isCorrect8 = this.trackingService.isQuestionCompleted(this.question8.questionId);
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
        const page = this.currentView.replace('driven_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'driven_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean {
        return this.currentView === 'driven_osc1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'driven_osc7';
    }



    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'driven_osc1') {
            this.router.navigate(["/decision/dec-e-driven"]);
            return;
        } else if (this.currentView === 'driven_osc2') {
            this.currentView = 'driven_osc1';
        } else if (this.currentView === 'driven_osc3') {
            this.currentView = 'driven_osc2';
        } else if (this.currentView === 'driven_osc4') {
            this.currentView = 'driven_osc3';
        } else if (this.currentView === 'driven_osc5') {
            this.currentView = 'driven_osc4';
        } else if (this.currentView === 'driven_osc6') {
            this.currentView = 'driven_osc5';
        } else if (this.currentView === 'driven_osc7') {
            this.currentView = 'driven_osc6';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'driven_osc1') {
            this.currentView = 'driven_osc2';
        } else if (this.currentView === 'driven_osc2') {
            this.currentView = 'driven_osc3';
        } else if (this.currentView === 'driven_osc3') {
            this.currentView = 'driven_osc4';
        } else if (this.currentView === 'driven_osc4') {
            this.currentView = 'driven_osc5';
        } else if (this.currentView === 'driven_osc5') {
            this.currentView = 'driven_osc6';
        } else if (this.currentView === 'driven_osc6') {
            this.currentView = 'driven_osc7';
        } else if (this.currentView === 'driven_osc7') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-e-driven', 'true');
                this.router.navigate(['/decision/dec-e-driven']);
            } else {
                this.router.navigate(['/target/tar-experiment']);
            }
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
