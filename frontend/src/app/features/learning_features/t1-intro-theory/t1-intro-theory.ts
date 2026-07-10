import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';



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

	// ── Question data ────────────────────────────────────────────────────────

	question1 = {
		questionId: 't1-q1-dgl-solutions',
		question: 'Welche der folgenden Gleichungen sind allgemeine Lösungen der Differentialgleichung des harmonischen Oszillators? Beachten Sie, dass alle Variablen als konstant angenommen werden sollen.',
		options: [
			{ value: 'answer1', label: '\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)' },
			{ value: 'answer2', label: '\\( x(t) = c_1\\left(e^{i\\omega_0t} + e^{-i\\omega_0t}\\right) \\)' },
			{ value: 'answer3', label: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)' },
			{ value: 'answer4', label: '\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)' }
		],
		correctAnswers: ['answer3', 'answer4'],
		containerId: 't1-q1-container',
		successMessage: `✓ Völlig richtig.<br><br>
			Wenn Sie mögen, können Sie die nächsten Seiten überspringen, um direkt zum Test zu gedämpften Schwingungen zu gelangen.`,
		incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Lösungen fehlen. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.`,
		incorrectMessage: `✗ Das ist noch nicht ganz richtig. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.`
	};

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
        this.trackingService.startModule('intro_theory');


        this.introTheoText1a = this.sanitizer.bypassSecurityTrustHtml(`
			Wenn ein Körper aus seiner Ruhelage ausgelenkt wird und durch eine Kraft
			$\\vec{F}$, die linear mit dem Abstand von der Ruhelage zunimmt,
			in Bewegung versetzt wird, dann sprechen wir von einer harmonischen Schwingung.<br><br>

			Die Bewegung des Körpers kann mit der 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a> 
			$m\\frac{d^2x}{dt^2} = -Dx$
			beschrieben werden. Dabei wird $D$ als 
			<a href="#glossary-spring-constant" class="glossary-link">Federkonstante</a>  
			bezeichnet
			und gibt die Stärke der rücktreibenden Kraft an.<br><br>

			Üblicherweise ersetzt man hierbei
			$\\omega_0^2 = \\frac{D}{m}$
			und erhält dadurch die klassische Schwingungsgleichung:
        `);


		this.introTheoText1b = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\frac{d^2x}{dt^2} + \\omega_0^2 x = 0$$
        `);

		this.introTheoText1c = this.sanitizer.bypassSecurityTrustHtml(`
			Die Kreisfrequenz der Schwingung ist mit $\\omega_0$ angegeben.
			Sie beschreibt, wie häufig der Körper die Ruhelage durchschreitet.
			Sie hängt mit der Schwingungsdauer über
			$T = \\frac{2\\pi}{\\omega_0}$ zusammen.
        `);

		this.introTheoText1d = this.sanitizer.bypassSecurityTrustHtml(`
			Der folgende Graph zeigt die Schwingung eines Körpers bei einer Anfangsauslenkung
			und mit der Anfangsgeschwindigkeit $v_0=0$.
        `);
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
