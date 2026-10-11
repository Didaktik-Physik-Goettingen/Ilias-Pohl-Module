import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    "questionId": "e2-damped-osc-1-schwungrad",
    "question": "Welche der folgenden Aussagen trifft auf das schwingende Rad zu?",
    "options": [
        {
            "value": "answer1",
            "label": "Auf das Rad wirkt ausschließlich das rücktreibende Drehmoment der Feder."
        },
        {
            "value": "answer2",
            "label": "Das Drehmoment der Wirbelstrombremse ist proportional zur Auslenkung $\\varphi$."
        },
        {
            "value": "answer3",
            "label": "Das Drehmoment der Feder ist proportional zur Winkelgeschwindigkeit $\\dot{\\varphi}$."
        },
        {
            "value": "answer4",
            "label": "Die Feder liefert ein auslenkungsabhängiges und die Wirbelstrombremse ein geschwindigkeitsabhängiges Drehmoment."
        }
    ],
    "correctAnswers": [
        "answer4"
    ],
    "containerId": "question1-container",
    "successMessage": "Die Feder wirkt über die Auslenkung, die Wirbelstrombremse über die Winkelgeschwindigkeit; beide tragen zur Drehmomentbilanz bei.",
    "incompleteMessage": "Ordnen Sie anhand der beiden Drehmomentgleichungen auf der vorangegangenen Seite Auslenkung und Winkelgeschwindigkeit den Bauteilen zu.",
    "incorrectMessage": "Ordnen Sie anhand der beiden Drehmomentgleichungen auf der vorangegangenen Seite Auslenkung und Winkelgeschwindigkeit den Bauteilen zu.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "torque-balance",
            "order": 1,
            "message": "Beziehen Sie neben der Feder auch das Bremsmoment in die Drehmomentbilanz ein."
        },
        "answer2": {
            "conceptId": "displacement-vs-velocity",
            "order": 2,
            "message": "In den Gleichungen der vorangegangenen Seite steht $\\varphi$ für die Auslenkung und $\\dot{\\varphi}$ für die Winkelgeschwindigkeit. Ordnen Sie jeder Drehmomentgleichung die darin vorkommende Größe zu. Prüfen Sie anschließend, ob Ihre Auswahl Feder und Wirbelstrombremse vertauscht."
        },
        "answer3": {
            "conceptId": "displacement-vs-velocity",
            "order": 2,
            "message": "In den Gleichungen der vorangegangenen Seite steht $\\varphi$ für die Auslenkung und $\\dot{\\varphi}$ für die Winkelgeschwindigkeit. Ordnen Sie jeder Drehmomentgleichung die darin vorkommende Größe zu. Prüfen Sie anschließend, ob Ihre Auswahl Feder und Wirbelstrombremse vertauscht."
        },
        "answer4": {
            "conceptId": "displacement-vs-velocity",
            "order": 2,
            "message": "In den Gleichungen der vorangegangenen Seite steht $\\varphi$ für die Auslenkung und $\\dot{\\varphi}$ für die Winkelgeschwindigkeit. Ordnen Sie jeder Drehmomentgleichung die darin vorkommende Größe zu. Prüfen Sie anschließend, ob Ihre Auswahl Feder und Wirbelstrombremse vertauscht."
        }
    }
};
