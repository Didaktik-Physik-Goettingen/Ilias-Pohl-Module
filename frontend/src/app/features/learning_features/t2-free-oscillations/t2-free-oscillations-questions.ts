import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-1-oscillator',
    question: 'Welche der folgenden Aussagen zum ungedämpften harmonischen Oszillator sind korrekt?',
    options: [
        { value: 'answer1', label: 'Die Lösung ist im Allgemeinen komplex, kann aber immer auf eine reelle Form zurückgeführt werden.' },
        { value: 'answer2', label: 'Die Schwingungsfrequenz hängt von der Masse ab.' },
        { value: 'answer3', label: 'Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen.' },
        { value: 'answer4', label: 'Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt.' },
        { value: 'answer5', label: 'Die allgemeine Lösung lässt sich stets als Linearkombination von $e^{\\lambda t}$-Termen ausdrücken.' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer5'],
    containerId: 't2-free-osc-1-container',
    successMessage: '✓ Richtig. Damit sind die wichtigsten Eigenschaften des ungedämpften harmonischen Oszillators erfasst.',
    incompleteMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.',
    incorrectMessage: '✗ Das ist noch nicht ganz richtig. Denken Sie an die Begriffe frei, homogen und ungedämpft.'
};

export const question2: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-2-reality',
    question: 'Welche der folgenden Aussagen zur Reellheitsbedingung sind korrekt?',
    options: [
        { value: 'answer1', label: 'Für eine reelle Lösung muss gelten: $c_2 = c_1^*$.' },
        { value: 'answer2', label: 'Die Reellheitsbedingung folgt daraus, dass $x(t) = x^*(t)$ gelten muss.' },
        { value: 'answer3', label: 'Wenn $c_1$ rein reell ist, ist die gesamte Lösung automatisch reell.' },
        { value: 'answer4', label: 'Die Bedingung $c_1 - c_2^* = 0$ folgt aus dem Vergleich der Koeffizienten der Exponentialterme.' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer4'],
    containerId: 't2-free-osc-2-container',
    successMessage: '✓ Richtig. Die Reellheitsbedingung erzwingt, dass die Konstanten komplex konjugiert zueinander sind.',
    incompleteMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.',
    incorrectMessage: '✗ Denken Sie daran, dass die Lösung mit ihrer komplex konjugierten Lösung übereinstimmen muss.'
};

export const question3: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-3-dgl-matching',
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
    containerId: 't2-free-osc-3-container',
    successMessage: '✓ Richtig. Die Zuordnungen passen zum ungedämpften und gedämpften Fall.',
    incompleteMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.',
    incorrectMessage: '✗ Achten Sie darauf, ob der Realteil null ist oder als Dämpfungsfaktor erhalten bleibt.'
};

export const question4: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-4-phase',
    question: 'Welche der folgenden Aussagen zum Phasenraum des ungedämpften harmonischen Oszillators sind korrekt?',
    options: [
        { value: 'answer1', label: 'Die Phasenraumtrajektorie ergibt sich unter der Voraussetzung, dass Energie und Amplitude zeitabhängig sind.' },
        { value: 'answer2', label: 'Die im Phasenraum dargestellten Zustände bestehen aus Ort und Geschwindigkeit.' },
        { value: 'answer3', label: 'Die Gleichung $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$ ergibt sich aus der Erhaltung der Gesamtenergie.' },
        { value: 'answer4', label: 'Eine Kreisbahn im Phasenraum bedeutet, dass die Geschwindigkeit des Oszillators konstant bleibt.' }
    ],
    correctAnswers: ['answer2', 'answer3'],
    containerId: 't2-free-osc-4-container',
    successMessage: '✓ Richtig. Ort und Geschwindigkeit bilden den Zustand. Die Kreisform folgt aus Energieerhaltung.',
    incompleteMessage: '✗ Eine Kreisbahn bedeutet nicht, dass die Geschwindigkeit konstant bleibt.',
    incorrectMessage: '✗ Eine Kreisbahn bedeutet nicht, dass die Geschwindigkeit konstant bleibt.'
};

export const question5: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-5-phase-matching',
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
    containerId: 't2-free-osc-5-container',
    successMessage: '✓ Richtig. Die Begriffe sind passend zugeordnet.',
    incompleteMessage: '✗ Unterscheiden Sie Zustand, Trajektorie, Energiegleichung und Kreisgleichung.',
    incorrectMessage: '✗ Unterscheiden Sie Zustand, Trajektorie, Energiegleichung und Kreisgleichung.'
};

export const question6: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-6-pohl',
    question: 'Warum ist der Phasenraum des Pohlschen Pendels zweidimensional darstellbar?',
    options: [
        { value: 'answer1', label: 'Weil die Energie des Systems konstant ist.' },
        { value: 'answer2', label: 'Weil sowohl Orts- als auch Impulskoordinaten eindimensional darstellbar sind.' },
        { value: 'answer3', label: 'Weil das Pendel ungedämpft ist.' }
    ],
    correctAnswers: ['answer2'],
    containerId: 't2-free-osc-6-container',
    successMessage: '✓ Richtig. Der Phasenraum ist zweidimensional darstellbar, weil Ort und Impuls jeweils eindimensional sind.',
    incompleteMessage: '✗ Achten Sie auf die Dimension der Orts- und Impulskoordinaten.',
    incorrectMessage: '✗ Achten Sie auf die Dimension der Orts- und Impulskoordinaten.'
};
