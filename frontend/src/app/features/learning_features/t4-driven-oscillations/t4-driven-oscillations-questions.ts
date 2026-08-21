import { MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    questionId: 't4-q1-driven-oscillator',
    question: 'Beurteilen Sie die folgenden Aussagen über den gedämpften, getriebenen harmonischen Oszillator. Welche Aussagen sind richtig?',
    options: [
        { value: 'answer1', label: 'Die äußere Kraft $F_{\\text{ext}}\\cos(\\omega t)$ hängt von der Zeit und zusätzlich von der momentanen Auslenkung $x(t)$ ab.' },
        { value: 'answer2', label: 'Die DGL nennt man inhomogen, weil der äußere Anregungsterm unabhängig von der Schwingungsauslenkung $x(t)$ oder $\\dot{x}(t)$ ist.' },
        { value: 'answer3', label: 'Der Term $2\\gamma\\dot{x}$ in der Normalform entsteht durch eine Reibungskraft, die proportional zur Geschwindigkeit ist.' },
        { value: 'answer4', label: 'Ein System kann nur dann als „getrieben" bezeichnet werden, wenn seine Eigenfrequenz gleich der Anregungsfrequenz ist.' },
    ],
    correctAnswers: ['answer2', 'answer3'],
    containerId: 't4-q1-container',
    successMessage: '✓ Richtig. Die äußere Kraft hängt nur von der Zeit ab – das macht die DGL inhomogen.',
    incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie: „getrieben" bedeutet äußere Kraft, nicht Resonanz.',
    incorrectMessage: '✗ Noch nicht ganz richtig. „Inhomogen" bedeutet, der Anregungsterm hängt nicht von x oder ẋ ab.',
};

export const question2: MultipleChoiceQuestion = {
    questionId: 't4-q2-pohl-term',
    question: 'Was beschreibt der Term $2\\beta\\dot{\\varphi}$ in der DGL des Pohlschen Rads?',
    options: [
        { value: 'answer1', label: 'Den dämpfenden Anteil, proportional zur Winkelgeschwindigkeit' },
        { value: 'answer2', label: 'Die äußere Anregung des Systems' },
        { value: 'answer3', label: 'Die Rückstellkraft' },
        { value: 'answer4', label: 'Das Trägheitsmoment des Systems' },
    ],
    correctAnswers: ['answer1'],
    containerId: 't4-q2-container',
    successMessage: '✓ Richtig. $2\\beta\\dot{\\varphi}$ ist proportional zur Winkelgeschwindigkeit – das ist der Dämpfungsterm.',
    incompleteMessage: '✗ Noch nicht vollständig. Schauen Sie sich die Terme in der DGL genauer an.',
    incorrectMessage: '✗ Noch nicht ganz richtig. $2\\beta := \\rho/\\Theta$ ist der Reibungskoeffizient bezogen aufs Trägheitsmoment.',
};

export const question3: MultipleChoiceQuestion = {
    questionId: 't4-q3-gesamtloesung',
    question: 'Die Gesamtbewegung wird als $\\varphi(t) = \\varphi_h(t) + \\varphi_p(t)$ dargestellt. Welche Aussagen treffen zu?',
    options: [
        { value: 'answer1', label: '$\\varphi_h(t)$ enthält alle äußeren wirkenden Drehmomente.' },
        { value: 'answer2', label: 'Der homogene Anteil $\\varphi_h(t)$ entspricht der Lösung ohne äußere Anregung.' },
        { value: 'answer3', label: 'Der spezielle Anteil $\\varphi_p(t)$ wird als „partikuläre" oder „spezielle" Lösung bezeichnet.' },
        { value: 'answer4', label: '$\\varphi_p(t)$ beschreibt die Stärke der Dämpfung.' },
        { value: 'answer5', label: 'Es ergibt sich die Gesamtbewegung durch Addition der homogenen und der speziellen Lösung.' },
    ],
    correctAnswers: ['answer2', 'answer3', 'answer5'],
    containerId: 't4-q3-container',
    successMessage: '✓ Richtig. $\\varphi_h$ ist die freie Schwingung, $\\varphi_p$ die partikuläre Lösung. Addition ergibt die Gesamtbewegung.',
    incompleteMessage: '✗ Noch nicht vollständig. $\\varphi_h$ enthält keine äußeren Drehmomente – es ist die Lösung ohne Antrieb.',
    incorrectMessage: '✗ Noch nicht ganz richtig. $\\varphi_h$ enthält keine äußeren Drehmomente – es ist die Lösung der homogenen DGL.',
};

