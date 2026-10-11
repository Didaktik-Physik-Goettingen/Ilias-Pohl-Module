import { MultipleChoiceImageQuestion, MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceImageQuestion = {
    "questionId": "e1-intro-exp-1-schwungrad",
    "imageSrc": "assets/images/e1_intro_experiment/schwungrad_2.png",
    "imageAlt": "Schwungrad",
    "question": "Welche der Aussagen in Bezug auf das Schwungrad sind richtig?",
    "options": [
        {
            "value": "answer1",
            "label": "Das Schwungrad setzt das System in Bewegung."
        },
        {
            "value": "answer2",
            "label": "Nur ein zylinderförmiger Schwungkörper ermöglicht eine harmonische Bewegung."
        },
        {
            "value": "answer3",
            "label": "Die Form beeinflusst das Trägheitsmoment, bestimmt aber nicht allein den harmonischen Charakter der Bewegung."
        },
        {
            "value": "answer4",
            "label": "Das Schwungrad dient als träger Körper, dessen Bewegung untersucht wird."
        }
    ],
    "correctAnswers": [
        "answer3",
        "answer4"
    ],
    "containerId": "question1-container",
    "successMessage": "Das Schwungrad liefert die Trägheit; der harmonische Charakter folgt aus der linearen Rückstellung.",
    "incompleteMessage": "Vergleichen Sie in der Aufbauzeichnung die Aufgaben von Schwungrad, Feder und Antrieb.",
    "incorrectMessage": "Vergleichen Sie in der Aufbauzeichnung die Aufgaben von Schwungrad, Feder und Antrieb.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "inertia",
            "order": 1,
            "message": "Trennen Sie die Trägheit des Rads von der Rückstellung: Die Körperform beeinflusst die Masseverteilung und damit das Trägheitsmoment. Prüfen Sie damit erneut, welche Aufgabe das Schwungrad erfüllt."
        },
        "answer4": {
            "conceptId": "inertia",
            "order": 1,
            "message": "Trennen Sie die Trägheit des Rads von der Rückstellung: Die Körperform beeinflusst die Masseverteilung und damit das Trägheitsmoment. Prüfen Sie damit erneut, welche Aufgabe das Schwungrad erfüllt."
        },
        "answer2": {
            "conceptId": "harmonic-restoration",
            "order": 2,
            "message": "Der harmonische Charakter entsteht durch ein zur Auslenkung proportionales Rückstellmoment. Prüfen Sie, welche Eigenschaft lediglich durch die Form des Schwungrads beeinflusst wird."
        },
        "answer3": {
            "conceptId": "harmonic-restoration",
            "order": 2,
            "message": "Der harmonische Charakter entsteht durch ein zur Auslenkung proportionales Rückstellmoment. Prüfen Sie, welche Eigenschaft lediglich durch die Form des Schwungrads beeinflusst wird."
        }
    }
};

export const question2: MultipleChoiceImageQuestion = {
    "questionId": "e1-intro-exp-2-feder",
    "imageSrc": "assets/images/e1_intro_experiment/feder_2.png",
    "imageAlt": "Feder",
    "question": "Welche Aussage über die Feder ist korrekt?",
    "options": [
        {
            "value": "answer1",
            "label": "Die Feder ist für den Versuch nur notwendig, wenn man auch den externen Antrieb verwendet."
        },
        {
            "value": "answer2",
            "label": "Die Feder sorgt für ein rücktreibendes Drehmoment."
        },
        {
            "value": "answer3",
            "label": "Die Feder führt zur kontinuierlichen Dämpfung des Schwungrads."
        }
    ],
    "correctAnswers": [
        "answer2"
    ],
    "containerId": "question2-container",
    "successMessage": "Die Feder erzeugt das Rückstellmoment $M=-D\\varphi$, das der Auslenkung entgegenwirkt.",
    "incompleteMessage": "Vergleichen Sie in der Aufbauzeichnung, welches Bauteil das ausgelenkte Rad zur Ruhelage zurückführt.",
    "incorrectMessage": "Vergleichen Sie in der Aufbauzeichnung, welches Bauteil das ausgelenkte Rad zur Ruhelage zurückführt.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "spring-restoration",
            "order": 1,
            "message": "Auch bei ausgeschaltetem Antrieb bleibt die Feder mit ihrem festen Ankerpunkt verbunden. Wird das Rad verdreht, wirkt sie der Auslenkung entgegen und führt es zur Ruhelage zurück. Prüfen Sie die Verbindung zum Ankerpunkt bei ausgeschaltetem Antrieb."
        },
        "answer2": {
            "conceptId": "spring-restoration",
            "order": 1,
            "message": "Auch bei ausgeschaltetem Antrieb bleibt die Feder mit ihrem festen Ankerpunkt verbunden. Wird das Rad verdreht, wirkt sie der Auslenkung entgegen und führt es zur Ruhelage zurück. Prüfen Sie die Verbindung zum Ankerpunkt bei ausgeschaltetem Antrieb."
        },
        "answer3": {
            "conceptId": "restoration-vs-damping",
            "order": 2,
            "message": "Eine Dämpfung wirkt dagegen der Bewegung entgegen. Prüfen Sie anhand dieses Unterschieds, welche Aufgabe die Feder erfüllt."
        }
    }
};

