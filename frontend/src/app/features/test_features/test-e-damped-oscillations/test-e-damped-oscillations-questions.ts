export const question1 = {
    questionId: 'test-e-damped-osc-1-daempfungsstaerke',
    question: `Bei dem Versuch können Sie die Dämpfung darüber anpassen, dass Sie den Überlappbereich zwischen einem Magneten (eines Magnetfelds) und der Schwungscheibe variieren.
			Ziehen Sie die Bilder in die richtige Reihenfolge (stärkste Dämpfung oben, schwächste unten).`,
    questionInstruction: 'Frage 1 von 5 (30 Punkte): Sortierung Dämpfungskonstante',
    images: [
        { id: 'weak', imageSrc: 'assets/images/test_e_damped_oscillations/weak_damping_1.png', label: 'Schwingung A' },
        { id: 'medium', imageSrc: 'assets/images/test_e_damped_oscillations/medium_damping_1.png', label: 'Schwingung B' },
        { id: 'strong', imageSrc: 'assets/images/test_e_damped_oscillations/strong_damping_1.png', label: 'Schwingung C' }
    ],
    correctOrder: ['strong', 'medium', 'weak'],
    maxPoints: 30,
    containerId: 'test-question1-container'
};

export const question2 = {
    questionId: 'test-e-damped-osc-2-federkonstante',
    question: `Im Versuch ist eine feste Feder eingebaut, die Federkonstante kann also nicht varriert werden. Was würde aber passieren, wenn man die Federkonstante variieren könnte?
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
    questionId: 'test-e-damped-osc-3-frequency-damping',
    question: `Sie haben in einer ersten Messung einer gedämpften Schwingung gesehen, dass das Schwungrad mit einer Frequenz von $\\omega_1=0.3$ Hz geschwungen ist.
			Nun hat ihr*e Praktikumspartner*in die Wirbelstrombremse weiter über das Schwungrad bewegt - sie erwarten also eine größere Dämpfung.
			Mit welcher Frequenz $\\omega_2$ erwarten Sie nun das Schwungrad zu schwingen?`,
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
    questionId: 'test-e-damped-osc-4-log-decrement',
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
    questionId: 'test-e-damped-osc-5-phase-space',
    question: `Der Phasenraum beschreibt mögliche Zustände, die ein System annehmen kann über die Angabe der Raum- und einer Geschwindigkeitskoordinate.
		Für das Pohlsche Rad kann die Bewegung des Schwungrads angegeben werden über den Auslenkwinkel $\\phi$ und die Winkelgeschwindigkeit $\\dot{\\phi}$.

		Ordnen Sie den gezeigten Phasenraumdarstellungen die korrekten Anfangsbedingungen und Dämpfungskonstanten zu.`,
    questionInstruction: 'Frage 5 von 5 (60 Punkte): Zuordnung Phasenraum',
    containers: [
        {
            id: 'spiral1',
            imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral1_5.png',
            imageAlt: 'Spirale 1',
            correctAnswerIds: ['phi_gr_zero', 'phi_dot_eq_zero', 'gamma_weak'],
            assignedAnswerIds: []
        },
        {
            id: 'spiral2',
            imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral2_5.png',
            imageAlt: 'Spirale 2',
            correctAnswerIds: ['phi_sm_zero', 'phi_dot_gr_zero', 'gamma_medium'],
            assignedAnswerIds: []
        },
        {
            id: 'spiral3',
            imageSrc: 'assets/images/test_e_damped_oscillations/phase_space_spiral3_5.png',
            imageAlt: 'Spirale 3',
            correctAnswerIds: ['phi_eq_zero', 'phi_dot_sm_zero', 'gamma_strong'],
            assignedAnswerIds: []
        }
    ],
    answers: [
        { id: 'phi_sm_zero', label: '$\\phi(0)<0$' },
        { id: 'phi_eq_zero', label: '$\\phi(0)=0$' },
        { id: 'phi_gr_zero', label: '$\\phi(0)>0$' },
        { id: 'phi_dot_sm_zero', label: '$\\dot{\\phi}(0)<0$' },
        { id: 'phi_dot_eq_zero', label: '$\\dot{\\phi}(0)=0$' },
        { id: 'phi_dot_gr_zero', label: '$\\dot{\\phi}(0)>0$' },
        { id: 'gamma_weak', label: '$\\gamma=0.1$' },
        { id: 'gamma_medium', label: '$\\gamma=0.4$' },
        { id: 'gamma_strong', label: '$\\gamma=0.8$' },
    ],
    maxPoints: 60,
    containerId: 'test-question5-container'
};
