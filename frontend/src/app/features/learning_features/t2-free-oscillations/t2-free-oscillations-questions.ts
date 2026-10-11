import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    "questionId": "t2-free-osc-1-oscillator",
    "question": "Welche der folgenden Aussagen zum ungedämpften harmonischen Oszillator sind korrekt?",
    "options": [
        {
            "value": "answer1",
            "label": "Die komplexe Darstellung $x(t)=c_1e^{i\\omega_0t}+c_2e^{-i\\omega_0t}$ ist für $c_2=c_1^*$ physikalisch reell."
        },
        {
            "value": "answer2",
            "label": "Bei fester Federkonstante hängt die Eigenkreisfrequenz von der Masse ab."
        },
        {
            "value": "answer3",
            "label": "Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen."
        },
        {
            "value": "answer4",
            "label": "Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt."
        },
        {
            "value": "answer5",
            "label": "Die allgemeine Lösung lässt sich stets als Linearkombination von $e^{\\lambda t}$-Termen ausdrücken."
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer5"
    ],
    "containerId": "t2-free-osc-1-container",
    "successMessage": "Die Exponentialdarstellung ist bei konjugierten Koeffizienten reell. Die Eigenkreisfrequenz folgt aus $\\omega_0^2=D/m$.",
    "incompleteMessage": "Vergleichen Sie die Bestimmungsgleichung und die Reellheitsbedingung mit den angebotenen Aussagen.",
    "incorrectMessage": "Vergleichen Sie die Bestimmungsgleichung und die Reellheitsbedingung mit den angebotenen Aussagen.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "reality",
            "order": 1,
            "message": "Prüfen Sie die Beziehung zwischen den beiden Koeffizienten anhand der konjugierten Funktion.",
            "paragraphId": "complex-solution"
        },
        "answer3": {
            "conceptId": "roots",
            "order": 2,
            "message": "Lösen Sie $\\lambda^2+\\omega_0^2=0$ und beachten Sie das Vorzeichen unter der Wurzel.",
            "paragraphId": "complex-solution"
        },
        "answer5": {
            "conceptId": "exponential-solution",
            "order": 3,
            "message": "Gehen Sie vom Exponentialansatz und den beiden Nullstellen des charakteristischen Polynoms aus.",
            "paragraphId": "complex-solution"
        },
        "answer4": {
            "conceptId": "source",
            "order": 4,
            "message": "Fragen Sie, was eine verschwindende rechte Seite über eine äußere Anregung aussagt.",
            "paragraphId": "source"
        },
        "answer2": {
            "conceptId": "mass-frequency",
            "order": 5,
            "message": "Nutzen Sie $\\omega_0^2=D/m$ und verändern Sie gedanklich $m$.",
            "paragraphId": "frequency"
        }
    }
};

