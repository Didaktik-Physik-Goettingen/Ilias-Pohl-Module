import { MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-1-driven-oscillator",
    "question": "Beurteilen Sie die folgenden Aussagen über den gedämpften, getriebenen harmonischen Oszillator. Welche Aussagen sind richtig?",
    "options": [
        {
            "value": "answer1",
            "label": "Die äußere Kraft $F_{\\text{ext}}\\cos(\\omega t)$ hängt von der Zeit und zusätzlich von der momentanen Auslenkung $x(t)$ ab."
        },
        {
            "value": "answer2",
            "label": "Die DGL ist inhomogen, weil der äußere Quellterm $K\\cos(\\omega t)$ nicht identisch null ist; der vorgeschriebene Antrieb hängt außerdem nicht vom Systemzustand ab."
        },
        {
            "value": "answer3",
            "label": "Der Term $2\\gamma\\dot{x}$ in der Normalform entsteht durch eine Reibungskraft, die proportional zur Geschwindigkeit ist."
        },
        {
            "value": "answer4",
            "label": "Ein System kann nur dann als „getrieben\" bezeichnet werden, wenn seine Eigenfrequenz gleich der Anregungsfrequenz ist."
        }
    ],
    "correctAnswers": [
        "answer2",
        "answer3"
    ],
    "containerId": "t4-driven-osc-1-container",
    "successMessage": "Der nicht verschwindende äußere Quellterm macht die DGL inhomogen. Der geschwindigkeitsproportionale Reibungsterm beschreibt die Dämpfung.",
    "incompleteMessage": "Vergleichen Sie rechte und linke Seite der DGL und ordnen Sie Antrieb und Reibung ihren Termen zu.",
    "incorrectMessage": "Vergleichen Sie rechte und linke Seite der DGL und ordnen Sie Antrieb und Reibung ihren Termen zu.",
    "answerFeedback": {
        "answer2": {
            "conceptId": "source",
            "order": 1,
            "message": "Prüfen Sie, ob die rechte Seite der Differentialgleichung identisch verschwindet.",
            "paragraphId": "drive"
        },
        "answer1": {
            "conceptId": "state-independent-drive",
            "order": 2,
            "message": "Unterscheiden Sie die vorgegebene Zeitabhängigkeit des Antriebs von den Zustandsgrößen $x$ und $\\dot{x}$.",
            "paragraphId": "drive"
        },
        "answer3": {
            "conceptId": "friction",
            "order": 3,
            "message": "Ordnen Sie einem zur Geschwindigkeit proportionalen Term die Reibungswirkung zu.",
            "paragraphId": "friction"
        },
        "answer4": {
            "conceptId": "drive-vs-resonance",
            "order": 4,
            "message": "Trennen Sie das Vorhandensein eines äußeren Antriebs vom Sonderfall der Resonanz.",
            "paragraphId": "resonance"
        }
    }
};

export const question2: MultipleChoiceQuestion = {
    questionId: 't4-driven-osc-2-pohl-term',
    question: 'Was beschreibt der Term $2\\beta\\dot{\\varphi}$ in der DGL des Pohlschen Rads?',
    options: [
        { value: 'answer1', label: 'Den dämpfenden Anteil, proportional zur Winkelgeschwindigkeit' },
        { value: 'answer2', label: 'Die äußere Anregung des Systems' },
        { value: 'answer3', label: 'Die Rückstellkraft' },
        { value: 'answer4', label: 'Das Trägheitsmoment des Systems' },
    ],
    correctAnswers: ['answer1'],
    containerId: 't4-driven-osc-2-container',
    successMessage: '✓ Richtig. Der Term ist proportional zur Winkelgeschwindigkeit $\\dot{\\varphi}$ und geht auf das bremsende Moment $-\\rho\\dot{\\varphi}$ zurück. Er beschreibt daher die Dämpfung.',
    incompleteMessage: '✗ Noch nicht vollständig. Vergleichen Sie den Term auf dieser Seite mit seiner Abhängigkeit von der Winkelgeschwindigkeit $\\dot{\\varphi}$.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Ordnen Sie Antrieb, Rückstellung und Dämpfung anhand ihrer jeweiligen Abhängigkeiten zu.',
    answerFeedback: {
        answer1: 'Vergleichen Sie $2\\beta\\dot{\\varphi}$ mit dem bremsenden Moment $-\\rho\\dot{\\varphi}$.',
        answer2: 'Suchen Sie den äußeren Antrieb auf der rechten Seite der DGL.',
        answer3: 'Die Rückstellung erkennen Sie an ihrer Proportionalität zur Auslenkung $\\varphi$.',
        answer4: 'Unterscheiden Sie den Koeffizienten des Beschleunigungsterms vom geschwindigkeitsabhängigen Term.'
    }
};

