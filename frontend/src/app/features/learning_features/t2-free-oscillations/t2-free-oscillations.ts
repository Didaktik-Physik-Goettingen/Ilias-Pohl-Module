import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';

declare global { interface Window { MathJax: any; } }

@Component({
selector: 'app-t2-free-oscillations',
standalone: true,
imports: [CommonModule, RouterLink, MultipleChoice],
templateUrl: './t2-free-oscillations.html',
styleUrl: './t2-free-oscillations.css',
})
export class T2FreeOscillations implements OnInit, AfterViewInit, OnDestroy {
	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

	currentView = 'free_osc1';
	get isFirstPage(): boolean { return this.currentView === 'free_osc1'; }
	get isLastPage(): boolean { return this.currentView === 'free_osc3'; }

	// ── Formulas (steps 1-3) ─────────────────────────────────────────────────

	formulas = {
		mainDgl: '\\( \\frac{d^2x}{dt^2} + \\omega_0^2x = 0 \\)',
		omegaDefinition: '\\( \\omega_0^2 = \\frac{D}{m} \\)',
		newtonNotation: '\\( \\ddot{x} + \\omega_0^2x = 0 \\)',
		exponentialAnsatz: '\\( x(t) = c \\cdot e^{\\lambda t}, \\quad c \\neq 0 \\)',
		firstDerivative: '\\( \\dot{x}(t) = c\\lambda \\cdot e^{\\lambda t} \\)',
		secondDerivative: '\\( \\ddot{x}(t) = c\\lambda^2 \\cdot e^{\\lambda t} \\)',
		substitution: '\\( c\\lambda^2e^{\\lambda t} + c\\omega_0^2e^{\\lambda t} = ce^{\\lambda t}(\\lambda^2 + \\omega_0^2) = 0 \\)',
		characteristicEquation: '\\( \\lambda^2 + \\omega_0^2 = 0 \\)',
		lambdaSquared: '\\( \\lambda^2 = -\\omega_0^2 \\)',
		lambdaSolutions: '\\( \\lambda_1 = +i\\omega_0, \\quad \\lambda_2 = -i\\omega_0 \\)',
		solutionOne: '\\( x_1(t) = c_1e^{i\\omega_0t} \\)',
		solutionTwo: '\\( x_2(t) = c_2e^{-i\\omega_0t} \\)',
		complexGeneralSolution: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)',
		realGeneralSolution: '\\( x(t) = c_1\\cos(\\omega_0t) + c_2\\sin(\\omega_0t) \\)',
		realityCondition: '\\( x(t) = x^*(t) \\)',
		conjugatedSolution: '\\( x^*(t) = c_1^*e^{-i\\omega_0t} + c_2^*e^{i\\omega_0t} \\)',
		coefficientConditionOne: '\\( c_1 - c_2^* = 0 \\)',
		coefficientConditionTwo: '\\( c_1^* - c_2 = 0 \\)',
		conjugatedConstants: '\\( c_2 = c_1^* \\)',
		complexC: '\\( c = a + ib, \\quad a,b \\in \\mathbb{R} \\)',
		complexRealSolution: '\\( x(t) = ce^{i\\omega_0t} + c^*e^{-i\\omega_0t} \\)',
		boundaryCondition: '\\( x(t=0) := 0, \\quad \\dot{x}(t=0) = v_0 \\)',
		exampleResult: '\\( x(t) = \\frac{v_0}{\\omega_0}\\sin(\\omega_0t) \\)',
		complexPair: '\\( \\lambda = \\alpha \\pm i\\beta \\)',
		undampedAlpha: '\\( \\alpha = 0 \\)',
		dampedFunctions: '\\( e^{\\alpha t}\\cos(\\beta t) \\), \\( e^{\\alpha t}\\sin(\\beta t) \\)',
		phaseState: '\\( x(t) \\), \\( \\dot{x}(t) \\)',
		phaseDgl: '\\( \\frac{d^2x}{dt^2} + \\omega_0^2x = 0 \\)',
		restoringForce: '\\( F = -Dx \\)',
		energyEquation: '\\( E = \\frac{m}{2}\\dot{x}^2 + \\frac{1}{2}Dx^2 \\)',
		omegaPhase: '\\( \\omega_0 = \\sqrt{\\frac{D}{m}} \\)',
		phaseCircle: '\\( x^2 + \\left(\\frac{\\dot{x}}{\\omega_0}\\right)^2 = \\frac{2E}{D} \\)',
		phaseRadius: '\\( R = \\sqrt{\\frac{2E}{D}} \\)',
	};

	// ── Question data ────────────────────────────────────────────────────────

	// Page 1 — main task (outside accordion)
	question1 = {
		questionId: 't2-q1-oscillator',
		question: 'Welche der folgenden Aussagen zum ungedämpften harmonischen Oszillator sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Die Lösung ist im Allgemeinen komplex, kann aber immer auf eine reelle Form zurückgeführt werden.' },
			{ value: 'answer2', label: 'Die Schwingungsfrequenz hängt von der Masse ab.' },
			{ value: 'answer3', label: 'Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen.' },
			{ value: 'answer4', label: 'Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt.' },
			{ value: 'answer5', label: 'Die allgemeine Lösung lässt sich stets als Linearkombination von \\( e^{\\lambda t} \\)-Termen ausdrücken.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer5'],
		containerId: 't2-q1-container',
		successMessage: '✓ Richtig. Damit sind die wichtigsten Eigenschaften des ungedämpften harmonischen Oszillators erfasst.',
		incompleteMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.',
		incorrectMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.'
	};

	// Page 1 — optional accordion task: Reellheitsbedingung
	question2 = {
		questionId: 't2-q2-reality',
		question: 'Welche der folgenden Aussagen zur Reellheitsbedingung sind korrekt?',
		options: [
		{ value: 'answer1', label: 'Für eine reelle Lösung muss gelten: \\( c_2 = c_1^* \\).' },
		{ value: 'answer2', label: 'Die Reellheitsbedingung folgt daraus, dass \\( x(t) = x^*(t) \\) gelten muss.' },
		{ value: 'answer3', label: 'Wenn \\( c_1 \\) rein reell ist, ist die gesamte Lösung automatisch reell.' },
		{ value: 'answer4', label: 'Die Bedingung \\( c_1 - c_2^* = 0 \\) folgt aus dem Vergleich der Koeffizienten der Exponentialterme.' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer4'],
		containerId: 't2-q2-container',
		successMessage: '✓ Richtig. Die Reellheitsbedingung erzwingt, dass die Konstanten komplex konjugiert zueinander sind.',
		incompleteMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.',
		incorrectMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.'
	};

	// Page 1 — optional accordion task: DGL-Zuordnung
	question3 = {
		questionId: 't2-q3-dgl-matching',
		question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Ungedämpfter Fall → α = 0' },
			{ value: 'answer2', label: 'Komplex konjugiertes Paar → λ = α ± iβ' },
			{ value: 'answer3', label: 'Gedämpfte harmonische Schwingung → e^(αt)cos(βt) und e^(αt)sin(βt)' },
			{ value: 'answer4', label: 'Lösung des ungedämpften Falls → Reine Sinus- und Kosinuslösung' },
			{ value: 'answer5', label: 'Ungedämpfter Fall → e^(αt)cos(βt) und e^(αt)sin(βt)' },
			{ value: 'answer6', label: 'Gedämpfte harmonische Schwingung → α = 0' }
		],
		correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
		containerId: 't2-q3-container',
		successMessage: '✓ Richtig. Die Zuordnungen passen zum ungedämpften und gedämpften Fall.',
		incompleteMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.',
		incorrectMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.'
	};

	// Page 2 — Phasenraum (3 main tasks)
	question4 = {
		questionId: 't2-q4-phase',
		question: 'Welche der folgenden Aussagen zum Phasenraum des ungedämpften harmonischen Oszillators sind korrekt?',
		options: [
			{ value: 'answer1', label: 'Die Phasenraumtrajektorie ergibt sich unter der Voraussetzung, dass Energie und Amplitude zeitabhängig sind.' },
			{ value: 'answer2', label: 'Die im Phasenraum dargestellten Zustände bestehen aus Ort und Geschwindigkeit.' },
			{ value: 'answer3', label: 'Die Gleichung \\( x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D \\) ergibt sich aus der Erhaltung der Gesamtenergie.' },
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
			{ value: 'answer2', label: 'Energiegleichung des freien Oszillators → mẋ²/2 + Dx²/2 = E' },
			{ value: 'answer3', label: 'Phasenraumtrajektorie → Eine geometrische Kurve aus allen möglichen Kombinationen von Ort und Geschwindigkeit' },
			{ value: 'answer4', label: 'Kreisgleichung der Phasenraumtrajektorie → x² + (ẋ/ω₀)² = 2E/D' },
			{ value: 'answer5', label: 'Phasenraumzustand → Eine geometrische Kurve aus allen Kombinationen von Ort und Geschwindigkeit' },
			{ value: 'answer6', label: 'Energiegleichung des freien Oszillators → x² + (ẋ/ω₀)² = 2E/D' }
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

	isCorrect1 = false; onQuestion1Answered(v: boolean): void { this.isCorrect1 = v; }
	isCorrect2 = false; onQuestion2Answered(v: boolean): void { this.isCorrect2 = v; }
	isCorrect3 = false; onQuestion3Answered(v: boolean): void { this.isCorrect3 = v; }
	isCorrect4 = false; onQuestion4Answered(v: boolean): void { this.isCorrect4 = v; }
	isCorrect5 = false; onQuestion5Answered(v: boolean): void { this.isCorrect5 = v; }
	isCorrect6 = false; onQuestion6Answered(v: boolean): void { this.isCorrect6 = v; }

	// ── Lifecycle ────────────────────────────────────────────────────────────

	ngOnInit(): void {
		const page = this.route.snapshot.queryParamMap.get('page');
		if (page) this.currentView = `free_osc${page}`;
	}

	ngAfterViewInit(): void { this.renderMath(); }

	ngOnDestroy(): void {
		if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
	}

	// ── Navigation ───────────────────────────────────────────────────────────

	goBack(): void {
		if (this.currentView === 'free_osc1') {
			this.router.navigate(['/learning/t1-intro-theory']); return;
		} else if (this.currentView === 'free_osc2') {
			this.currentView = 'free_osc1';
		} else if (this.currentView === 'free_osc3') {
			this.currentView = 'free_osc2';
		}
		this.updateUrl(); this.renderMath();
	}

	goForward(): void {
		if (this.currentView === 'free_osc1' && !this.isCorrect1) return;
		if (this.currentView === 'free_osc2' && (!this.isCorrect4 || !this.isCorrect5 || !this.isCorrect6)) return;
		if (this.currentView === 'free_osc1') {
			this.currentView = 'free_osc2';
		} else if (this.currentView === 'free_osc2') {
			this.currentView = 'free_osc3';
		} else if (this.currentView === 'free_osc3') {
			this.router.navigate(['/learning/t3-damped-oscillations']); return;
		}
		this.updateUrl(); this.renderMath();
	}

	private updateUrl(): void {
		const page = this.currentView.replace('free_osc', '');
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
