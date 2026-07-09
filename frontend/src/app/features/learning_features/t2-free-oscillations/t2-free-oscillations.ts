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
		questionId: 't2-q1-oscillator',
		question: 'Welche der folgenden Aussagen zum ungedämpften harmonischen Oszillator sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Die Lösung ist im Allgemeinen komplex, kann aber immer auf eine reelle Form zurückgeführt werden.' },
			{ value: 'answer2', label: 'Die Schwingungsfrequenz hängt von der Masse ab.' },
			{ value: 'answer3', label: 'Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen.' },
			{ value: 'answer4', label: 'Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt.' },
			{ value: 'answer5', label: 'Die allgemeine Lösung lässt sich stets als Linearkombination von $e^{\\lambda t}$-Termen ausdrücken.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer5'],
		containerId: 't2-q1-container',
		successMessage: '✓ Richtig. Damit sind die wichtigsten Eigenschaften des ungedämpften harmonischen Oszillators erfasst.',
		incompleteMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.',
		incorrectMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.'
	};

	question2 = {
		questionId: 't2-q2-reality',
		question: 'Welche der folgenden Aussagen zur Reellheitsbedingung sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Für eine reelle Lösung muss gelten: $c_2 = c_1^*$.' },
			{ value: 'answer2', label: 'Die Reellheitsbedingung folgt daraus, dass $x(t) = x^*(t)$ gelten muss.' },
			{ value: 'answer3', label: 'Wenn $c_1$ rein reell ist, ist die gesamte Lösung automatisch reell.' },
			{ value: 'answer4', label: 'Die Bedingung $c_1 - c_2^* = 0$ folgt aus dem Vergleich der Koeffizienten der Exponentialterme.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer4'],
		containerId: 't2-q2-container',
		successMessage: '✓ Richtig. Die Reellheitsbedingung erzwingt, dass die Konstanten komplex konjugiert zueinander sind.',
		incompleteMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.',
		incorrectMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.'
	};

	question3 = {
		questionId: 't2-q3-dgl-matching',
		question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Ungedämpfter Fall → $\\alpha = 0$' },
			{ value: 'answer2', label: 'Komplex konjugiertes Paar → $\\lambda = \\alpha \\pm i\\beta$' },
			{ value: 'answer3', label: 'Gedämpfte harmonische Schwingung → $e^{\\alpha t}\\cos(\\beta t)$ und $e^{\\alpha t}\\sin(\\beta t)$' },
			{ value: 'answer4', label: 'Lösung des ungedämpften Falls → Reine Sinus- und Kosinuslösung' },
			{ value: 'answer5', label: 'Ungedämpfter Fall → $e^{\\alpha t}\\cos(\\beta t)$ und $e^{\\alpha t}\\sin(\\beta t)$' },
			{ value: 'answer6', label: 'Gedämpfte harmonische Schwingung → $\\alpha = 0$' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
		containerId: 't2-q3-container',
		successMessage: '✓ Richtig. Die Zuordnungen passen zum ungedämpften und gedämpften Fall.',
		incompleteMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.',
		incorrectMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.'
	};

	question4 = {
		questionId: 't2-q4-phase',
		question: 'Welche der folgenden Aussagen zum Phasenraum des ungedämpften harmonischen Oszillators sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Die Phasenraumtrajektorie ergibt sich unter der Voraussetzung, dass Energie und Amplitude zeitabhängig sind.' },
			{ value: 'answer2', label: 'Die im Phasenraum dargestellten Zustände bestehen aus Ort und Geschwindigkeit.' },
			{ value: 'answer3', label: 'Die Gleichung $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$ ergibt sich aus der Erhaltung der Gesamtenergie.' },
			{ value: 'answer4', label: 'Eine Kreisbahn im Phasenraum bedeutet, dass die Geschwindigkeit des Oszillators konstant bleibt.' }
		],
		correctAnswers: ['answer2', 'answer3'],
		containerId: 't2-q4-container',
		successMessage: '✓ Richtig. Ort und Geschwindigkeit bilden den Zustand. Die Kreisform folgt aus Energieerhaltung.',
		incompleteMessage: '✗ Eine Kreisbahn bedeutet nicht, dass die Geschwindigkeit konstant bleibt.',
		incorrectMessage: '✗ Eine Kreisbahn bedeutet nicht, dass die Geschwindigkeit konstant bleibt.'
	};

	question5 = {
		questionId: 't2-q5-phase-matching',
		question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Begriff und Beschreibung sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Phasenraumzustand → Ein einzelnes Wertepaar aus Ort und Geschwindigkeit zu einem bestimmten Zeitpunkt' },
			{ value: 'answer2', label: 'Energiegleichung des freien Oszillators → $m\\dot{x}^2/2 + Dx^2/2 = E$' },
			{ value: 'answer3', label: 'Phasenraumtrajektorie → Eine geometrische Kurve aus allen möglichen Kombinationen von Ort und Geschwindigkeit' },
			{ value: 'answer4', label: 'Kreisgleichung der Phasenraumtrajektorie → $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$' },
			{ value: 'answer5', label: 'Phasenraumzustand → Eine geometrische Kurve aus allen Kombinationen von Ort und Geschwindigkeit' },
			{ value: 'answer6', label: 'Energiegleichung des freien Oszillators → $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
		containerId: 't2-q5-container',
		successMessage: '✓ Richtig. Die Begriffe sind passend zugeordnet.',
		incompleteMessage: '✗ Unterscheiden Sie Zustand, Trajektorie, Energiegleichung und Kreisgleichung.',
		incorrectMessage: '✗ Unterscheiden Sie Zustand, Trajektorie, Energiegleichung und Kreisgleichung.'
	};

	question6 = {
		questionId: 't2-q6-pohl',
		question: 'Warum ist der Phasenraum des Pohlschen Pendels zweidimensional darstellbar?',
		options: [
			{ value: 'answer1', label: 'Weil die Energie des Systems konstant ist.' },
			{ value: 'answer2', label: 'Weil sowohl Orts- als auch Impulskoordinaten eindimensional darstellbar sind.' },
			{ value: 'answer3', label: 'Weil das Pendel ungedämpft ist.' }
		],
		correctAnswers: ['answer2'],
		containerId: 't2-q6-container',
		successMessage: '✓ Richtig. Der Phasenraum ist zweidimensional darstellbar, weil Ort und Impuls jeweils eindimensional sind.',
		incompleteMessage: '✗ Achten Sie auf die Dimension der Orts- und Impulskoordinaten.',
		incorrectMessage: '✗ Achten Sie auf die Dimension der Orts- und Impulskoordinaten.'
	};


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
		const page = this.route.snapshot.queryParamMap.get('page');
		if (page && ['1', '2'].includes(page)) {
			this.currentView = `free_osc${page}`;
		}

		this.trackingService.startModule('free_oscillations');
		this.restoreCompletionState();

		// ── Page 1: DGL und Exponentialansatz ────────────────────────────────

		this.freeOscText1a = this.sanitizer.bypassSecurityTrustHtml(`
			Die 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a> 
			des ungedämpften harmonischen Oszillators lautet:
		`);

		this.freeOscText1b = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\frac{d^2x}{dt^2} + \\omega_0^2x = 0$$
		`);

		this.freeOscText1c = this.sanitizer.bypassSecurityTrustHtml(`
			Mit der Abkürzung $\\omega_0^2 = \\frac{D}{m}$ für die Masse $m$ und die 
			<a href="#glossary-spring-constant" class="glossary-link">Federkonstante</a> 
			$D$ nennt man diese Gleichung:
			<ul>
				<li><strong>ungedämpft</strong>, weil keinerlei Dämpung betrachtet wird,</li>
				<li><strong>frei</strong>, weil keinerlei äußere Anregung existiert. Die rechte Seite der 
				<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a> 
				ist null. Deshalb heißt die Gleichung auch 
				<a href="#glossary-hom-dgl" class="glossary-link">homogene Differentialgleichung</a>,
				</li>
				<li><strong>harmonisch</strong>, weil die akustische Überlagerung von den entstehenden „reinen" Sinustönen als harmonisch empfunden wird.</li>
			</ul>
			Die DGL kann auch in der Newtonschen Notation geschrieben werden:
			$$\\ddot{x} + \\omega_0^2x = 0$$
		`);

		this.freeOscText1d = this.sanitizer.bypassSecurityTrustHtml(`
			Gelöst werden kann die 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a>
			nun mit einem 
			<a href="#glossary-exponential-ansatz" class="glossary-link">Exponentialansatz </a>
			gelöst werden:
			$$x(t) = c \\cdot e^{\\lambda t}, \\quad c \\neq 0$$
			Dazu bestimmen wir die zeitlichen Ableitungen:
			$$\\dot{x}(t) = c\\lambda \\cdot e^{\\lambda t}$$
			$$\\ddot{x}(t) = c\\lambda^2 \\cdot e^{\\lambda t}$$
			Nun setzen wir den Ansatz und die zweite Ableitung in die 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a> 
			ein:
			$$c\\lambda^2e^{\\lambda t} + c\\omega_0^2e^{\\lambda t} = ce^{\\lambda t}(\\lambda^2 + \\omega_0^2) = 0$$
			Da der Faktor vor der Klammer nicht für alle Zeiten null wird, muss die Klammer selbst null werden. Dadurch ergibt sich die Bestimmungsgleichung:
			$$\\lambda^2 + \\omega_0^2 = 0$$
			$$\\lambda^2 = -\\omega_0^2$$
			$$\\lambda_{1,2} = \\pm\\, i\\omega_0$$
			Es gibt also zwei komplexe Lösungen:
			$$x_1(t) = c_1e^{i\\omega_0t}, \\quad x_2(t) = c_2e^{-i\\omega_0t}$$
			Die allgemeine Lösung ist die Linearkombination dieser beiden Lösungen:
		`);

		this.freeOscText1e = this.sanitizer.bypassSecurityTrustHtml(`
			$$x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t}$$
		`);

		this.freeOscText1f = this.sanitizer.bypassSecurityTrustHtml(`
			Aus physikalischen Gründen muss die Lösung reell sein. Daher kann sie auch in folgender Form geschrieben werden:
			$$x(t) = c_1\\cos(\\omega_0t) + c_2\\sin(\\omega_0t)$$
		`);

		this.freeOscText1g = this.sanitizer.bypassSecurityTrustHtml(`
			Da die Auslenkung physikalisch reell sein muss, muss die Funktion mit ihrer komplex konjugierten Funktion übereinstimmen:
			$$x(t) = x^*(t)$$
			Für die komplexe Lösung ergibt sich:
			$$x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t}$$
			$$x^*(t) = c_1^*e^{-i\\omega_0t} + c_2^*e^{i\\omega_0t}$$
			Vergleicht man die Koeffizienten der Exponentialterme, erhält man:
			$$c_1 - c_2^* = 0, \\quad c_1^* - c_2 = 0$$
			Das heißt: $c_2 = c_1^*$, die beiden komplexen Konstanten müssen komplex konjugiert zueinander sein.
			Mit $c = a + ib$, $a,b \\in \\mathbb{R}$ ergibt sich:
			$$x(t) = ce^{i\\omega_0t} + c^*e^{-i\\omega_0t}$$
			Beispielsweise können die Randbedingungen durch die Geschwindigkeit beim Nulldurchgang gegeben sein:
			$$x(t=0) := 0, \\quad \\dot{x}(t=0) = v_0 \\implies x(t) = \\frac{v_0}{\\omega_0}\\sin(\\omega_0t)$$
		`);

		this.freeOscText1h = this.sanitizer.bypassSecurityTrustHtml(`
			Man kann allgemeiner zeigen, dass komplexe Lösungen des charakteristischen Polynoms bei einer reellen Ausgangsgleichung paarweise auftreten.<br><br>
			Ein komplex konjugiertes Paar besitzt die Form $\\lambda = \\alpha \\pm i\\beta$.
			Im ungedämpften Fall ist der Realteil null: $\\alpha = 0$.<br><br>
			Bei einer gedämpften harmonischen Schwingung treten zusätzlich Exponentialfaktoren auf:
			$$e^{\\alpha t}\\cos(\\beta t), \\quad e^{\\alpha t}\\sin(\\beta t)$$
		`);

		// ── Page 2: Phasenraum ────────────────────────────────────────────────

		this.freeOscText2a = this.sanitizer.bypassSecurityTrustHtml(`
			Der sogenannte Phasenraum beschreibt die Menge aller möglichen Zustände eines dynamischen Systems.
			Ausgehend von einer Bewegungsgleichung werden alle möglichen Kombinationen von
			$x(t)$ und $\\dot{x}(t)$ in einem Phasenraumdiagramm aufgetragen.
		`);

		this.freeOscText2b = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\frac{d^2x}{dt^2} + \\omega_0^2x = 0$$
		`);

		this.freeOscText2c = this.sanitizer.bypassSecurityTrustHtml(`
			Für den ungedämpften harmonischen Oszillator mit der Rückstellkraft $F = -Dx$ gilt für die Energie:
			$$E = \\frac{m}{2}\\dot{x}^2 + \\frac{1}{2}Dx^2$$
			Mit $\\omega_0 = \\sqrt{\\frac{D}{m}}$ ergibt sich durch Umstellen eine Kreisgleichung:
			$$x^2 + \\left(\\frac{\\dot{x}}{\\omega_0}\\right)^2 = \\frac{2E}{D}$$
		`);

		this.freeOscText2d = this.sanitizer.bypassSecurityTrustHtml(`
			Eine besonders anschauliche Darstellung des Schwingungsverhaltens ist im Phasenraum möglich.
			Für ein punktförmiges Teilchen im dreidimensionalen Ortsraum ist der Phasenraum als Menge aller
			Sechsertupel aus den drei Orts- und Impulskoordinaten definiert.<br><br>
			Beim Pohlschen Pendel sind sowohl die Orts- als auch die Impulskoordinate eindimensionale Größen.
			Der Phasenraum reduziert sich dadurch auf zwei Dimensionen.<br><br>
			Für einen ungedämpften Oszillator erhält man als Trajektorie einen Kreis.
			Sein Radius hängt mit der Energie des Systems zusammen: $R = \\sqrt{\\frac{2E}{D}}$.
			Für einen schwach gedämpften Oszillator erhält man hingegen eine Spirale zum Nullpunkt.
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
			this.router.navigate(['/decision/t-free-oscillations']);
			return;
		}
		this.updateUrl();
		this.renderMath();
	}
}
