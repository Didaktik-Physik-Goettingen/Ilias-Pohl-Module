import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';

declare global { interface Window { MathJax: any; } }

@Component({
	selector: 'app-t3-damped-oscillations',
	standalone: true,
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './t3-damped-oscillations.html',
	styleUrl: './t3-damped-oscillations.css',
})
export class T3DampedOscillations implements OnInit, AfterViewInit, OnDestroy {
	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

	currentView = 'damped_osc1';
	get isFirstPage(): boolean { return this.currentView === 'damped_osc1'; }
	get isLastPage(): boolean { return this.currentView === 'damped_osc6'; }

	// ── Formulas (steps 4–9) ─────────────────────────────────────────────────

	formulas = {
		dampedDglLong: '\\( \\frac{d^2x}{dt^2} + 2\\gamma\\frac{dx}{dt} + \\omega_0^2x = 0 \\)',
		dampedDglShort: '\\( \\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2x = 0 \\)',
		omegaDefinition: '\\( \\omega_0^2 = \\frac{D}{m} \\)',
		dampingForce: '\\( F_R = -b\\dot{x} \\)',
		dampingRelation: '\\( 2\\gamma = b/m, \\quad b > 0 \\)',
		dampedCharEq: '\\( \\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0 \\)',
		dampedLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2} \\)',
		eigenfrequency: '\\( \\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2} \\)',
		dampedGenSolution: '\\( x(t) = e^{-\\gamma t} \\cdot \\left( c_1 e^{-i\\omega_e t} + c_2 e^{i\\omega_e t} \\right) \\)',
		exponentialAnsatz: '\\( x(t) = c \\cdot e^{\\lambda t}, \\quad c \\neq 0 \\)',
		firstDerivative: '\\( \\dot{x}(t) = c\\lambda \\cdot e^{\\lambda t} \\)',
		secondDerivative: '\\( \\ddot{x}(t) = c\\lambda^2 \\cdot e^{\\lambda t} \\)',
		schwingfallLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm i\\omega_e \\)',
		dampedSpecialSolution: '\\( x(t) = Ae^{-\\gamma t}\\cos(\\omega_e t) \\)',
		phasenraumTrajectory: '\\( \\dfrac{d}{dt}\\!\\left(x^2 + \\left(\\dfrac{\\dot{x}}{\\omega_0}\\right)^{\\!2}\\right) = -4\\gamma\\!\\left(\\dfrac{\\dot{x}}{\\omega_0}\\right)^{\\!2} \\)',
		xDotOverOmega: '\\( \\tfrac{\\dot{x}}{\\omega_0} \\)',
		maxRatio: '\\( \\frac{x(t+T)}{x(t)} = e^{-\\gamma T} \\)',
		periodFormulaSchwingfall: '\\( T = \\dfrac{2\\pi}{\\omega_e} \\)',
		expDecayBeta: '\\( e^{-\\beta T} \\)',
		logDekrement: '\\( \\Lambda = \\ln\\frac{x(t)}{x(t+T)} = \\frac{2\\pi\\gamma}{\\sqrt{\\omega_0^2 - \\gamma^2}} = \\gamma \\cdot T \\)',
		kriechfallLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm \\alpha, \\quad \\lambda_{1,2} \\in \\mathbb{R} \\)',
		kriechfallGenSolution: '\\( x(t) = e^{-\\gamma t}\\left(c_1 e^{\\alpha t} - c_2 e^{-\\alpha t}\\right) \\)',
		kriechfallSpec1: '\\( x(t) = \\frac{v_0}{\\alpha} e^{-\\gamma t}\\sinh(\\alpha t) \\)',
		kriechfallSpec2: '\\( x(t) = \\frac{A}{\\alpha} e^{-\\gamma t}\\left(\\alpha\\cosh(\\alpha t) + \\gamma\\sinh(\\alpha t)\\right) \\)',
		boundaryCondition: '\\( x(t=0) := 0, \\quad \\dot{x}(t=0) = v_0 \\)',
		aperDegen: '\\( \\lambda_1 = \\lambda_2 = \\lambda = -\\gamma \\)',
		aperGenSolution: '\\( x(t) = (c_1 t + c_2)e^{-\\gamma t} \\)',
		aperSpec1: '\\( x(t) = A(1 + \\gamma t)e^{-\\gamma t} \\)',
		aperSpec2: '\\( x(t) = v_0 t e^{-\\gamma t} \\)',
	};

	// ── Question data ────────────────────────────────────────────────────────

	// Page 1 (step 4) — Exponentialansatz
	question1 = {
		questionId: 't3-q1-exp-ansatz',
		question: 'Warum kann man die DGL des gedämpften Oszillators mit dem Exponentialansatz lösen?',
		options: [
		{ value: 'answer1', label: 'Weil die DGL nicht linear ist.' },
		{ value: 'answer2', label: 'Weil der Ansatz nur für ungedämpfte Systeme funktioniert.' },
		{ value: 'answer3', label: 'Weil \\( e^{\\lambda t} \\) bei Ableitung nur mit konstanten Faktoren multipliziert wird.' },
		{ value: 'answer4', label: 'Weil die Lösung immer sinusförmig sein muss.' }
		],
		correctAnswers: ['answer3'],
		containerId: 't3-q1-container',
		successMessage: '✓ Richtig. Exponentialfunktionen reproduzieren sich beim Ableiten – das ermöglicht das Kürzen in der DGL.',
		incompleteMessage: '✗ Überlegen Sie, was beim Ableiten von e^(λt) passiert.',
		incorrectMessage: '✗ Überlegen Sie, was beim Ableiten von e^(λt) passiert.'
	};

	question2 = {
		questionId: 't3-q2-gen-solution',
		question: 'Was lässt sich über die allgemeine Lösung (s. oben) aussagen?',
		options: [
		{ value: 'answer1', label: 'Die Frequenz \\( \\omega_e \\) ist durch \\( \\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2} \\) bestimmt.' },
		{ value: 'answer2', label: 'Die Parameter \\( c_1, c_2 \\) hängen ausschließlich von den Anfangsbedingungen ab.' },
		{ value: 'answer3', label: 'Der Faktor \\( e^{-\\gamma t} \\) sorgt dafür, dass alle Lösungen exponentiell abfallen.' },
		{ value: 'answer4', label: 'Der Schwinganteil ist unabhängig vom Verhältnis \\( \\gamma/\\omega_0 \\).' },
		{ value: 'answer5', label: 'Die Form der Lösung ist nur im Schwingfall physikalisch interpretierbar.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3'],
		containerId: 't3-q2-container',
		successMessage: '✓ Richtig. Frequenz, Anfangsbedingungen und exponentieller Abfall sind korrekt erkannt.',
		incompleteMessage: '✗ Beachten Sie, dass ωₑ von γ abhängt und der Schwinganteil fallabhängig ist.',
		incorrectMessage: '✗ Beachten Sie, dass ωₑ von γ abhängt und der Schwinganteil fallabhängig ist.'
	};

	// Page 2 (step 5) — Schwingfall (5 tasks)
	question3 = {
		questionId: 't3-q3-schwingfall-condition',
		question: 'Wann spricht man beim harmonischen Oszillator vom schwach gedämpften Schwingfall?',
		options: [
		{ value: 'answer1', label: 'Wenn \\( \\gamma = 0 \\)' },
		{ value: 'answer2', label: 'Wenn \\( \\gamma > \\omega_0 \\)' },
		{ value: 'answer3', label: 'Wenn \\( \\gamma < \\omega_0 \\)' }
		],
		correctAnswers: ['answer3'],
		containerId: 't3-q3-container',
		successMessage: '✓ Richtig. Wenn γ < ω₀ sind die Lösungen komplex und das System schwingt periodisch.',
		incompleteMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.',
		incorrectMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.'
	};

	question4 = {
		questionId: 't3-q4-schwingfall-matching',
		question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Ausdruck und Bedeutung sind korrekt?',
		options: [
		{ value: 'answer1', label: 'gedämpfter Schwingungsanteil → cos(ωₑt)' },
		{ value: 'answer2', label: 'exponentieller Abfall der Amplitude → e^(−γt)' },
		{ value: 'answer3', label: 'Eigenfrequenz des gedämpften Systems → ωₑ := √(ω₀² − γ²)' },
		{ value: 'answer4', label: 'gedämpfter Schwingungsanteil → e^(−γt)' },
		{ value: 'answer5', label: 'Eigenfrequenz des gedämpften Systems → cos(ωₑt)' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3'],
		containerId: 't3-q4-container',
		successMessage: '✓ Richtig. Die Terme sind korrekt zugeordnet.',
		incompleteMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.',
		incorrectMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.'
	};

	question5 = {
		questionId: 't3-q5-exp-factor',
		question: 'Was beschreibt der Faktor \\( x(t+T)/x(t) = e^{-\\gamma T} \\) in der Lösung des gedämpften Oszillators?',
		options: [
		{ value: 'answer1', label: 'Die ungedämpfte Schwingung' },
		{ value: 'answer2', label: 'Die zeitlich konstante Eigenfrequenz' },
		{ value: 'answer3', label: 'Die exponentielle Abnahme der Amplitude' },
		{ value: 'answer4', label: 'Die Beschleunigung des Systems' }
		],
		correctAnswers: ['answer3'],
		containerId: 't3-q5-container',
		successMessage: '✓ Richtig. e^(−γt) beschreibt den exponentiellen Amplitudenabfall.',
		incompleteMessage: '✗ Betrachten Sie, wie sich e^(−γt) mit der Zeit verhält.',
		incorrectMessage: '✗ Betrachten Sie, wie sich e^(−γt) mit der Zeit verhält.'
	};

	question6 = {
		questionId: 't3-q6-amplitude-ratio',
		question: 'Wie verändert sich der Quotient e^(−γT), wenn die Dämpfung γ größer wird?',
		options: [
		{ value: 'answer1', label: 'Er wird größer als 1, weil die Amplitude wächst, also keine Dämpfung stattfindet.' },
		{ value: 'answer2', label: 'Er bleibt gleich, weil die Amplitude unabhängig von der Dämpfung gleich stark abfällt.' },
		{ value: 'answer3', label: 'Er wird exakt 0, weil ein einziges Maximum danach sofort vollständig verschwindet.' },
		{ value: 'answer4', label: 'Er wird kleiner, weil es zu einem stärkeren Abfall der Amplitude von einem Maximum zum nächsten kommt.' }
		],
		correctAnswers: ['answer4'],
		containerId: 't3-q6-container',
		successMessage: '✓ Richtig. Größeres γ → stärkerer Abfall → e^(−γT) wird kleiner.',
		incompleteMessage: '✗ Denken Sie daran: e^(−γT) nimmt mit größerem γ ab.',
		incorrectMessage: '✗ Denken Sie daran: e^(−γT) nimmt mit größerem γ ab.'
	};

	question7 = {
		questionId: 't3-q7-log-dekrement',
		question: 'Das logarithmische Dekrement ist definiert als Λ = ln(x(t)/x(t+T)) = 2πγ/√(ω₀²−γ²) = γ·T. Welche der folgenden Aussagen treffen zu?',
		options: [
		{ value: 'answer1', label: 'Ein größeres logarithmisches Dekrement bedeutet stärkere Dämpfung.' },
		{ value: 'answer2', label: 'Mit steigender Dämpfung vergrößert sich die Periodendauer \\( T \\).' },
		{ value: 'answer3', label: 'Ein kleineres \\( \\Lambda \\) zeigt, dass die Amplitude zwischen zwei Maxima kaum abnimmt.' },
		{ value: 'answer4', label: 'Bei größerer Dämpfung wird die Kreisfrequenz \\( \\omega \\) kleiner.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
		containerId: 't3-q7-container',
		successMessage: '✓ Richtig. Alle vier Aussagen treffen zu.',
		incompleteMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres ω → größeres T.',
		incorrectMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres ω → größeres T.'
	};

	// Page 4 (step 7) — Aperiodischer Grenzfall
	question8 = {
		questionId: 't3-q8-aper-grenzfall',
		question: 'Welche Aussagen zum aperiodischen Grenzfall sind korrekt?',
		options: [
		{ value: 'answer1', label: 'Das System kehrt schneller zur Ruhelage zurück als im Kriechfall (\\( \\gamma > \\omega_0 \\)).' },
		{ value: 'answer2', label: 'Die Lösung besitzt kein Maximum.' },
		{ value: 'answer3', label: 'Die Lösungen der Bestimmungsgleichung sind reell und verschieden.' },
		{ value: 'answer4', label: 'Die allgemeine Lösung lautet \\( x(t) = (c_1 t + c_2)e^{-\\gamma t} \\).' }
		],
		correctAnswers: ['answer1', 'answer4'],
		containerId: 't3-q8-container',
		successMessage: '✓ Richtig. Der aperiodische Grenzfall ist schneller als der Kriechfall und hat entartete (gleiche) Lösungen.',
		incompleteMessage: '✗ Beachten Sie: λ₁ = λ₂ = −γ bedeutet entartet, nicht verschieden.',
		incorrectMessage: '✗ Beachten Sie: λ₁ = λ₂ = −γ bedeutet entartet, nicht verschieden.'
	};

	// Page 5 (step 8) — Zusammenfassung
	question9 = {
		questionId: 't3-q9-summary-matching',
		question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Kennzeichen und Dämpfungsfall sind korrekt?',
		options: [
		{ value: 'answer1', label: 'γ = ω₀ → Aperiodischer Grenzfall' },
		{ value: 'answer2', label: 'langsame Rückkehr zur Ruhelage → Kriechfall' },
		{ value: 'answer3', label: 'Frequenz ω = √(ω₀² − γ²) → Gedämpfte Schwingung (Schwingfall)' },
		{ value: 'answer4', label: 'γ = ω₀ → Kriechfall' },
		{ value: 'answer5', label: 'langsame Rückkehr zur Ruhelage → Aperiodischer Grenzfall' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3'],
		containerId: 't3-q9-container',
		successMessage: '✓ Richtig. Die drei Fälle sind korrekt ihren Kennzeichen zugeordnet.',
		incompleteMessage: '✗ γ = ω₀ ist der Grenzfall, γ > ω₀ der Kriechfall.',
		incorrectMessage: '✗ γ = ω₀ ist der Grenzfall, γ > ω₀ der Kriechfall.'
	};

	question10 = {
		questionId: 't3-q10-gebaude',
		question: 'Welcher der drei Schwingungsfälle wäre für ein hohes Gebäude aus Komfort- und Sicherheitsgründen am besten geeignet?',
		options: [
		{ value: 'answer1', label: 'Eine Kombination aus Schwingfall und Kriechfall, da beide ähnlich reagieren.' },
		{ value: 'answer2', label: 'Schwingfall, da die Auslenkung gleichmäßig verteilt wird.' },
		{ value: 'answer3', label: 'Aperiodischer Grenzfall, da das Gebäude möglichst schnell in die Ruhelage zurückkehrt, ohne nachzuschwingen.' },
		{ value: 'answer4', label: 'Kriechfall, da die Bewegung langsam abklingt und weiche Bewegungen entstehen.' }
		],
		correctAnswers: ['answer3'],
		containerId: 't3-q10-container',
		successMessage: '✓ Richtig. Der aperiodische Grenzfall kehrt schnellstmöglich ohne Nachschwingen zur Ruhe zurück – ideal für Gebäude.',
		incompleteMessage: '✗ Schwingfall schwingt zu lange nach, Kriechfall ist zu langsam.',
		incorrectMessage: '✗ Schwingfall schwingt zu lange nach, Kriechfall ist zu langsam.'
	};

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

	// ── Lifecycle ────────────────────────────────────────────────────────────

	ngOnInit(): void {
		const page = this.route.snapshot.queryParamMap.get('page');
		if (page) this.currentView = `damped_osc${page}`;
	}

	ngAfterViewInit(): void { this.renderMath(); }

	ngOnDestroy(): void {
		if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
	}

	// ── Navigation ───────────────────────────────────────────────────────────

	goBack(): void {
	    window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'damped_osc1') {
			this.router.navigate(['/learning/t2-free-oscillations']); return;
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
		this.updateUrl(); this.renderMath();
	}

	goForward(): void {
	    window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'damped_osc1' && (!this.isCorrect1 || !this.isCorrect2)) return;
		if (this.currentView === 'damped_osc2' && (!this.isCorrect3 || !this.isCorrect4 || !this.isCorrect5 || !this.isCorrect6 || !this.isCorrect7)) return;
		if (this.currentView === 'damped_osc4' && !this.isCorrect8) return;
		if (this.currentView === 'damped_osc5' && (!this.isCorrect9 || !this.isCorrect10)) return;
		if (this.currentView === 'damped_osc1') {
			this.currentView = 'damped_osc2';
		} else if (this.currentView === 'damped_osc2') {
			this.currentView = 'damped_osc3';
		} else if (this.currentView === 'damped_osc3') {
			this.currentView = 'damped_osc4';
		} else if (this.currentView === 'damped_osc4') {
			this.currentView = 'damped_osc5';
		} else if (this.currentView === 'damped_osc5') {
			this.currentView = 'damped_osc6';
		} else if (this.currentView === 'damped_osc6') {
			this.router.navigate(['/learning/t4-driven-oscillations']); return;
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

	// ── MathJax ──────────────────────────────────────────────────────────────

	renderMath(): void {
		if (isPlatformBrowser(this.platformId)) {
		if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
		this.mathJaxTimeout = setTimeout(() => {
			this.mathJaxTimeout = null;
			const mj = (window as any).MathJax;
			if (mj?.typesetPromise) mj.typesetPromise();
			else if (mj?.typeset) mj.typeset();
		}, 100);
		}
	}
}