export const question3: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-3-gesamtloesung",
    "question": "Eine spezielle Lösung der inhomogenen DGL ist bekannt. Welche Aussagen erklären, wie daraus die allgemeine Lösung mit beliebigen Anfangsbedingungen entsteht?",
    "options": [
        {
            "value": "answer1",
            "label": "$\\varphi_h(t)$ enthält alle äußeren wirkenden Drehmomente."
        },
        {
            "value": "answer2",
            "label": "Der homogene Anteil $\\varphi_h(t)$ entspricht der Lösung ohne äußere Anregung."
        },
        {
            "value": "answer3",
            "label": "Zur speziellen Lösung darf eine beliebige homogene Lösung addiert werden, ohne den Quellterm zu verändern."
        },
        {
            "value": "answer4",
            "label": "$\\varphi_p(t)$ beschreibt die Stärke der Dämpfung."
        },
        {
            "value": "answer5",
            "label": "Die freien Konstanten der homogenen Lösung passen die Gesamtlösung an die Anfangsbedingungen an."
        }
    ],
    "correctAnswers": [
        "answer2",
        "answer3",
        "answer5"
    ],
    "containerId": "t4-driven-osc-3-container",
    "successMessage": "Die Addition einer homogenen Lösung verändert den Quellterm nicht. Ihre freien Konstanten erlauben, die Gesamtlösung an die Anfangsbedingungen anzupassen.",
    "incompleteMessage": "Setzen Sie eine Summe aus spezieller und homogener Lösung in den linearen Differentialoperator ein.",
    "incorrectMessage": "Setzen Sie eine Summe aus spezieller und homogener Lösung in den linearen Differentialoperator ein.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "homogeneous-equation",
            "order": 1,
            "message": "Für den homogenen Anteil wird der äußere Anregungsterm auf null gesetzt; Rückstellung und Dämpfung bleiben erhalten. Vergleichen Sie diese Gleichung mit der Gleichung des frei gedämpften Rads und prüfen Sie, welche äußere Anregung der homogene Anteil enthalten kann."
        },
        "answer2": {
            "conceptId": "homogeneous-equation",
            "order": 1,
            "message": "Für den homogenen Anteil wird der äußere Anregungsterm auf null gesetzt; Rückstellung und Dämpfung bleiben erhalten. Vergleichen Sie diese Gleichung mit der Gleichung des frei gedämpften Rads und prüfen Sie, welche äußere Anregung der homogene Anteil enthalten kann."
        },
        "answer3": {
            "conceptId": "superposition-and-constants",
            "order": 2,
            "message": "Setzen Sie die Summe aus spezieller und homogener Lösung in die linke Seite der DGL ein. Prüfen Sie, welchen Beitrag der homogene Anteil zum Quellterm liefert und wie seine freien Konstanten die beiden Anfangsbedingungen einstellen können."
        },
        "answer5": {
            "conceptId": "superposition-and-constants",
            "order": 2,
            "message": "Setzen Sie die Summe aus spezieller und homogener Lösung in die linke Seite der DGL ein. Prüfen Sie, welchen Beitrag der homogene Anteil zum Quellterm liefert und wie seine freien Konstanten die beiden Anfangsbedingungen einstellen können."
        },
        "answer4": {
            "conceptId": "solution-vs-parameter",
            "order": 3,
            "message": "Unterscheiden Sie eine Lösungsfunktion von einem Systemparameter wie $\\beta$."
        }
    }
};

