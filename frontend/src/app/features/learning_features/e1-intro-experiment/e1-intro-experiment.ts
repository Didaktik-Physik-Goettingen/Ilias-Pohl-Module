import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoiceImage } from '../../../shared/evaluation/multiple-choice-image/multiple-choice-image';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ImageChoice } from '../../../shared/evaluation/image-choice/image-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as e1Questions from './e1-intro-experiment-questions';
import * as e1Content from './e1-intro-experiment-content';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
	selector: 'app-e1-intro-experiment',
    standalone: true,
    imports: [CommonModule, RouterLink, MultipleChoiceImage, MultipleChoice, ImageChoice],
    templateUrl: './e1-intro-experiment.html',
    styleUrl: './e1-intro-experiment.css',
})
export class E1IntroExperiment implements OnInit, AfterViewInit, OnDestroy {
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
    question1 = e1Questions.question1;
    question2 = e1Questions.question2;
    question3 = e1Questions.question3;
    question4 = e1Questions.question4;
    question5 = e1Questions.question5;
    question6 = e1Questions.question6;


    // track completion
    isCorrect1 = false;
    isCorrect2 = false;
    isCorrect3 = false;
    isCorrect4 = false;
    isCorrect5 = false;
    isCorrect6 = false;
	
	// QA states
	showResult1 = false;
	showResult2 = false;
	showResult3 = false;
	showResult4 = false;
	showResult5 = false;
	showResult6 = false;
	

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
	

    // +++ SafeHtml content +++
    introExpText1a!: SafeHtml;
    introExpText1b!: SafeHtml;
    introExpText1c!: SafeHtml;
    introExpText2a!: SafeHtml;
    introExpText3a!: SafeHtml;
    introExpText3b!: SafeHtml;

    ngOnInit() {
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3','4'].includes(page)) {
            this.currentView = `intro_exp${page}`;
        }

        // start tracking this module
        this.trackingService.startModule('e1-intro-experiment-module');

        // restore completion states from previous session
        this.restoreCompletionState();

        // sanitized strings to enable LaTeX rendering
        this.introExpText1a = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText1a);
        this.introExpText1b = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText1b);
        this.introExpText1c = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText1c);
        this.introExpText2a = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText2a);
        this.introExpText3a = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText3a);
        this.introExpText3b = this.sanitizer.bypassSecurityTrustHtml(e1Content.introExpText3b);
    }


    ngAfterViewInit() {
        this.renderMath();
    }


    ngOnDestroy() {
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
        const page = this.currentView.replace('intro_exp', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'intro_exp1';
    get isFirstPage(): boolean {
        return this.currentView === 'intro_exp1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'intro_exp4';
    }



    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'intro_exp1') {
            this.router.navigate(['/']);
            return;
        } else if (this.currentView === 'intro_exp2') {
            this.currentView = 'intro_exp1';
        } else if (this.currentView === 'intro_exp3') {
            this.currentView = 'intro_exp2';
        } else if (this.currentView === 'intro_exp4') {
            this.currentView = 'intro_exp3';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'intro_exp1') {
            this.currentView = 'intro_exp2';
        } else if (this.currentView === 'intro_exp2') {
            this.currentView = 'intro_exp3';
        } else if (this.currentView === 'intro_exp3') {
            this.currentView = 'intro_exp4';
        } else if (this.currentView === 'intro_exp4') {
            this.router.navigate(['/decision/dec-e-damped']);
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}