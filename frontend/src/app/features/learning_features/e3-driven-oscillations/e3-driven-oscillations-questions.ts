import { SingleChoiceQuestion, MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: SingleChoiceQuestion = {
    "questionId": "e3-driven-osc-1-dgl-loesen",
    "question": "Welcher Grundgedanke hilft weiter, um diese Differentialgleichung zu lösen?",
    "options": [
        {
            "value": "answer1",
            "label": "$\\varphi_\\mathrm{gesamt}(t)=\\varphi_\\mathrm{homogen}(t)+\\varphi_\\mathrm{spezial}(t)$"
        },
        {
            "value": "answer2",
            "label": "$\\varphi_\\mathrm{gesamt}(t)=\\alpha\\varphi_\\mathrm{homogen}(t)$ genügt auch bei nicht verschwindendem Antrieb."
        },
        {
            "value": "answer3",
            "label": "Die stationäre Lösung wird allein durch die Anfangsauslenkung bestimmt."
        },
        {
            "value": "answer4",
            "label": "Die Lösung ohne Antrieb beschreibt bereits die gesamte getriebene Bewegung."
        }
    ],
    "correctAnswer": "answer1",
    "containerId": "question1-container",
    "successMessage": "Wegen der Linearität kann zu einer speziellen Lösung jede homogene Lösung addiert werden. Die Summe erfüllt weiterhin die Gleichung mit Antrieb.",
    "incorrectMessage": "Vergleichen Sie die Gleichung mit und ohne Anregungsterm und prüfen Sie, wie sich ihre Lösungsanteile ergänzen.",
    "answerFeedback": {
        "answer2": "Ein Vielfaches der homogenen Lösung erfüllt weiterhin nur die Gleichung ohne Antrieb; für den nicht verschwindenden Anregungsterm wird zusätzlich eine spezielle Lösung benötigt.",
        "answer3": "Die Anfangsauslenkung legt den homogenen Einschwinganteil mit fest, während die stationäre Antwort durch Antrieb und Systemparameter bestimmt wird.",
        "answer4": "Die homogene Lösung beschreibt das System ohne Antrieb und kann deshalb den nicht verschwindenden Anregungsterm nicht allein erfüllen."
    }
};

export const question2: MultipleChoiceQuestion = {
    "questionId": "e3-driven-osc-2-inhom-dgl",
    "question": "Welche Aussagen folgen für das linear gedämpfte System mit dauerhaftem sinusförmigem Antrieb und positiver Dämpfung aus der gezeigten Gesamtlösung?",
    "options": [
        {
            "value": "answer1",
            "label": "Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch."
        },
        {
            "value": "answer2",
            "label": "Der stationäre Anteil eines ungedämpften Rads schwingt immer mit der Eigenfrequenz des Rads."
        },
        {
            "value": "answer3",
            "label": "Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Systems zu allen Zeiten."
        },
        {
            "value": "answer4",
            "label": "Nach dem Einschwingen entspricht die Schwingungsfrequenz der Antriebsfrequenz, unabhängig von der Dämpfungsstärke."
        },
        {
            "value": "answer5",
            "label": "Der Antrieb hat nur zu Beginn einen Einfluss auf das Schwingungsverhalten, ab einer bestimmten Zeit schwingt das System frei."
        },
        {
            "value": "answer6",
            "label": "Der erste, homogene Summand wird nach hinreichend langer Zeit vernachlässigbar."
        },
        {
            "value": "answer7",
            "label": "Der zweite, stationäre Summand wird nach hinreichend langer Zeit vernachlässigbar."
        }
    ],
    "correctAnswers": [
        "answer4",
        "answer6"
    ],
    "containerId": "question2-container",
    "successMessage": "Bei positiver Dämpfung klingt der homogene Anteil ab. Die verbleibende stationäre Antwort schwingt mit der Frequenz des Antriebs.",
    "incompleteMessage": "Prüfen Sie das Langzeitverhalten der beiden Summanden in der Gesamtlösung.",
    "incorrectMessage": "Prüfen Sie das Langzeitverhalten der beiden Summanden in der Gesamtlösung.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "transient-and-stationary",
            "order": 1,
            "message": "Betrachten Sie den Faktor $e^{-\\beta t}$: Bei positiver Dämpfung nimmt der homogene Anteil mit der Zeit ab. Der durch den dauerhaften Antrieb erzeugte stationäre Anteil bleibt bestehen."
        },
        "answer5": {
            "conceptId": "transient-and-stationary",
            "order": 1,
            "message": "Betrachten Sie den Faktor $e^{-\\beta t}$: Bei positiver Dämpfung nimmt der homogene Anteil mit der Zeit ab. Der durch den dauerhaften Antrieb erzeugte stationäre Anteil bleibt bestehen."
        },
        "answer6": {
            "conceptId": "transient-and-stationary",
            "order": 1,
            "message": "Betrachten Sie den Faktor $e^{-\\beta t}$: Bei positiver Dämpfung nimmt der homogene Anteil mit der Zeit ab. Der durch den dauerhaften Antrieb erzeugte stationäre Anteil bleibt bestehen."
        },
        "answer7": {
            "conceptId": "transient-and-stationary",
            "order": 1,
            "message": "Betrachten Sie den Faktor $e^{-\\beta t}$: Bei positiver Dämpfung nimmt der homogene Anteil mit der Zeit ab. Der durch den dauerhaften Antrieb erzeugte stationäre Anteil bleibt bestehen."
        },
        "answer2": {
            "conceptId": "frequency-and-initial-state",
            "order": 2,
            "message": "Anfangsbedingungen bestimmen den abklingenden homogenen Anteil. Lesen Sie anschließend im Cosinusterm des stationären Anteils ab, welche Frequenz nach dem Einschwingen verbleibt."
        },
        "answer3": {
            "conceptId": "frequency-and-initial-state",
            "order": 2,
            "message": "Anfangsbedingungen bestimmen den abklingenden homogenen Anteil. Lesen Sie anschließend im Cosinusterm des stationären Anteils ab, welche Frequenz nach dem Einschwingen verbleibt."
        },
        "answer4": {
            "conceptId": "frequency-and-initial-state",
            "order": 2,
            "message": "Anfangsbedingungen bestimmen den abklingenden homogenen Anteil. Lesen Sie anschließend im Cosinusterm des stationären Anteils ab, welche Frequenz nach dem Einschwingen verbleibt."
        }
    }
};

