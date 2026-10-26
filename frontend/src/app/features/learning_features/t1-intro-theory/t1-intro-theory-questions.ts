import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    "questionId": "t1-intro-theory-1-dgl-solutions",
    "question": "Welche Funktionsfamilien stellen die allgemeine reelle Lösung von $\\ddot{x}+\\omega_0^2x=0$ mit $\\omega_0>0$ dar? Alle Parameter und Koeffizienten außer der Zeitvariablen $t$ sind konstant; $A,\\phi$ sind reell. Für die komplexe Darstellung gilt $c_2=c_1^*$; bei nur einem Koeffizienten ist $c_1$ reell. Eine Familie muss beliebige Anfangsauslenkung und Anfangsgeschwindigkeit erfassen können.",
    "options": [
        {
            "value": "answer1",
            "label": "\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)"
        },
        {
            "value": "answer2",
            "label": "\\( x(t) = c_1\\left(e^{i\\omega_0t} + e^{-i\\omega_0t}\\right) \\)"
        },
        {
            "value": "answer3",
            "label": "\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)"
        },
        {
            "value": "answer4",
            "label": "\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)"
        }
    ],
    "correctAnswers": [
        "answer3",
        "answer4"
    ],
    "containerId": "t1-intro-theory-1-container",
    "successMessage": "Beide allgemeinen Darstellungen enthalten zwei reelle Freiheitsgrade für die Anfangsbedingungen. In der komplexen Form müssen die Koeffizienten konjugiert sein.",
    "incompleteMessage": "Prüfen Sie durch Einsetzen, ob die DGL erfüllt ist und ob sich zwei unabhängige Anfangsbedingungen darstellen lassen.",
    "incorrectMessage": "Prüfen Sie durch Einsetzen, ob die DGL erfüllt ist und ob sich zwei unabhängige Anfangsbedingungen darstellen lassen.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "satisfy-equation",
            "order": 1,
            "message": "Setzen Sie den Ausdruck gedanklich in $\\ddot{x}+\\omega_0^2x=0$ ein und beachten Sie den konstanten Zusatz."
        },
        "answer2": {
            "conceptId": "real-general-solution",
            "order": 2,
            "message": "Eine allgemeine Lösung einer Differentialgleichung zweiter Ordnung muss zwei unabhängige Anfangsbedingungen abbilden können. Prüfen Sie deshalb, welche Funktionsfamilien zwei freie reelle Konstanten enthalten und zugleich eine reelle Auslenkung ergeben."
        },
        "answer3": {
            "conceptId": "real-general-solution",
            "order": 2,
            "message": "Eine allgemeine Lösung einer Differentialgleichung zweiter Ordnung muss zwei unabhängige Anfangsbedingungen abbilden können. Prüfen Sie deshalb, welche Funktionsfamilien zwei freie reelle Konstanten enthalten und zugleich eine reelle Auslenkung ergeben."
        },
        "answer4": {
            "conceptId": "real-general-solution",
            "order": 2,
            "message": "Eine allgemeine Lösung einer Differentialgleichung zweiter Ordnung muss zwei unabhängige Anfangsbedingungen abbilden können. Prüfen Sie deshalb, welche Funktionsfamilien zwei freie reelle Konstanten enthalten und zugleich eine reelle Auslenkung ergeben."
        }
    }
};
