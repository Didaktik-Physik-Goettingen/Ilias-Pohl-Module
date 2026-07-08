import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';

@Component({
	selector: 'app-t4-driven-oscillations',
	standalone: true,
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './t4-driven-oscillations.html',
	styleUrl: './t4-driven-oscillations.css',
})
export class T4DrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
	currentView = 'driven_osc1';

	get isFirstPage(): boolean { return this.currentView === 'driven_osc1'; }
	get isLastPage(): boolean { return this.currentView === 'driven_osc9'; }

	private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: object
	) {}

	formulas = {
		drivenDglLinear: '\\( m\\ddot{x} = -Dx - b\\dot{x} + F_{ext}\\cos(\\omega t) \\)',
		drivenDglNormal: '\\( \\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = K\\cos(\\omega t) \\)',
		drivenAbbrevK: '\\( K := F_{ext}/m \\)',
		drivenAbbrevGamma: '\\( \\gamma := b/(2m) \\)',
		omegaDefinition: '\\( \\omega_0^2 = D/m \\)',
		pohlDgl: '\\( \\ddot{\\varphi}(t) + 2\\beta\\dot{\\varphi}(t) + \\omega_0^2\\varphi(t) = N\\cos(\\omega t) \\)',
		pohlBeta: '\\( 2\\beta := \\rho/\\Theta \\)',
		pohlOmega0sq: '\\( \\omega_0^2 := D^*/\\Theta \\)',
		pohlNdef: '\\( N := M/\\Theta \\)',
		totalSolutionPohl: '\\( \\varphi(t) = \\varphi_h(t) + \\varphi_p(t) \\)',
		complexDrivingForce: '\\( N\\cos(\\omega t) = \\operatorname{Re}\\!\\left[Ne^{i\\omega t}\\right] \\)',
		complexDrivenDgl: '\\( \\ddot{\\tilde{\\varphi}} + 2\\beta\\dot{\\tilde{\\varphi}} + \\omega_0^2\\tilde{\\varphi} = Ne^{i\\omega t} \\)',
		particularAnsatz: '\\( \\tilde{\\varphi}_p(t) = Ae^{i\\omega t} \\)',
		complexAmplitudeMod: '\\( |A| = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2 + (2\\beta\\omega)^2}} \\)',
		phaseShiftDef: '\\( \\Phi = \\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right) \\)',
		particularRealSolution: '\\( \\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi) \\)',
		homogenousWeakDamping: '\\( \\varphi_h(t) = e^{-\\beta t}\\bigl(c_1\\cos(\\omega_d t) + c_2\\sin(\\omega_d t)\\bigr) \\)',
		dampedNaturalFreq: '\\( \\omega_d = \\sqrt{\\omega_0^2 - \\beta^2} \\)',
		pohlHomogeneCritical: '\\( \\varphi_h(t) = (C_1 + C_2 t)\\,e^{-\\beta t} \\)',
		pohlHomogeneStrong: '\\( \\varphi_h(t) = C_1 e^{\\lambda_1 t} + C_2 e^{\\lambda_2 t} \\)',
		pohlLambdaStrong: '\\( \\lambda_{1,2} = -\\beta \\pm \\sqrt{\\beta^2 - \\omega_0^2} \\in \\mathbb{R} \\)',
		einschwingvorgangFull: '\\( \\varphi(t) = \\underbrace{\\varphi_0\\cos(\\omega_d t+\\phi)e^{-\\beta t}}_{\\text{Einschwingvorgang}} + \\underbrace{\\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t - \\Phi\\right)}_{\\text{Stationäre Antwort}} \\)',
		stationaryAmplitude: '\\( \\varphi_0(\\omega) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}} \\)',
		resonanceFreqDriven: '\\( \\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2} \\)',
		phaseAtOmega0: '\\( \\Phi(\\omega_0) = \\frac{\\pi}{2} \\)',
		phaseFreqFormula: '\\( \\Phi(\\omega) = \\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right) \\)',
		externalDrivePohl: '\\( \\varphi_{\\text{ext}}(t) = N\\cos(\\omega t) \\)',
	};

	// ── Q1: drivenOscillatorTask (TrueFalse → MC) ──────────────────────────────
	question1 = {
		questionId: 't4-q1-driven-oscillator',
		question: 'Beurteilen Sie die folgenden Aussagen über den gedämpften, getriebenen harmonischen Oszillator. Welche Aussagen sind richtig?',
		options: [
		{ value: 'answer1', label: 'Die äußere Kraft \\( F_{ext}\\cos(\\omega t) \\) hängt von der Zeit und zusätzlich von der momentanen Auslenkung \\( x(t) \\) ab.' },
		{ value: 'answer2', label: 'Die DGL nennt man inhomogen, weil der äußere Anregungsterm unabhängig von der Schwingungsauslenkung \\( x(t) \\) oder \\( \\dot{x}(t) \\) ist.' },
		{ value: 'answer3', label: 'Der Term \\( 2\\gamma\\dot{x} \\) in der Normalform entsteht durch eine Reibungskraft, die proportional zur Geschwindigkeit ist.' },
		{ value: 'answer4', label: 'Ein System kann nur dann als „getrieben" bezeichnet werden, wenn seine Eigenfrequenz gleich der Anregungsfrequenz ist.' },
		],
		correctAnswers: ['answer2', 'answer3'],
		containerId: 't4-q1-container',
		successMessage: '✓ Richtig. Die äußere Kraft hängt nur von der Zeit ab – das macht die DGL inhomogen.',
		incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie: „getrieben" bedeutet äußere Kraft, nicht Resonanz.',
		incorrectMessage: '✗ Noch nicht ganz richtig. „Inhomogen" bedeutet, der Anregungsterm hängt nicht von x oder ẋ ab.',
	};

	// ── Q2: pohlTermTask ────────────────────────────────────────────────────────
	question2 = {
		questionId: 't4-q2-pohl-term',
		question: 'Was beschreibt der Term \\( 2\\beta\\dot{\\varphi} \\) in der DGL des Pohlschen Rads?',
		options: [
		{ value: 'answer1', label: 'Den dämpfenden Anteil, proportional zur Winkelgeschwindigkeit' },
		{ value: 'answer2', label: 'Die äußere Anregung des Systems' },
		{ value: 'answer3', label: 'Die Rückstellkraft' },
		{ value: 'answer4', label: 'Das Trägheitsmoment des Systems' },
		],
		correctAnswers: ['answer1'],
		containerId: 't4-q2-container',
		successMessage: '✓ Richtig. \\( 2\\beta\\dot{\\varphi} \\) ist proportional zur Winkelgeschwindigkeit – das ist der Dämpfungsterm.',
		incompleteMessage: '✗ Noch nicht vollständig. Schauen Sie sich die Terme in der DGL genauer an.',
		incorrectMessage: '✗ Noch nicht ganz richtig. \\( 2\\beta := \\rho/\\Theta \\) ist der Reibungskoeffizient bezogen aufs Trägheitsmoment.',
	};

	// ── Q3: gesamtlosungTask ────────────────────────────────────────────────────
	question3 = {
		questionId: 't4-q3-gesamtloesung',
		question: 'Die Gesamtbewegung wird als \\( \\varphi(t) = \\varphi_h(t) + \\varphi_p(t) \\) dargestellt. Welche Aussagen treffen zu?',
		options: [
		{ value: 'answer1', label: '\\( \\varphi_h(t) \\) enthält alle äußeren wirkenden Drehmomente.' },
		{ value: 'answer2', label: 'Der homogene Anteil \\( \\varphi_h(t) \\) entspricht der Lösung ohne äußere Anregung.' },
		{ value: 'answer3', label: 'Der spezielle Anteil \\( \\varphi_p(t) \\) wird als „partikuläre" oder „spezielle" Lösung bezeichnet.' },
		{ value: 'answer4', label: '\\( \\varphi_p(t) \\) beschreibt die Stärke der Dämpfung.' },
		{ value: 'answer5', label: 'Es ergibt sich die Gesamtbewegung durch Addition der homogenen und der speziellen Lösung.' },
		],
		correctAnswers: ['answer2', 'answer3', 'answer5'],
		containerId: 't4-q3-container',
		successMessage: '✓ Richtig. \\( \\varphi_h \\) ist die freie Schwingung, \\( \\varphi_p \\) die partikuläre Lösung. Addition ergibt die Gesamtbewegung.',
		incompleteMessage: '✗ Noch nicht vollständig. \\( \\varphi_h \\) enthält keine äußeren Drehmomente – es ist die Lösung ohne Antrieb.',
		incorrectMessage: '✗ Noch nicht ganz richtig. \\( \\varphi_h \\) enthält keine äußeren Drehmomente – es ist die Lösung der homogenen DGL.',
	};

	// ── Q4: partikularAnsatzTask ────────────────────────────────────────────────
	question4 = {
		questionId: 't4-q4-partikular-ansatz',
		question: 'Warum wird für die partikuläre Lösung der Ansatz \\( \\tilde{\\varphi}_p(t) = Ae^{i\\omega t} \\) verwendet?',
		options: [
		{ value: 'answer1', label: 'Weil der Ansatz automatisch eine reelle Lösung ergibt.' },
		{ value: 'answer2', label: 'Weil die homogene Lösung ebenfalls exponentiell ist.' },
		{ value: 'answer3', label: 'Weil die Inhomogenität \\( N\\cos(\\omega t) \\) die Struktur einer komplexen Exponentialfunktion besitzt.' },
		{ value: 'answer4', label: 'Weil die partikuläre Lösung unabhängig von der Anregungsfrequenz ist.' },
		],
		correctAnswers: ['answer3'],
		containerId: 't4-q4-container',
		successMessage: '✓ Richtig. Der Ansatz spiegelt die Struktur der Inhomogenität wider – Exponentialfunktionen gehen bei Ableitung in sich selbst über.',
		incompleteMessage: '✗ Noch nicht vollständig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
		incorrectMessage: '✗ Noch nicht ganz richtig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
	};

	// ── Q5: partikularLosungTask ────────────────────────────────────────────────
	question5 = {
		questionId: 't4-q5-partikular-loesung',
		question: 'Die reelle partikuläre Lösung lautet \\( \\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi) \\). Welche Aussagen folgen allein aus dieser Darstellung?',
		options: [
		{ value: 'answer1', label: 'Der Wert von \\( \\varphi_p(t) \\) bleibt konstant, wenn \\( \\omega \\) sehr groß wird.' },
		{ value: 'answer2', label: 'Die partikuläre Lösung schwingt mit der extern vorgegebenen Frequenz \\( \\omega \\).' },
		{ value: 'answer3', label: 'Der Ausdruck unter der Wurzel ist positiv.' },
		{ value: 'answer4', label: 'Die Phase \\( \\Phi \\) beschreibt eine Verschiebung zwischen äußerer Anregung und Antwort des Systems.' },
		],
		correctAnswers: ['answer2', 'answer3', 'answer4'],
		containerId: 't4-q5-container',
		successMessage: '✓ Richtig. Die partikuläre Lösung schwingt mit der aufgezwungenen Frequenz \\( \\omega \\), und \\( \\Phi \\) beschreibt die Phasenverschiebung.',
		incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie den Cosinus-Term – seine Frequenz ist \\( \\omega \\), nicht \\( \\omega_0 \\).',
		incorrectMessage: '✗ Noch nicht ganz richtig. Beachten Sie den Cosinus-Term – seine Frequenz ist \\( \\omega \\), nicht \\( \\omega_0 \\).',
	};

	// ── Q6: einschwingTask (image task → MC) ────────────────────────────────────
	question6 = {
		questionId: 't4-q6-einschwing',
		question: 'Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden? (Das graue Kreuz markiert den ersten, das rote Kreuz den letzten Messwert.)',
		options: [
		{ value: 'answer1', label: 'Abbildung a)' },
		{ value: 'answer2', label: 'Abbildung b)' },
		{ value: 'answer3', label: 'Abbildung c)' },
		{ value: 'answer4', label: 'Abbildung d)' },
		],
		correctAnswers: ['answer4'],
		containerId: 't4-q6-container',
		successMessage: '✓ Richtig. Abbildung d) zeigt eine geschlossene Trajektorie – der Einschwingvorgang ist abgeschlossen.',
		incompleteMessage: '✗ Noch nicht vollständig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
		incorrectMessage: '✗ Noch nicht ganz richtig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
	};

	// ── Q7: amplitudeParamsTask ─────────────────────────────────────────────────
	question7 = {
		questionId: 't4-q7-amplitude-params',
		question: 'Welche Parameter des Systems beeinflussen die maximale Amplitude des stationär schwingenden (gedämpften) Systems?',
		options: [
		{ value: 'answer1', label: 'Eigenfrequenz \\( \\omega_0 \\)' },
		{ value: 'answer2', label: 'Trägheitsmoment des Schwungkörpers \\( \\Theta \\)' },
		{ value: 'answer3', label: 'Anfangsauslenkung \\( \\varphi(t=0) \\)' },
		{ value: 'answer4', label: 'Anfangsgeschwindigkeit \\( \\dot{\\varphi}(t=0) \\)' },
		{ value: 'answer5', label: 'Stärke der Dämpfung \\( \\beta \\)' },
		{ value: 'answer6', label: 'Dämpfung (Wirbelstrombremse &amp; Reibungsverluste) \\( \\rho \\)' },
		],
		correctAnswers: ['answer1', 'answer2', 'answer5', 'answer6'],
		containerId: 't4-q7-container',
		successMessage: '✓ Richtig. Das Zusammenspiel dieser Systemparameter beeinflusst die Amplitude der Schwingung.',
		incompleteMessage: '✗ Noch nicht vollständig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
		incorrectMessage: '✗ Noch nicht ganz richtig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
	};

	// ── Q8: dampingAmplitudeTask ────────────────────────────────────────────────
	question8 = {
		questionId: 't4-q8-damping-amplitude',
		question: 'Je stärker die Dämpfung, desto…',
		options: [
		{ value: 'answer1', label: '… größer die Resonanzfrequenz.' },
		{ value: 'answer2', label: '… größer die Amplitude bei der Resonanzfrequenz.' },
		{ value: 'answer3', label: '… größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz \\( \\omega_0 \\).' },
		],
		correctAnswers: ['answer3'],
		containerId: 't4-q8-container',
		successMessage: '✓ Richtig. \\( \\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2} \\) verschiebt sich mit steigendem \\( \\beta \\) stärker von \\( \\omega_0 \\) weg.',
		incompleteMessage: '✗ Noch nicht vollständig. Stärkere Dämpfung senkt die Resonanzfrequenz.',
		incorrectMessage: '✗ Noch nicht ganz richtig. Stärkere Dämpfung senkt die Resonanzfrequenz und damit auch die maximale Amplitude.',
	};

	// ── Q9: versuchTask ─────────────────────────────────────────────────────────
	question9 = {
		questionId: 't4-q9-versuch',
		question: 'Überlegen Sie, welche Konsequenzen stärkere Dämpfung für die Versuchsdurchführung hat. Je stärker die Dämpfung, desto…',
		options: [
		{ value: 'answer1', label: '… vorsichtiger muss man bei Messungen im Bereich der Resonanzfrequenz sein, damit der Aufbau nicht beschädigt wird.' },
		{ value: 'answer2', label: '… gleichmäßiger können die Frequenzschritte bei der Messung gewählt werden.' },
		{ value: 'answer3', label: '… kleinschrittiger sollte man die Frequenz im Bereich der Resonanzfrequenz variieren.' },
		],
		correctAnswers: ['answer2'],
		containerId: 't4-q9-container',
		successMessage: '✓ Richtig. Stärkere Dämpfung verbreitert den Resonanzpeak – gleichmäßige Frequenzschritte sind ausreichend.',
		incompleteMessage: '✗ Noch nicht vollständig. Je schärfer der Resonanzpeak, desto kleinere Schritte sind nötig.',
		incorrectMessage: '✗ Noch nicht ganz richtig. Je schärfer der Resonanzpeak (geringe Dämpfung), desto kleinschrittiger muss gemessen werden.',
	};

	// ── Q10: resonanzPhaseTask ──────────────────────────────────────────────────
	question10 = {
		questionId: 't4-q10-resonanz-phase',
		question: 'Entspricht die Anregungsfrequenz gerade der Resonanzfrequenz \\( \\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2} \\), so…',
		options: [
		{ value: 'answer1', label: 'ist die Phasenverschiebung genau \\( \\frac{\\pi}{2} \\).' },
		{ value: 'answer2', label: 'ist die Phasenverschiebung größer als \\( \\frac{\\pi}{2} \\).' },
		{ value: 'answer3', label: 'ist die Phasenverschiebung kleiner als \\( \\frac{\\pi}{2} \\).' },
		{ value: 'answer4', label: 'kann man keine Aussage über die Phasenverschiebung treffen.' },
		],
		correctAnswers: ['answer3'],
		containerId: 't4-q10-container',
		successMessage: '✓ Richtig. Die Resonanzfrequenz \\( \\omega_r < \\omega_0 \\), und da \\( \\Phi = \\pi/2 \\) nur bei \\( \\omega_0 \\) gilt, ist \\( \\Phi(\\omega_r) < \\pi/2 \\).',
		incompleteMessage: '✗ Noch nicht vollständig. \\( \\Phi = \\pi/2 \\) gilt nur bei \\( \\omega = \\omega_0 \\), nicht bei der Resonanzfrequenz.',
		incorrectMessage: '✗ Noch nicht ganz richtig. \\( \\Phi = \\pi/2 \\) gilt nur bei \\( \\omega = \\omega_0 \\) (Eigenfrequenz), nicht bei \\( \\omega_r \\).',
	};

	// ── Q11: messungTask ────────────────────────────────────────────────────────
	question11 = {
		questionId: 't4-q11-messung',
		question: 'Sie vermessen ein gedämpftes Schwungrad bei zwei Frequenzen: ω₁ = 200 mHz und ω₂ = 400 mHz. Bei ω₁ beträgt der zeitliche Abstand zwischen den Nulldurchgängen von Antrieb und Rad Δt₁ = 0,25 s, bei ω₂ ist er Δt₂ = 1,4 s. Was können Sie über die Resonanzfrequenz des Systems aussagen?',
		options: [
		{ value: 'answer1', label: 'Die Resonanzfrequenz ist größer als \\( \\omega_2 = 400 \\) mHz.' },
		{ value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen \\( \\omega_1 \\) und \\( \\omega_2 \\).' },
		{ value: 'answer3', label: 'Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' },
		{ value: 'answer4', label: 'Die Resonanzfrequenz ist kleiner als \\( \\omega_1 = 200 \\) mHz.' },
		],
		correctAnswers: ['answer2'],
		containerId: 't4-q11-container',
		successMessage: '✓ Richtig. Bei \\( \\omega_1 \\) ist \\( \\Phi_1 < \\pi/2 \\) (Antrieb unter Eigenfrequenz), bei \\( \\omega_2 \\) ist \\( \\Phi_2 > \\pi/2 \\) – die Resonanz liegt dazwischen.',
		incompleteMessage: '✗ Noch nicht vollständig. Berechnen Sie \\( \\Phi = \\omega \\cdot \\Delta t \\). Liegt \\( \\Phi < \\pi/2 \\), ist \\( \\omega < \\omega_0 \\).',
		incorrectMessage: '✗ Noch nicht ganz richtig. Berechnen Sie \\( \\Phi = \\omega \\cdot \\Delta t \\) für beide Frequenzen und vergleichen Sie mit \\( \\pi/2 \\).',
	};

	isCorrect1 = false;
	isCorrect2 = false;
	isCorrect3 = false;
	isCorrect4 = false;
	isCorrect5 = false;
	isCorrect6 = false;
	isCorrect7 = false;
	isCorrect8 = false;
	isCorrect9 = false;
	isCorrect10 = false;
	isCorrect11 = false;

	onQuestion1Answered(isCorrect: boolean): void { this.isCorrect1 = isCorrect; }
	onQuestion2Answered(isCorrect: boolean): void { this.isCorrect2 = isCorrect; }
	onQuestion3Answered(isCorrect: boolean): void { this.isCorrect3 = isCorrect; }
	onQuestion4Answered(isCorrect: boolean): void { this.isCorrect4 = isCorrect; }
	onQuestion5Answered(isCorrect: boolean): void { this.isCorrect5 = isCorrect; }
	onQuestion6Answered(isCorrect: boolean): void { this.isCorrect6 = isCorrect; }
	onQuestion7Answered(isCorrect: boolean): void { this.isCorrect7 = isCorrect; }
	onQuestion8Answered(isCorrect: boolean): void { this.isCorrect8 = isCorrect; }
	onQuestion9Answered(isCorrect: boolean): void { this.isCorrect9 = isCorrect; }
	onQuestion10Answered(isCorrect: boolean): void { this.isCorrect10 = isCorrect; }
	onQuestion11Answered(isCorrect: boolean): void { this.isCorrect11 = isCorrect; }

	ngOnInit(): void {
		const page = this.route.snapshot.queryParamMap.get('page');
		if (page) this.currentView = `driven_osc${page}`;
	}

	ngAfterViewInit(): void { this.renderMath(); }

	ngOnDestroy(): void {
		if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
	}

	goBack(): void {
	    window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'driven_osc1') {
			this.router.navigate(['/learning/t3-damped-oscillations']); return;
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
		} else if (this.currentView === 'driven_osc9') {
			this.currentView = 'driven_osc8';
		}
		this.updateUrl(); this.renderMath();
	}

	goForward(): void {
	    window.scrollTo({ top: 0, behavior: 'smooth' });
		if (this.currentView === 'driven_osc1' && !this.isCorrect1) return;
		if (this.currentView === 'driven_osc2' && !(this.isCorrect2 && this.isCorrect3)) return;
		if (this.currentView === 'driven_osc4' && !(this.isCorrect4 && this.isCorrect5)) return;
		if (this.currentView === 'driven_osc6' && !this.isCorrect6) return;
		if (this.currentView === 'driven_osc7' && !(this.isCorrect7 && this.isCorrect8 && this.isCorrect9)) return;
		if (this.currentView === 'driven_osc8' && !(this.isCorrect10 && this.isCorrect11)) return;
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
			this.currentView = 'driven_osc9';
		} else if (this.currentView === 'driven_osc9') {
			this.router.navigate(['/simulation/theory-damped-driven']); return;
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

	private renderMath(): void {
		if (!isPlatformBrowser(this.platformId)) return;
		if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
		this.mathJaxTimeout = setTimeout(() => {
			this.mathJaxTimeout = null;
			const mj = (window as any).MathJax;
			if (mj?.typesetPromise) mj.typesetPromise();
			else if (mj?.typeset) mj.typeset();
		}, 100);
	}
}