export const question3: ImageChoiceQuestion = {
    "questionId": "e3-driven-osc-3-swinging-process",
    "question": "In welcher Abbildung ist am deutlichsten eine nahezu geschlossene, wiederkehrende Bahn ohne ausgeprägte Drift zwischen benachbarten Umläufen zu erkennen?",
    "options": [
        {
            "value": "answer1",
            "imageSrc": "assets/images/e3_driven_oscillations/swinging_process_option1_3.png"
        },
        {
            "value": "answer2",
            "imageSrc": "assets/images/e3_driven_oscillations/swinging_process_option2_3.png"
        },
        {
            "value": "answer3",
            "imageSrc": "assets/images/e3_driven_oscillations/swinging_process_option3_3.png"
        }
    ],
    "correctAnswers": [
        "answer1"
    ],
    "containerId": "question3-container",
    "successMessage": "Im stationären Zustand wiederholen sich Winkel und Winkelgeschwindigkeit periodisch. Benachbarte Umläufe liegen deshalb nahezu auf derselben geschlossenen Bahn.",
    "incorrectMessage": "Vergleichen Sie die Überlagerung benachbarter Umläufe auf einer nahezu geschlossenen Bahn.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "stationary-trajectory",
            "order": 1,
            "message": "Im stationären Zustand wiederholen sich dieselben Paare aus Winkel und Winkelgeschwindigkeit. Suchen Sie deshalb nach einer nahezu geschlossenen Bahn, bei der benachbarte Umläufe weitgehend aufeinanderliegen, statt sichtbar nach innen oder außen zu wandern."
        },
        "answer2": {
            "conceptId": "stationary-trajectory",
            "order": 1,
            "message": "Im stationären Zustand wiederholen sich dieselben Paare aus Winkel und Winkelgeschwindigkeit. Suchen Sie deshalb nach einer nahezu geschlossenen Bahn, bei der benachbarte Umläufe weitgehend aufeinanderliegen, statt sichtbar nach innen oder außen zu wandern."
        },
        "answer3": {
            "conceptId": "stationary-trajectory",
            "order": 1,
            "message": "Im stationären Zustand wiederholen sich dieselben Paare aus Winkel und Winkelgeschwindigkeit. Suchen Sie deshalb nach einer nahezu geschlossenen Bahn, bei der benachbarte Umläufe weitgehend aufeinanderliegen, statt sichtbar nach innen oder außen zu wandern."
        }
    },
    "incompleteMessage": "Vergleichen Sie die Überlagerung benachbarter Umläufe auf einer nahezu geschlossenen Bahn."
};