export const question3: MultipleChoiceImageQuestion = {
    "questionId": "e1-intro-exp-3-wirbelstrombremse",
    "imageSrc": "assets/images/e1_intro_experiment/wirbelstrombremse_2.png",
    "imageAlt": "Wirbelstrombremse",
    "question": "Zur Dämpfung wird in diesem Versuchsaufbau ein Magnet verwendet,\n\t\t\tder so verschoben werden kann, dass er das Rad (mit Abstand, also nicht wie eine Scheibenbremse) umschließt.\n\t\t\tWelche der Aussagen über die Wirbelstrombremse sind korrekt?",
    "options": [
        {
            "value": "answer1",
            "label": "Ohne die Wirbelstrombremse würde das Schwungrad unendlich lange weiterschwingen."
        },
        {
            "value": "answer2",
            "label": "Die Wirbelstrombremse benötigt ein elektrisch leitendes Schwungrad."
        },
        {
            "value": "answer3",
            "label": "Die Wirbelstrombremse ist direkt von der Auslenkung des Schwungrads abhängig."
        }
    ],
    "correctAnswers": [
        "answer2"
    ],
    "containerId": "question3-container",
    "successMessage": "Wirbelströme benötigen ein elektrisch leitendes Rad. Bei fester Magnetstellung modellieren wir das Bremsmoment im verwendeten Geschwindigkeitsbereich näherungsweise als $M=-\\rho\\dot{\\varphi}$.",
    "incompleteMessage": "Prüfen Sie die Materialvoraussetzung für Wirbelströme und unterscheiden Sie Auslenkung von Bewegung.",
    "incorrectMessage": "Prüfen Sie die Materialvoraussetzung für Wirbelströme und unterscheiden Sie Auslenkung von Bewegung.",
    "answerFeedback": {
        "answer2": {
            "conceptId": "conductivity",
            "order": 1,
            "message": "Die Wirbelstrombremse benötigt ein elektrisch leitendes Rad. Prüfen Sie, welche Materialeigenschaft das Entstehen der Ströme ermöglicht."
        },
        "answer3": {
            "conceptId": "motion",
            "order": 2,
            "message": "Die Wirbelstrombremse wirkt nur bei einer Bewegung durch das Magnetfeld. Bei einem ruhenden, ausgelenkten Rad entsteht deshalb kein entsprechendes Bremsmoment. Prüfen Sie damit die Abhängigkeit von Auslenkung und Bewegung."
        },
        "answer1": {
            "conceptId": "ordinary-friction",
            "order": 3,
            "message": "Berücksichtigen Sie zusätzlich, dass auch ohne Magnetbremse gewöhnliche Reibungsverluste vorhanden sind. Prüfen Sie damit das Verhalten ohne Wirbelstrombremse."
        }
    }
};

