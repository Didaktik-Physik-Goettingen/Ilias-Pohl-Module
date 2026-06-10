import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface ChoiceOption {
  id: number;
  label: string;
  selected: boolean;
  correct: boolean;
}

interface ChoiceTask {
  checked: boolean;
  remainingAttempts: number;
  options: ChoiceOption[];
}

interface TrueFalseStatement {
  id: number;
  text: string;
  selected: boolean | null;
  correct: boolean;
}

interface TrueFalseTask {
  checked: boolean;
  remainingAttempts: number;
  statements: TrueFalseStatement[];
}

interface MatchingOption {
  id: string;
  label: string;
}

interface MatchingItem {
  id: number;
  prompt: string;
  selectedRightId: string;
  correctRightId: string;
}

interface MatchingTask {
  checked: boolean;
  remainingAttempts: number;
  items: MatchingItem[];
}

@Component({
  selector: 'app-theorie-strang',
  imports: [],
  templateUrl: './theorie-strang.html',
  styleUrl: './theorie-strang.css',
})
export class TheorieStrang implements OnInit, OnDestroy {
  currentStep = 0;
  totalSteps = 19;
  private mathNeedsUpdate = true;
  private queryParamSub?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe(params => {
      const step = parseInt(params.get('step') ?? '0', 10);
      if (!isNaN(step) && step >= 0 && step < this.totalSteps) {
        this.currentStep = step;
        this.queueMathUpdate();
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub?.unsubscribe();
  }

  formulas = {
    force: '\\( \\vec{F} \\)',
    motionEquation: '\\( m\\frac{d^2x}{dt^2} = -Dx \\)',
    omegaDefinition: '\\( \\omega_0^2 = \\frac{D}{m} \\)',
    mainDgl: '\\( \\frac{d^2x}{dt^2} + \\omega_0^2x = 0 \\)',
    period: '\\( T = \\frac{2\\pi}{\\omega_0} \\)',
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
    phaseDgl: '\\( \\frac{d^2x}{dt^2} + \\omega_0^2x = 0 \\)',
    phaseState: '\\( x(t) \\), \\( \\dot{x}(t) \\)',
    restoringForce: '\\( F = -Dx \\)',
    energyEquation: '\\( E = \\frac{m}{2}\\dot{x}^2 + \\frac{1}{2}Dx^2 \\)',
    omegaPhase: '\\( \\omega_0 = \\sqrt{\\frac{D}{m}} \\)',
    phaseCircle: '\\( x^2 + \\left(\\frac{\\dot{x}}{\\omega_0}\\right)^2 = \\frac{2E}{D} \\)',
    phaseRadius: '\\( R = \\sqrt{\\frac{2E}{D}} \\)',
    pohlCoordinates: '\\( \\varphi(t) \\), \\( \\dot{\\varphi}(t) \\)',
    glossaryMoment: '\\( M_{\\text{Rück}} = D^* \\cdot \\varphi \\)',
    circularFrequency: '\\( \\omega = 2\\pi f = \\frac{2\\pi}{T} \\)',
    ownCircularFrequency: '\\( \\omega_0 = \\sqrt{\\frac{D^*}{\\Theta}} \\)',
    frequency: '\\( f = \\frac{1}{T} \\)',

    // Gedämpfte Schwingung
    dampedDglLong: '\\( \\frac{d^2x}{dt^2} + 2\\gamma\\frac{dx}{dt} + \\omega_0^2x = 0 \\)',
    dampedDglShort: '\\( \\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2x = 0 \\)',
    dampingForce: '\\( F_R = -b\\dot{x} \\)',
    dampingRelation: '\\( 2\\gamma = b/m, \\quad b > 0 \\)',
    dampedCharEq: '\\( \\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0 \\)',
    dampedLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2} \\)',
    eigenfrequency: '\\( \\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2} \\)',
    dampedGenSolution: '\\( x(t) = e^{-\\gamma t} \\cdot \\left( c_1 e^{-i\\omega_e t} + c_2 e^{i\\omega_e t} \\right) \\)',
    schwingfallLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm i\\omega_e \\)',
    dampedSpecialSolution: '\\( x(t) = Ae^{-\\gamma t}\\cos(\\omega_e t) \\)',
    maxRatio: '\\( \\frac{x(t+T)}{x(t)} = e^{-\\gamma T} \\)',
    logDekrement: '\\( \\Lambda = \\ln\\frac{x(t)}{x(t+T)} = \\frac{2\\pi\\gamma}{\\sqrt{\\omega_0^2 - \\gamma^2}} = \\gamma \\cdot T \\)',
    kriechfallAlpha: '\\( \\alpha := \\sqrt{\\gamma^2 - \\omega_0^2} \\)',
    kriechfallLambda: '\\( \\lambda_{1,2} = -\\gamma \\pm \\alpha, \\quad \\lambda_{1,2} \\in \\mathbb{R} \\)',
    kriechfallGenSolution: '\\( x(t) = e^{-\\gamma t}\\left(c_1 e^{\\alpha t} - c_2 e^{-\\alpha t}\\right) \\)',
    kriechfallSpec1: '\\( x(t) = \\frac{v_0}{\\alpha} e^{-\\gamma t}\\sinh(\\alpha t) \\)',
    kriechfallSpec2: '\\( x(t) = \\frac{A}{\\alpha} e^{-\\gamma t}\\left(\\alpha\\cosh(\\alpha t) + \\gamma\\sinh(\\alpha t)\\right) \\)',
    aperDegen: '\\( \\lambda_1 = \\lambda_2 = \\lambda = -\\gamma \\)',
    aperGenSolution: '\\( x(t) = (c_1 t + c_2)e^{-\\gamma t} \\)',
    aperSpec1: '\\( x(t) = A(1 + \\gamma t)e^{-\\gamma t} \\)',
    aperSpec2: '\\( x(t) = v_0 t e^{-\\gamma t} \\)',
    summaryFrequency: '\\( \\omega = \\sqrt{\\omega_0^2 - \\gamma^2} \\)',

