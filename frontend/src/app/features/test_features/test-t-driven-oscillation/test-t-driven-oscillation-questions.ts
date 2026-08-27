export const question1 = {
    questionId: 'test-t-driven-osc-1-gesamtgleichung',
    question: `Die Gesamtlösung für den getriebenen, gedämpften harmonischen Oszillator kann in folgender Weise geschrieben werden:<br><br>
    \$\\varphi(t) = {\\varphi_0 \\cos(\\omega_e t + \\Phi) \\mathrm{e}^{-\\beta t}}+ { \\frac{N}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}} \\cos\\left(\\omega t - \\arctan\\left(\\frac{2\\beta\\omega}{\\omega_0^2 - \\omega^2}\\right) \\right)} ,\$<br><br>
    wobei $\\varphi(t)$ die Winkelauslenkung, $\\omega_0$ bzw. $\\omega_e$ die Eigenfrequenz des ungedämpften bzw. gedämpften Oszillators, $\\beta$ die Dämpfungskonstante, $N$ und $\\omega$ die Amplitude und Frequenz des Antriebs beschreiben. $\\varphi_0\$ und $\\Phi\$ sind Hilfsgrößen, die sich aus den Anfangsbedingungen ergeben.<br><br>
    Welche der Aussagen zu dieser Gesamtlösung sind korrekt? `,
    questionInstruction: 'Frage 1 von 4 (35 Punkte): Analyse der Gleichung',
    statements: [
        { id: 'first_ext', text: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne äußeren Antrieb.', isCorrect: true },
        { id: 'first_damp', text: 'Der erste Summand beschreibt die Dynamik des Schwungrads ohne Dämpfung.', isCorrect: false },
        { id: 'first_time', text: 'Der erste Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.', isCorrect: true },
        { id: 'second_time', text: 'Der zweite Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.', isCorrect: false },
        { id: 'init_vel', text: 'Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Schwungrads zu allen Zeiten.', isCorrect: false },
        { id: 'damp_frequ', text: 'Die Dämpfung spielt für die Schwingungsfrequenz des gedämpft schwingenden Rades nach einer bestimmten Zeit kaum noch eine Rolle. Entscheidend ist nur, mit welcher Frequenz der Antrieb das Rad schwingen lässt.', isCorrect: true },
        { id: 'const', text: 'Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch.', isCorrect: false }
    ],
    maxPoints: 35,
    pointsPerCorrectClick: 5,
    containerId: 'test-question1-container'
};

export const question2 = {
    questionId: 'test-t-driven-osc-2-einschwingen',
    question: `Bei einer gedämpften, getriebenen Schwingung, gibt es zunächst eine sogenannte Einschwingphase, bevor sich eine stationäre Schwingung stabilisiert. Wann die Einschwingphase abgeschlossen ist, kann man sehr gut an der Phasenraumdarstellung ablesen.
Im folgenden sind vier Phasenraumdiagramme für unterschiedliche Anfangsbedingungen und Einstellungen gezeigt. Der erste Messwert ist jeweils mit einem grauen, der letzte mit einem roten Kreuz markiert.<br><br>
Bei welcher der Graphen ist der Einschwingvorgang abgeschlossen?`,
    questionInstruction: 'Frage 2 von 4 (5 Punkte): Einschwingvorgang abgeschlossen?',
    options: [
        { value: 'osc1', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_JA.png', label: 'Schwingung A' },
        { value: 'osc2', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_NEIN1.png', label: 'Schwingung B' },
        { value: 'osc3', imageSrc: 'assets/images/test_t_driven_oscillations/Einschwingvorgang_NEIN2.png', label: 'Schwingung C' }
    ],
    correctAnswer: 'osc1',
    maxPoints: 5,
    containerId: 'test-question2-container'
};

export const question3 = {
    questionId: 'test-t-driven-osc-3-resonance-freq',
    question: `Die folgenden Graphen zeigen "Resonanzkurven" für die Amplitude der Schwingung (nach dem Einschwingvorgang).
    Sie zeigen hierbei das Ergebnis mehrerer Messungen. Bei den Messungen wird jeweils die Frequenz verändert und die Amplitude des Schwungkörpers nach dem Einschwingvorgang gemessen.
    Die Amplitude des Antriebs und die Dämpfung sind über die Messungen konstant gehalten.<br><br>
    Bei welcher der unten stehenden Abbildungen ist die x-Achsenskalierung korrekt? (Beachten Sie die Beschriftung der x-Achse)`,
    questionInstruction: 'Frage 3 von 4 (10 Punkte): Zusammenhang Frequenz und Schwingungsamplitude - Resonanzkurve',
    options: [
        { value: 'answer1', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_1.png', label: 'Resonanzkurve A' },
        { value: 'answer2', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_2.png', label: 'Resonanzkurve B' },
        { value: 'answer3', imageSrc: 'assets/images/test_t_driven_oscillations/Resonanzkurve_3.png', label: 'Resonanzkurve C' },
    ],
    correctAnswer: 'answer2',
    maxPoints: 10,
    containerId: 'test-question3-container'
};

export const question4 = {
    questionId: 'test-t-driven-osc-4-resonance-damping',
    question: `Wie verändert sich die Messung, wenn Sie die Dämpfung des Systems vergrößern? <br>
    Überlegen Sie was passiert, wenn man nur die Dämpfung ändert und alle anderen konstant hält.<br><br>
    Welche der folgenden Aussagen sind korrekt?<br><br>
    Je größer die Dämpfung, desto ... `,
    questionInstruction: 'Frage 4 von 4 (30 Punkte): Einfluss der Dämpfung',
    statements: [
        { id: 'answer1', text: '... größer die Resonanzfrequenz.', isCorrect: false },
        { id: 'answer2', text: '... kleiner ist der Phasenversatz zwischen der Schwingung des Antriebs und der des Schwungrads bei großen Frequenzen ($\\omega > \\omega_0$).', isCorrect: false },
        { id: 'answer3', text: '... breiter der Resonanzpeak der Amplitude.', isCorrect: true },
        { id: 'answer4', text: '... größer die Resonanzfrequenz.', isCorrect: false },
        { id: 'answer5', text: '... größer die Amplitude bei der Resonanzfrequenz.', isCorrect: false },
        { id: 'answer6', text: '... größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz des ungedämpften Systems ($\\omega_0$).', isCorrect: true },
    ],
    maxPoints: 30,
    pointsPerCorrectClick: 5,
    containerId: 'test-question4-container'
};