export const question4: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-4-partikular-ansatz",
    "question": "Warum wird für die partikuläre Lösung der Ansatz $\\tilde{\\varphi}_p(t) = Ae^{i\\omega t}$ verwendet?",
    "options": [
        {
            "value": "answer1",
            "label": "Weil der Ansatz automatisch eine reelle Lösung ergibt."
        },
        {
            "value": "answer2",
            "label": "Der Ansatz wird gewählt, weil die homogene Lösung immer mit der Anregungsfrequenz $\\omega$ schwingt."
        },
        {
            "value": "answer3",
            "label": "Weil $\\cos(\\omega t)$ der Realteil von $e^{i\\omega t}$ ist und dessen Ableitungen ihre Form behalten."
        },
        {
            "value": "answer4",
            "label": "Weil die partikuläre Lösung unabhängig von der Anregungsfrequenz ist."
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t4-driven-osc-4-container",
    "successMessage": "Es gilt $\\cos(\\omega t)=\\operatorname{Re}(e^{i\\omega t})$. Der komplexe Ansatz vereinfacht die Ableitungen; sein Realteil liefert die physikalische Antwort.",
    "incompleteMessage": "Vergleichen Sie die komplexe Anregung mit dem Ansatz und beachten Sie die abschließende Realteilbildung.",
    "incorrectMessage": "Vergleichen Sie die komplexe Anregung mit dem Ansatz und beachten Sie die abschließende Realteilbildung.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "complex-driven-ansatz",
            "order": 1,
            "message": "Der Realteil von $e^{i\\omega t}$ ist $\\cos(\\omega t)$. Beim Ableiten bleibt die Exponentialfunktion erhalten und erhält nur die Faktoren $i\\omega$ beziehungsweise $-\\omega^2$. Prüfen Sie damit, weshalb dieser Ansatz zum sinusförmigen Antrieb passt und das Einsetzen in die Differentialgleichung vereinfacht."
        },
        "answer2": {
            "conceptId": "complex-driven-ansatz",
            "order": 1,
            "message": "Der Realteil von $e^{i\\omega t}$ ist $\\cos(\\omega t)$. Beim Ableiten bleibt die Exponentialfunktion erhalten und erhält nur die Faktoren $i\\omega$ beziehungsweise $-\\omega^2$. Prüfen Sie damit, weshalb dieser Ansatz zum sinusförmigen Antrieb passt und das Einsetzen in die Differentialgleichung vereinfacht."
        },
        "answer3": {
            "conceptId": "complex-driven-ansatz",
            "order": 1,
            "message": "Der Realteil von $e^{i\\omega t}$ ist $\\cos(\\omega t)$. Beim Ableiten bleibt die Exponentialfunktion erhalten und erhält nur die Faktoren $i\\omega$ beziehungsweise $-\\omega^2$. Prüfen Sie damit, weshalb dieser Ansatz zum sinusförmigen Antrieb passt und das Einsetzen in die Differentialgleichung vereinfacht."
        },
        "answer4": {
            "conceptId": "complex-driven-ansatz",
            "order": 1,
            "message": "Der Realteil von $e^{i\\omega t}$ ist $\\cos(\\omega t)$. Beim Ableiten bleibt die Exponentialfunktion erhalten und erhält nur die Faktoren $i\\omega$ beziehungsweise $-\\omega^2$. Prüfen Sie damit, weshalb dieser Ansatz zum sinusförmigen Antrieb passt und das Einsetzen in die Differentialgleichung vereinfacht."
        }
    }
};