export const question2: MultipleChoiceQuestion = {
    "questionId": "t2-free-osc-2-reality",
    "question": "Welche der folgenden Aussagen zur Reellheitsbedingung sind korrekt?",
    "options": [
        {
            "value": "answer1",
            "label": "Für eine reelle Lösung muss gelten: $c_2 = c_1^*$."
        },
        {
            "value": "answer2",
            "label": "Die Reellheitsbedingung folgt daraus, dass $x(t) = x^*(t)$ gelten muss."
        },
        {
            "value": "answer3",
            "label": "Wenn $c_1$ rein reell ist, ist die gesamte Lösung automatisch reell."
        },
        {
            "value": "answer4",
            "label": "Die Bedingung $c_1 - c_2^* = 0$ folgt aus dem Vergleich der Koeffizienten der Exponentialterme."
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer4"
    ],
    "containerId": "t2-free-osc-2-container",
    "successMessage": "Weil eine physikalische Auslenkung reell ist, muss $x(t)=x^*(t)$ gelten. Der Koeffizientenvergleich zeigt deshalb, dass $c_1$ und $c_2$ komplex konjugiert zueinander sind.",
    "incompleteMessage": "Bilden Sie zur komplexen Lösung die konjugierte Funktion und vergleichen Sie die Koeffizienten der beiden Exponentialterme.",
    "incorrectMessage": "Bilden Sie zur komplexen Lösung die konjugierte Funktion und vergleichen Sie die Koeffizienten der beiden Exponentialterme.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "reality",
            "order": 1,
            "message": "Beginnen Sie mit $x(t)=x^*(t)$: Eine reelle Auslenkung stimmt mit ihrer komplex konjugierten Funktion überein. Vergleichen Sie anschließend in beiden Funktionen die Koeffizienten vor $e^{i\\omega_0t}$ und $e^{-i\\omega_0t}$. Leiten Sie daraus ab, welche Beziehung zwischen $c_1$ und $c_2$ gelten muss."
        },
        "answer2": {
            "conceptId": "reality",
            "order": 1,
            "message": "Beginnen Sie mit $x(t)=x^*(t)$: Eine reelle Auslenkung stimmt mit ihrer komplex konjugierten Funktion überein. Vergleichen Sie anschließend in beiden Funktionen die Koeffizienten vor $e^{i\\omega_0t}$ und $e^{-i\\omega_0t}$. Leiten Sie daraus ab, welche Beziehung zwischen $c_1$ und $c_2$ gelten muss."
        },
        "answer3": {
            "conceptId": "reality",
            "order": 1,
            "message": "Beginnen Sie mit $x(t)=x^*(t)$: Eine reelle Auslenkung stimmt mit ihrer komplex konjugierten Funktion überein. Vergleichen Sie anschließend in beiden Funktionen die Koeffizienten vor $e^{i\\omega_0t}$ und $e^{-i\\omega_0t}$. Leiten Sie daraus ab, welche Beziehung zwischen $c_1$ und $c_2$ gelten muss."
        },
        "answer4": {
            "conceptId": "reality",
            "order": 1,
            "message": "Beginnen Sie mit $x(t)=x^*(t)$: Eine reelle Auslenkung stimmt mit ihrer komplex konjugierten Funktion überein. Vergleichen Sie anschließend in beiden Funktionen die Koeffizienten vor $e^{i\\omega_0t}$ und $e^{-i\\omega_0t}$. Leiten Sie daraus ab, welche Beziehung zwischen $c_1$ und $c_2$ gelten muss."
        }
    }
};

