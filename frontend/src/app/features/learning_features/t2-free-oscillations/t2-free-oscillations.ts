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
import * as t2Questions from './t2-free-oscillations-questions';
import * as t2Content from './t2-free-oscillations-content';



@Component({
	selector: 'app-t2-free-oscillations',
	standalone: true,
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './t2-free-oscillations.html',
	styleUrl: './t2-free-oscillations.css',
})
export class T2FreeOscillations implements OnInit, AfterViewInit, OnDestroy {
	constructor(
		private sanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) private platformId: Object,
		private route: ActivatedRoute,
		private router: Router,
		private trackingService: ResultsTracking,
		public glossaryOverlay: GlossaryOverlay,
		public devMode: DevModeService,
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
    question1 = t2Questions.question1;
    question2 = t2Questions.question2;
    question3 = t2Questions.question3;
    question4 = t2Questions.question4;
    question5 = t2Questions.question5;
    question6 = t2Questions.question6;



	// track completion
	isCorrect1 = false;
	isCorrect2 = false;
	isCorrect3 = false;
	isCorrect4 = false;
	isCorrect5 = false;
	isCorrect6 = false;


	// actions upon answering questions
	onQuestion1Answered(isCorrect: boolean) { this.isCorrect1 = isCorrect; }
	onQuestion2Answered(isCorrect: boolean) { this.isCorrect2 = isCorrect; }
	onQuestion3Answered(isCorrect: boolean) { this.isCorrect3 = isCorrect; }
	onQuestion4Answered(isCorrect: boolean) { this.isCorrect4 = isCorrect; }
	onQuestion5Answered(isCorrect: boolean) { this.isCorrect5 = isCorrect; }
	onQuestion6Answered(isCorrect: boolean) { this.isCorrect6 = isCorrect; }


	// +++ TeX rendering +++
	freeOscText1a!: SafeHtml;
	freeOscText1b!: SafeHtml;
	freeOscText1c!: SafeHtml;
	freeOscText1d!: SafeHtml;
	freeOscText1e!: SafeHtml;
	freeOscText1f!: SafeHtml;
	freeOscText1g!: SafeHtml;
	freeOscText1h!: SafeHtml;

	freeOscText2a!: SafeHtml;
	freeOscText2b!: SafeHtml;
	freeOscText2c!: SafeHtml;
	freeOscText2d!: SafeHtml;


	// ── Lifecycle ────────────────────────────────────────────────────────────

	ngOnInit() {
		this.pageSub = this.route.queryParams.subscribe(params => {
			const page = params['page'];
			if (page && ['1', '2'].includes(page))
				this.currentView = `free_osc${page}`;
		});

		this.trackingService.startModule('t2-free-oscillations-module');
		this.restoreCompletionState();

		// ── Page 1: DGL und Exponentialansatz ────────────────────────────────

		this.freeOscText1a = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1a);

		this.freeOscText1b = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1b);

		this.freeOscText1c = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1c);

		this.freeOscText1d = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1d);

		this.freeOscText1e = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1e);

		this.freeOscText1f = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1f);

		this.freeOscText1g = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1g);

		this.freeOscText1h = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText1h);

		// ── Page 2: Phasenraum ────────────────────────────────────────────────

		this.freeOscText2a = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText2a);

		this.freeOscText2b = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText2b);

		this.freeOscText2c = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText2c);

		this.freeOscText2d = this.sanitizer.bypassSecurityTrustHtml(t2Content.freeOscText2d);
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
		const page = this.currentView.replace('free_osc', '');
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { page },
			queryParamsHandling: 'merge',
			replaceUrl: true
		});
	}

	currentView: string = 'free_osc1';

	get isFirstPage(): boolean {
		return this.currentView === 'free_osc1';
	}
	get isLastPage(): boolean {
		return this.currentView === 'free_osc2';
	}


	goBack() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'free_osc1') {
			this.router.navigate(['/learning/t1-intro-theory']);
			return;
		} else if (this.currentView === 'free_osc2') {
			this.currentView = 'free_osc1';
		}
		this.updateUrl();
		this.renderMath();
	}


	goForward() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'free_osc1') {
			this.currentView = 'free_osc2';
		} else if (this.currentView === 'free_osc2') {
			this.router.navigate(['/decision/dec-t-damped']);
			return;
		}
		this.updateUrl();
		this.renderMath();
	}
}