export const question5: MultipleChoiceQuestion = {
    questionId: 't4-driven-osc-5-partikular-loesung',
    question: 'Die reelle partikuläre Lösung lautet $\\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi)$. Welche Aussagen folgen allein aus dieser Darstellung?',
    options: [
        { value: 'answer1', label: 'Der Wert von $\\varphi_p(t)$ bleibt konstant, wenn $\\omega$ sehr groß wird.' },
        { value: 'answer2', label: 'Die partikuläre Lösung schwingt mit der extern vorgegebenen Frequenz $\\omega$.' },
        { value: 'answer3', label: 'Der Ausdruck unter der Wurzel ist positiv.' },
        { value: 'answer4', label: 'Die Phase $\\Phi$ beschreibt eine Verschiebung zwischen äußerer Anregung und Antwort des Systems.' },
    ],
    correctAnswers: ['answer2', 'answer3', 'answer4'],
    containerId: 't4-driven-osc-5-container',
    successMessage: '✓ Richtig. Die partikuläre Lösung schwingt mit der vorgegebenen Frequenz $\\omega$; der Nenner bestimmt ihre Amplitude und $\\Phi$ die Phasenverschiebung zum Antrieb.',
    incompleteMessage: '✗ Noch nicht vollständig. Lesen Sie Frequenz, Amplitude und Phase direkt aus der auf dieser Seite hervorgehobenen Lösung ab.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Achten Sie besonders darauf, welche Frequenz im Cosinusterm steht und wie sich der Nenner mit $\\omega$ verändert.',
    answerFeedback: {
        answer1: 'Untersuchen Sie für großes $\\omega$ den führenden Term im Amplitudennenner.',
        answer2: 'Lesen Sie die zeitliche Frequenz unmittelbar aus $\\cos(\\omega t-\\Phi)$ ab.',
        answer3: 'Betrachten Sie die Summe der Quadrate unter der Wurzel im gedämpften Fall.',
        answer4: 'Vergleichen Sie das Argument $\\omega t-\\Phi$ mit der Phase des äußeren Antriebs.'
    }
};

export const question6: ImageChoiceQuestion = {
    questionId: 't4-driven-osc-6-einschwing',
    question: 'Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden? (Das graue Kreuz markiert den ersten, das rote Kreuz den letzten Messwert.)',
    options: [
        { value: 'answer1', imageSrc: 'assets/images/t4_driven_oscillations/17_phasenraumdiagramme_und_stationaere_schwingung_1.svg' },
        { value: 'answer2', imageSrc: 'assets/images/t4_driven_oscillations/18_phasenraumdiagramme_und_stationaere_schwingung_2.svg' },
        { value: 'answer4', imageSrc: 'assets/images/t4_driven_oscillations/20_phasenraumdiagramme_und_stationaere_schwingung_4.svg' },
    ],
    correctAnswers: ['answer4'],
    containerId: 't4-driven-osc-6-container',
    successMessage: '✓ Richtig. In Abbildung d) kehrt das System periodisch zu denselben Paaren aus Winkel und Winkelgeschwindigkeit zurück. Die geschlossene Trajektorie zeigt daher den stationären Zustand.',
    incompleteMessage: '✗ Noch nicht vollständig. Suchen Sie nach einer geschlossenen, stabilen Phasenraumkurve, auf der sich Anfangs- und Endpunkt nicht mehr auseinanderentwickeln.',
    incorrectMessage: '✗ Noch nicht ganz richtig. In der gewählten Abbildung verändert sich die Bahn noch; der abgeschlossene Einschwingvorgang ist an einer geschlossenen, wiederkehrenden Trajektorie zu erkennen.',
    answerFeedback: {
        answer1: 'Suchen Sie im Phasenraum nach einer geschlossenen, wiederkehrenden Bahn statt nach einer noch driftenden Trajektorie.',
        answer2: 'Suchen Sie im Phasenraum nach einer geschlossenen, wiederkehrenden Bahn statt nach einer noch driftenden Trajektorie.',
        answer4: 'Überlegen Sie, wie sich periodisch wiederkehrende Werte von Winkel und Winkelgeschwindigkeit darstellen.'
    }
};

