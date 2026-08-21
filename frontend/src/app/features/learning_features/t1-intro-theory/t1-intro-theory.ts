import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as t1Questions from './t1-intro-theory-questions';
import * as t1Content from './t1-intro-theory-content';



@Component({
	selector: 'app-t1-intro-theory',
	standalone: true,
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './t1-intro-theory.html',
	styleUrl: './t1-intro-theory.css',
})
export class T1IntroTheory implements AfterViewInit {
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
    question1 = t1Questions.question1;


	// track completion
	isCorrect1 = false;


	// QA states
	showResult1 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }


	// +++ TeX rendering +++
	introTheoText1a!: SafeHtml;
	introTheoText1b!: SafeHtml;
	introTheoText1c!: SafeHtml;
	introTheoText1d!: SafeHtml;


	// ── Lifecycle ────────────────────────────────────────────────────────────
	ngOnInit(): void {

        // start tracking this module
        this.trackingService.startModule('t1-intro-theory-module');


        this.introTheoText1a = this.sanitizer.bypassSecurityTrustHtml(t1Content.introTheoText1a);


		this.introTheoText1b = this.sanitizer.bypassSecurityTrustHtml(t1Content.introTheoText1b);

		this.introTheoText1c = this.sanitizer.bypassSecurityTrustHtml(t1Content.introTheoText1c);

		this.introTheoText1d = this.sanitizer.bypassSecurityTrustHtml(t1Content.introTheoText1d);
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
    }


    // trigger MathJax rendering — waits for startup promise so a cold-cache reload works
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
}