export const question3: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-3-dgl-matching',
    question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen sind korrekt?',
    options: [
        { value: 'answer1', label: 'Ungedämpfter Fall → $\\alpha = 0$' },
        { value: 'answer2', label: 'Komplex konjugiertes Paar → $\\lambda = \\alpha \\pm i\\beta$' },
        { value: 'answer3', label: 'Gedämpfte harmonische Schwingung → $e^{\\alpha t}\\cos(\\beta t)$ und $e^{\\alpha t}\\sin(\\beta t)$' },
        { value: 'answer4', label: 'Lösung des ungedämpften Falls → Reine Sinus- und Kosinuslösung' },
        { value: 'answer5', label: 'Ungedämpfter Fall → exponentiell abklingende Amplitude' },
        { value: 'answer6', label: 'Gedämpfte harmonische Schwingung → $\\alpha = 0$' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
    containerId: 't2-free-osc-3-container',
    successMessage: '✓ Richtig. Im ungedämpften Fall verschwindet der Realteil $\\alpha$; ein von null verschiedener Realteil bleibt dagegen als Faktor $e^{\\alpha t}$ erhalten.',
    incompleteMessage: '✗ Mindestens eine richtige Zuordnung fehlt. Gehen Sie auf dieser Seite von $\\lambda=\\alpha\\pm i\\beta$ aus und prüfen Sie, was für $\\alpha=0$ übrig bleibt.',
    incorrectMessage: '✗ Mindestens eine zusätzliche Zuordnung vertauscht den gedämpften und ungedämpften Fall. Achten Sie darauf, wann der Faktor $e^{\\alpha t}$ erhalten bleibt.',
    answerFeedback: {
        answer1: 'Setzen Sie im ungedämpften Fall den Realteil von $\\lambda$ gleich null.',
        answer2: 'Zerlegen Sie $\\lambda$ in Real- und Imaginärteil.',
        answer3: 'Leiten Sie aus $\\lambda=\\alpha\\pm i\\beta$ die reelle Lösungsform ab.',
        answer4: 'Betrachten Sie die Lösungsform für $\\alpha=0$.',
        answer5: 'Prüfen Sie, ob ohne Dämpfung ein abklingender Exponentialfaktor entstehen kann.',
        answer6: 'Überlegen Sie, welches Vorzeichen der Realteil bei einer abklingenden Schwingung haben muss.'
    }
};

export const question4: MultipleChoiceQuestion = {
    "questionId": "t2-free-osc-4-phase",
    "question": "Welche Aussagen zum Phasenraum des ungedämpften harmonischen Oszillators sind korrekt? Die Kreisform bezieht sich auf die skalierten Koordinaten $(x,\\dot{x}/\\omega_0)$.",
    "options": [
        {
            "value": "answer1",
            "label": "Die Phasenraumtrajektorie ergibt sich unter der Voraussetzung, dass Energie und Amplitude zeitabhängig sind."
        },
        {
            "value": "answer2",
            "label": "Die im Phasenraum dargestellten Zustände bestehen aus Ort und Geschwindigkeit."
        },
        {
            "value": "answer3",
            "label": "Die Gleichung $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$ ergibt sich aus der Erhaltung der Gesamtenergie."
        },
        {
            "value": "answer4",
            "label": "Eine Kreisbahn in $(x,\\dot{x}/\\omega_0)$ bedeutet, dass $\\dot{x}$ zeitlich konstant bleibt."
        }
    ],
    "correctAnswers": [
        "answer2",
        "answer3"
    ],
    "containerId": "t2-free-osc-4-container",
    "successMessage": "Die Energieerhaltung liefert einen Kreis in den skalierten Koordinaten $(x,\\dot{x}/\\omega_0)$. In den gewöhnlichen Koordinaten $(x,\\dot{x})$ ist die Bahn eine Ellipse.",
    "incompleteMessage": "Nutzen Sie die Energiegleichung oberhalb der Frage und beachten Sie die Skalierung der Geschwindigkeitskoordinate.",
    "incorrectMessage": "Nutzen Sie die Energiegleichung oberhalb der Frage und beachten Sie die Skalierung der Geschwindigkeitskoordinate.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "energy-conservation",
            "order": 1,
            "message": "Nutzen Sie die Energieerhaltung: Welche Größen bleiben beim ungedämpften Oszillator konstant? Formen Sie die Energiegleichung nach $x^2+(\\dot{x}/\\omega_0)^2$ um."
        },
        "answer3": {
            "conceptId": "energy-conservation",
            "order": 1,
            "message": "Nutzen Sie die Energieerhaltung: Welche Größen bleiben beim ungedämpften Oszillator konstant? Formen Sie die Energiegleichung nach $x^2+(\\dot{x}/\\omega_0)^2$ um."
        },
        "answer2": {
            "conceptId": "state-coordinates",
            "order": 2,
            "message": "Benennen Sie die beiden Koordinaten eines Zustands im dargestellten Phasenraum."
        },
        "answer4": {
            "conceptId": "velocity-along-orbit",
            "order": 3,
            "message": "Die senkrechte Koordinate ist $\\dot{x}/\\omega_0$. Verfolgen Sie einen vollständigen Umlauf und vergleichen Sie ihre Werte oben, an den Schnittpunkten mit der waagerechten Achse und unten. Prüfen Sie daraus, ob die Geschwindigkeit während des Umlaufs konstant sein kann."
        }
    }
};

