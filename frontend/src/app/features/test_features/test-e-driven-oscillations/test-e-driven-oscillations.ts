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
            continueLink: '/decision/e-driven-oscillations',
            continueLinkText: 'Zurück zur Entscheidungsseite',
        },
        {
            minPercentage: 80,
            maxPercentage: 100,
            level: 'high' as const,
            message: 'Sie haben ein gutes Grundlagenwissen zu getriebenen, gedämpften Schwingungen und bekommen nun ihre <b>Versuchsanleitung</b>.',
            continueLink: '/target/tar-experiment',
            continueLinkText: 'Weiter zur Anleitung',
        }
    ];

	
	// question 1 data
    question1 = {
		questionId: 'driven-osc-e-1-gesamtgleichung',
        question: `Die Gesamtlösung für den getriebenen, gedämpften harmonischen Oszillator kann in folgender Weise geschrieben werden: <br><br> \$\\varphi(t) = {\\varphi_0 \\cos(\\omega_e t + \\Phi) \\mathrm{e}^{-\\beta t}}+ {\\frac{N}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}} \\cos\\left(\\omega t - \\arctan\\left(\\frac{2\\beta\\omega}{\\omega_0^2 - \\omega^2}\\right) \\right)}\$<br><br>
        wobei $\\varphi(t)$ die Winkelauslenkung, $\\omega_0$ bzw. $\\omega_e$ die Eigenfrequenz des ungedämpften bzw. gedämpften Oszillators, $\\beta$ die Dämpfungskonstante, $N$ und $\\omega$ die Amplitude und Frequenz des Antriebs beschreiben. $\\varphi_0$ und $\\Phi$ sind Hilfsgrößen, die sich aus den Anfangsbedingungen ergeben.<br><br>
        Welche der Aussagen zu dieser Gesamtlösung sind korrekt? `,
		questionInstruction: 'Frage 1 von 4 (35 Punkte): Analyse der Gleichung',
		statements: [
			{ id: 'first_ext', text: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne äußeren Antrieb.', isCorrect: true },
			{ id: 'first_damp', text: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne Dämpfung.', isCorrect: false  },
            { id: 'first_time', text: 'Der erste Summand ist bei einem realen gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.', isCorrect: true  },
			{ id: 'second_time', text: 'Der zweite Summand ist bei einem realen gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' , isCorrect: false },
			{ id: 'init_vel', text: 'Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Schwungrads zu allen Zeiten.' , isCorrect: false },
			{ id: 'damp_frequ', text: 'Die Schwingungsfrequenz ist beim realen System nach einer Weile unabhängig von der Dämpfung, sie wird von der Frequenz des Antriebs bestimmt.' , isCorrect: true },
			{ id: 'const', text: 'Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch.' , isCorrect: false }      
		],
        maxPoints: 35,
		pointsPerCorrectClick: 5,
        containerId: 'test-question1-container'
    };


	// question 2 data
    question2 = {
		questionId: 'driven-osc-e-2-einschwingen',
        question: `Bei einer gedämpften, getriebenen Schwingung, gibt es zunächst eine sogenannte Einschwingphase, bevor sich eine stationäre Schwingung stabilisiert. Wann die Einschwingphase abgeschlossen ist, kann man sehr gut an der Phasenraumdarstellung ablesen.
Im folgenden sind vier Phasenraumdiagramme für unterschiedliche Anfangsbedingungen und Einstellungen gezeigt. Der erste Messwert ist jeweils mit einem grauen, der letzte mit einem roten Kreuz markiert.<br><br>
Bei welcher der Graphen ist der Einschwingvorgang abgeschlossen?`,
		questionInstruction: 'Frage 2 von 4 (5 Punkte): Einschwingvorgang abgeschlossen?',
        options: [
			{ value: 'osc1', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_JA.png', label: 'Schwingung A' },
            { value: 'osc2', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_NEIN1.png', label: 'Schwingung B' },
            { value: 'osc3', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_NEIN2.png', label: 'Schwingung C' }
        ],
        correctAnswer: 'osc1',
        maxPoints: 5,
        containerId: 'test-question2-container'
    };


	// question 3 data
    question3 = {
		questionId: 'driven-osc-e-3-resonance_freq',
        question: `Die folgenden Graphen zeigen "Resonanzkurven" für die Amplitude der Schwingung (nach dem Einschwingvorgang).
        Sie zeigen hierbei das Ergebnis mehrerer Messungen. Bei den Messungen wird jeweils die Frequenz verändert und die Amplitude des Schwungkörpers nach dem Einschwingvorgang gemessen.
        Die Amplitude des Antriebs und die Dämpfung sind über die Messungen konstant gehalten.<br><br>
        Bei welcher der unten stehenden Abbildungen ist die x-Achsenskalierung korrekt? (Beachten Sie die Beschriftung der x-Achse)`,
		questionInstruction: 'Frage 3 von 4 (10 Punkte): Zusammenhang Frequenz und Schwingungsamplitude - Resonanzkurve',
        options: [
            { value: 'answer1', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_1.png', label: 'Resonanzkurve A' },
            { value: 'answer2', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_2.png', label: 'Resonanzkurve B' },
            { value: 'answer3', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_3.png', label: 'Resonanzkurve C' },
        ],
		correctAnswer: 'answer2',
        maxPoints: 10,
        containerId: 'test-question3-container'
    };


	// question 4 data
    question4 = {
        questionId: 'driven-osc-e-4-resonance_damping',
        question: `Wie verändert sich die Messung, wenn Sie den Überlapp zwischen dem Magneten (Wirbelstrombremse) und dem Schwungrad vergrößern? <br>
        Überlegen Sie was passiert, wenn Sie nur diese Einstellung am Aufbau ändern und alle anderen konstant halten.<br><br>
        Welche der folgenden Aussagen sind korrekt?
        Je größer der Überlapp, desto ... `,
        questionInstruction: 'Frage 4 von 4 (30 Punkte): Einfluss der Dämpfung',
        statements: [
            { id: 'answer1', text: '... größer die Resonanzfrequenz.', isCorrect: false },
            { id: 'answer2', text: '... kleiner ist der Phasenversatz zwischen der Schwingung des Antriebs und der des Schwungrads bei großen Frequenzen ($\\omega > \\omega_0$).', isCorrect: false },
            { id: 'answer3', text: '... breiter der Resonanzpeak der Amplitude.', isCorrect: true },
            { id: 'answer4', text: '... größer die Resonanzfrequenz.', isCorrect: false },
            { id: 'answer5', text: '... größer die Amplitude bei der Resonanzfrequenz.', isCorrect: false },
            { id: 'answer6', text: '... größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz des ungedämpften Systems ($\\omega_0$).', isCorrect: true },
        ],
        maxPoints: 30,
        pointsPerCorrectClick: 5,
        containerId: 'test-question4-container'
    };

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
            this.router.navigate(['/decision/e-driven-oscillations'], { queryParams: { page: 4 } });
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