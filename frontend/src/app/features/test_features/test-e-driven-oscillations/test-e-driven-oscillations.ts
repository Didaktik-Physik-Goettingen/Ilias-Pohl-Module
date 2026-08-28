import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TestTracking } from '../../../core/services/test-tracking';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestOrderImages } from '../../../shared/test/order-images/order-images';
import { TestSingleChoice } from '../../../shared/test/single-choice/single-choice';
import { TestImageChoice } from '../../../shared/test/image-choice/image-choice';
import { TestMultipleChoice } from '../../../shared/test/multiple-choice/multiple-choice';
import { TestDragDrop } from '../../../shared/test/drag-and-drop/drag-and-drop';
import { TestTrueFalse } from '../../../shared/test/test-true-false/test-true-false';
import { EndPage } from '../../../shared/test/end-page/end-page';
import {
    question1 as question1Data,
    question2 as question2Data,
    question3 as question3Data,
    question4 as question4Data
} from './test-e-driven-oscillations-questions';

declare global {
	interface Window {
		MathJax: any;
    }
}

@Component({
  selector: 'app-test-e-driven-oscillations',
  imports: [TestTrueFalse, TestImageChoice, EndPage, RouterLink],
  templateUrl: './test-e-driven-oscillations.html',
  styleUrl: './test-e-driven-oscillations.css',
})
export class TestEDrivenOscillations implements OnInit, OnDestroy {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
        private testTracking: TestTracking,
        public devMode: DevModeService
    ) {}

    // Custom thresholds for this test
    performanceThresholds = [
        {
            minPercentage: 0,
            maxPercentage: 79,
            level: 'low' as const,
            message: 'Sie werden sich nun zurück zur Entscheidungsseite geleitet um sich noch einmal die <b>theoretischen Grundlagen zu getriebenen, gedämpften Schwingungen</b> zu erarbeiten oder sich eine <b>interaktive Simulation</b> anzuschauen.',
            continueLink: '/decision/dec-e-driven',
            continueLinkText: 'Zurück zur Entscheidungsseite',
        },
        {
            minPercentage: 80,
            maxPercentage: 100,
            level: 'high' as const,
            message: `Sie haben ein gutes Grundlagenwissen zu getriebenen, gedämpften Schwingungen und können ihr Wissen nun mit
            <a class="glossary-link" routerLink="/learning/t-chaos"><b>chaotischem Verhalten</b></a> erweitern oder direkt ihre <b>Versuchsanleitung bekommen.</b>.`,
            continueLink: '/target/tar-experiment',
            continueLinkText: 'Weiter zur Anleitung',
        }
    ];

	
    question1 = question1Data;
    question2 = question2Data;
    question3 = question3Data;
    question4 = question4Data;

    // track submissions
    question1Submitted = false;
	question2Submitted = false;
	question3Submitted = false;
	question4Submitted = false;

	// performance handling

    // results page data
    continueLink = '/';
    continueLinkText = 'Weiter';
    performanceLevel: 'low' | 'medium' | 'high' = 'low';

    // calculate results directly when navigating to results page
    private calculateResults() {
        const testProgress = this.testTracking.getTestResults('e-driven-oscillations-test');
        
        if (!testProgress) {
            console.warn('No test results found');
            return;
        }

        const totalPoints = testProgress.pointsEarned;
        const maxPoints = testProgress.maxPoints;
        const percentage = (totalPoints / maxPoints) * 100;

        // find matching threshold
        const threshold = this.performanceThresholds.find(t => 
            percentage >= t.minPercentage && percentage <= t.maxPercentage
        );

        if (threshold) {
            this.performanceLevel = threshold.level;
            this.continueLink = threshold.continueLink;
            this.continueLinkText = threshold.continueLinkText;
        }
    }

    // handle results calculated event
    onResultsCalculated(results: any) {
        this.performanceLevel = results.level;
        this.continueLink = results.continueLink;
        this.continueLinkText = results.continueLinkText;
    }

    getPerformanceClass(): string {
        if (this.currentView === 'driven_osc5') {
            return this.performanceLevel;
        }
        return '';
    }
	
	
    ngOnInit() {
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3','4','5'].includes(page)) {
            this.currentView = `driven_osc${page}`;
        }


		// start tracking this test
        this.testTracking.startTest('e-driven-oscillations-test', 4, 80); // 4 questions, 80 total points
        
        // restore completion state from previous session
        this.restoreCompletionState();

        this.renderMath();
    }
	
	
    ngOnDestroy() {
        if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
        this.testTracking.endTest();
    }
	
	
    private restoreCompletionState() {
		// check if question was already answered
        this.question1Submitted = this.testTracking.isQuestionAnswered(this.question1.questionId);
		this.question2Submitted = this.testTracking.isQuestionAnswered(this.question2.questionId);
		this.question3Submitted = this.testTracking.isQuestionAnswered(this.question3.questionId);
		this.question4Submitted = this.testTracking.isQuestionAnswered(this.question4.questionId);
    }
	
	
    onQuestion1Submit(result: any) {
		this.question1Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question1.questionId)) {
            const userAnswerTexts    = (result.userAnswer as { statementId: string; selected: 'true' | 'false' }[])
                .map(ans => { const s = this.question1.statements.find((st: any) => st.id === ans.statementId); return s ? `${s.text}: ${ans.selected === 'true' ? 'Wahr' : 'Falsch'}` : ans.statementId; });
            const correctAnswerTexts = this.question1.statements.map((s: any) => `${s.text}: ${s.isCorrect ? 'Wahr' : 'Falsch'}`);
			this.testTracking.trackQuestionResult(
				this.question1.questionId, result.isCorrect, result.userAnswer,
                [], result.pointsAwarded, this.question1.maxPoints,
                { questionText: this.question1.question, questionInstruction: this.question1.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
    }

    onQuestion2Submit(result: any) {
		this.question2Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question2.questionId)) {
            const userAnswerTexts    = [this.question2.options.find((o: any) => o.value === result.userAnswer)?.label ?? result.userAnswer];
            const correctAnswerTexts = [this.question2.options.find((o: any) => o.value === this.question2.correctAnswer)?.label ?? this.question2.correctAnswer];
			this.testTracking.trackQuestionResult(
				this.question2.questionId, result.isCorrect, result.userAnswer,
                this.question2.correctAnswer, result.pointsAwarded, this.question2.maxPoints,
                { questionText: this.question2.question, questionInstruction: this.question2.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
	}

    onQuestion3Submit(result: any) {
        this.question3Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question3.questionId)) {
            const userAnswerTexts    = [this.question3.options.find((o: any) => o.value === result.userAnswer)?.label ?? result.userAnswer];
            const correctAnswerTexts = [this.question3.options.find((o: any) => o.value === this.question3.correctAnswer)?.label ?? this.question3.correctAnswer];
            this.testTracking.trackQuestionResult(
                this.question3.questionId, result.isCorrect, result.userAnswer,
                this.question3.correctAnswer, result.pointsAwarded, this.question3.maxPoints,
                { questionText: this.question3.question, questionInstruction: this.question3.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
    }

    onQuestion4Submit(result: any) {
        this.question4Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question4.questionId)) {
            const userAnswerTexts    = (result.userAnswer as { statementId: string; selected: 'true' | 'false' }[])
                .map(ans => { const s = this.question4.statements.find((st: any) => st.id === ans.statementId); return s ? `${s.text}: ${ans.selected === 'true' ? 'Wahr' : 'Falsch'}` : ans.statementId; });
            const correctAnswerTexts = this.question4.statements.map((s: any) => `${s.text}: ${s.isCorrect ? 'Wahr' : 'Falsch'}`);
            this.testTracking.trackQuestionResult(
                this.question4.questionId, result.isCorrect, result.userAnswer,
                [], result.pointsAwarded, this.question4.maxPoints,
                { questionText: this.question4.question, questionInstruction: this.question4.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
    }

    private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

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
    get isFirstPage(): boolean {
        return this.currentView === 'driven_osc1';
    }
	// get isLastPage(): boolean {
	// 	return this.currentView === 'damped_osc5';
	// }
    get isEndPage(): boolean {
        return (this.currentView === 'driven_osc4') || (this.currentView === 'driven_osc5');
    }

    get canProceed(): boolean {
		// can only proceed if all questions on current page are submitted
        if (this.currentView === 'driven_osc1') {
			// return this.question1Submitted;
            return true;
        } else if (this.currentView === 'driven_osc2') {
			// return this.question2Submitted;
            return true;
		} else if (this.currentView === 'driven_osc3') {
			// return this.question3Submitted;
            return true;
		} else if (this.currentView === 'driven_osc4') {
			return (
                this.question1Submitted && 
                this.question2Submitted &&
                this.question3Submitted &&
                this.question4Submitted );
		} else if (this.currentView === 'driven_osc5') {
			return true;
		}
        return false;
    }


    // going back always enabled (for now at least)
    get canGoBack(): boolean {
		// if (this.currentView === 'damped_osc1') return false;
        return true;
    }
	
	
    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'driven_osc1') {
            this.router.navigate(['/decision/dec-e-driven'], { queryParams: { page: 4 } });
            return;
        } else if (this.currentView === 'driven_osc2') {
            this.currentView = 'driven_osc1';
        } else if (this.currentView === 'driven_osc3') {
            this.currentView = 'driven_osc2';
        } else if (this.currentView === 'driven_osc4') {
            this.currentView = 'driven_osc3';
        } else if (this.currentView === 'driven_osc5') {
            this.currentView = 'driven_osc4';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.canProceed) {
            if (this.currentView === 'driven_osc1') {
                this.currentView = 'driven_osc2';
            } else if (this.currentView === 'driven_osc2') {
                this.currentView = 'driven_osc3';
            } else if (this.currentView === 'driven_osc3') {
                this.currentView = 'driven_osc4';
            } else if (this.currentView === 'driven_osc4') {
				this.calculateResults();
				this.currentView = 'driven_osc5';
			} else if (this.currentView === 'driven_osc5') {
                this.router.navigate([this.continueLink]);
                return;
			}
            this.updateUrl();
            this.renderMath();
        }
    }
}