export const question4: MultipleChoiceQuestion = {
    "questionId": "e3-driven-osc-4-max-amp",
    "question": "Welche der angebotenen Größen beeinflussen die stationäre Winkelamplitude bei festem Antriebsmoment und fester Antriebsfrequenz? $\\omega_0$ und $\\beta$ sind aus $D$, $\\Theta$ und $\\rho$ abgeleitet und keine zusätzlichen unabhängigen Parameter.",
    "options": [
        {
            "value": "answer1",
            "label": "Trägheitsmoment $\\Theta$"
        },
        {
            "value": "answer2",
            "label": "Anfangswinkelgeschwindigkeit $\\dot{\\varphi}(0)$"
        },
        {
            "value": "answer3",
            "label": "Ungedämpfte Eigenkreisfrequenz $\\omega_0$"
        },
        {
            "value": "answer4",
            "label": "Anfangswinkelauslenkung $\\varphi(0)$"
        },
        {
            "value": "answer5",
            "label": "Dämpfung (Wirbelstrombremse und Reibungsverluste) $\\rho$"
        },
        {
            "value": "answer6",
            "label": "Abgeleiteter Dämpfungskoeffizient $\\beta$"
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer3",
        "answer5",
        "answer6"
    ],
    "containerId": "question4-container",
    "successMessage": "Die stationäre Amplitude hängt von den Systemgrößen ab, nicht vom Anfangszustand. Dabei sind $\\omega_0^2=D/\\Theta$ und $2\\beta=\\rho/\\Theta$ abgeleitete Größen.",
    "incompleteMessage": "Verfolgen Sie die angebotenen Größen in der stationären Amplitude und in den Definitionen ihrer Koeffizienten.",
    "incorrectMessage": "Verfolgen Sie die angebotenen Größen in der stationären Amplitude und in den Definitionen ihrer Koeffizienten.",
    "answerFeedback": {
        "answer2": {
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
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=A/\\Theta$, $\\omega_0^2=D/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer3": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=A/\\Theta$, $\\omega_0^2=D/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer5": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=A/\\Theta$, $\\omega_0^2=D/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        },
        "answer6": {
            "conceptId": "system-parameters",
            "order": 2,
            "message": "Verfolgen Sie die übrigen Größen mithilfe von $N=A/\\Theta$, $\\omega_0^2=D/\\Theta$ und $2\\beta=\\rho/\\Theta$ bis in die stationäre Amplitudenformel. Eine Grundgröße kann die Amplitude auch über einen daraus abgeleiteten Koeffizienten beeinflussen."
        }
    }
};

export const question5: SingleChoiceQuestion = {
    "questionId": "e3-driven-osc-5-damping-resonance-freq",
    "question": "Bei festem Antriebsmoment und festem $\\omega_0$ gilt: Je stärker die Dämpfung, desto … (solange ein Resonanzmaximum bei $\\omega_r>0$ existiert).",
    "options": [
        {
            "value": "answer1",
            "label": "... größer die Resonanzfrequenz."
        },
        {
            "value": "answer2",
            "label": "... größer die Amplitude bei der Resonanzfrequenz."
        },
        {
            "value": "answer3",
            "label": " ... größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz $\\omega_0$."
        }
    ],
    "correctAnswer": "answer3",
    "containerId": "question5-container",
    "successMessage": "Bei festem $\\omega_0$ sinkt $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ mit wachsender Dämpfung, solange ein Maximum bei nicht verschwindender Frequenz existiert.",
    "incorrectMessage": "Die dunkelblaue Kurve zeigt die schwächste, die hellblaue die stärkste Dämpfung. Vergleichen Sie die Lage ihrer Maxima.",
    "answerFeedback": {
        "answer1": "In $\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}$ wird der Radikand mit wachsendem $\\beta$ kleiner; die Resonanzfrequenz sinkt daher.",
        "answer2": "Bei gleicher Amplitude und Frequenz verursacht stärkere Dämpfung größere Energieverluste. Bei festem Antrieb stellt sich deshalb eine kleinere stationäre Amplitude ein. Vergleichen Sie in der Abbildung die Höhen der Resonanzmaxima bei kleiner und großer Dämpfung."
    }
};

export const question6: SingleChoiceQuestion = {
    "questionId": "e3-driven-osc-6-damping-resonance-freq-exp",
    "question": "Wie verändert stärkere Dämpfung bei sonst gleichen Parametern und weiterhin vorhandenem Resonanzmaximum die erforderliche Frequenzauflösung?",
    "options": [
        {
            "value": "answer1",
            "label": "Sie erfordert wegen steigender Resonanzamplitude größere Vorsicht."
        },
        {
            "value": "answer2",
            "label": "Sie erfordert wegen eines schmaleren Peaks kleinere Frequenzschritte."
        },
        {
            "value": "answer3",
            "label": "Sie erlaubt wegen eines breiteren Peaks größere Frequenzschritte bei vergleichbarer Auflösung des Maximums."
        }
    ],
    "correctAnswer": "answer3",
    "containerId": "question6-container",
    "successMessage": "Ein breiteres Resonanzmaximum lässt sich mit größeren Frequenzschritten auflösen. Ein schmaler Peak benötigt in seiner Umgebung eine feinere Frequenzauflösung.",
    "incorrectMessage": "Vergleichen Sie die Breite der Resonanzpeaks in der Abbildung und die dafür erforderliche Frequenzauflösung.",
    "answerFeedback": {
        "answer1": "Für die Wahl der Frequenzschritte ist die Breite des Resonanzmaximums entscheidend. Vergleichen Sie den Frequenzbereich um das Maximum bei schwacher und starker Dämpfung. Ein schmaler Peak erfordert kleinere Schritte, damit sein Maximum nicht zwischen zwei Messpunkten liegt.",
        "answer2": "Für die Wahl der Frequenzschritte ist die Breite des Resonanzmaximums entscheidend. Vergleichen Sie den Frequenzbereich um das Maximum bei schwacher und starker Dämpfung. Ein schmaler Peak erfordert kleinere Schritte, damit sein Maximum nicht zwischen zwei Messpunkten liegt."
    }
};

export const question7: SingleChoiceQuestion = {
    "questionId": "e3-driven-osc-7-exciting-frequency",
    "question": "Für $0<\\beta<\\omega_0/\\sqrt{2}$ entspricht die Anregungsfrequenz der Resonanzfrequenz $\\omega_r$. Dann …",
    "options": [
        {
            "value": "answer1",
            "label": "... ist die Phasenverschiebung kleiner als $\\pi/2$."
        },
        {
            "value": "answer2",
            "label": "... ist die Phasenverschiebung genau $\\pi/2$."
        },
        {
            "value": "answer3",
            "label": "... ist die Phasenverschiebung größer als $\\pi/2$."
        },
        {
            "value": "answer4",
            "label": "...  kann man keine Aussage über die Phasenverschiebung treffen."
        }
    ],
    "correctAnswer": "answer1",
    "containerId": "question7-container",
    "successMessage": "Bei positiver Dämpfung und vorhandenem Resonanzmaximum gilt $\\omega_r<\\omega_0$. Daher liegt die Phasenverzögerung am Amplitudenmaximum unter $\\pi/2$.",
    "incorrectMessage": "Vergleichen Sie die Lage von $\\omega_r$ relativ zu $\\omega_0$ und den Punkt $\\Phi=\\pi/2$ in der Phasenkurve.",
    "answerFeedback": {
        "answer2": "$\\Phi=\\pi/2$ gilt bei $\\omega=\\omega_0$; wegen $\\omega_r<\\omega_0$ ist dieser Phasenwert am Resonanzmaximum noch nicht erreicht.",
        "answer3": "Die Phase wächst mit der Anregungsfrequenz und erreicht $\\pi/2$ erst bei $\\omega_0$, während $\\omega_r$ darunter liegt.",
        "answer4": "Aus $\\omega_r<\\omega_0$ und $\\Phi(\\omega_0)=\\pi/2$ lässt sich die Phase am Resonanzmaximum eindeutig einordnen."
    }
};

export const question8: SingleChoiceQuestion = {
    "questionId": "e3-driven-osc-8-measure-time-delta",
    "question": "Ein linear gedämpftes Pohlsches Rad schwingt stationär bei $f=0{,}400\\,\\mathrm{Hz}$ ($\\omega=2\\pi f$, $T=2{,}50\\,\\mathrm{s}$). Auf jeden aufwärts gerichteten Nulldurchgang des sinusförmigen Antriebsmoments folgt der nächste aufwärts gerichtete Nulldurchgang der Winkelauslenkung nach $\\Delta t=0{,}625\\,\\mathrm{s}$. Die Verzögerung liegt zwischen $0$ und $T/2$. Es gilt $0<\\beta<\\omega_0/\\sqrt{2}$. Welche Folgerung ist richtig?",
    "options": [
        {
            "value": "answer1",
            "label": "Die ungedämpfte Eigenfrequenz ist $f_0=0{,}400\\,\\mathrm{Hz}$; die Resonanzfrequenz $f_r$ ist kleiner."
        },
        {
            "value": "answer2",
            "label": "Die Resonanzfrequenz ist $f_r=0{,}400\\,\\mathrm{Hz}$; die ungedämpfte Eigenfrequenz ist kleiner."
        },
        {
            "value": "answer3",
            "label": "Eigenfrequenz und Resonanzfrequenz sind beide $0{,}400\\,\\mathrm{Hz}$."
        },
        {
            "value": "answer4",
            "label": "Auch die ungedämpfte Eigenfrequenz lässt sich aus dieser Phasenmessung nicht bestimmen."
        }
    ],
    "correctAnswer": "answer1",
    "containerId": "question8-container",
    "successMessage": "Mit $\\Phi=2\\pi f\\Delta t=\\pi/2$ ist $f_0=0{,}400\\,\\mathrm{Hz}$ bestimmt. Bei positiver Dämpfung und vorhandenem Maximum liegt die Resonanzfrequenz darunter.",
    "incorrectMessage": "Bestimmen Sie aus $\\Delta t/T$ die Phasenverzögerung und vergleichen Sie den zugehörigen Punkt der Phasenkurve mit dem Amplitudenmaximum.",
    "answerFeedback": {
        "answer2": "$\\Delta t/T=1/4$ bedeutet $\\Phi=\\pi/2$ und kennzeichnet die ungedämpfte Eigenfrequenz, nicht die Resonanzfrequenz; bei positiver Dämpfung liegt $f_r$ darunter.",
        "answer3": "Die Viertelperiode bestimmt zwar $f_0=0{,}400\\,\\mathrm{Hz}$, doch bei positiver Dämpfung gilt $f_r<f_0$.",
        "answer4": "Die gemessene Verzögerung von einer Viertelperiode liefert $\\Phi=\\pi/2$; genau dieser Phasenwert kennzeichnet $f_0$."
    }
};
