import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    questionId: 't3-q1-exp-ansatz',
    question: 'Warum kann man die DGL des gedämpften Oszillators mit dem Exponentialansatz lösen?',
    options: [
        { value: 'answer1', label: 'Weil die DGL nicht linear ist.' },
        { value: 'answer2', label: 'Weil der Ansatz nur für ungedämpfte Systeme funktioniert.' },
        { value: 'answer3', label: 'Weil $e^{\\lambda t}$ bei Ableitung nur mit konstanten Faktoren multipliziert wird.' },
        { value: 'answer4', label: 'Weil die Lösung immer sinusförmig sein muss.' }
    ],
    correctAnswers: ['answer3'],
    containerId: 't3-q1-container',
    successMessage: '✓ Richtig. Exponentialfunktionen reproduzieren sich beim Ableiten – das ermöglicht das Kürzen in der DGL.',
    incompleteMessage: '✗ Überlegen Sie, was beim Ableiten von $e^{\\lambda t}$ passiert.',
    incorrectMessage: '✗ Überlegen Sie, was beim Ableiten von $e^{\\lambda t}$ passiert.'
};

export const question2: MultipleChoiceQuestion = {
    questionId: 't3-q2-gen-solution',
    question: 'Was lässt sich über die allgemeine Lösung $x(t) = e^{-\\gamma t}(c_1 e^{-i\\omega_e t} + c_2 e^{i\\omega_e t})$ aussagen?',
    options: [
        { value: 'answer1', label: 'Die Frequenz $\\omega_e$ ist durch $\\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$ bestimmt.' },
        { value: 'answer2', label: 'Die Parameter $c_1, c_2$ hängen ausschließlich von den Anfangsbedingungen ab.' },
        { value: 'answer3', label: 'Der Faktor $e^{-\\gamma t}$ sorgt dafür, dass alle Lösungen exponentiell abfallen.' },
        { value: 'answer4', label: 'Der Schwinganteil ist unabhängig vom Verhältnis $\\gamma/\\omega_0$.' },
        { value: 'answer5', label: 'Die Form der Lösung ist nur im Schwingfall physikalisch interpretierbar.' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3'],
    containerId: 't3-q2-container',
    successMessage: '✓ Richtig. Frequenz, Anfangsbedingungen und exponentieller Abfall sind korrekt erkannt.',
    incompleteMessage: '✗ Beachten Sie, dass $\\omega_e$ von $\\gamma$ abhängt und der Schwinganteil fallabhängig ist.',
    incorrectMessage: '✗ Beachten Sie, dass $\\omega_e$ von $\\gamma$ abhängt und der Schwinganteil fallabhängig ist.'
};

export const question3: MultipleChoiceQuestion = {
    questionId: 't3-q3-schwingfall-condition',
    question: 'Wann spricht man beim harmonischen Oszillator vom schwach gedämpften Schwingfall?',
    options: [
        { value: 'answer1', label: 'Wenn $\\gamma = 0$' },
        { value: 'answer2', label: 'Wenn $\\gamma > \\omega_0$' },
        { value: 'answer3', label: 'Wenn $\\gamma < \\omega_0$' }
    ],
    correctAnswers: ['answer3'],
    containerId: 't3-q3-container',
    successMessage: '✓ Richtig. Wenn $\\gamma < \\omega_0$ sind die Lösungen komplex und das System schwingt periodisch.',
    incompleteMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.',
    incorrectMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.'
};

export const question4: MultipleChoiceQuestion = {
    questionId: 't3-q4-schwingfall-matching',
    question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Ausdruck und Bedeutung sind korrekt?',
    options: [
        { value: 'answer1', label: 'Gedämpfter Schwingungsanteil → $\\cos(\\omega_e t)$' },
        { value: 'answer2', label: 'Exponentieller Abfall der Amplitude → $e^{-\\gamma t}$' },
        { value: 'answer3', label: 'Eigenfrequenz des gedämpften Systems → $\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$' },
        { value: 'answer4', label: 'Gedämpfter Schwingungsanteil → $e^{-\\gamma t}$' },
        { value: 'answer5', label: 'Eigenfrequenz des gedämpften Systems → $\\cos(\\omega_e t)$' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3'],
    containerId: 't3-q4-container',
    successMessage: '✓ Richtig. Die Terme sind korrekt zugeordnet.',
    incompleteMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.',
    incorrectMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.'
};

export const question5: MultipleChoiceQuestion = {
    questionId: 't3-q5-exp-factor',
    question: 'Was beschreibt der Faktor $x(t+T)/x(t) = e^{-\\gamma T}$ in der Lösung des gedämpften Oszillators?',
    options: [
        { value: 'answer1', label: 'Die ungedämpfte Schwingung' },
        { value: 'answer2', label: 'Die zeitlich konstante Eigenfrequenz' },
        { value: 'answer3', label: 'Die exponentielle Abnahme der Amplitude' },
        { value: 'answer4', label: 'Die Beschleunigung des Systems' }
    ],
    correctAnswers: ['answer3'],
    containerId: 't3-q5-container',
    successMessage: '✓ Richtig. $e^{-\\gamma T}$ beschreibt den exponentiellen Amplitudenabfall.',
    incompleteMessage: '✗ Betrachten Sie, wie sich $e^{-\\gamma t}$ mit der Zeit verhält.',
    incorrectMessage: '✗ Betrachten Sie, wie sich $e^{-\\gamma t}$ mit der Zeit verhält.'
};

export const question6: MultipleChoiceQuestion = {
    questionId: 't3-q6-amplitude-ratio',
    question: 'Wie verändert sich der Quotient $e^{-\\gamma T}$, wenn die Dämpfung $\\gamma$ größer wird?',
    options: [
        { value: 'answer1', label: 'Er wird größer als 1, weil die Amplitude wächst.' },
        { value: 'answer2', label: 'Er bleibt gleich, weil die Amplitude unabhängig von der Dämpfung abfällt.' },
        { value: 'answer3', label: 'Er wird exakt 0, weil ein einziges Maximum danach sofort vollständig verschwindet.' },
        { value: 'answer4', label: 'Er wird kleiner, weil es zu einem stärkeren Abfall der Amplitude von einem Maximum zum nächsten kommt.' }
    ],
    correctAnswers: ['answer4'],
    containerId: 't3-q6-container',
    successMessage: '✓ Richtig. Größeres $\\gamma$ → stärkerer Abfall → $e^{-\\gamma T}$ wird kleiner.',
    incompleteMessage: '✗ Denken Sie daran: $e^{-\\gamma T}$ nimmt mit größerem $\\gamma$ ab.',
    incorrectMessage: '✗ Denken Sie daran: $e^{-\\gamma T}$ nimmt mit größerem $\\gamma$ ab.'
};

export const question7: MultipleChoiceQuestion = {
    questionId: 't3-q7-log-dekrement',
    question: 'Das logarithmische Dekrement ist definiert als $\\Lambda = \\ln(x(t)/x(t+T)) = 2\\pi\\gamma/\\sqrt{\\omega_0^2-\\gamma^2} = \\gamma\\cdot T$. Welche der folgenden Aussagen treffen zu?',
    options: [
        { value: 'answer1', label: 'Ein größeres logarithmisches Dekrement bedeutet stärkere Dämpfung.' },
        { value: 'answer2', label: 'Mit steigender Dämpfung vergrößert sich die Periodendauer $T$.' },
        { value: 'answer3', label: 'Ein kleineres $\\Lambda$ zeigt, dass die Amplitude zwischen zwei Maxima kaum abnimmt.' },
        { value: 'answer4', label: 'Bei größerer Dämpfung wird die Kreisfrequenz $\\omega_e$ kleiner.' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
    containerId: 't3-q7-container',
    successMessage: '✓ Richtig. Alle vier Aussagen treffen zu.',
    incompleteMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres $\\omega_e$ → größeres $T$.',
    incorrectMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres $\\omega_e$ → größeres $T$.'
};

export const question8: MultipleChoiceQuestion = {
    questionId: 't3-q8-aper-grenzfall',
    question: 'Welche Aussagen zum aperiodischen Grenzfall sind korrekt?',
    options: [
        { value: 'answer1', label: 'Das System kehrt schneller zur Ruhelage zurück als im Kriechfall ($\\gamma > \\omega_0$).' },
        { value: 'answer2', label: 'Die Lösung besitzt kein Maximum.' },
        { value: 'answer3', label: 'Die Lösungen der Bestimmungsgleichung sind reell und verschieden.' },
        { value: 'answer4', label: 'Die allgemeine Lösung lautet $x(t) = (c_1 t + c_2)e^{-\\gamma t}$.' }
    ],
    correctAnswers: ['answer1', 'answer4'],
    containerId: 't3-q8-container',
    successMessage: '✓ Richtig. Der aperiodische Grenzfall ist schneller als der Kriechfall und hat entartete (gleiche) Lösungen.',
    incompleteMessage: '✗ Beachten Sie: $\\lambda_1 = \\lambda_2 = -\\gamma$ bedeutet entartet, nicht verschieden.',
    incorrectMessage: '✗ Beachten Sie: $\\lambda_1 = \\lambda_2 = -\\gamma$ bedeutet entartet, nicht verschieden.'
};

export const question9: MultipleChoiceQuestion = {
    questionId: 't3-q9-summary-matching',
    question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Kennzeichen und Dämpfungsfall sind korrekt?',
    options: [
        { value: 'answer1', label: '$\\gamma = \\omega_0$ → Aperiodischer Grenzfall' },
        { value: 'answer2', label: 'Langsame Rückkehr zur Ruhelage → Kriechfall' },
        { value: 'answer3', label: 'Frequenz $\\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$ → Gedämpfte Schwingung (Schwingfall)' },
        { value: 'answer4', label: '$\\gamma = \\omega_0$ → Kriechfall' },
        { value: 'answer5', label: 'Langsame Rückkehr zur Ruhelage → Aperiodischer Grenzfall' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3'],
    containerId: 't3-q9-container',
    successMessage: '✓ Richtig. Die drei Fälle sind korrekt ihren Kennzeichen zugeordnet.',
    incompleteMessage: '✗ $\\gamma = \\omega_0$ ist der Grenzfall, $\\gamma > \\omega_0$ der Kriechfall.',
    incorrectMessage: '✗ $\\gamma = \\omega_0$ ist der Grenzfall, $\\gamma > \\omega_0$ der Kriechfall.'
};

export const question10: MultipleChoiceQuestion = {
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
