import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SingleChoice } from '../../../shared/evaluation/single-choice/single-choice';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';



@Component({
	selector: 'app-e3-driven-oscillations',
	imports: [CommonModule, RouterLink, SingleChoice, MultipleChoice],
	templateUrl: './e3-driven-oscillations.html',
	styleUrl: './e3-driven-oscillations.css',
})
export class E3DrivenOscillations {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay
    ) {}

    @HostListener('click', ['$event'])
    onGlossaryLink(event: MouseEvent) {
        const link = (event.target as HTMLElement)
            ?.closest('a[href^="#glossary-"]') as HTMLAnchorElement | null;
        if (!link) return;
        event.preventDefault();
        const term = link.getAttribute('href')!.replace('#glossary-', '');
        this.glossaryOverlay.open(term);
    }


	// question 1 data
    question1 = {
		questionId: 'driven_osc-1-dgl-loesen',
        question: 'Welcher Grundgedanke hilft weiter, um diese Differentialgleichung zu lösen?',
        options: [
            { value: 'answer1', label: '$\\varphi_\\mathrm{gesamt}(t)=\\varphi_\\mathrm{homogen}(t)+\\varphi_\\mathrm{spezial}(t)$' },
            { value: 'answer2', label: '$\\varphi_\\mathrm{gesamt}(t)\\propto\\alpha\\varphi_\\mathrm{homogen}(t)$' },
            { value: 'answer3', label: '$\\varphi_\\mathrm{gesamt}(t)$ kann man nur erraten.' },
            { value: 'answer4', label: 'Ich habe keine Ahnung. Was ist eine "inhomogene Differentialgleichung"?' }
        ],
        correctAnswer: 'answer1',
        containerId: 'question1-container',
        successMessage: `✓ Völlig richtig!<br><br>
			Völlig richtig! Die Lösung einer inhomogenen Differentialgleichung erhält man als Summe der Lösung der homogenen Gleichung (also für den gedämpften harmonischen Oszillator, wie auf den letzten Seiten behandelt) und einer speziellen Lösung.<br>
			Wie man zu dieser speziellen Lösung kommt, das ist auf der nächsten Seite skizziert.<br><br>

			Frage am Rande:
			Warum funktioniert das so mit der Unterteilung in Lösung der homogenen und speziellen Lösung?
		`,
        incorrectMessage: `✗ Falsche Wahl.<br><br>
			Versuchen Sie es nochmals!<br>
			Sie haben entweder angegeben, dass Sie die Begriffe in dieser Weise nicht kennen, oder eine falsche Lösung angekreuzt.<br><br>
			Entscheiden Sie an dieser Stelle selber, wie sie weitergehen möchten:<br><br>

			Auf der nächsten Seite finden Sie einen kurzen Überblick, wie die soeben aufgestellte Differentialgleichung gelöst werden kann. Für den Versuch ist diese Seite ausreichend.<br><br>

			Hier erhalten Sie gerne einen allgemeineren Einblick in das Lösen von 
			<a href="#glossary-hom-dgl" class="glossary-link">homogenen</a>
			oder
			<a href="#glossary-inhom-dgl" class="glossary-link">inhomogenen Differentialgleichungen</a>
			.
			`
    };


	// question 2 data
    question2 = {
		questionId: 'damped_osc-2-inhom-dgl',
        question: 'Welche der folgenden Aussagen sind korrekt?',
        options: [
            { value: 'answer1', label: 'Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch.' },
            { value: 'answer2', label: 'Ein ungedämpftes Rad würde direkt auf den Antrieb reagieren, also in Phase mit dem Antrieb schwingen.' },
            { value: 'answer3', label: 'Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Systems zu allen Zeiten.' },
            { value: 'answer4', label: 'Die Dämpfung spielt für die Schwingungsfrequenz des gedämpft schwingenden Rades nach einer bestimmten Zeit keine Rolle mehr. Entscheidend ist nur, mit welcher Frequenz der Antrieb das Rad schwingen lässt.' },
            { value: 'answer5', label: 'Der Antrieb hat nur zu Beginn einen Einfluss auf das Schwingungsverhalten, ab einer bestimmten Zeit schwingt das System frei.' },
            { value: 'answer6', label: ' Der erste Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
            { value: 'answer7', label: 'Der zweite Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
        ],
        correctAnswers: ['answer4', 'answer6'],
        containerId: 'question1-container',
        successMessage: `✓ Völlig richtig!<br><br>
		
			Aufgrund der Dämpfung wird die Bedeutung des ersten Summanden (grün) mit der Zeit geringer und das schwingende System wird durch den zweiten Term, also durch den Antrieb, dominiert.
			Der erste Summand ist nur im sogenannten "Einschwingvorgang" relevant. Der zweite Term wird auch als "stationäre Lösung" beschrieben, da maximale Amplitude und Phasenverschiebung hier nicht von der Zeit abhängen.<br>
			Die Dämpfung hat hierbei einen Einfluss auf die maximale Auslenkung und auch auf die Phasenverschiebung zwischen Anreger und Schwungrad. Auf der folgenden Seite werden wir uns diese beiden Größen und die Abhängigkeiten noch einmal genauer anschauen.<br><br>
		`,
        incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>
		
		Betrachten Sie alternativ noch einmal die Gleichung. Überlegen Sie, wie sich die Gleichung reduziert für $t\\rightarrow\\infty$. Überlege, in welchen Termen die Dämpfung (\\beta) eine Rolle spielt und wie sich die Gleichung für $\\beta=0$ verhält.`,
        incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>`
    };




	// track completion
	isCorrect1 = false;
	isCorrect2 = false;
	// isCorrect3 = false;
	// isCorrect4 = false;
	// isCorrect5 = false;
	// isCorrect6 = false;
	// isCorrect7 = false;
	// isCorrect8 = false;


	// QA states
	showResult1 = false;
	showResult2 = false;
	// showResult3 = false;
	// showResult4 = false;
	// showResult5 = false;
	// showResult6 = false;
	// showResult7 = false;
	// showResult8 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }

    onQuestion2Answered(isCorrect: boolean) {
		this.isCorrect2 = isCorrect;
    }

    // onQuestion3Answered(isCorrect: boolean) {
	// 	this.isCorrect3 = isCorrect;
    // }

    // onQuestion4Answered(isCorrect: boolean) {
	// 	this.isCorrect4 = isCorrect;
    // }

    // onQuestion5Answered(isCorrect: boolean) {
	// 	this.isCorrect5 = isCorrect;
    // }

    // onQuestion6Answered(isCorrect: boolean) {
	// 	this.isCorrect6 = isCorrect;
    // }

    // onQuestion7Answered(isCorrect: boolean) {
	// 	this.isCorrect7 = isCorrect;
    // }

    // onQuestion8Answered(isCorrect: boolean) {
	// 	this.isCorrect8 = isCorrect;
    // }


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
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3', '4', '5', '6', '7'].includes(page)) {
            this.currentView = `driven_osc${page}`;
        }

        // read entry-flow so continue button can navigate correctly
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';

        // start tracking this module
        this.trackingService.startModule('driven_oscillations');

        // restore completion states from previous session
        this.restoreCompletionState();




        this.renderMath();
    }


   ngOnDestroy() {
        // End tracking when leaving the module
        this.trackingService.endModule();
    }


    private restoreCompletionState() {
        // check if questions were already answered correctly
        this.isCorrect1 = this.trackingService.isQuestionCompleted(this.question1.questionId);
		this.isCorrect2 = this.trackingService.isQuestionCompleted(this.question2.questionId);
		// this.isCorrect3 = this.trackingService.isQuestionCompleted(this.question3.questionId);
		// this.isCorrect4 = this.trackingService.isQuestionCompleted(this.question4.questionId);
		// this.isCorrect5 = this.trackingService.isQuestionCompleted(this.question5.questionId);
		// this.isCorrect6 = this.trackingService.isQuestionCompleted(this.question6.questionId);
		// this.isCorrect7 = this.trackingService.isQuestionCompleted(this.question7.questionId);
		// this.isCorrect8 = this.trackingService.isQuestionCompleted(this.question8.questionId);
    }


    // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (window.MathJax) {
					// Clear all previous MathJax processing
					const elements = document.querySelectorAll('.MathJax');
					elements.forEach(el => el.remove());

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
        return this.currentView === 'driven_osc3';
    }



    // going back shows the previous subpage / home page
    goBack() {
        if (this.currentView === 'driven_osc1') {
            this.router.navigate(["/decision/e-driven-oscillations"]);
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
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc4';
        } else if (this.currentView === 'damped_osc5') {
            this.currentView = 'damped_osc6';
        } else if (this.currentView === 'damped_osc6') {
            this.currentView = 'damped_osc7';
        } else if (this.currentView === 'damped_osc7') {
            if (this.navigationFlow === 'learning-first') {
                this.router.navigate(['/simulation/sim-e-driven-osc'], { queryParams: { flow: 'learning-first' } });
            } else {
				// to be adjusted
                this.router.navigate(['/decision/e-driven-oscillations']);
            }
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
