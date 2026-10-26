import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-1-exp-ansatz",
    "question": "Warum kann man die DGL des gedämpften Oszillators mit dem Exponentialansatz lösen?",
    "options": [
        {
            "value": "answer1",
            "label": "Weil die DGL nicht linear ist."
        },
        {
            "value": "answer2",
            "label": "Weil der Ansatz nur für ungedämpfte Systeme funktioniert."
        },
        {
            "value": "answer3",
            "label": "Weil $e^{\\lambda t}$ bei Ableitung nur mit konstanten Faktoren multipliziert wird."
        },
        {
            "value": "answer4",
            "label": "Weil die Lösung immer sinusförmig sein muss."
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t3-damped-osc-1-container",
    "successMessage": "Exponentialfunktionen werden beim Ableiten nur mit konstanten Faktoren multipliziert. Dadurch wird die Differentialgleichung auf eine algebraische Bestimmungsgleichung zurückgeführt.",
    "incompleteMessage": "Leiten Sie $e^{\\lambda t}$ ein- und zweimal ab und vergleichen Sie mit dem Ansatz in der DGL.",
    "incorrectMessage": "Leiten Sie $e^{\\lambda t}$ ein- und zweimal ab und vergleichen Sie mit dem Ansatz in der DGL.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "linearity",
            "order": 1,
            "message": "Prüfen Sie anhand der DGL, ob $x$, $\\dot{x}$ und $\\ddot{x}$ nur linear auftreten."
        },
        "answer2": {
            "conceptId": "exponential-derivatives",
            "order": 2,
            "message": "Beim Ableiten von $e^{\\lambda t}$ bleibt dieselbe Exponentialfunktion erhalten und erhält lediglich die Faktoren $\\lambda$ beziehungsweise $\\lambda^2$. Das gilt für reelle und komplexe Werte von $\\lambda$. Prüfen Sie deshalb, ob die Eignung des Ansatzes bereits eine sinusförmige Lösung voraussetzt."
        },
        "answer3": {
            "conceptId": "exponential-derivatives",
            "order": 2,
            "message": "Beim Ableiten von $e^{\\lambda t}$ bleibt dieselbe Exponentialfunktion erhalten und erhält lediglich die Faktoren $\\lambda$ beziehungsweise $\\lambda^2$. Das gilt für reelle und komplexe Werte von $\\lambda$. Prüfen Sie deshalb, ob die Eignung des Ansatzes bereits eine sinusförmige Lösung voraussetzt."
        },
        "answer4": {
            "conceptId": "exponential-derivatives",
            "order": 2,
            "message": "Beim Ableiten von $e^{\\lambda t}$ bleibt dieselbe Exponentialfunktion erhalten und erhält lediglich die Faktoren $\\lambda$ beziehungsweise $\\lambda^2$. Das gilt für reelle und komplexe Werte von $\\lambda$. Prüfen Sie deshalb, ob die Eignung des Ansatzes bereits eine sinusförmige Lösung voraussetzt."
        }
    }
};

