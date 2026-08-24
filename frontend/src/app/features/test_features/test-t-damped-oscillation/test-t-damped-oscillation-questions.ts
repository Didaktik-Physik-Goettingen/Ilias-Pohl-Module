export const question1 = {
    questionId: 'test-t-damped-osc-1-daempfungsstaerke',
    question: `Sortieren Sie die drei Graphen entsprechend der Größe der Dämpfungskonstante. Beginnen Sie oben mit der niedrigsten Dämpfungskonstante.`,
    questionInstruction: 'Frage 1 von 5 (30 Punkte): Sortierung Dämpfungskonstante',
    images: [
        { id: 'weak', imageSrc: 'assets/images/test_e_damped_oscillations/weak_damping_1.png', label: 'Schwingung A' },
        { id: 'medium', imageSrc: 'assets/images/test_e_damped_oscillations/medium_damping_1.png', label: 'Schwingung B' },
        { id: 'strong', imageSrc: 'assets/images/test_e_damped_oscillations/strong_damping_1.png', label: 'Schwingung C' }
    ],
    correctOrder: ['weak', 'medium', 'strong'],
    maxPoints: 30,
    containerId: 'test-question1-container'
};

export const question2 = {
    questionId: 'test-t-damped-osc-2-federkonstante',
    question: `Welchen Einfluss hat die Federkonstante auf eine Schwingung?<br>
		  Sortieren Sie die Graphen nach der Größe der Federkonstante.
		  Sortieren Sie die Graphen absteigend, indem Sie den Graphen mit der größten Federkonstante nach oben einsortieren (andere Variablen sind konstant gehalten).`,
    questionInstruction: 'Frage 2 von 5 (30 Punkte): Sortierung Federkonstante',
    images: [
        { id: 'weak', imageSrc: 'assets/images/test_e_damped_oscillations/weak_spring_constant_2.png', label: 'Schwingung A' },
        { id: 'medium', imageSrc: 'assets/images/test_e_damped_oscillations/medium_spring_constant_2.png', label: 'Schwingung B' },
        { id: 'strong', imageSrc: 'assets/images/test_e_damped_oscillations/strong_spring_constant_2.png', label: 'Schwingung C' }
    ],
    correctOrder: ['strong', 'medium', 'weak'],
    maxPoints: 30,
    containerId: 'test-question2-container'
};

export const question3 = {
    questionId: 'test-t-damped-osc-3-frequency-damping',
    question: `Welchen Einfluss hat eine größere Dämpfung auf die Frequenz der Schwingung?<br>
      Sei $\\omega_1$ die Schwingungsfrequenz bei einer niedrigen Dämpfung und $\\omega_2$ die Schwingungsfrequenz bei einer stärkeren Dämpfung.
      Was gilt dann für das Verhältnis zwischen den beiden Schwingungsfrequenzen?`,
    questionInstruction: 'Frage 3 von 5 (10 Punkte): Zusammenhang Frequenz und Dämpfungskonstante',
    options: [
        { value: 'answer1', label: '$\\omega_1<\\omega_2$.' },
        { value: 'answer2', label: '$\\omega_1>\\omega_2$.' },
        { value: 'answer3', label: 'Die Frequenz ist unanhängig von der Dämpfung.' },
    ],
    correctAnswer: 'answer2',
    maxPoints: 10,
    containerId: 'test-question3-container'
};

export const question4 = {
    questionId: 'test-t-damped-osc-4-log-decrement',
    question: `Das logarithmische Dekrement $\\Lambda$ ist eine Hilfsgröße, die man zur Beschreibung gedämpfter Schwingungen verwendet.
			Das logarithmische Dekrement ergibt sich hierbei in folgender Weise aus dem Verhältnis zwischen Amplituden einer gedämpften Schwingung, die zeitlich genau eine Schwingung auseinanderliegen:
			$$\\Lambda = \\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right).$$
			Hierbei beschreibt $\\varphi(t)$ die Auslenkung aus der Ruhelage und $T$ die Periodendauer.
			Was kann über das logarithmische Dekrement bestimmt werden? Markieren Sie alle physikalischen Größen, die direkt mit dem logarithmischen Dekrement zusammenhängen.`,
    questionInstruction: 'Frage 4 von 5 (20 Punkte): LogarithmischesDekrement',
    options: [
        { value: 'eigenfrequency', label: 'Die Eigenfrequenz des schwingenden Systems $\\omega_0$.' },
        { value: 'half_life', label: 'Die Halbwertszeit $t_{1/2}$.' },
        { value: 'period', label: 'Die Periodendauer $T$.' },
        { value: 'damping', label: 'Die Dämpfungskonstante $\\gamma$.' }
    ],
    correctAnswers: ['half_life', 'damping'],
    maxPoints: 20,
    pointsPerCorrectClick: 5,
    containerId: 'test-question4-container'
};

export const question5 = {
    questionId: 'test-t-damped-osc-5-phase-space',
    question: `Man unterscheidet bei Schwingungen zwischen qualitativ unterschiedlichen Formen: dem Schwingfall, dem aperiodischen Grenzfall und dem Kriechfall.<br>
    Ordnen Sie die Bezeichnungen und die Bedingungen für das Verhältnis von Eigenschwingfrequenz $\\omega_0$ und Dämpfungskonstante $\\gamma$ den entsprechenden Graphen zu.`,
    questionInstruction: 'Frage 5 von 5 (60 Punkte): Zuordnung Bewegungsformen mit Dämpfung',
    containers: [
        {
            id: 'aperiodic',
            imageSrc: 'assets/images/test_e_damped_oscillations/aperiodisch.png',
            imageAlt: 'Spirale 1',
            correctAnswerIds: ['omega_eq_gamma', 'aperiod'],
            assignedAnswerIds: []
        },
        {
            id: 'kriechfall',
            imageSrc: 'assets/images/test_e_damped_oscillations/kriechfall.png',
            imageAlt: 'Spirale 2',
            correctAnswerIds: ['omega_sm_gamma', 'kriech'],
            assignedAnswerIds: []
        },
        {
            id: 'schwingfall',
            imageSrc: 'assets/images/test_e_damped_oscillations/schwingfall.png',
            imageAlt: 'Spirale 3',
            correctAnswerIds: ['omega_gr_gamma', 'schwing'],
            assignedAnswerIds: []
        }
    ],
    answers: [
        { id: 'omega_sm_gamma', label: '$\\omega_0^2<\\gamma^2$' },
        { id: 'omega_eq_gamma', label: '$\\omega_0^2=\\gamma^2$' },
        { id: 'omega_gr_gamma', label: '$\\omega_0^2>\\gamma^2$' },
        { id: 'aperiod', label: 'Aperiodischer Grenzfall' },
        { id: 'kriech', label: 'Kriechfall' },
        { id: 'schwing', label: 'Schwingfall' },
    ],
    maxPoints: 45,
    containerId: 'test-question5-container'
};