export const question4: MultipleChoiceQuestion = {
    "questionId": "e1-intro-exp-4-direktionsmoment",
    "question": "Welche Größen benötigen Sie zur statischen Bestimmung des Direktionsmoments $D$ in der gezeigten Geometrie? Die Erdbeschleunigung $g$ sei bekannt; betrachten Sie eine von null verschiedene Gleichgewichtsauslenkung.",
    "options": [
        {
            "value": "answer1",
            "label": "Kreisfrequenz der freien Schwingung $\\omega_e$."
        },
        {
            "value": "answer2",
            "label": "Außenradius des Schwungrads, unabhängig von der Position der Zusatzmasse."
        },
        {
            "value": "answer3",
            "label": "Masse des Schwungrads $m_\\mathrm{Rad}$."
        },
        {
            "value": "answer4",
            "label": "Auslenkwinkel $\\varphi$."
        },
        {
            "value": "answer5",
            "label": "Radialer Abstand des Aufhängepunkts der Zusatzmasse von der Drehachse $R$."
        },
        {
            "value": "answer6",
            "label": "Masse der Zusatzmassen $m_{zm}$."
        },
        {
            "value": "answer7",
            "label": "Trägheitsmoment des Schwungrads $\\Theta$."
        }
    ],
    "correctAnswers": [
        "answer4",
        "answer5",
        "answer6"
    ],
    "containerId": "question4-container",
    "successMessage": "In der gezeigten Geometrie gilt im Gleichgewicht $D\\varphi=m_{zm}gR\\sin\\varphi$. Dabei ist $R\\sin\\varphi$ der senkrechte Hebelarm der Gewichtskraft.",
    "incompleteMessage": "Nutzen Sie die Drehmomentbilanz neben der Skizze und unterscheiden Sie radialen Abstand und senkrechten Hebelarm.",
    "incorrectMessage": "Nutzen Sie die Drehmomentbilanz neben der Skizze und unterscheiden Sie radialen Abstand und senkrechten Hebelarm.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "static",
            "order": 1,
            "message": "Im statischen Gleichgewicht bewegt sich das Rad nicht. Größen, die ausschließlich die zeitliche Bewegung beschreiben, werden für diese Bestimmung daher nicht benötigt."
        },
        "answer7": {
            "conceptId": "static",
            "order": 1,
            "message": "Im statischen Gleichgewicht bewegt sich das Rad nicht. Größen, die ausschließlich die zeitliche Bewegung beschreiben, werden für diese Bestimmung daher nicht benötigt."
        },
        "answer2": {
            "conceptId": "torque-geometry",
            "order": 2,
            "message": "Verwenden Sie die Drehmomentbilanz neben der Skizze. Der wirksame Hebelarm ist der senkrechte Abstand der Wirkungslinie der Gewichtskraft von der Drehachse und ergibt sich hier aus dem radialen Abstand und dem Winkel."
        },
        "answer5": {
            "conceptId": "torque-geometry",
            "order": 2,
            "message": "Verwenden Sie die Drehmomentbilanz neben der Skizze. Der wirksame Hebelarm ist der senkrechte Abstand der Wirkungslinie der Gewichtskraft von der Drehachse und ergibt sich hier aus dem radialen Abstand und dem Winkel."
        },
        "answer3": {
            "conceptId": "required-quantities",
            "order": 3,
            "message": "Stellen Sie die Gleichung nach $D$ um und prüfen Sie, welche Masse, welcher Abstand und welcher Winkel darin vorkommen."
        },
        "answer4": {
            "conceptId": "required-quantities",
            "order": 3,
            "message": "Stellen Sie die Gleichung nach $D$ um und prüfen Sie, welche Masse, welcher Abstand und welcher Winkel darin vorkommen."
        },
        "answer6": {
            "conceptId": "required-quantities",
            "order": 3,
            "message": "Stellen Sie die Gleichung nach $D$ um und prüfen Sie, welche Masse, welcher Abstand und welcher Winkel darin vorkommen."
        }
    }
};

export const question5: ImageChoiceQuestion = {
    "questionId": "e1-intro-exp-5-winkel-drehmoment",
    "question": "Welche Graphen können den Zusammenhang zwischen Gleichgewichtsauslenkung $\\varphi$ und Lastdrehmoment $M$ bei konstantem Direktionsmoment $D>0$ darstellen? Ein Zahlenwert für $D$ ist nicht vorgegeben.",
    "options": [
        {
            "value": "answer1",
            "imageSrc": "assets/images/e1_intro_experiment/angle_over_moment_option1_3.png"
        },
        {
            "value": "answer2",
            "imageSrc": "assets/images/e1_intro_experiment/angle_over_moment_option2_3.png"
        },
        {
            "value": "answer3",
            "imageSrc": "assets/images/e1_intro_experiment/angle_over_moment_option3_3.png"
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2"
    ],
    "containerId": "question5-container",
    "successMessage": "Bei konstantem $D>0$ gilt im Gleichgewicht $\\varphi=M/D$: Die Auslenkung steigt linear mit dem Lastdrehmoment. Ohne Zahlenwert für $D$ ist die Steigung nicht festgelegt.",
    "incompleteMessage": "Vergleichen Sie Richtung und Linearität der Graphen mit der Drehmomentbilanz der Feder.",
    "incorrectMessage": "Vergleichen Sie Richtung und Linearität der Graphen mit der Drehmomentbilanz der Feder.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "unspecified-slope",
            "order": 2,
            "message": "Prüfen Sie, ob die Aufgabe eine bestimmte positive Steigung vorgibt."
        },
        "answer2": {
            "conceptId": "unspecified-slope",
            "order": 2,
            "message": "Prüfen Sie, ob die Aufgabe eine bestimmte positive Steigung vorgibt."
        },
        "answer3": {
            "conceptId": "load-direction",
            "order": 1,
            "message": "Auf der waagerechten Achse steht das äußere Lastdrehmoment. Im Gleichgewicht gilt $M-D\\varphi=0$. Stellen Sie diese Beziehung nach $\\varphi$ um und prüfen Sie bei $D>0$, ob eine größere Last zu einer größeren oder kleineren Gleichgewichtsauslenkung führt."
        }
    }
};