export const question4: MultipleChoiceQuestion = {
    questionId: 't4-q4-partikular-ansatz',
    question: 'Warum wird für die partikuläre Lösung der Ansatz $\\tilde{\\varphi}_p(t) = Ae^{i\\omega t}$ verwendet?',
    options: [
        { value: 'answer1', label: 'Weil der Ansatz automatisch eine reelle Lösung ergibt.' },
        { value: 'answer2', label: 'Weil die homogene Lösung ebenfalls exponentiell ist.' },
        { value: 'answer3', label: 'Weil die Inhomogenität $N\\cos(\\omega t)$ die Struktur einer komplexen Exponentialfunktion besitzt.' },
        { value: 'answer4', label: 'Weil die partikuläre Lösung unabhängig von der Anregungsfrequenz ist.' },
    ],
    correctAnswers: ['answer3'],
    containerId: 't4-q4-container',
    successMessage: '✓ Richtig. Der Ansatz spiegelt die Struktur der Inhomogenität wider – Exponentialfunktionen gehen bei Ableitung in sich selbst über.',
    incompleteMessage: '✗ Noch nicht vollständig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
};

export const question5: MultipleChoiceQuestion = {
    questionId: 't4-q5-partikular-loesung',
    question: 'Die reelle partikuläre Lösung lautet $\\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi)$. Welche Aussagen folgen allein aus dieser Darstellung?',
    options: [
        { value: 'answer1', label: 'Der Wert von $\\varphi_p(t)$ bleibt konstant, wenn $\\omega$ sehr groß wird.' },
        { value: 'answer2', label: 'Die partikuläre Lösung schwingt mit der extern vorgegebenen Frequenz $\\omega$.' },
        { value: 'answer3', label: 'Der Ausdruck unter der Wurzel ist positiv.' },
        { value: 'answer4', label: 'Die Phase $\\Phi$ beschreibt eine Verschiebung zwischen äußerer Anregung und Antwort des Systems.' },
    ],
    correctAnswers: ['answer2', 'answer3', 'answer4'],
    containerId: 't4-q5-container',
    successMessage: '✓ Richtig. Die partikuläre Lösung schwingt mit der aufgezwungenen Frequenz $\\omega$, und $\\Phi$ beschreibt die Phasenverschiebung.',
    incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie den Cosinus-Term – seine Frequenz ist $\\omega$, nicht $\\omega_0$.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Beachten Sie den Cosinus-Term – seine Frequenz ist $\\omega$, nicht $\\omega_0$.',
};

export const question6: ImageChoiceQuestion = {
    questionId: 't4-q6-einschwing',
    question: 'Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden? (Das graue Kreuz markiert den ersten, das rote Kreuz den letzten Messwert.)',
    options: [
        { value: 'answer1', imageSrc: 'assets/images/t4_driven_oscillations/17_phasenraumdiagramme_und_stationaere_schwingung_1.svg' },
        { value: 'answer2', imageSrc: 'assets/images/t4_driven_oscillations/18_phasenraumdiagramme_und_stationaere_schwingung_2.svg' },
        { value: 'answer4', imageSrc: 'assets/images/t4_driven_oscillations/20_phasenraumdiagramme_und_stationaere_schwingung_4.svg' },
    ],
    correctAnswers: ['answer4'],
    containerId: 't4-q6-container',
    successMessage: '✓ Richtig. Abbildung d) zeigt eine geschlossene Trajektorie – der Einschwingvorgang ist abgeschlossen.',
    incompleteMessage: '✗ Noch nicht vollständig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
};

export const question7: MultipleChoiceQuestion = {
    questionId: 't4-q7-amplitude-params',
    question: 'Welche Parameter des Systems beeinflussen die maximale Amplitude des stationär schwingenden (gedämpften) Systems?',
    options: [
        { value: 'answer1', label: 'Eigenfrequenz $\\omega_0$' },
        { value: 'answer2', label: 'Trägheitsmoment des Schwungkörpers $\\Theta$' },
        { value: 'answer3', label: 'Anfangsauslenkung $\\varphi(t=0)$' },
        { value: 'answer4', label: 'Anfangsgeschwindigkeit $\\dot{\\varphi}(t=0)$' },
        { value: 'answer5', label: 'Stärke der Dämpfung $\\beta$' },
        { value: 'answer6', label: 'Dämpfung (Wirbelstrombremse &amp; Reibungsverluste) $\\rho$' },
    ],
    correctAnswers: ['answer1', 'answer2', 'answer5', 'answer6'],
    containerId: 't4-q7-container',
    successMessage: '✓ Richtig. Das Zusammenspiel dieser Systemparameter beeinflusst die Amplitude der Schwingung.',
    incompleteMessage: '✗ Noch nicht vollständig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
};

