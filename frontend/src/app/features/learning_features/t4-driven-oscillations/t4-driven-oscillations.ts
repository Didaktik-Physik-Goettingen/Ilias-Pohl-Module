import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ImageChoice } from '../../../shared/evaluation/image-choice/image-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';
import * as t4Questions from './t4-driven-oscillations-questions';
import * as t4Content from './t4-driven-oscillations-content';

@Component({
    selector: 'app-t4-driven-oscillations',
    imports: [CommonModule, RouterLink, MultipleChoice, ImageChoice],
    templateUrl: './t4-driven-oscillations.html',
    styleUrl: './t4-driven-oscillations.css',
})
export class T4DrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
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

    currentView = 'driven_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean { return this.currentView === 'driven_osc1'; }
    get isLastPage(): boolean { return this.currentView === 'driven_osc8'; }

    // +++ SafeHtml content +++

    t4Text1a!: SafeHtml;
    t4Text1b!: SafeHtml;
    t4Text1c!: SafeHtml;

    t4Text2a!: SafeHtml;
    t4Text2b!: SafeHtml;
    t4Text2c!: SafeHtml;

    t4Text3a!: SafeHtml;
    t4Text3b!: SafeHtml;
    t4Text3c!: SafeHtml;

    t4Text4a!: SafeHtml;
    t4Text4b!: SafeHtml;
    t4Text4c!: SafeHtml;
    t4Text4d!: SafeHtml;
    t4Text4spoiler!: SafeHtml;

    t4Text5a!: SafeHtml;
    t4Text5b!: SafeHtml;
    t4Text5spoiler!: SafeHtml;
    t4Text5c!: SafeHtml;

    t4Text6a!: SafeHtml;
    t4Text6b!: SafeHtml;
    t4Text6c!: SafeHtml;

    t4Text7a!: SafeHtml;
    t4Text7b!: SafeHtml;
    t4Text7c!: SafeHtml;

    t4Text8a!: SafeHtml;
    t4Text8b!: SafeHtml;
    t4Text8c!: SafeHtml;

    // +++ QA data +++
    question1 = t4Questions.question1;
    question2 = t4Questions.question2;
    question3 = t4Questions.question3;
    question4 = t4Questions.question4;
    question5 = t4Questions.question5;
    question6 = t4Questions.question6;
    question7 = t4Questions.question7;
    question8 = t4Questions.question8;
    question9 = t4Questions.question9;
    question10 = t4Questions.question10;
    question11 = t4Questions.question11;

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
    isCorrect11 = false; onQuestion11Answered(v: boolean): void { this.isCorrect11 = v; }

    // +++ Lifecycle +++

    ngOnInit(): void {
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page) this.currentView = `driven_osc${page}`;
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';
        this.trackingService.startModule('t4-driven-oscillations-module');
        this.restoreCompletionState();

        // Page 1 — Getriebener harmonischer Oszillator
        this.t4Text1a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text1a);

        this.t4Text1b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text1b);

        this.t4Text1c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text1c);

        // Page 2 — DGL des Pohlschen Rads
        this.t4Text2a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text2a);

        this.t4Text2b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text2b);

        this.t4Text2c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text2c);

        // Page 3 — Komplexe Erweiterung
        this.t4Text3a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text3a);

        this.t4Text3b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text3b);

        this.t4Text3c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text3c);

        // Page 4 — Partikuläre Lösung
        this.t4Text4a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text4a);

        this.t4Text4b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text4b);

        this.t4Text4c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text4c);

        this.t4Text4d = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text4d);

        this.t4Text4spoiler = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text4spoiler);

        // Page 5 — Homogene Lösung
        this.t4Text5a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text5a);

        this.t4Text5b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text5b);

        this.t4Text5spoiler = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text5spoiler);

        this.t4Text5c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text5c);

        // Page 6 — Vollständige Lösung und Einschwingvorgang
        this.t4Text6a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text6a);

        this.t4Text6b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text6b);

        this.t4Text6c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text6c);

        // Page 7 — Amplitude
        this.t4Text7a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text7a);

        this.t4Text7b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text7b);

        this.t4Text7c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text7c);

        // Page 8 — Phasenverschiebung
        this.t4Text8a = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text8a);

        this.t4Text8b = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text8b);

        this.t4Text8c = this.sanitizer.bypassSecurityTrustHtml(t4Content.t4Text8c);
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
        this.isCorrect11 = this.trackingService.isQuestionCompleted(this.question11.questionId);
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
        if (this.currentView === 'driven_osc1') {
            this.router.navigate(['/decision/t-driven-oscillations']); return;
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
        } else if (this.currentView === 'driven_osc8') { 
            this.currentView = 'driven_osc7';
        }
        this.updateUrl(); this.renderMath();
    }

    goForward(): void {
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
            this.currentView = 'driven_osc8';
        } else if (this.currentView === 'driven_osc8') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-t-driven', 'true');
                this.router.navigate(['/decision/t-driven-oscillations']);
            } else {
                this.router.navigate(['/learning/t-setup']);
            }
            return;
        }
        this.updateUrl(); this.renderMath();
    }

    private updateUrl(): void {
        const page = this.currentView.replace('driven_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