export const question6: ImageChoiceQuestion = {
    "questionId": "e1-intro-exp-6-winkel-zeit",
    "question": "Welche Kurven passen zum linearen Modell eines frei gedämpften Pohlschen Rads, das bei $\\varphi(0)=10^\\circ$ aus der Ruhe losgelassen wird ($\\dot{\\varphi}(0)=0\\,{}^\\circ/\\mathrm{s}$)? Das Rad ist im Schwerpunkt gelagert; Antrieb und Zusatzmasse fehlen. Für jede Kurve sind Feder und Dämpfung zeitlich konstant; die Dämpfungsstärke darf zwischen den Kurven variieren. Im linearen Schwingfall ist die Periodendauer bei diesen Bedingungen zeitlich konstant.",
    "options": [
        {
            "value": "answer1",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option1_4.png"
        },
        {
            "value": "answer2",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option2_4.png"
        },
        {
            "value": "answer3",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option3_4.png"
        },
        {
            "value": "answer4",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option4_4.png"
        },
        {
            "value": "answer5",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option5_4.png"
        },
        {
            "value": "answer6",
            "imageSrc": "assets/images/e1_intro_experiment/phi_over_t_option6_4.png"
        }
    ],
    "correctAnswers": [
        "answer4"
    ],
    "containerId": "question6-container",
    "successMessage": "Beim Loslassen aus der Ruhe ist die Anfangssteigung null. Im linearen Schwingfall bleibt die Periodendauer bei fester Dämpfung konstant, während die Amplitude abnimmt.",
    "incompleteMessage": "Vergleichen Sie Anfangswert, Anfangssteigung, Amplitudenentwicklung und Abstände aufeinanderfolgender Maxima.",
    "incorrectMessage": "Vergleichen Sie Anfangswert, Anfangssteigung, Amplitudenentwicklung und Abstände aufeinanderfolgender Maxima.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "initial-value",
            "order": 1,
            "message": "Vergleichen Sie den Wert am linken Rand mit der vorgegebenen Anfangsauslenkung.",
            "paragraphId": "initial-state"
        },
        "answer2": {
            "conceptId": "constant-period",
            "order": 3,
            "message": "Vergleichen Sie die Abstände aufeinanderfolgender Maxima bei zeitlich konstanten Modellparametern.",
            "paragraphId": "period"
        },
        "answer3": {
            "conceptId": "initial-slope",
            "order": 2,
            "message": "Beim Loslassen aus der Ruhe gilt $\\dot{\\varphi}(0)=0$. Die Kurve muss deshalb am linken Rand eine waagerechte Tangente besitzen. Prüfen Sie, ob die dargestellte Auslenkung zunächst waagerecht startet oder bereits mit deutlich negativer Steigung abnimmt.",
            "paragraphId": "initial-state"
        },
        "answer6": {
            "conceptId": "initial-slope",
            "order": 2,
            "message": "Beim Loslassen aus der Ruhe gilt $\\dot{\\varphi}(0)=0$. Die Kurve muss deshalb am linken Rand eine waagerechte Tangente besitzen. Prüfen Sie, ob die dargestellte Auslenkung zunächst waagerecht startet oder bereits mit deutlich negativer Steigung abnimmt.",
            "paragraphId": "initial-state"
        },
        "answer4": [
            {
                "conceptId": "initial-value",
                "order": 1,
                "message": "Vergleichen Sie den Wert am linken Rand mit der vorgegebenen Anfangsauslenkung.",
                "paragraphId": "initial-state"
            },
            {
                "conceptId": "initial-slope",
                "order": 2,
                "message": "Beim Loslassen aus der Ruhe gilt $\\dot{\\varphi}(0)=0$. Die Kurve muss deshalb am linken Rand eine waagerechte Tangente besitzen. Prüfen Sie, ob die dargestellte Auslenkung zunächst waagerecht startet oder bereits mit deutlich negativer Steigung abnimmt.",
                "paragraphId": "initial-state"
            },
            {
                "conceptId": "constant-period",
                "order": 3,
                "message": "Vergleichen Sie die Abstände aufeinanderfolgender Maxima bei zeitlich konstanten Modellparametern.",
                "paragraphId": "period"
            },
            {
                "conceptId": "mechanical-energy",
                "order": 4,
                "message": "Ohne Antrieb kann die mechanische Energie bei positiver Dämpfung nicht zunehmen. Prüfen Sie damit, ob die Spitzenwerte der Auslenkung wachsen können.",
                "paragraphId": "energy"
            }
        ],
        "answer5": {
            "conceptId": "mechanical-energy",
            "order": 4,
            "message": "Ohne Antrieb kann die mechanische Energie bei positiver Dämpfung nicht zunehmen. Prüfen Sie damit, ob die Spitzenwerte der Auslenkung wachsen können.",
            "paragraphId": "energy"
        }
    }
};