export const question8: MultipleChoiceQuestion = {
    questionId: 't4-q8-damping-amplitude',
    question: 'Je stärker die Dämpfung, desto…',
    options: [
        { value: 'answer1', label: '… größer die Resonanzfrequenz.' },
        { value: 'answer2', label: '… größer die Amplitude bei der Resonanzfrequenz.' },
        { value: 'answer3', label: '… größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz $\\omega_0$.' },
    ],
    correctAnswers: ['answer3'],
    containerId: 't4-q8-container',
    successMessage: '✓ Richtig. $\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$ verschiebt sich mit steigendem $\\beta$ stärker von $\\omega_0$ weg.',
    incompleteMessage: '✗ Noch nicht vollständig. Stärkere Dämpfung senkt die Resonanzfrequenz.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Stärkere Dämpfung senkt die Resonanzfrequenz und damit auch die maximale Amplitude.',
};

export const question9: MultipleChoiceQuestion = {
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

export const question10: MultipleChoiceQuestion = {
    questionId: 't4-q10-resonanz-phase',
    question: 'Entspricht die Anregungsfrequenz gerade der Resonanzfrequenz $\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$, so…',
    options: [
        { value: 'answer1', label: 'ist die Phasenverschiebung genau $\\frac{\\pi}{2}$.' },
        { value: 'answer2', label: 'ist die Phasenverschiebung größer als $\\frac{\\pi}{2}$.' },
        { value: 'answer3', label: 'ist die Phasenverschiebung kleiner als $\\frac{\\pi}{2}$.' },
        { value: 'answer4', label: 'kann man keine Aussage über die Phasenverschiebung treffen.' },
    ],
    correctAnswers: ['answer3'],
    containerId: 't4-q10-container',
    successMessage: '✓ Richtig. Die Resonanzfrequenz $\\omega_r < \\omega_0$, und da $\\Phi = \\pi/2$ nur bei $\\omega_0$ gilt, ist $\\Phi(\\omega_r) < \\pi/2$.',
    incompleteMessage: '✗ Noch nicht vollständig. $\\Phi = \\pi/2$ gilt nur bei $\\omega = \\omega_0$, nicht bei der Resonanzfrequenz.',
    incorrectMessage: '✗ Noch nicht ganz richtig. $\\Phi = \\pi/2$ gilt nur bei $\\omega = \\omega_0$ (Eigenfrequenz), nicht bei $\\omega_r$.',
};

export const question11: MultipleChoiceQuestion = {
    questionId: 't4-q11-messung',
    question: 'Sie vermessen ein gedämpftes Schwungrad bei zwei Frequenzen: $\\omega_1 = 200\\,\\text{mHz}$ und $\\omega_2 = 400\\,\\text{mHz}$. Bei $\\omega_1$ beträgt der zeitliche Abstand zwischen den Nulldurchgängen von Antrieb und Rad $\\Delta t_1 = 0{,}25\\,\\text{s}$, bei $\\omega_2$ ist er $\\Delta t_2 = 1{,}4\\,\\text{s}$. Was können Sie über die Resonanzfrequenz des Systems aussagen?',
    options: [
        { value: 'answer1', label: 'Die Resonanzfrequenz ist größer als $\\omega_2 = 400\\,\\text{mHz}$.' },
        { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
        { value: 'answer3', label: 'Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' },
        { value: 'answer4', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1 = 200\\,\\text{mHz}$.' },
    ],
    correctAnswers: ['answer2'],
    containerId: 't4-q11-container',
    successMessage: '✓ Richtig. Bei $\\omega_1$ ist $\\Phi_1 < \\pi/2$ (Antrieb unter Eigenfrequenz), bei $\\omega_2$ ist $\\Phi_2 > \\pi/2$ – die Resonanz liegt dazwischen.',
    incompleteMessage: '✗ Noch nicht vollständig. Berechnen Sie $\\Phi = \\omega \\cdot \\Delta t$. Liegt $\\Phi < \\pi/2$, ist $\\omega < \\omega_0$.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Berechnen Sie $\\Phi = \\omega \\cdot \\Delta t$ für beide Frequenzen und vergleichen Sie mit $\\pi/2$.',
};