export const question2: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-2-gen-solution",
    "question": "Was gilt im Schwingfall $0<\\gamma<\\omega_0$ für $x(t)=e^{-\\gamma t}(c_1e^{-i\\omega_e t}+c_2e^{i\\omega_e t})$ mit $c_2=c_1^*$?",
    "options": [
        {
            "value": "answer1",
            "label": "Die Frequenz $\\omega_e$ ist durch $\\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$ bestimmt."
        },
        {
            "value": "answer2",
            "label": "Bei festen Systemparametern werden die Konstanten $c_1,c_2$ durch die Anfangsbedingungen bestimmt."
        },
        {
            "value": "answer3",
            "label": "Der Faktor $e^{-\\gamma t}$ beschreibt die abklingende Einhüllende der Schwingung."
        },
        {
            "value": "answer4",
            "label": "Der Schwinganteil ist unabhängig vom Verhältnis $\\gamma/\\omega_0$."
        },
        {
            "value": "answer5",
            "label": "Die Konstanten $c_1$ und $c_2$ werden ausschließlich durch die Dämpfung $\\gamma$ bestimmt."
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer3"
    ],
    "containerId": "t3-damped-osc-2-container",
    "successMessage": "Die Dämpfung verändert die Frequenz und die exponentiell abklingende Einhüllende. Bei festen Systemparametern legen die Anfangsbedingungen die Integrationskonstanten fest.",
    "incompleteMessage": "Zerlegen Sie die Lösung in Einhüllende und Schwinganteil und unterscheiden Sie Systemparameter von Anfangsbedingungen.",
    "incorrectMessage": "Zerlegen Sie die Lösung in Einhüllende und Schwinganteil und unterscheiden Sie Systemparameter von Anfangsbedingungen.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "damped-frequency",
            "order": 1,
            "message": "Verfolgen Sie das Verhältnis von $\\gamma$ und $\\omega_0$ unter der Wurzel für $\\omega_e$."
        },
        "answer4": {
            "conceptId": "damped-frequency",
            "order": 1,
            "message": "Verfolgen Sie das Verhältnis von $\\gamma$ und $\\omega_0$ unter der Wurzel für $\\omega_e$."
        },
        "answer3": {
            "conceptId": "envelope",
            "order": 2,
            "message": "Betrachten Sie die Einhüllende $e^{-\\gamma t}$ für positives $\\gamma$."
        },
        "answer2": {
            "conceptId": "initial-conditions",
            "order": 3,
            "message": "Überlegen Sie, welche zwei Angaben die freien Konstanten einer Differentialgleichung zweiter Ordnung festlegen."
        },
        "answer5": {
            "conceptId": "initial-conditions",
            "order": 3,
            "message": "Überlegen Sie, welche zwei Angaben die freien Konstanten einer Differentialgleichung zweiter Ordnung festlegen."
        }
    }
};

export const question3: MultipleChoiceQuestion = {
    questionId: 't3-damped-osc-3-schwingfall-condition',
    question: 'Wann spricht man beim harmonischen Oszillator vom schwach gedämpften Schwingfall?',
    options: [
        { value: 'answer1', label: 'Wenn $\\gamma = 0$' },
        { value: 'answer2', label: 'Wenn $\\gamma > \\omega_0$' },
        { value: 'answer3', label: 'Wenn $0 < \\gamma < \\omega_0$' }
    ],
    correctAnswers: ['answer3'],
    containerId: 't3-damped-osc-3-container',
    successMessage: '✓ Richtig. Für $0 < \\gamma < \\omega_0$ sind die Lösungen komplex. Das System führt eine gedämpfte Schwingung mit der Kreisfrequenz $\\omega_e$ aus.',
    incompleteMessage: '✗ Die passende Bedingung fehlt noch. Prüfen Sie auf dieser Seite, wann der Ausdruck unter der Wurzel in $\\omega_e$ positiv ist.',
    incorrectMessage: '✗ Die gewählte Bedingung beschreibt nicht den Schwingfall. Vergleichen Sie Dämpfung und Eigenfrequenz so, dass $\\omega_e$ reell bleibt.',
    answerFeedback: {
        answer1: 'Unterscheiden Sie den ungedämpften Grenzfall von einer schwach gedämpften Schwingung.',
        answer2: 'Prüfen Sie das Vorzeichen von $\\omega_0^2-\\gamma^2$ für diese Größenordnung.',
        answer3: 'Fordern Sie für $\\omega_e=\\sqrt{\\omega_0^2-\\gamma^2}$ einen positiven Radikanden bei vorhandener Dämpfung.'
    }
};

export const question4: MultipleChoiceQuestion = {
    questionId: 't3-damped-osc-4-schwingfall-matching',
    question: 'Welche der folgenden Zuordnungen zwischen Ausdruck und Bedeutung sind korrekt?',
    options: [
        { value: 'answer1', label: 'Gedämpfter Schwingungsanteil → $\\cos(\\omega_e t)$' },
        { value: 'answer2', label: 'Exponentieller Abfall der Amplitude → $e^{-\\gamma t}$' },
        { value: 'answer3', label: 'Eigenfrequenz des gedämpften Systems → $\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$' },
        { value: 'answer4', label: 'Gedämpfter Schwingungsanteil → $e^{-\\gamma t}$' },
        { value: 'answer5', label: 'Eigenfrequenz des gedämpften Systems → $\\cos(\\omega_e t)$' }
    ],
    correctAnswers: ['answer1', 'answer2', 'answer3'],
    containerId: 't3-damped-osc-4-container',
    successMessage: '✓ Richtig. Der Cosinusterm beschreibt die periodische Bewegung, $e^{-\\gamma t}$ den Amplitudenabfall und $\\omega_e$ die gedämpfte Eigenfrequenz.',
    incompleteMessage: '✗ Mindestens eine Zuordnung fehlt. Zerlegen Sie die Lösung auf dieser Seite in Einhüllende, periodischen Anteil und Frequenz.',
    incorrectMessage: '✗ Mindestens eine zusätzliche Zuordnung vertauscht die Rollen der Terme. Fragen Sie bei jedem Ausdruck: Ist er zeitlich abklingend, periodisch oder eine Frequenz?',
    answerFeedback: {
        answer1: 'Ordnen Sie dem Cosinusterm die periodische Zeitabhängigkeit zu.',
        answer2: 'Betrachten Sie den Verlauf von $e^{-\\gamma t}$ für wachsendes $t$.',
        answer3: 'Unterscheiden Sie die Größe $\\omega_e$ von der Funktion $\\cos(\\omega_e t)$.',
        answer4: 'Trennen Sie die abklingende Einhüllende vom periodischen Schwingungsanteil.',
        answer5: 'Eine Frequenz ist ein Parameter des Cosinusterms, nicht der Cosinusterm selbst.'
    }
};