export const question7: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-7-amplitude-params",
    "question": "Welche angebotenen Größen beeinflussen die stationäre Winkelamplitude bei festem Antriebsmoment $M$ und fester Antriebsfrequenz? $\\omega_0$ und $\\beta$ sind aus $D^*$, $\\Theta$ und $\\rho$ abgeleitet und keine zusätzlichen unabhängigen Parameter.",
    "options": [
        {
            "value": "answer1",
            "label": "Eigenfrequenz $\\omega_0$"
        },
        {
            "value": "answer2",
            "label": "Trägheitsmoment des Schwungkörpers $\\Theta$"
        },
        {
            "value": "answer3",
            "label": "Anfangsauslenkung $\\varphi(t=0)$"
        },
        {
            "value": "answer4",
            "label": "Anfangsgeschwindigkeit $\\dot{\\varphi}(t=0)$"
        },
        {
            "value": "answer5",
            "label": "Stärke der Dämpfung $\\beta$"
        },
        {
            "value": "answer6",
            "label": "Dämpfung (Wirbelstrombremse; Reibungsverluste) $\\rho$"
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer5",
        "answer6"
    ],
    "containerId": "t4-driven-osc-7-container",
    "successMessage": "Die stationäre Amplitude hängt von System und Antrieb ab, nicht vom Anfangszustand. Es gelten $N=M/\\Theta$, $\\omega_0^2=D^*/\\Theta$ und $2\\beta=\\rho/\\Theta$.",
    "incompleteMessage": "Verfolgen Sie jede Größe in der Amplitudenformel und den Definitionen der normierten Koeffizienten.",
    "incorrectMessage": "Verfolgen Sie jede Größe in der Amplitudenformel und den Definitionen der normierten Koeffizienten.",
    "answerFeedback": {
        "answer3": {
            "conceptId": "initial-conditions",
            "order": 1,
            "message": "Anfangsauslenkung und Anfangsgeschwindigkeit bestimmen den abklingenden homogenen Anteil. Nach dem Einschwingen beeinflussen sie die stationäre Amplitude nicht mehr."
        },
        "answer4": {
            "conceptId": "initial-conditions",
            "order": 1,
            "message": "Anfangsauslenkung und Anfangsgeschwindigkeit bestimmen den abklingenden homogenen Anteil. Nach dem Einschwingen beeinflussen sie die stationäre Amplitude nicht mehr."
        },
        "answer1": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=M/\\Theta$, $\\omega_0^2=D^*/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer2": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=M/\\Theta$, $\\omega_0^2=D^*/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer5": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=M/\\Theta$, $\\omega_0^2=D^*/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer6": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=M/\\Theta$, $\\omega_0^2=D^*/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        }
    }
};

export const question8: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-8-damping-amplitude",
    "question": "Bei festem Antriebsmoment und festem $\\omega_0$ gilt: Je stärker die Dämpfung, desto … (solange ein Resonanzmaximum bei $\\omega_r>0$ existiert).",
    "options": [
        {
            "value": "answer1",
            "label": "… größer die Resonanzfrequenz."
        },
        {
            "value": "answer2",
            "label": "… größer die Amplitude bei der Resonanzfrequenz."
        },
        {
            "value": "answer3",
            "label": "… größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz $\\omega_0$."
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t4-driven-osc-8-container",
    "successMessage": "Bei festem $\\omega_0$ sinkt $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ mit zunehmender Dämpfung. Das gilt für ein Maximum bei nicht verschwindender Frequenz.",
    "incompleteMessage": "Vergleichen Sie die Lage und die Höhe der Maxima in den Resonanzkurven.",
    "incorrectMessage": "Vergleichen Sie die Lage und die Höhe der Maxima in den Resonanzkurven.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "resonance-position",
            "order": 1,
            "message": "Verfolgen Sie, wie ein größeres $\\beta$ den Abstand zwischen $\\omega_r$ und $\\omega_0$ verändert."
        },
        "answer3": {
            "conceptId": "resonance-position",
            "order": 1,
            "message": "Verfolgen Sie, wie ein größeres $\\beta$ den Abstand zwischen $\\omega_r$ und $\\omega_0$ verändert."
        },
        "answer2": {
            "conceptId": "resonance-height",
            "order": 2,
            "message": "Vergleichen Sie die Höhen der Resonanzkurven bei unterschiedlicher Dämpfung."
        }
    }
};

