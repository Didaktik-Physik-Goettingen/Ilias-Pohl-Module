import { MultipleChoiceImageQuestion, MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceImageQuestion = {
    questionId: 'intro-exp-1-schwungrad',
    imageSrc: 'assets/images/e1_intro_experiment/schwungrad_2.png',
    imageAlt: 'Schwungrad',
    question: 'Welche der Aussagen in Bezug auf das Schwungrad sind richtig?',
    options: [
        { value: 'answer1', label: 'Das Schwungrad setzt das System in Bewegung.' },
        { value: 'answer2', label: 'Die Form des Schwungkörpers beeinträchtigt den Versuch. Nur durch die zylinderförmige Form ist eine harmonische Bewegung möglich.' },
        { value: 'answer3', label: 'Solange der Schwungkörper sich um seinen Schwerpunkt dreht, spielt die exakte Form keine Rolle.' },
        { value: 'answer4', label: 'Das Schwungrad dient als träger Körper, dessen Bewegung untersucht wird.' }
    ],
    correctAnswers: ['answer3', 'answer4'],
    containerId: 'question1-container',
    successMessage: `✓ Völlig richtig.<br><br>
			Die Bewegung des Schwungrads wird untersucht, wenn es "von außen" angetrieben wird.
			Der Schwungkörper muss kein Zylinder sein, wenn Sie sich das Bild des Versuchsaufbaus anschauen, dann ist auch dies kein Zylinder.
			Der Schwungkörper muss nicht einmal rotationssymmetrisch sein. Wichtig ist aber, dass er im Schwerpunkt aufgehängt ist.
			Wäre er nicht im Schwerpunkt aufgehängt, würde aufgrund der Schwerkraft ein zusätzliches Drehmoment auf den Schwungkörper wirken.
			Dieses zusätzliche Drehmoment würde die Bewegung beeinflussen.
			Unter Umständen führt das Hinzufügen zusätzlicher Massestücke an das Schwungrad bei diesem Versuchsaufbau zu chaotischem Verhalten.<br><br>

			Das zusätzliche Hinzufügen einer Masse kann man allerdings auch nutzen, um den Versuchsaufbau näher zu charakterisieren.
			Hierzu erfahren Sie mehr auf den folgenden Seiten.`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>
			Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus?
			Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
			Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>
			Betrachten Sie noch einmal den Versuchsaufbau. Welche Rolle übernimmt das Schwungrad? Wie sieht das Schwungrad aus?
			Welche Eigenschaften erfüllt das Schwungrad und welche nicht?
			Überlegen Sie sich, was die physikalischen Begründungen für dieses Aussehen sein könnten.`
};

export const question2: MultipleChoiceImageQuestion = {
    questionId: 'intro-exp-2-feder',
    imageSrc: 'assets/images/e1_intro_experiment/feder_2.png',
    imageAlt: 'Feder',
    question: 'Welche Aussage über die Feder ist korrekt?',
    options: [
        { value: 'answer1', label: 'Die Feder ist für den Versuch nur notwendig, wenn man auch den externen Antrieb verwendet.' },
        { value: 'answer2', label: 'Die Feder sorgt für ein rücktreibendes Drehmoment.' },
        { value: 'answer3', label: 'Die Feder führt zu kontinuierlichen Dämpfung des Schwungrads.' },
    ],
    correctAnswers: ['answer2'],
    containerId: 'question2-container',
    successMessage: `✓ Korrekt, die Feder bedingt ein rücktreibendes Drehmoment, das von der Auslenkung aus der Ruhelage abhängt.
			Das rücktreibende Drehmoment $M$ kann mathematisch beschrieben werden als
			$$M = -D^*\\varphi.$$
			Hierbei ist $D^*$ das Direktionsmoment (auch als Winkelrichtgröße bezeichnet) und $\\varphi$
			beschreibt die Auslenkung aus der Ruhelage.`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.`
};

export const question3: MultipleChoiceImageQuestion = {
    questionId: 'intro-exp-3-wirbelstrombremse',
    imageSrc: 'assets/images/e1_intro_experiment/wirbelstrombremse_2.png',
    imageAlt: 'Wirbelstrombremse',
    question: `Zur Dämpfung wird in diesem Versuchsaufbau ein Magnet verwendet,
			der so verschoben werden kann, dass er das Rad (mit Abstand, also nicht wie eine Scheibenbremse) umschließt.
			Welche der Aussagen über die Wirbelstrombremse sind korrekt?`,
    options: [
        { value: 'answer1', label: 'Ohne die Wirbelstrombremse würde das Schwungrad unendlich lange weiterschwingen.' },
        { value: 'answer2', label: 'Das Material des Schwungrads bedingt die Wirkung der Wirbelstrombremse.' },
        { value: 'answer3', label: 'Die Wirbelstrombremse ist direkt von der Auslenkung des Schwungrads abhängig.' },
    ],
    correctAnswers: ['answer2'],
    containerId: 'question3-container',
    successMessage: `✓ Genau richtig.<br><br>
			Damit die Wirbelstrombremse zu einer Dämpfung des Systems führen kann, muss das Schwungrad aus einem leitenden Material bestehen.
			Die Wirbelstrombremse funktioniert über das Prinzip der Induktion --- je nach Stärke des Magnetfeldes der
			Wirbelstrombremse wird das Schwungrad stärker abgedämpft in seiner Bewegung.
			Die Dämpfung ist hierbei linear zur Bewegungsgeschwindigkeit des Rads durch das Magnetfeld. Die Wirbelstrombremse bewirkt also ein bremsendes Moment
			$$M=-\\rho\\dot{\\varphi},$$
			wobei $\\rho$ der Reibungskoeffizient und $\\dot{\\varphi}$ die Winkelgeschwindigkeit sind.<br><br>
			Im Versuch ist die Wirbelstrombremse durch einen Magneten realisiert.
			Sie können die Dämpfung des Rades variieren, indem Sie den Magneten weiter über das Rad schieben.
			Je größer der Bereich der Rads, den das Magnetfeld beeinträchtigt, desto stärker ist die dämpfende Wirkung.<br><br>

			Wenn Sie mehr über die Funktionsweise der Wirbelstrombremse erfahren möchten, dann können Sie sich hier informieren.`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.`
};

export const question4: MultipleChoiceQuestion = {
    questionId: 'intro-exp-4-direktionsmoment',
    question: `Welche Informationen über den Versuchsaufbau benötigen Sie bzw. welche Größen müssen Sie messen, um das Direktionsmoment $D$ der Feder zu bestimmen?`,
    options: [
        { value: 'answer1', label: 'Frequenz der Schwingung $\\omega$.' },
        { value: 'answer2', label: 'Radius des Schwungrads $R$.' },
        { value: 'answer3', label: 'Masse des Schwungrads $m_\\mathrm{Rad}$.' },
        { value: 'answer4', label: 'Auslenkwinkel $\\varphi$.' },
        { value: 'answer5', label: 'Abstand zwischen Aufhängung der Masse und Mittelpunkt des Schwungrads $R$.' },
        { value: 'answer6', label: 'Masse der Zusatzmassen $m_{zm}$.' },
        { value: 'answer7', label: 'Trägheitsmoment des Schwungrads $\\theta$.' },
    ],
    correctAnswers: ['answer4', 'answer5', 'answer6'],
    containerId: 'question4-container',
    successMessage: `✓ Korrekt.<br><br>
			indem Sie den Auslenkwinkel für unterschiedliche Massenstücke messen können Sie mit Hilfe der Angabe des Abstands zwischen Aufhängung der
			Masse und Aufhängung des Schwungrads das wirkende Drehmoment bestimmen.
			Das Direktionsmoment der Feder können Sie hieraus bestimmen.`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>Betrachten Sie noch einmal die relevanten Formeln.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>Betrachten Sie noch einmal die relevanten Formeln.`
};

export const question5: ImageChoiceQuestion = {
    questionId: 'intro-exp-5-winkel-drehmoment',
    question: 'Welchen Zusammenhang zwischen dem Winkel $\\varphi$ und dem Drehmoment $M$ erwarten Sie bei der Messung?',
    options: [
        { value: 'answer1', imageSrc: 'assets/images/e1_intro_experiment/angle_over_moment_option1_3.png' },
        { value: 'answer2', imageSrc: 'assets/images/e1_intro_experiment/angle_over_moment_option2_3.png' },
        { value: 'answer3', imageSrc: 'assets/images/e1_intro_experiment/angle_over_moment_option3_3.png' },
    ],
    correctAnswers: ['answer2'],
    containerId: 'question5-container',
    successMessage: `✓ Richtig, der Zusammenhang sollte etwa linear sein - je größer das wirkende Drehmoment, desto stärker wird das Rad ausgelenkt.
			Es gilt der Zusammenhang $M=\\varphi D$.<br><br>
			Das Drehmoment kann nicht direkt im Versuch gemessen/variiert werden, Sie können aber durch das Anhängen unterschiedlicher Massekörper ein Drehmoment erzeugen.`,
    incompleteMessage: `✗ Überlegen Sie sich, was passiert, wenn Sie unterschiedliche Massestücke an eine "normale" Feder hängen. Wie reagiert die Feder, wenn Sie die Masse verdoppeln?`,
    incorrectMessage: `✗ Überlegen Sie sich, was passiert, wenn Sie unterschiedliche Massestücke an eine "normale" Feder hängen. Wie reagiert die Feder, wenn Sie die Masse verdoppeln?`
};

export const question6: ImageChoiceQuestion = {
    questionId: 'intro-exp-6-winkel-zeit',
    question: `
		Die unten angezeigten Graphen zeigen zeitliche Entwicklungen der Winkelauslenkung (Winkel $\\varphi$) des Schwungrads.<br><br>
		Welcher dieser Graphen sind "realistisch"? Welche der folgenden Graphen könnten bei einem realen Versuch enstehen, wenn Sie davon ausgehen,
		dass das Rad zu Beginn um den Winkel $\\varphi_0=10^\\circ$ ausgelenkt und einfach losgelassen wurde (Anfangsgeschwindigkeit $\\dot{\\varphi_0}=10^\\circ$)?<br>
		Gehen Sie davon aus, dass das Schwungrad in seinem Schwerpunkt aufgehängt und das Magnetfeld der Wirbelstrombremse jeweils auf einen festen Wert
		(unterschiedliche Einstellungen bei den unterschiedlichen Antwortmöglichkeiten) eingestellt ist.`,
    options: [
        { value: 'answer1', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option1_4.png' },
        { value: 'answer2', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option2_4.png' },
        { value: 'answer3', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option3_4.png' },
        { value: 'answer4', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option4_4.png' },
        { value: 'answer5', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option5_4.png' },
        { value: 'answer6', imageSrc: 'assets/images/e1_intro_experiment/phi_over_t_option6_4.png' },
    ],
    correctAnswers: ['answer3', 'answer4', 'answer6'],
    containerId: 'question6-container',
    successMessage: `Sehr gut! Das gedämpfte Schwungrad schwingt mit einer festen Frequenz und hat eine abnehmende Amplitude. Das war ein guter Start.`,
    incompleteMessage: `✗ Einige der von die ausgewählten Bewegungsformen entsprechen nicht dem, was man aus einem Experiment erwarten würde.`,
    incorrectMessage: `✗ Einige der von die ausgewählten Bewegungsformen entsprechen nicht dem, was man aus einem Experiment erwarten würde.`
};