export const question5: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-5-exp-factor",
    "question": "Im Schwingfall seien $a_n>0$ und $a_{n+1}>0$ die Beträge zweier aufeinanderfolgender positiver Maxima im Abstand $T$. Was beschreibt $a_{n+1}/a_n=e^{-\\gamma T}$?",
    "options": [
        {
            "value": "answer1",
            "label": "Die ungedämpfte Schwingung"
        },
        {
            "value": "answer2",
            "label": "Die zeitlich konstante Eigenfrequenz"
        },
        {
            "value": "answer3",
            "label": "Die exponentielle Abnahme der Amplitude"
        },
        {
            "value": "answer4",
            "label": "Die Beschleunigung des Systems"
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t3-damped-osc-5-container",
    "successMessage": "Das Verhältnis $a_{n+1}/a_n=e^{-\\gamma T}$ gibt an, welcher Anteil der Amplitude nach einer Periode verbleibt. Bei $\\gamma>0$ liegt dieser Anteil zwischen null und eins, sodass die aufeinanderfolgenden Spitzenwerte exponentiell abnehmen.",
    "incompleteMessage": "Vergleichen Sie die Einhüllende an zwei aufeinanderfolgenden Maxima.",
    "incorrectMessage": "Vergleichen Sie die Einhüllende an zwei aufeinanderfolgenden Maxima.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "damped-envelope",
            "order": 1,
            "message": "Vergleichen Sie die Einhüllende mit und ohne den Faktor $e^{-\\gamma t}$."
        },
        "answer2": {
            "conceptId": "amplitude-ratio",
            "order": 2,
            "message": "Deuten Sie den Quotienten als Verhältnis aufeinanderfolgender Spitzenwerte."
        },
        "answer3": {
            "conceptId": "amplitude-ratio",
            "order": 2,
            "message": "Deuten Sie den Quotienten als Verhältnis aufeinanderfolgender Spitzenwerte."
        },
        "answer4": {
            "conceptId": "amplitude-ratio",
            "order": 2,
            "message": "Deuten Sie den Quotienten als Verhältnis aufeinanderfolgender Spitzenwerte."
        }
    }
};

export const question6: MultipleChoiceQuestion = {
    questionId: 't3-damped-osc-6-amplitude-ratio',
    question: 'Wie verändert sich der Quotient $e^{-\\gamma T}$, wenn die Dämpfung $\\gamma$ größer wird?',
    options: [
        { value: 'answer1', label: 'Er wird größer als 1, weil die Amplitude wächst.' },
        { value: 'answer2', label: 'Er bleibt gleich, weil die Amplitude unabhängig von der Dämpfung abfällt.' },
        { value: 'answer3', label: 'Er wird exakt 0, weil ein einziges Maximum danach sofort vollständig verschwindet.' },
        { value: 'answer4', label: 'Er wird kleiner, weil es zu einem stärkeren Abfall der Amplitude von einem Maximum zum nächsten kommt.' }
    ],
    correctAnswers: ['answer4'],
    containerId: 't3-damped-osc-6-container',
    successMessage: '✓ Richtig. Wird $\\gamma$ größer, wird der Exponent $-\\gamma T$ negativer. Daher wird $e^{-\\gamma T}$ kleiner und die Amplitude nimmt innerhalb einer Periode stärker ab.',
    incompleteMessage: '✗ Die passende Aussage fehlt noch. Betrachten Sie den Exponenten $-\\gamma T$: Wie verändert er sich, wenn $\\gamma$ größer wird?',
    incorrectMessage: '✗ Die gewählte Aussage passt nicht zum Verlauf der Exponentialfunktion. Vergleichen Sie $e^{-\\gamma T}$ für zwei unterschiedlich große positive Werte von $\\gamma$.',
    answerFeedback: {
        answer1: 'Beachten Sie, dass $e^{-\\gamma T}$ für positive Werte zwischen null und eins liegt.',
        answer2: 'Setzen Sie gedanklich zwei verschieden große Werte für $\\gamma$ in den Exponenten ein.',
        answer3: 'Eine Exponentialfunktion erreicht bei endlichem $\\gamma T$ nicht exakt null.',
        answer4: 'Verknüpfen Sie einen negativeren Exponenten mit einem kleineren Amplitudenverhältnis.'
    }
};