    // Angetriebene Schwingung
    drivenDglLinear: '\\( m\\ddot{x} = -Dx - b\\dot{x} + F_{ext}\\cos(\\omega t) \\)',
    drivenDglNormal: '\\( \\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = K\\cos(\\omega t) \\)',
    drivenAbbrevK: '\\( K := F_{ext}/m \\)',
    drivenAbbrevGamma: '\\( \\gamma := b/(2m) \\)',
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
    stationaryAmplitude: '\\( \\varphi_0(\\omega) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}} \\)',
    einschwingvorgangFull: '\\( \\varphi(t) = \\underbrace{\\varphi_0\\cos(\\omega_d t+\\phi)e^{-\\beta t}}_{\\text{Einschwingvorgang}} + \\underbrace{\\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t - \\Phi\\right)}_{\\text{Stationäre Antwort}} \\)',
    resonanceFreqDriven: '\\( \\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2} \\)',
    phaseAtOmega0: '\\( \\Phi(\\omega_0) = \\frac{\\pi}{2} \\)',
    phaseFreqFormula: '\\( \\Phi(\\omega) = \\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right) \\)',
    pohlHomogeneCritical: '\\( \\varphi_h(t) = (C_1 + C_2 t)\\,e^{-\\beta t} \\)',
    pohlHomogeneStrong: '\\( \\varphi_h(t) = C_1 e^{\\lambda_1 t} + C_2 e^{\\lambda_2 t} \\)',
    pohlLambdaStrong: '\\( \\lambda_{1,2} = -\\beta \\pm \\sqrt{\\beta^2 - \\omega_0^2} \\in \\mathbb{R} \\)'
  };

  firstTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      {
        id: 1,
        label: '\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)',
        selected: false,
        correct: false
      },
      {
        id: 2,
        label: '\\( x(t) = c_1\\left(e^{i\\omega_0t} + e^{-i\\omega_0t}\\right) \\)',
        selected: false,
        correct: false
      },
      {
        id: 3,
        label: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)',
        selected: false,
        correct: true
      },
      {
        id: 4,
        label: '\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)',
        selected: false,
        correct: true
      }
    ]
  };

  realityTask: TrueFalseTask = {
    checked: false,
    remainingAttempts: 2,
    statements: [
      {
        id: 1,
        text: 'Für eine reelle Lösung muss gelten: \\( c_2 = c_1^* \\).',
        selected: null,
        correct: true
      },
      {
        id: 2,
        text: 'Die Reellheitsbedingung folgt daraus, dass \\( x(t) = x^*(t) \\) gelten muss.',
        selected: null,
        correct: true
      },
      {
        id: 3,
        text: 'Wenn \\( c_1 \\) rein reell ist, ist die gesamte Lösung automatisch reell.',
        selected: null,
        correct: false
      },
      {
        id: 4,
        text: 'Die Bedingung \\( c_1 - c_2^* = 0 \\) folgt aus dem Vergleich der Koeffizienten der Exponentialterme.',
        selected: null,
        correct: true
      }
    ]
  };

  dglMatchingOptions: MatchingOption[] = [
    {
      id: 'undamped',
      label: 'α = 0'
    },
    {
      id: 'complex-pair',
      label: 'λ = α ± iβ'
    },
    {
      id: 'damped',
      label: 'e^(αt)cos(βt) und e^(αt)sin(βt)'
    },
    {
      id: 'pure',
      label: 'Reine Sinus- und Kosinuslösung'
    }
  ];

  dglMatchingTask: MatchingTask = {
    checked: false,
    remainingAttempts: 2,
    items: [
      {
        id: 1,
        prompt: 'Ungedämpfter Fall',
        selectedRightId: '',
        correctRightId: 'undamped'
      },
      {
        id: 2,
        prompt: 'Komplex konjugiertes Paar',
        selectedRightId: '',
        correctRightId: 'complex-pair'
      },
      {
        id: 3,
        prompt: 'Gedämpfte harmonische Schwingung',
        selectedRightId: '',
        correctRightId: 'damped'
      },
      {
        id: 4,
        prompt: 'Lösung des ungedämpften Falls',
        selectedRightId: '',
        correctRightId: 'pure'
      }
    ]
  };

  oscillatorTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      {
        id: 1,
        label: 'Die Lösung ist im Allgemeinen komplex, kann aber immer auf eine reelle Form zurückgeführt werden.',
        selected: false,
        correct: true
      },
      {
        id: 2,
        label: 'Die Schwingungsfrequenz hängt von der Masse ab.',
        selected: false,
        correct: true
      },
      {
        id: 3,
        label: 'Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen.',
        selected: false,
        correct: false
      },
      {
        id: 4,
        label: 'Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt.',
        selected: false,
        correct: false
      },
      {
        id: 5,
        label: 'Die allgemeine Lösung lässt sich stets als Linearkombination von \\( e^{\\lambda t} \\)-Termen ausdrücken.',
        selected: false,
        correct: true
      }
    ]
  };

  phaseTask: TrueFalseTask = {
    checked: false,
    remainingAttempts: 2,
    statements: [
      {
        id: 1,
        text: 'Die Phasenraumtrajektorie ergibt sich unter der Voraussetzung, dass Energie und Amplitude zeitabhängig sind.',
        selected: null,
        correct: false
      },
      {
        id: 2,
        text: 'Die im Phasenraum dargestellten Zustände bestehen aus Ort und Geschwindigkeit.',
        selected: null,
        correct: true
      },
      {
        id: 3,
        text: 'Die Gleichung \\( x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D \\) ergibt sich aus der Erhaltung der Gesamtenergie.',
        selected: null,
        correct: true
      },
      {
        id: 4,
        text: 'Eine Kreisbahn im Phasenraum bedeutet, dass die Geschwindigkeit des Oszillators konstant bleibt.',
        selected: null,
        correct: false
      }
    ]
  };

  phaseMatchingOptions: MatchingOption[] = [
    {
      id: 'state',
      label: 'Ein einzelnes Wertepaar aus Ort und Geschwindigkeit zu einem bestimmten Zeitpunkt'
    },
    {
      id: 'energy',
      label: 'mẋ²/2 + Dx²/2 = E'
    },
    {
      id: 'trajectory',
      label: 'Eine geometrische Kurve aus allen möglichen Kombinationen von Ort und Geschwindigkeit'
    },
    {
      id: 'circle',
      label: 'x² + (ẋ/ω₀)² = 2E/D'
    }
  ];

  phaseMatchingTask: MatchingTask = {
    checked: false,
    remainingAttempts: 2,
    items: [
      {
        id: 1,
        prompt: 'Phasenraumzustand',
        selectedRightId: '',
        correctRightId: 'state'
      },
      {
        id: 2,
        prompt: 'Energiegleichung des freien Oszillators',
        selectedRightId: '',
        correctRightId: 'energy'
      },
      {
        id: 3,
        prompt: 'Phasenraumtrajektorie',
        selectedRightId: '',
        correctRightId: 'trajectory'
      },
      {
        id: 4,
        prompt: 'Kreisgleichung der Phasenraumtrajektorie',
        selectedRightId: '',
        correctRightId: 'circle'
      }
    ]
  };

  pohlTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      {
        id: 1,
        label: 'Weil die Energie des Systems konstant ist.',
        selected: false,
        correct: false
      },
      {
        id: 2,
        label: 'Weil sowohl Orts- als auch Impulskoordinaten eindimensional darstellbar sind.',
        selected: false,
        correct: true
      },
      {
        id: 3,
        label: 'Weil das Pendel ungedämpft ist.',
        selected: false,
        correct: false
      }
    ]
  };

  // ── Gedämpfte Schwingung tasks ────────────────────────────────────────────

  expAnsatzTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Weil die DGL nicht linear ist.', selected: false, correct: false },
      { id: 2, label: 'Weil der Ansatz nur für ungedämpfte Systeme funktioniert.', selected: false, correct: false },
      { id: 3, label: 'Weil \\( e^{\\lambda t} \\) bei Ableitung nur mit konstanten Faktoren multipliziert wird.', selected: false, correct: true },
      { id: 4, label: 'Weil die Lösung immer sinusförmig sein muss.', selected: false, correct: false }
    ]
  };

  generalSolutionTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Die Frequenz \\( \\omega_e \\) ist durch \\( \\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2} \\) bestimmt.', selected: false, correct: true },
      { id: 2, label: 'Die Parameter \\( c_1, c_2 \\) hängen ausschließlich von den Anfangsbedingungen ab.', selected: false, correct: true },
      { id: 3, label: 'Der Faktor \\( e^{-\\gamma t} \\) sorgt dafür, dass alle Lösungen exponentiell abfallen.', selected: false, correct: true },
      { id: 4, label: 'Der Schwinganteil ist unabhängig vom Verhältnis \\( \\gamma/\\omega_0 \\).', selected: false, correct: false },
      { id: 5, label: 'Die Form der Lösung ist nur im Schwingfall physikalisch interpretierbar.', selected: false, correct: false }
    ]
  };

  schwingfallConditionTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Wenn \\( \\gamma = 0 \\)', selected: false, correct: false },
      { id: 2, label: 'Wenn \\( \\gamma > \\omega_0 \\)', selected: false, correct: false },
      { id: 3, label: 'Wenn \\( \\gamma < \\omega_0 \\)', selected: false, correct: true }
    ]
  };

  schwingfallMatchingOptions: MatchingOption[] = [
    { id: 'exp', label: 'e^(−γt)' },
    { id: 'cos', label: 'cos(ωₑt)' },
    { id: 'omega', label: 'ωₑ := √(ω₀² − γ²)' }
  ];

  schwingfallMatchingTask: MatchingTask = {
    checked: false,
    remainingAttempts: 2,
    items: [
      { id: 1, prompt: 'gedämpfter Schwingungsanteil', selectedRightId: '', correctRightId: 'cos' },
      { id: 2, prompt: 'exponentieller Abfall der Amplitude', selectedRightId: '', correctRightId: 'exp' },
      { id: 3, prompt: 'Eigenfrequenz des gedämpften Systems', selectedRightId: '', correctRightId: 'omega' }
    ]
  };

  expFactorTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Die ungedämpfte Schwingung', selected: false, correct: false },
      { id: 2, label: 'Die zeitlich konstante Eigenfrequenz', selected: false, correct: false },
      { id: 3, label: 'Die exponentielle Abnahme der Amplitude', selected: false, correct: true },
      { id: 4, label: 'Die Beschleunigung des Systems', selected: false, correct: false }
    ]
  };

  amplitudeRatioTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Er wird größer als 1, weil die Amplitude wächst, also keine Dämpfung stattfindet.', selected: false, correct: false },
      { id: 2, label: 'Er bleibt gleich, weil die Amplitude unabhängig von der Dämpfung gleich stark abfällt.', selected: false, correct: false },
      { id: 3, label: 'Er wird exakt 0, weil ein einziges Maximum danach sofort vollständig verschwindet.', selected: false, correct: false },
      { id: 4, label: 'Er wird kleiner, weil es zu einem stärkeren Abfall der Amplitude von einem Maximum zum nächsten kommt.', selected: false, correct: true }
    ]
  };

  logDekrementTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Ein größeres logarithmisches Dekrement bedeutet stärkere Dämpfung.', selected: false, correct: true },
      { id: 2, label: 'Mit steigender Dämpfung vergrößert sich die Periodendauer \\( T \\).', selected: false, correct: true },
      { id: 3, label: 'Ein kleineres \\( \\Lambda \\) zeigt, dass die Amplitude zwischen zwei Maxima kaum abnimmt.', selected: false, correct: true },
      { id: 4, label: 'Bei größerer Dämpfung wird die Kreisfrequenz \\( \\omega \\) kleiner.', selected: false, correct: true }
    ]
  };

  aperGrenzfallTask: TrueFalseTask = {
    checked: false,
    remainingAttempts: 2,
    statements: [
      { id: 1, text: 'Das System kehrt schneller zur Ruhelage zurück als im Kriechfall (\\( \\gamma > \\omega_0 \\)).', selected: null, correct: true },
      { id: 2, text: 'Die Lösung besitzt kein Maximum.', selected: null, correct: false },
      { id: 3, text: 'Die Lösungen der Bestimmungsgleichung sind reell und verschieden.', selected: null, correct: false },
      { id: 4, text: 'Die allgemeine Lösung lautet \\( x(t) = (c_1 t + c_2)e^{-\\gamma t} \\).', selected: null, correct: true }
    ]
  };

  summaryMatchingOptions: MatchingOption[] = [
    { id: 'aper', label: 'Aperiodischer Grenzfall' },
    { id: 'kriech', label: 'Kriechfall' },
    { id: 'schwing', label: 'Gedämpfte Schwingung (Schwingfall)' }
  ];

  summaryMatchingTask: MatchingTask = {
    checked: false,
    remainingAttempts: 2,
    items: [
      { id: 1, prompt: 'γ = ω₀', selectedRightId: '', correctRightId: 'aper' },
      { id: 2, prompt: 'langsame Rückkehr zur Ruhelage', selectedRightId: '', correctRightId: 'kriech' },
      { id: 3, prompt: 'Frequenz ω = √(ω₀² − γ²)', selectedRightId: '', correctRightId: 'schwing' }
    ]
  };

  gebaudeTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      { id: 1, label: 'Eine Kombination aus Schwingfall und Kriechfall, da beide ähnlich reagieren.', selected: false, correct: false },
      { id: 2, label: 'Schwingfall, da die Auslenkung gleichmäßig verteilt wird.', selected: false, correct: false },
      { id: 3, label: 'Aperiodischer Grenzfall, da das Gebäude möglichst schnell in die Ruhelage zurückkehrt, ohne nachzuschwingen.', selected: false, correct: true },
      { id: 4, label: 'Kriechfall, da die Bewegung langsam abklingt und weiche Bewegungen entstehen.', selected: false, correct: false }
    ]
  };

  get isLastStep(): boolean {
    return this.currentStep >= this.totalSteps - 1;
  }

  ngAfterViewInit(): void {
    this.typesetMath();
  }

  ngAfterViewChecked(): void {
    if (this.mathNeedsUpdate) {
      this.mathNeedsUpdate = false;
      this.typesetMath();
    }
  }

  goNext(): void {
    if (this.isLastStep) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: this.currentStep + 1 },
      queryParamsHandling: 'merge',
    });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  toggleChoiceOption(task: ChoiceTask, option: ChoiceOption, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    option.selected = checkbox.checked;
    task.checked = false;
    this.queueMathUpdate();
  }

  checkChoiceTask(task: ChoiceTask): void {
    task.checked = true;

    if (!this.isChoiceTaskCorrect(task) && task.remainingAttempts > 0) {
      task.remainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isChoiceTaskCorrect(task: ChoiceTask): boolean {
    return task.options.every(option => option.selected === option.correct);
  }

  selectTrueFalse(task: TrueFalseTask, statement: TrueFalseStatement, value: boolean): void {
    statement.selected = value;
    task.checked = false;
    this.queueMathUpdate();
  }

  checkTrueFalseTask(task: TrueFalseTask): void {
    task.checked = true;

    if (!this.isTrueFalseTaskCorrect(task) && task.remainingAttempts > 0) {
      task.remainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isTrueFalseTaskCorrect(task: TrueFalseTask): boolean {
    return task.statements.every(statement => {
      return statement.selected !== null && statement.selected === statement.correct;
    });
  }

  selectMatching(task: MatchingTask, item: MatchingItem, event: Event): void {
    const select = event.target as HTMLSelectElement;
    item.selectedRightId = select.value;
    task.checked = false;
    this.queueMathUpdate();
  }

  checkMatchingTask(task: MatchingTask): void {
    task.checked = true;

    if (!this.isMatchingTaskCorrect(task) && task.remainingAttempts > 0) {
      task.remainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isMatchingTaskCorrect(task: MatchingTask): boolean {
    return task.items.every(item => {
      return item.selectedRightId !== '' && item.selectedRightId === item.correctRightId;
    });
  }

  resetMatchingTask(task: MatchingTask): void {
    task.items.forEach(item => {
      item.selectedRightId = '';
    });

    task.checked = false;
    task.remainingAttempts = 2;
    this.queueMathUpdate();
  }

  draggingOptionId = '';

  onDragStart(event: DragEvent, optionId: string): void {
    this.draggingOptionId = optionId;
    event.dataTransfer?.setData('text/plain', optionId);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropOption(task: MatchingTask, item: MatchingItem, event: DragEvent): void {
    event.preventDefault();
    const optionId = event.dataTransfer?.getData('text/plain') || this.draggingOptionId;
    if (!optionId) return;
    task.items.forEach(i => { if (i.selectedRightId === optionId) i.selectedRightId = ''; });
    item.selectedRightId = optionId;
    task.checked = false;
    this.draggingOptionId = '';
    this.queueMathUpdate();
  }

  onDragEnd(): void {
    this.draggingOptionId = '';
  }

  clearMatchingItem(task: MatchingTask, item: MatchingItem): void {
    item.selectedRightId = '';
    task.checked = false;
    this.queueMathUpdate();
  }

  getAvailableOptions(task: MatchingTask, options: MatchingOption[]): MatchingOption[] {
    const usedIds = new Set(task.items.filter(i => i.selectedRightId !== '').map(i => i.selectedRightId));
    return options.filter(opt => !usedIds.has(opt.id));
  }

  getOptionLabel(options: MatchingOption[], id: string): string {
    return options.find(opt => opt.id === id)?.label ?? '';
  }

  // ── Angetriebene Schwingung tasks ─────────────────────────────────────────

  drivenOscillatorTask: TrueFalseTask = {
    checked: false, remainingAttempts: 2,
    statements: [
      { id: 1, text: 'Die äußere Kraft \\( F_{ext}\\cos(\\omega t) \\) hängt von der Zeit und zusätzlich von der momentanen Auslenkung \\( x(t) \\) ab.', selected: null, correct: false },
      { id: 2, text: 'Die DGL nennt man inhomogen, weil der äußere Anregungsterm unabhängig von der Schwingungsauslenkung \\( x(t) \\) oder \\( \\dot{x}(t) \\) ist.', selected: null, correct: true },
      { id: 3, text: 'Der Term \\( 2\\gamma\\dot{x} \\) in der Normalform entsteht durch eine Reibungskraft, die proportional zur Geschwindigkeit ist.', selected: null, correct: true },
      { id: 4, text: 'Ein System kann nur dann als „getrieben" bezeichnet werden, wenn seine Eigenfrequenz gleich der Anregungsfrequenz ist.', selected: null, correct: false }
    ]
  };

  pohlTermTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Den dämpfenden Anteil, proportional zur Winkelgeschwindigkeit', selected: false, correct: true },
      { id: 2, label: 'Die äußere Anregung des Systems', selected: false, correct: false },
      { id: 3, label: 'Die Rückstellkraft', selected: false, correct: false },
      { id: 4, label: 'Das Trägheitsmoment des Systems', selected: false, correct: false }
    ]
  };

  gesamtlosungTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: '\\( \\varphi_h(t) \\) enthält alle äußeren wirkenden Drehmomente.', selected: false, correct: false },
      { id: 2, label: 'Der homogene Anteil \\( \\varphi_h(t) \\) entspricht der Lösung ohne äußere Anregung.', selected: false, correct: true },
      { id: 3, label: 'Der spezielle Anteil \\( \\varphi_p(t) \\) wird als „partikuläre" oder „spezielle" Lösung bezeichnet.', selected: false, correct: true },
      { id: 4, label: '\\( \\varphi_p(t) \\) beschreibt die Stärke der Dämpfung.', selected: false, correct: false },
      { id: 5, label: 'Es ergibt sich die Gesamtbewegung durch Addition der homogenen und der speziellen Lösung.', selected: false, correct: true }
    ]
  };

  partikularAnsatzTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Weil der Ansatz automatisch eine reelle Lösung ergibt.', selected: false, correct: false },
      { id: 2, label: 'Weil die homogene Lösung ebenfalls exponentiell ist.', selected: false, correct: false },
      { id: 3, label: 'Weil die Inhomogenität \\( N\\cos(\\omega t) \\) die Struktur einer komplexen Exponentialfunktion besitzt.', selected: false, correct: true },
      { id: 4, label: 'Weil die partikuläre Lösung unabhängig von der Anregungsfrequenz ist.', selected: false, correct: false }
    ]
  };

  partikularLosungTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Der Wert von \\( \\varphi_p(t) \\) bleibt konstant, wenn \\( \\omega \\) sehr groß wird.', selected: false, correct: false },
      { id: 2, label: 'Die partikuläre Lösung schwingt mit der extern vorgegebenen Frequenz \\( \\omega \\).', selected: false, correct: true },
      { id: 3, label: 'Der Ausdruck unter der Wurzel ist positiv.', selected: false, correct: true },
      { id: 4, label: 'Die Phase \\( \\Phi \\) beschreibt eine Verschiebung zwischen äußerer Anregung und Antwort des Systems.', selected: false, correct: true }
    ]
  };

  einschwingTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Wenn die Phase des Systems und des Antriebs identisch sind.', selected: false, correct: false },
      { id: 2, label: 'Wenn die Trajektorie im Phasenraumdiagramm geschlossen und stabil ist.', selected: false, correct: true },
      { id: 3, label: 'Wenn die Amplitude des Systems ihr Maximum erreicht hat.', selected: false, correct: false },
      { id: 4, label: 'Wenn die homogene Lösung größer als die partikuläre Lösung ist.', selected: false, correct: false }
    ]
  };

  amplitudeParamsTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Eigenfrequenz \\( \\omega_0 \\)', selected: false, correct: true },
      { id: 2, label: 'Trägheitsmoment des Schwungkörpers \\( \\Theta \\)', selected: false, correct: true },
      { id: 3, label: 'Anfangsauslenkung \\( \\varphi(t=0) \\)', selected: false, correct: false },
      { id: 4, label: 'Anfangsgeschwindigkeit \\( \\dot{\\varphi}(t=0) \\)', selected: false, correct: false },
      { id: 5, label: 'Stärke der Dämpfung \\( \\beta \\)', selected: false, correct: true },
      { id: 6, label: 'Dämpfung (Wirbelstrombremse & Reibungsverluste) \\( \\rho \\)', selected: false, correct: true }
    ]
  };

  dampingAmplitudeTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: '… größer die Resonanzfrequenz.', selected: false, correct: false },
      { id: 2, label: '… größer die Amplitude bei der Resonanzfrequenz.', selected: false, correct: false },
      { id: 3, label: '… größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz \\( \\omega_0 \\).', selected: false, correct: true }
    ]
  };

  resonanzPhaseTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'ist die Phasenverschiebung genau \\( \\frac{\\pi}{2} \\).', selected: false, correct: false },
      { id: 2, label: 'ist die Phasenverschiebung größer als \\( \\frac{\\pi}{2} \\).', selected: false, correct: false },
      { id: 3, label: 'ist die Phasenverschiebung kleiner als \\( \\frac{\\pi}{2} \\).', selected: false, correct: true },
      { id: 4, label: 'kann man keine Aussage über die Phasenverschiebung treffen.', selected: false, correct: false }
    ]
  };

  messungTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'Die Resonanzfrequenz ist größer als \\( \\omega_2 = 400 \\) mHz.', selected: false, correct: false },
      { id: 2, label: 'Die Resonanzfrequenz liegt zwischen \\( \\omega_1 \\) und \\( \\omega_2 \\).', selected: false, correct: true },
      { id: 3, label: 'Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.', selected: false, correct: false },
      { id: 4, label: 'Die Resonanzfrequenz ist kleiner als \\( \\omega_1 = 200 \\) mHz.', selected: false, correct: false }
    ]
  };

  versuchTask: ChoiceTask = {
    checked: false, remainingAttempts: 2,
    options: [
      { id: 1, label: 'vorsichtiger muss man bei Messungen im Bereich der Resonanzfrequenz sein, damit der Aufbau nicht beschädigt wird.', selected: false, correct: false },
      { id: 2, label: 'gleichmäßiger können die Frequenzschritte bei der Messung gewählt werden.', selected: false, correct: true },
      { id: 3, label: 'kleinschrittiger sollte man die Frequenz im Bereich der Resonanzfrequenz variieren.', selected: false, correct: false }
    ]
  };

  onAccordionToggle(): void {
    this.queueMathUpdate();
  }

  checkDglMatchingTask(): void {
    this.checkMatchingTask(this.dglMatchingTask);
  }

  resetDglMatchingTask(): void {
    this.resetMatchingTask(this.dglMatchingTask);
  }

  private queueMathUpdate(): void {
    this.mathNeedsUpdate = true;
  }

  private typesetMath(): void {
    setTimeout(() => {
      const mathJax = (window as any).MathJax;

      if (mathJax?.typesetPromise) {
        mathJax.typesetPromise();
      } else if (mathJax?.typeset) {
        mathJax.typeset();
      }
    }, 0);
  }
}