export const question9: MultipleChoiceQuestion = {
    questionId: 't4-driven-osc-9-versuch',
    question: 'Überlegen Sie, welche Konsequenzen stärkere Dämpfung für die Versuchsdurchführung hat. Je stärker die Dämpfung, desto…',
    options: [
        { value: 'answer1', label: '… vorsichtiger muss man bei Messungen im Bereich der Resonanzfrequenz sein, damit der Aufbau nicht beschädigt wird.' },
        { value: 'answer2', label: '… gleichmäßiger können die Frequenzschritte bei der Messung gewählt werden.' },
        { value: 'answer3', label: '… kleinschrittiger sollte man die Frequenz im Bereich der Resonanzfrequenz variieren.' },
    ],
    correctAnswers: ['answer2'],
    containerId: 't4-driven-osc-9-container',
    successMessage: '✓ Richtig. Stärkere Dämpfung macht den Resonanzpeak flacher und breiter. Seine Form ändert sich dann über einen größeren Frequenzbereich, sodass gleichmäßige Schritte ausreichen.',
    incompleteMessage: '✗ Noch nicht vollständig. Vergleichen Sie auf dieser Seite die Breite der Resonanzkurven bei kleiner und großer Dämpfung.',
    incorrectMessage: '✗ Noch nicht ganz richtig. Ein schmaler Peak erfordert in seiner Umgebung feinere Frequenzschritte als ein breiter Peak.',
    answerFeedback: {
        answer1: 'Vergleichen Sie die maximale Amplitude der Resonanzkurven bei schwacher und starker Dämpfung.',
        answer2: 'Leiten Sie die Schrittweite aus der Breite des Resonanzpeaks ab.',
        answer3: 'Kleine Frequenzschritte sind besonders bei einem schmalen Peak erforderlich.'
    }
};

export const question10: MultipleChoiceQuestion = {
    "questionId": "t4-driven-osc-10-resonanz-phase",
    "question": "Für $0<\\beta<\\omega_0/\\sqrt{2}$ entspricht die Anregungsfrequenz der Resonanzfrequenz $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$. Dann …",
    "options": [
        {
            "value": "answer1",
            "label": "ist die Phasenverschiebung genau $\\frac{\\pi}{2}$."
        },
        {
            "value": "answer2",
            "label": "ist die Phasenverschiebung größer als $\\frac{\\pi}{2}$."
        },
        {
            "value": "answer3",
            "label": "ist die Phasenverschiebung kleiner als $\\frac{\\pi}{2}$."
        },
        {
            "value": "answer4",
            "label": "kann man keine Aussage über die Phasenverschiebung treffen."
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t4-driven-osc-10-container",
    "successMessage": "Bei positiver Dämpfung und vorhandenem Resonanzmaximum liegt $\\omega_r$ unter $\\omega_0$. Die Phase am Amplitudenmaximum ist deshalb kleiner als $\\pi/2$.",
    "incompleteMessage": "Ordnen Sie $\\omega_r$ relativ zu $\\omega_0$ ein und nutzen Sie die Phasenkurve oberhalb der Frage.",
    "incorrectMessage": "Ordnen Sie $\\omega_r$ relativ zu $\\omega_0$ ein und nutzen Sie die Phasenkurve oberhalb der Frage.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "phase-curve",
            "order": 2,
            "message": "Die Phase wächst mit der Frequenz und beträgt bei $\\omega_0$ genau $\\pi/2$. Übertragen Sie die zuvor bestimmte Lage von $\\omega_r$ auf die Phasenkurve und ordnen Sie den Phasenwert am Resonanzmaximum ein."
        },
        "answer2": {
            "conceptId": "phase-curve",
            "order": 2,
            "message": "Die Phase wächst mit der Frequenz und beträgt bei $\\omega_0$ genau $\\pi/2$. Übertragen Sie die zuvor bestimmte Lage von $\\omega_r$ auf die Phasenkurve und ordnen Sie den Phasenwert am Resonanzmaximum ein."
        },
        "answer3": {
            "conceptId": "frequency-comparison",
            "order": 1,
            "message": "Vergleichen Sie zuerst $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ bei positiver Dämpfung mit $\\omega_0$. Bestimmen Sie damit, ob $\\omega_r$ links oder rechts von $\\omega_0$ liegt."
        },
        "answer4": [
            {
                "conceptId": "frequency-comparison",
                "order": 1,
                "message": "Vergleichen Sie zuerst $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ bei positiver Dämpfung mit $\\omega_0$. Bestimmen Sie damit, ob $\\omega_r$ links oder rechts von $\\omega_0$ liegt."
            },
            {
                "conceptId": "phase-curve",
                "order": 2,
                "message": "Die Phase wächst mit der Frequenz und beträgt bei $\\omega_0$ genau $\\pi/2$. Übertragen Sie die zuvor bestimmte Lage von $\\omega_r$ auf die Phasenkurve und ordnen Sie den Phasenwert am Resonanzmaximum ein."
            }
        ]
    }
};