export const question7: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-7-log-dekrement",
    "question": "Im Schwingfall $0<\\gamma<\\omega_0$ gilt für aufeinanderfolgende positive Maxima $a_n,a_{n+1}$: $\\Lambda=\\ln(a_n/a_{n+1})=\\gamma T=2\\pi\\gamma/\\sqrt{\\omega_0^2-\\gamma^2}$. Welche Aussagen gelten bei festem $\\omega_0$?",
    "options": [
        {
            "value": "answer1",
            "label": "Ein größeres logarithmisches Dekrement bedeutet stärkere Dämpfung."
        },
        {
            "value": "answer2",
            "label": "Mit steigender Dämpfung vergrößert sich die Periodendauer $T$."
        },
        {
            "value": "answer3",
            "label": "Ein $\\Lambda$ nahe null bedeutet, dass sich aufeinanderfolgende Amplituden nur wenig unterscheiden."
        },
        {
            "value": "answer4",
            "label": "Mit steigender Dämpfung steigt die gedämpfte Eigenkreisfrequenz $\\omega_e$."
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer3"
    ],
    "containerId": "t3-damped-osc-7-container",
    "successMessage": "$\\Lambda=\\gamma T$ misst den relativen Amplitudenverlust pro Periode. Bei festem $\\omega_0$ wächst es mit der Dämpfung; nahe null unterscheiden sich die aufeinanderfolgenden Amplituden nur wenig.",
    "incompleteMessage": "Vergleichen Sie die Formel für die Periodendauer mit dem Verhältnis aufeinanderfolgender Maxima.",
    "incorrectMessage": "Vergleichen Sie die Formel für die Periodendauer mit dem Verhältnis aufeinanderfolgender Maxima.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "decrement",
            "order": 2,
            "message": "Vergleichen Sie in $\\Lambda=\\ln(a_n/a_{n+1})$ das Amplitudenverhältnis mit eins. Prüfen Sie, wie sich der Logarithmus bei größerem Verhältnis oder bei einem Verhältnis nahe eins verhält."
        },
        "answer3": {
            "conceptId": "decrement",
            "order": 2,
            "message": "Vergleichen Sie in $\\Lambda=\\ln(a_n/a_{n+1})$ das Amplitudenverhältnis mit eins. Prüfen Sie, wie sich der Logarithmus bei größerem Verhältnis oder bei einem Verhältnis nahe eins verhält."
        },
        "answer2": {
            "conceptId": "period-vs-damping",
            "order": 1,
            "message": "Halten Sie $\\omega_0$ fest und erhöhen Sie gedanklich $\\gamma$ innerhalb des Schwingfalls. Prüfen Sie, wie sich dadurch der Nenner in $T=2\\pi/\\sqrt{\\omega_0^2-\\gamma^2}$ verändert. Leiten Sie daraus ab, ob die Periodendauer größer oder kleiner wird."
        },
        "answer4": {
            "conceptId": "period-vs-damping",
            "order": 1,
            "message": "Halten Sie $\\omega_0$ fest und erhöhen Sie gedanklich $\\gamma$ innerhalb des Schwingfalls. Prüfen Sie, wie sich dadurch der Nenner in $T=2\\pi/\\sqrt{\\omega_0^2-\\gamma^2}$ verändert. Leiten Sie daraus ab, ob die Periodendauer größer oder kleiner wird."
        }
    }
};