export const question5: MultipleChoiceQuestion = {
    questionId: 't2-free-osc-5-phase-matching',
    question: 'Welche der folgenden Zuordnungen zwischen Begriff und Beschreibung sind korrekt?',
    options: [
        { value: 'answer1', label: 'Phasenraumzustand → Ein einzelnes Wertepaar aus Ort und Geschwindigkeit zu einem bestimmten Zeitpunkt' },
        { value: 'answer2', label: 'Energiegleichung des freien Oszillators → $m\\dot{x}^2/2 + Dx^2/2 = E$' },
        { value: 'answer3', label: 'Phasenraumtrajektorie → Eine geometrische Kurve aus den im Zeitverlauf durchlaufenen Kombinationen von Ort und Geschwindigkeit' },
        { value: 'answer4', label: 'Kreisgleichung der Phasenraumtrajektorie → $x^2 + (\\dot{x}/\\omega_0)^2 = 2E/D$' },
        { value: 'answer5', label: 'Phasenraumzustand → Eine geometrische Kurve aus allen Kombinationen von Ort und Geschwindigkeit' },
        { value: 'answer6', label: 'Phasenraumtrajektorie → Ein einzelnes Wertepaar aus Ort und Geschwindigkeit zu einem bestimmten Zeitpunkt' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
    containerId: 't2-free-osc-5-container',
    successMessage: 'Richtig. Ein Phasenraumzustand ist ein einzelnes Wertepaar zu einem bestimmten Zeitpunkt. Die Phasenraumtrajektorie ist die gesamte im Zeitverlauf durchlaufene Kurve. Aus der Energiegleichung folgt durch Umformen die Kreisgleichung.',
    incompleteMessage: 'Mindestens eine Zuordnung fehlt. Unterscheiden Sie einen einzelnen Zustand von der gesamten Trajektorie und vergleichen Sie Energiegleichung und Kreisgleichung.',
    incorrectMessage: 'Mindestens eine Zuordnung vertauscht einen Einzelzustand mit der gesamten zeitlichen Entwicklung. Prüfen Sie, ob die Beschreibung einen Zeitpunkt oder eine vollständige Kurve meint.',
    answerFeedback: {
        answer1: 'Unterscheiden Sie einen einzelnen Zustand zu einem Zeitpunkt von der gesamten Bahn.',
        answer2: 'Ordnen Sie kinetische und potenzielle Energie der Summe $E$ zu.',
        answer3: 'Verfolgen Sie die im Zeitverlauf durchlaufenen Paare aus Ort und Geschwindigkeit.',
        answer4: 'Formen Sie die Energiegleichung mit $\\omega_0^2=D/m$ um.',
        answer5: 'Unterscheiden Sie einen einzelnen Zustand zu einem Zeitpunkt von der gesamten Bahn.',
        answer6: 'Unterscheiden Sie die ursprüngliche Energiegleichung von ihrer umgeformten Kreisgleichung.'
    }
};

export const question6: MultipleChoiceQuestion = {
    "questionId": "t2-free-osc-6-pohl",
    "question": "Warum ist der Phasenraum des Pohlschen Rads zweidimensional?",
    "options": [
        {
            "value": "answer1",
            "label": "Weil die Energie des Systems konstant ist."
        },
        {
            "value": "answer2",
            "label": "Weil ein unabhängiger Drehwinkel und ein zugehöriger Drehimpuls den Zustand beschreiben."
        },
        {
            "value": "answer3",
            "label": "Weil das Rad ungedämpft ist."
        }
    ],
    "correctAnswers": [
        "answer2"
    ],
    "containerId": "t2-free-osc-6-container",
    "successMessage": "Ein Drehwinkel und der zugehörige Drehimpuls beschreiben den Zustand des Pohlschen Rads. Ein mechanischer Freiheitsgrad ergibt daher einen zweidimensionalen Phasenraum.",
    "incompleteMessage": "Zählen Sie im Exkurs die unabhängigen Lagekoordinaten und die zugehörigen Impulskoordinaten.",
    "incorrectMessage": "Zählen Sie im Exkurs die unabhängigen Lagekoordinaten und die zugehörigen Impulskoordinaten.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "energy-vs-dimension",
            "order": 1,
            "message": "Beim hier betrachteten konservativen System mit einem Freiheitsgrad legt die Energie eine Bahn fest; erklärt das auch die Anzahl der Koordinaten?"
        },
        "answer2": {
            "conceptId": "coordinate-count",
            "order": 2,
            "message": "Zählen Sie eine Lagekoordinate und den zugehörigen Impuls."
        },
        "answer3": {
            "conceptId": "damping-vs-dimension",
            "order": 3,
            "message": "Die Dimension des Phasenraums hängt nicht davon ab, ob die Bewegung gedämpft ist."
        }
    }
};