export const question11: MultipleChoiceQuestion = {
    questionId: 't4-driven-osc-11-messung',
    question: 'Sie vermessen ein gedämpftes Schwungrad bei zwei Frequenzen: $\\omega_1 = 200\\,\\text{mHz}$ und $\\omega_2 = 400\\,\\text{mHz}$. Bei $\\omega_1$ beträgt der zeitliche Abstand zwischen den Nulldurchgängen von Antrieb und Rad $\\Delta t_1 = 0{,}25\\,\\text{s}$, bei $\\omega_2$ ist er $\\Delta t_2 = 1{,}4\\,\\text{s}$. Was können Sie über die Resonanzfrequenz des Systems aussagen?',
    options: [
        { value: 'answer1', label: 'Die Resonanzfrequenz ist größer als $\\omega_2 = 400\\,\\text{mHz}$.' },
        { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
        { value: 'answer3', label: 'Aus den vorliegenden Angaben ist keine eindeutige Einordnung der Resonanzfrequenz in die drei genannten Bereiche möglich.' },
        { value: 'answer4', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1 = 200\\,\\text{mHz}$.' },
    ],
    correctAnswers: ['answer3'],
    containerId: 't4-driven-osc-11-container',
    successMessage: 'Richtig. Die Zeitabstände liefern zunächst Informationen über die Phasenlage und damit über die Eigenfrequenz $\\omega_0$. Für die Resonanzfrequenz gilt zusätzlich $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$. Ohne Kenntnis der Dämpfung $\\beta$ ist daher keine eindeutige Einordnung möglich.',
    incompleteMessage: 'Bestimmen Sie zunächst, welche Größe sich mithilfe der Phasenlage untersuchen lässt. Prüfen Sie anschließend in der Formel für $\\omega_r$, welche zusätzliche Größe noch benötigt wird.',
    incorrectMessage: 'Bestimmen Sie zunächst, welche Größe sich mithilfe der Phasenlage untersuchen lässt. Prüfen Sie anschließend in der Formel für $\\omega_r$, welche zusätzliche Größe noch benötigt wird.',
    answerFeedback: {
        answer1: 'Bestimmen Sie aus den Phasenlagen nur die Lage von $\\omega_0$ und beachten Sie die unbekannte Dämpfung in $\\omega_r$.',
        answer2: 'Bestimmen Sie aus den Phasenlagen nur die Lage von $\\omega_0$ und beachten Sie die unbekannte Dämpfung in $\\omega_r$.',
        answer3: 'Prüfen Sie, ob $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ ohne einen Wert für $\\beta$ eindeutig eingeordnet werden kann.',
        answer4: 'Bestimmen Sie aus den Phasenlagen nur die Lage von $\\omega_0$ und beachten Sie die unbekannte Dämpfung in $\\omega_r$.'
    }
};