export const question8: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-8-aper-grenzfall",
    "question": "Welche Aussagen gelten für den aperiodischen Grenzfall $\\gamma=\\omega_0$ im vereinfachten linearen Modell? Für den Rückkehrvergleich seien $\\omega_0$, $x(0)=A>0$ und $\\dot{x}(0)=0$ gleich.",
    "options": [
        {
            "value": "answer1",
            "label": "Bei diesen Anfangsbedingungen kehrt das System schneller zur Ruhelage zurück als im Kriechfall ($\\gamma>\\omega_0$)."
        },
        {
            "value": "answer2",
            "label": "Die Grenzfalllösung ist bei beliebigen Anfangsbedingungen stets eine reine Exponentialfunktion."
        },
        {
            "value": "answer3",
            "label": "Die Lösungen der Bestimmungsgleichung sind reell und verschieden."
        },
        {
            "value": "answer4",
            "label": "Die allgemeine Lösung lautet $x(t) = (c_1 t + c_2)e^{-\\gamma t}$."
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer4"
    ],
    "containerId": "t3-damped-osc-8-container",
    "successMessage": "Die doppelte Nullstelle führt zu $(c_1t+c_2)e^{-\\gamma t}$. Im vereinfachten Modell kehrt das aus gleicher Auslenkung und aus der Ruhe gestartete System schneller zurück als im Kriechfall.",
    "incompleteMessage": "Setzen Sie die Grenzfallbedingung in die Nullstellen ein und vergleichen Sie die Rückkehr bei gleichen Anfangsbedingungen.",
    "incorrectMessage": "Setzen Sie die Grenzfallbedingung in die Nullstellen ein und vergleichen Sie die Rückkehr bei gleichen Anfangsbedingungen.",
    "answerFeedback": {
        "answer2": {
            "conceptId": "double-root-solution",
            "order": 1,
            "message": "Setzen Sie zuerst $\\gamma=\\omega_0$ in $\\lambda_{1,2}=-\\gamma\\pm\\sqrt{\\gamma^2-\\omega_0^2}$ ein und vergleichen Sie die beiden Nullstellen. Bei einer doppelten Nullstelle benötigt die allgemeine Lösung neben $e^{-\\gamma t}$ auch $t e^{-\\gamma t}$, damit zwei Anfangsbedingungen eingestellt werden können."
        },
        "answer3": {
            "conceptId": "double-root-solution",
            "order": 1,
            "message": "Setzen Sie zuerst $\\gamma=\\omega_0$ in $\\lambda_{1,2}=-\\gamma\\pm\\sqrt{\\gamma^2-\\omega_0^2}$ ein und vergleichen Sie die beiden Nullstellen. Bei einer doppelten Nullstelle benötigt die allgemeine Lösung neben $e^{-\\gamma t}$ auch $t e^{-\\gamma t}$, damit zwei Anfangsbedingungen eingestellt werden können."
        },
        "answer4": {
            "conceptId": "double-root-solution",
            "order": 1,
            "message": "Setzen Sie zuerst $\\gamma=\\omega_0$ in $\\lambda_{1,2}=-\\gamma\\pm\\sqrt{\\gamma^2-\\omega_0^2}$ ein und vergleichen Sie die beiden Nullstellen. Bei einer doppelten Nullstelle benötigt die allgemeine Lösung neben $e^{-\\gamma t}$ auch $t e^{-\\gamma t}$, damit zwei Anfangsbedingungen eingestellt werden können."
        },
        "answer1": {
            "conceptId": "return-comparison",
            "order": 2,
            "message": "Vergleichen Sie den Grenzfall und den Kriechfall unter denselben Anfangsbedingungen."
        }
    }
};

