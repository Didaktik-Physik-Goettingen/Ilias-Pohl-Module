import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TestTracking } from '../../../core/services/test-tracking';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestOrderImages } from '../../../shared/test/order-images/order-images';
import { TestSingleChoice } from '../../../shared/test/single-choice/single-choice';
import { TestMultipleChoice } from '../../../shared/test/multiple-choice/multiple-choice';
import { TestDragDrop } from '../../../shared/test/drag-and-drop/drag-and-drop';
import { EndPage } from '../../../shared/test/end-page/end-page';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
    selector: 'app-test-e-damped-oscillations',
    standalone: true,
    imports: [CommonModule, RouterLink, TestOrderImages, TestSingleChoice, TestMultipleChoice, TestDragDrop, EndPage],
    templateUrl: './test-e-damped-oscillations.html',
    styleUrl: './test-e-damped-oscillations.css'
})
export class TestEDampedOscillations implements OnInit, OnDestroy {
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
            message: 'Sie werden sich nun zurück zur Entscheidungsseite geleitet um sich noch einmal die <b>theoretischen Grundlagen zu gedämpften Schwingungen</b> zu erarbeiten oder sich eine <b>interaktive Simulation</b> anzuschauen.',
            continueLink: '/decision/e-damped-oscillations',
            continueLinkText: 'Zurück zur Entscheidungsseite',
        },
        {
            minPercentage: 80,
            maxPercentage: 100,
            level: 'high' as const,
            message: 'Sie haben ein gutes Grundlagenwissen zu gedämpften Schwingungen und werden nun mit einem <b>Test zu getriebenen Schwingungen</b> fortfahren.',
            continueLink: '/test/e-driven-osc',
            continueLinkText: 'Weiter zum Test',
        }
    ];

	
	// question 1 data
    question1 = {
		questionId: 'damped-osc-1-daempfungsstaerke',
        question: `Bei dem Versuch können Sie die Dämpfung darüber anpassen, dass Sie den Überlappbereich zwischen einem Magneten (eines Magnetfelds) und der Schwungscheibe variieren.
			Ziehen Sie die Bilder in die richtige Reihenfolge (stärkste Dämpfung oben, schwächste unten).`,
		questionInstruction: 'Frage 1 von 5 (30 Punkte): Sortierung Dämpfungskonstante',
        images: [
			{ id: 'weak', imageSrc: 'assets/images/test_e_damped_oscillations/weak_damping_1.png', label: 'Schwingung A' },
            { id: 'medium', imageSrc: 'assets/images/test_e_damped_oscillations/medium_damping_1.png', label: 'Schwingung B' },
            { id: 'strong', imageSrc: 'assets/images/test_e_damped_oscillations/strong_damping_1.png', label: 'Schwingung C' }
        ],
        correctOrder: ['strong', 'medium', 'weak'],
        maxPoints: 30,
        containerId: 'test-question1-container'
    };


	// question 2 data
    question2 = {
		questionId: 'damped-osc-2-federkonstante',
        question: `Im Versuch ist eine feste Feder eingebaut, die Federkonstante kann also nicht varriert werden. Was würde aber passieren, wenn man die Federkonstante variieren könnte?
			Sortieren Sie die Graphen nach der Größe der Federkonstante. 
			Sortieren Sie die Graphen absteigend, indem Sie den Graphen mit der größten Federkonstante nach oben einsortieren (andere Variablen sind konstant gehalten).`,
		questionInstruction: 'Frage 2 von 5 (30 Punkte): Sortierung Federkonstante',
        images: [
			{ id: 'weak', imageSrc: 'assets/images/test_e_damped_oscillations/weak_spring_constant_2.png', label: 'Schwingung A' },
            { id: 'medium', imageSrc: 'assets/images/test_e_damped_oscillations/medium_spring_constant_2.png', label: 'Schwingung B' },
            { id: 'strong', imageSrc: 'assets/images/test_e_damped_oscillations/strong_spring_constant_2.png', label: 'Schwingung C' }
        ],
        correctOrder: ['strong', 'medium', 'weak'],
        maxPoints: 30,
        containerId: 'test-question2-container'
    };


	// question 3 data
    question3 = {
		questionId: 'damped-osc-3-frequency-damping',
        question: `Sie haben in einer ersten Messung einer gedämpften Schwingung gesehen, dass das Schwungrad mit einer Frequenz von $\\omega_1=0.3$ Hz geschwungen ist.
			Nun hat ihr*e Praktikumspartner*in die Wirbelstrombremse weiter über das Schwungrad bewegt - sie erwarten also eine größere Dämpfung.
			Mit welcher Frequenz $\\omega_2$ erwarten Sie nun das Schwungrad zu schwingen?`,
		questionInstruction: 'Frage 3 von 5 (10 Punkte): Zusammenhang Frequenz und Dämpfungskonstante',
        options: [
            { value: 'answer1', label: '$\\omega_1<\\omega_2$.' },
            { value: 'answer2', label: '$\\omega_1>\\omega_2$.' },
            { value: 'answer3', label: 'Die Frequenz ist unanhängig von der Dämpfung.' },
        ],
		correctAnswer: 'answer2',
        maxPoints: 10,
        containerId: 'test-question3-container'
    };


	// question 4 data
    question4 = {
		questionId: 'damped-osc-4-log-decrement',
        question: `Das logarithmische Dekrement $\\Lambda$ ist eine Hilfsgröße, die man zur Beschreibung gedämpfter Schwingungen verwendet.
			Das logarithmische Dekrement ergibt sich hierbei in folgender Weise aus dem Verhältnis zwischen Amplituden einer gedämpften Schwingung, die zeitlich genau eine Schwingung auseinanderliegen: 
			$$\\Lambda = \\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right).$$
			Hierbei beschreibt $\\varphi(t)$ die Auslenkung aus der Ruhelage und $T$ die Periodendauer. 
			Was kann über das logarithmische Dekrement bestimmt werden? Markieren Sie alle physikalischen Größen, die direkt mit dem logarithmischen Dekrement zusammenhängen.`,
		questionInstruction: 'Frage 4 von 5 (20 Punkte): LogarithmischesDekrement',
		options: [
			{ value: 'eigenfrequency', label: 'Die Eigenfrequenz des schwingenden Systems $\\omega_0$.' },
			{ value: 'half_life', label: 'Die Halbwertszeit $t_{1/2}$.' },
			{ value: 'period', label: 'Die Periodendauer $T$.' },
			{ value: 'damping', label: 'Die Dämpfungskonstante $\\gamma$.' }
		],
		correctAnswers: ['half_life', 'damping'],
        maxPoints: 20,
		pointsPerCorrectClick: 5,
        containerId: 'test-question4-container'
    };

	// question 5 data
    question5 = {
        questionId: 'damped-osc-5-phase-space',
        question: `Der Phasenraum beschreibt mögliche Zustände, die ein System annehmen kann über die Angabe der Raum- und einer Geschwindigkeitskoordinate. 
		Für das Pohlsche Rad kann die Bewegung des Schwungrads angegeben werden über den Auslenkwinkel $\\phi$ und die Winkelgeschwindigkeit $\\dot{\\phi}$.

		Ordnen Sie den gezeigten Phasenraumdarstellungen die korrekten Anfangsbedingungen und Dämpfungskonstanten zu.`,
        questionInstruction: 'Frage 5 von 5 (60 Punkte): Zuordnung Phasenraum',
        containers: [
            { 
				id: 'spiral1', 
				imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral1_5.png', 
				imageAlt: 'Spirale 1', 
				correctAnswerIds: [ 'phi_gr_zero', 'phi_dot_eq_zero', 'gamma_weak' ], 
				assignedAnswerIds: [] 
			},
            { 
				id: 'spiral2', 
				imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral2_5.png', 
				imageAlt: 'Spirale 2', 
				correctAnswerIds: [ 'phi_sm_zero', 'phi_dot_gr_zero', 'gamma_medium' ],
				assignedAnswerIds: [] 
			},
            { 
				id: 'spiral3', 
				imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral3_5.png', 
				imageAlt: 'Spirale 3', 
				correctAnswerIds: [ 'phi_eq_zero', 'phi_dot_sm_zero', 'gamma_strong'], 
				assignedAnswerIds: [] }
        ],
        answers: [
			{ id: 'phi_sm_zero', label: '$\\phi(0)<0$' },
			{ id: 'phi_eq_zero', label: '$\\phi(0)=0$' },
			{ id: 'phi_gr_zero', label: '$\\phi(0)>0$' },
			{ id: 'phi_dot_sm_zero', label: '$\\dot{\\phi}(0)<0$' },
			{ id: 'phi_dot_eq_zero', label: '$\\dot{\\phi}(0)=0$' },
			{ id: 'phi_dot_gr_zero', label: '$\\dot{\\phi}(0)>0$' },
			{ id: 'gamma_weak', label: '$\\gamma=0.1$' },
			{ id: 'gamma_medium', label: '$\\gamma=0.4$' },
			{ id: 'gamma_strong', label: '$\\gamma=0.8$' },
        ],
        maxPoints: 60,
        containerId: 'test-question5-container'
    };


    // track submissions
    question1Submitted = false;
	question2Submitted = false;
	question3Submitted = false;
	question4Submitted = false;
	question5Submitted = false;


	// performance handling

    // results page data
    continueLink = '/';
    continueLinkText = 'Weiter';
    performanceLevel: 'low' | 'medium' | 'high' = 'low';

    // calculate results directly when navigating to results page
    private calculateResults() {
        const testProgress = this.testTracking.getTestResults('e-damped-oscillations-test');
        
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
        if (this.currentView === 'damped_osc6') {
            return this.performanceLevel;
        }
        return '';
    }
	
	
    ngOnInit() {
        // restore subpage from URL
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3','4','5','6'].includes(page)) {
            this.currentView = `damped_osc${page}`;
            // if (page === '6') this.calculateResults();
        }

		// start tracking this test
        this.testTracking.startTest('e-damped-oscillations-test', 5, 150); // 5 questions, 150 total points
        
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
		this.question5Submitted = this.testTracking.isQuestionAnswered(this.question5.questionId);
    }
	
	
    onQuestion1Submit(result: any) {
		this.question1Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question1.questionId)) {
            const userAnswerTexts    = (result.userAnswer as string[]).map((id: string) => this.question1.images.find((img: any) => img.id === id)?.imageSrc ?? id);
            const correctAnswerTexts = this.question1.correctOrder.map((id: string) => this.question1.images.find((img: any) => img.id === id)?.imageSrc ?? id);
			this.testTracking.trackQuestionResult(
				this.question1.questionId, result.isCorrect, result.userAnswer,
                this.question1.correctOrder, result.pointsAwarded, this.question1.maxPoints,
                { questionText: this.question1.question, questionInstruction: this.question1.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
    }

    onQuestion2Submit(result: any) {
		this.question2Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question2.questionId)) {
            const userAnswerTexts    = (result.userAnswer as string[]).map((id: string) => this.question2.images.find((img: any) => img.id === id)?.imageSrc ?? id);
            const correctAnswerTexts = this.question2.correctOrder.map((id: string) => this.question2.images.find((img: any) => img.id === id)?.imageSrc ?? id);
			this.testTracking.trackQuestionResult(
				this.question2.questionId, result.isCorrect, result.userAnswer,
                this.question2.correctOrder, result.pointsAwarded, this.question2.maxPoints,
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
            const userAnswerTexts    = (result.userAnswer as string[]).map((v: string) => this.question4.options.find((o: any) => o.value === v)?.label ?? v);
            const correctAnswerTexts = this.question4.correctAnswers.map((v: string) => this.question4.options.find((o: any) => o.value === v)?.label ?? v);
            this.testTracking.trackQuestionResult(
                this.question4.questionId, result.isCorrect, result.userAnswer,
                this.question4.correctAnswers, result.pointsAwarded, this.question4.maxPoints,
                { questionText: this.question4.question, questionInstruction: this.question4.questionInstruction, userAnswerTexts, correctAnswerTexts }
            );
        }
    }

    onQuestion5Submit(result: any) {
        this.question5Submitted = true;
        if (!this.testTracking.isQuestionAnswered(this.question5.questionId)) {
            this.testTracking.trackQuestionResult(
                this.question5.questionId, result.isCorrect, result.userAnswer,
                {}, result.pointsAwarded, this.question5.maxPoints,
                { questionText: this.question5.question, questionInstruction: this.question5.questionInstruction }
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
    get isFirstPage(): boolean {
        return this.currentView === 'damped_osc1';
    }
	// get isLastPage(): boolean {
	// 	return this.currentView === 'damped_osc5';
	// }
    get isEndPage(): boolean {
        return (this.currentView === 'damped_osc5') || (this.currentView === 'damped_osc6');
    }



    get canProceed(): boolean {
		// can only proceed if all questions on current page are submitted
        if (this.currentView === 'damped_osc1') {
			// return this.question1Submitted;
            return true;
        } else if (this.currentView === 'damped_osc2') {
			// return this.question2Submitted;
            return true;
		} else if (this.currentView === 'damped_osc3') {
			// return this.question3Submitted;
            return true;
		} else if (this.currentView === 'damped_osc4') {
			// return this.question4Submitted;
            return true;
		} else if (this.currentView === 'damped_osc5') {
			return (
                this.question1Submitted && 
                this.question2Submitted &&
                this.question3Submitted &&
                this.question4Submitted &&
                this.question5Submitted) ;
		} else if (this.currentView === 'damped_osc6') {
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
		if (this.currentView === 'damped_osc1') {
            this.router.navigate(['/decision/e-damped-oscillations'], { queryParams: { page: 4 } });
            return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc5') {
            this.currentView = 'damped_osc4';
        } else if (this.currentView === 'damped_osc6') {
            this.currentView = 'damped_osc5';
        }
        this.renderMath();
        this.updateUrl();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.canProceed) {
            if (this.currentView === 'damped_osc1') {
                this.currentView = 'damped_osc2';
            } else if (this.currentView === 'damped_osc2') {
                this.currentView = 'damped_osc3';
            } else if (this.currentView === 'damped_osc3') {
                this.currentView = 'damped_osc4';
            } else if (this.currentView === 'damped_osc4') {
				this.currentView = 'damped_osc5';
			} else if (this.currentView === 'damped_osc5') {
				this.calculateResults();
				this.currentView = 'damped_osc6';
			} else if (this.currentView === 'damped_osc6') {
                this.router.navigate([this.continueLink]);
                return;
			}
            this.renderMath();
            this.updateUrl();
        }
    }
}