import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as t3Questions from './t3-damped-oscillations-questions';
import * as t3Content from './t3-damped-oscillations-content';

declare global { interface Window { MathJax: any; } }

@Component({
    selector: 'app-t3-damped-oscillations',
    imports: [CommonModule, RouterLink, MultipleChoice],
    templateUrl: './t3-damped-oscillations.html',
    styleUrl: './t3-damped-oscillations.css',
})
export class T3DampedOscillations implements OnInit, AfterViewInit, OnDestroy {
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

    currentView = 'damped_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean { return this.currentView === 'damped_osc1'; }
    get isLastPage(): boolean { return this.currentView === 'damped_osc5'; }

    // +++ SafeHtml content +++

    t3Text1a!: SafeHtml;
    t3Text1b!: SafeHtml;
    t3Text1c!: SafeHtml;
    t3Text1d!: SafeHtml;
    t3Text1e!: SafeHtml;
    t3Text1spoiler!: SafeHtml;

    t3Text2a!: SafeHtml;
    t3Text2b!: SafeHtml;
    t3Text2c!: SafeHtml;
    t3Text2d!: SafeHtml;
    t3Text2spoiler!: SafeHtml;

    t3Text3a!: SafeHtml;
    t3Text3b!: SafeHtml;

    t3Text4a!: SafeHtml;
    t3Text4b!: SafeHtml;
    t3Text4c!: SafeHtml;

    t3Text5a!: SafeHtml;
    t3Text5b!: SafeHtml;

    // +++ QA data +++
    question1 = t3Questions.question1;
    question2 = t3Questions.question2;
    question3 = t3Questions.question3;
    question4 = t3Questions.question4;
    question5 = t3Questions.question5;
    question6 = t3Questions.question6;
    question7 = t3Questions.question7;
    question8 = t3Questions.question8;
    question9 = t3Questions.question9;
    question10 = t3Questions.question10;

    isCorrect1 = false;  onQuestion1Answered(v: boolean): void  { this.isCorrect1 = v; }
    isCorrect2 = false;  onQuestion2Answered(v: boolean): void  { this.isCorrect2 = v; }
    isCorrect3 = false;  onQuestion3Answered(v: boolean): void  { this.isCorrect3 = v; }
    isCorrect4 = false;  onQuestion4Answered(v: boolean): void  { this.isCorrect4 = v; }
    isCorrect5 = false;  onQuestion5Answered(v: boolean): void  { this.isCorrect5 = v; }
    isCorrect6 = false;  onQuestion6Answered(v: boolean): void  { this.isCorrect6 = v; }
    isCorrect7 = false;  onQuestion7Answered(v: boolean): void  { this.isCorrect7 = v; }
    isCorrect8 = false;  onQuestion8Answered(v: boolean): void  { this.isCorrect8 = v; }
    isCorrect9 = false;  onQuestion9Answered(v: boolean): void  { this.isCorrect9 = v; }
    isCorrect10 = false; onQuestion10Answered(v: boolean): void { this.isCorrect10 = v; }

    // +++ Lifecycle +++

    ngOnInit(): void {
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page) this.currentView = `damped_osc${page}`;
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';
        this.trackingService.startModule('t3-damped-oscillations-module');
        this.restoreCompletionState();

        // Page 1 — Exponentialansatz
        this.t3Text1a = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1a);

        this.t3Text1b = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1b);

        this.t3Text1c = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1c);

        this.t3Text1d = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1d);

        this.t3Text1e = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1e);

        this.t3Text1spoiler = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text1spoiler);

        // Page 2 — Schwingfall
        this.t3Text2a = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text2a);

        this.t3Text2b = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text2b);

        this.t3Text2c = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text2c);

        this.t3Text2d = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text2d);

        this.t3Text2spoiler = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text2spoiler);

        // Page 3 — Kriechfall
        this.t3Text3a = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text3a);

        this.t3Text3b = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text3b);

        // Page 4 — Aperiodischer Grenzfall
        this.t3Text4a = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text4a);

        this.t3Text4b = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text4b);

        this.t3Text4c = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text4c);

        // Page 5 — Zusammenfassung
        this.t3Text5a = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text5a);
        this.t3Text5b = this.sanitizer.bypassSecurityTrustHtml(t3Content.t3Text5b);
    }

    ngAfterViewInit(): void { this.renderMath(); }

    ngOnDestroy(): void {
        if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
        this.trackingService.endModule();
    }

    private restoreCompletionState(): void {
        this.isCorrect1  = this.trackingService.isQuestionCompleted(this.question1.questionId);
        this.isCorrect2  = this.trackingService.isQuestionCompleted(this.question2.questionId);
        this.isCorrect3  = this.trackingService.isQuestionCompleted(this.question3.questionId);
        this.isCorrect4  = this.trackingService.isQuestionCompleted(this.question4.questionId);
        this.isCorrect5  = this.trackingService.isQuestionCompleted(this.question5.questionId);
        this.isCorrect6  = this.trackingService.isQuestionCompleted(this.question6.questionId);
        this.isCorrect7  = this.trackingService.isQuestionCompleted(this.question7.questionId);
        this.isCorrect8  = this.trackingService.isQuestionCompleted(this.question8.questionId);
        this.isCorrect9  = this.trackingService.isQuestionCompleted(this.question9.questionId);
        this.isCorrect10 = this.trackingService.isQuestionCompleted(this.question10.questionId);
    }

    renderMath(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
            this.mathJaxTimeout = setTimeout(() => {
                this.mathJaxTimeout = null;
                if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise();
            }, 100);
        }
    }

    // +++ Navigation +++

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.router.navigate(['/decision/t-damped-oscillations']); return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc5') {
            this.currentView = 'damped_osc4';
        }
        this.updateUrl(); this.renderMath();
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc4';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc5';
        } else if (this.currentView === 'damped_osc5') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-t-damped', 'true');
                this.router.navigate(['/decision/t-damped-oscillations']);
            } else {
                this.router.navigate(['/learning/t4-driven-oscillations']);
            }
            return;
        }
        this.updateUrl(); this.renderMath();
    }

    private updateUrl(): void {
        const page = this.currentView.replace('damped_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