export const question9: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-9-summary-matching",
    "question": "Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Kennzeichen und Dämpfungsfall sind korrekt?",
    "options": [
        {
            "value": "answer1",
            "label": "$\\gamma = \\omega_0$ → Aperiodischer Grenzfall"
        },
        {
            "value": "answer2",
            "label": "$\\gamma>\\omega_0$ → Kriechfall"
        },
        {
            "value": "answer3",
            "label": "$0<\\gamma<\\omega_0$, $\\omega_e=\\sqrt{\\omega_0^2-\\gamma^2}$ → Schwingfall"
        },
        {
            "value": "answer4",
            "label": "$\\gamma = \\omega_0$ → Kriechfall"
        },
        {
            "value": "answer5",
            "label": "$\\gamma>\\omega_0$ → Aperiodischer Grenzfall"
        }
    ],
    "correctAnswers": [
        "answer1",
        "answer2",
        "answer3"
    ],
    "containerId": "t3-damped-osc-9-container",
    "successMessage": "Die drei Fälle folgen aus dem Vergleich von Dämpfungskoeffizient und Eigenkreisfrequenz. Er bestimmt, ob die Nullstellen komplex, doppelt oder reell verschieden sind.",
    "incompleteMessage": "Vergleichen Sie jede Bedingung mit der Fallübersicht oberhalb der Frage.",
    "incorrectMessage": "Vergleichen Sie jede Bedingung mit der Fallübersicht oberhalb der Frage.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "critical-vs-overdamped",
            "order": 2,
            "message": "Unterscheiden Sie die Gleichheit $\\gamma=\\omega_0$ von der Überdämpfung $\\gamma>\\omega_0$."
        },
        "answer4": {
            "conceptId": "critical-vs-overdamped",
            "order": 2,
            "message": "Unterscheiden Sie die Gleichheit $\\gamma=\\omega_0$ von der Überdämpfung $\\gamma>\\omega_0$."
        },
        "answer5": {
            "conceptId": "critical-vs-overdamped",
            "order": 2,
            "message": "Unterscheiden Sie die Gleichheit $\\gamma=\\omega_0$ von der Überdämpfung $\\gamma>\\omega_0$."
        },
        "answer2": {
            "conceptId": "overdamped-return",
            "order": 3,
            "message": "Vergleichen Sie die Rückkehr zur Ruhelage für $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$."
        },
        "answer3": {
            "conceptId": "oscillatory-case",
            "order": 1,
            "message": "Prüfen Sie, wann $\\omega_0^2-\\gamma^2$ positiv und $\\omega_e$ reell ist."
        }
    }
};

export const question10: MultipleChoiceQuestion = {
    "questionId": "t3-damped-osc-10-gebaude",
    "question": "Ein Gebäude werde vereinfachend als linearer Oszillator mit einem Freiheitsgrad modelliert. Nach einer Auslenkung startet es aus der Ruhe; $\\omega_0$ ist fest. Welcher Dämpfungsfall ermöglicht im Modell die schnellste Rückkehr ohne Nachschwingen?",
    "options": [
        {
            "value": "answer1",
            "label": "Eine Kombination aus Schwingfall und Kriechfall, da beide ähnlich reagieren."
        },
        {
            "value": "answer2",
            "label": "Schwingfall, da die Auslenkung gleichmäßig verteilt wird."
        },
        {
            "value": "answer3",
            "label": "Aperiodischer Grenzfall, da das Gebäude möglichst schnell in die Ruhelage zurückkehrt, ohne nachzuschwingen."
        },
        {
            "value": "answer4",
            "label": "Kriechfall, da die Bewegung langsam abklingt und weiche Bewegungen entstehen."
        }
    ],
    "correctAnswers": [
        "answer3"
    ],
    "containerId": "t3-damped-osc-10-container",
    "successMessage": "Für dieses vereinfachte Modell erreicht der Grenzfall bei Start aus der Ruhe die schnellste Rückkehr ohne Nachschwingen. Die Auslegung realer Gebäude erfordert weitere Eigenschaften und Belastungen.",
    "incompleteMessage": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$.",
    "incorrectMessage": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$.",
    "answerFeedback": {
        "answer1": {
            "conceptId": "damping-cases",
            "order": 1,
            "message": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$."
        },
        "answer2": {
            "conceptId": "damping-cases",
            "order": 1,
            "message": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$."
        },
        "answer3": {
            "conceptId": "damping-cases",
            "order": 1,
            "message": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$."
        },
        "answer4": {
            "conceptId": "damping-cases",
            "order": 1,
            "message": "Im vereinfachten Modell schließen sich Schwingfall, aperiodischer Grenzfall und Kriechfall bei festen Parametern gegenseitig aus. Gesucht ist der nicht schwingende Fall, der bei vergleichbaren Anfangsbedingungen am schnellsten zur Ruhelage zurückkehrt. Vergleichen Sie dafür die Bedingungen $\\gamma<\\omega_0$, $\\gamma=\\omega_0$ und $\\gamma>\\omega_0$."
        }
    }
};
