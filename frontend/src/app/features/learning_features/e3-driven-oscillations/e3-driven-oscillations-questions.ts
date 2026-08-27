import { SingleChoiceQuestion, MultipleChoiceQuestion, ImageChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: SingleChoiceQuestion = {
    questionId: 'e3-driven-osc-1-dgl-loesen',
    question: 'Welcher Grundgedanke hilft weiter, um diese Differentialgleichung zu lösen?',
    options: [
        { value: 'answer1', label: '$\\varphi_\\mathrm{gesamt}(t)=\\varphi_\\mathrm{homogen}(t)+\\varphi_\\mathrm{spezial}(t)$' },
        { value: 'answer2', label: '$\\varphi_\\mathrm{gesamt}(t)\\propto\\alpha\\varphi_\\mathrm{homogen}(t)$' },
        { value: 'answer3', label: '$\\varphi_\\mathrm{gesamt}(t)$ kann man nur erraten.' },
        { value: 'answer4', label: 'Ich habe keine Ahnung. Was ist eine "inhomogene Differentialgleichung"?' }
    ],
    correctAnswer: 'answer1',
    containerId: 'question1-container',
    successMessage: `✓ Völlig richtig!<br><br>
			Völlig richtig! Die Lösung einer inhomogenen Differentialgleichung erhält man als Summe der Lösung der homogenen Gleichung (also für den gedämpften harmonischen Oszillator, wie auf den letzten Seiten behandelt) und einer speziellen Lösung.<br>
			Wie man zu dieser speziellen Lösung kommt, das ist auf der nächsten Seite skizziert.<br><br>

			Frage am Rande:
			Warum funktioniert das so mit der Unterteilung in Lösung der homogenen und speziellen Lösung?
		`,
    incorrectMessage: `✗ Falsche Wahl, versuchen Sie es nochmals!<br><br>
			Sie haben entweder angegeben, dass Sie die Begriffe in dieser Weise nicht kennen, oder eine falsche Lösung angekreuzt.<br><br>

			Auf der nächsten Seite finden Sie einen kurzen Überblick, wie die soeben aufgestellte Differentialgleichung gelöst werden kann.<br><br>

			Hier erhalten Sie einen allgemeineren Einblick in das Lösen von
			<a data-glossary="hom-dgl" class="glossary-link">homogenen</a>
			oder
			<a data-glossary="inhom-dgl" class="glossary-link">inhomogenen Differentialgleichungen</a>
			.
			`
};

export const question2: MultipleChoiceQuestion = {
    questionId: 'e3-driven-osc-2-inhom-dgl',
    question: 'Welche der folgenden Aussagen sind korrekt?',
    options: [
        { value: 'answer1', label: 'Aufgrund des äußeren Antriebs ist die Schwingung zu allen Zeiten gleichmäßig und periodisch.' },
        { value: 'answer2', label: 'Ein ungedämpftes Rad würde direkt auf den Antrieb reagieren, also in Phase mit dem Antrieb schwingen.' },
        { value: 'answer3', label: 'Die Anfangsgeschwindigkeit bestimmt die maximale Auslenkung des Systems zu allen Zeiten.' },
        { value: 'answer4', label: 'Die Dämpfung spielt für die Schwingungsfrequenz des gedämpft schwingenden Rades nach einer bestimmten Zeit keine Rolle mehr. Entscheidend ist nur, mit welcher Frequenz der Antrieb das Rad schwingen lässt.' },
        { value: 'answer5', label: 'Der Antrieb hat nur zu Beginn einen Einfluss auf das Schwingungsverhalten, ab einer bestimmten Zeit schwingt das System frei.' },
        { value: 'answer6', label: ' Der erste Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
        { value: 'answer7', label: 'Der zweite Summand ist bei einem gedämpften System nach einer gewissen Zeit zu vernachlässigen -- er spielt nur zu Beginn der Schwingung eine Rolle.' },
    ],
    correctAnswers: ['answer4', 'answer6'],
    containerId: 'question2-container',
    successMessage: `✓ Völlig richtig!<br><br>
			Aufgrund der Dämpfung wird die Bedeutung des ersten Summanden (grün) mit der Zeit geringer und das schwingende System wird durch den zweiten Term, also durch den Antrieb, dominiert.
			Der erste Summand ist nur im sogenannten "Einschwingvorgang" relevant. Der zweite Term wird auch als "stationäre Lösung" beschrieben, da maximale Amplitude und Phasenverschiebung hier nicht von der Zeit abhängen.<br>
			Die Dämpfung hat hierbei einen Einfluss auf die maximale Auslenkung und auch auf die Phasenverschiebung zwischen Anreger und Schwungrad. Auf der folgenden Seite werden wir uns diese beiden Größen und die Abhängigkeiten noch einmal genauer anschauen.<br><br>
		`,
    incompleteMessage: `✗ Das ist so noch nicht ganz richtig, versuchen Sie es nochmals!<br><br>
            Betrachte noch einmal die Gleichung. Überlege, wie sich die Gleichung reduziert für $$t\\rightarrow\\infty .$$ Überlege, in welchen Termen die Dämpfung (\\beta) eine Rolle spielt und wie sich die Gleichung für $$\\beta=0$$ verhält.`,
    incorrectMessage: `✗ Das ist so noch nicht ganz richtig, versuchen Sie es nochmals!<br><br>
            Betrachte noch einmal die Gleichung. Überlege, wie sich die Gleichung reduziert für $$t\\rightarrow\\infty .$$ Überlege, in welchen Termen die Dämpfung (\\beta) eine Rolle spielt und wie sich die Gleichung für $$\\beta=0$$ verhält.`
};

export const question3: ImageChoiceQuestion = {
    questionId: 'e3-driven-osc-3-swinging-process',
    question: `Woran kann man im Phasenraumdiagramm erkennen, dass der Einschwingvorgang abgeschlossen ist?<br>
            Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden?
            Überlegen Sie auf Basis der obigen Gleichung.<br>
            Das graue Kreuz markiert den ersten Messwert, das rote Kreuz markiert den letzten Messwert.`,
    options: [
        { value: 'answer1', imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option1_3.png' },
        { value: 'answer2', imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option2_3.png' },
        { value: 'answer3', imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option3_3.png' },
    ],
    correctAnswers: ['answer1'],
    containerId: 'question3-container',
    successMessage: `✓ Richtig, der Zusammenhang sollte etwa linear sein - je größer das wirkende Drehmoment, desto    stärker wird das Rad ausgelenkt. Es gilt der Zusammenhang $M=\\varphi D$.<br><br>
			Das Drehmoment kann nicht direkt im Versuch gemessen/variiert werden, Sie können aber durch das Anhängen unterschiedlicher Massekörper ein Drehmoment erzeugen.`,
    incorrectMessage: `✗ Falsche Wahl, versuchen Sie es nochmals!<br><br>
            Bei dieser Bewegung ist der Einschwingvorgang noch nicht abgeschlossen.
            Dass der Einschwingvorgang abgeschlossen ist, sieht man im Phasenraumdiagramm an einer geschlossenen Bahnkurve. Sowohl der Winkel, als auch die Winkelgeschwindigkeit verändern sich zu diesem Zeitpunkt periodisch, weshalb sich im Phasenraumdiagramm eine "geschlossene" Bewegung ergibt.`
};

export const question4: MultipleChoiceQuestion = {
    questionId: 'e3-driven-osc-4-max-amp',
    question: 'Welche Parameter des System beeinflussen die maximale Amplitude des stationär schwingenden (gedämpften) Systems?',
    options: [
        { value: 'answer1', label: 'Trägheitsmoment des Schwungkörpers $\\theta$' },
        { value: 'answer2', label: 'Anfangsgeschwindigkeit $v_0$' },
        { value: 'answer3', label: 'Eigenfrequenz $\\omega_0$' },
        { value: 'answer4', label: 'Anfangsauslenkung $x_0$' },
        { value: 'answer5', label: 'Dämpfung (Wirbelstrombremse und Reibungsverluste) $\\rho$' },
        { value: 'answer6', label: 'Stärke der Dämpfung $\\beta$' },
    ],
    correctAnswers: ['answer1', 'answer3', 'answer5', 'answer6'],
    containerId: 'question2-container',
    successMessage: `✓ Völlig richtig!<br><br>
			Aufgrund der Dämpfung wird die Bedeutung des ersten Summanden (grün) mit der Zeit geringer und das schwingende System wird durch den zweiten Term, also durch den Antrieb, dominiert.
			Der erste Summand ist nur im sogenannten "Einschwingvorgang" relevant. Der zweite Term wird auch als "stationäre Lösung" beschrieben, da maximale Amplitude und Phasenverschiebung hier nicht von der Zeit abhängen.<br>
			Die Dämpfung hat hierbei einen Einfluss auf die maximale Auslenkung und auch auf die Phasenverschiebung zwischen Anreger und Schwungrad. Auf der folgenden Seite werden wir uns diese beiden Größen und die Abhängigkeiten noch einmal genauer anschauen.<br><br>
		`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch!<br><br>
            Beachte, dass die Abhängigkeiten der Parameter in der Gleichung von den Eigenschaften des Systems.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch!<br><br>
            Beachte, dass die Abhängigkeiten der Parameter in der Gleichung von den Eigenschaften des Systems.`
};

export const question5: SingleChoiceQuestion = {
    questionId: 'e3-driven-osc-5-damping-resonance-freq',
    question: 'Je stärker die Dämpfung, desto...',
    options: [
        { value: 'answer1', label: '... größer die Resonanzfrequenz.' },
        { value: 'answer2', label: '... größer die Amplitude bei der Resonanzfrequenz.' },
        { value: 'answer3', label: ' ... größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz $\\omega_0$.' },
    ],
    correctAnswer: 'answer1',
    containerId: 'question5-container',
    successMessage: `✓ Richtig!<br><br>

            In dem Versuch werden Sie die Resonanzkurven bei unterschiedlichen Dämpfungen in Abhängigkeit von der Amplitude und der Frequenz der Anregung vermessen.<br>
            Überlegen Sie sich für die Versuchsdurchführung: Was sollten Sie bei der Wahl der Frequenzabstände beachten, wenn Sie die Dämpfung verringern?
		`,
    incorrectMessage: `✗ Das stimmt nicht, versuchen Sie es nochmals!<br><br>

            Betrachten Sie noch einmal die Abbildung.<br>
            Beachten Sie: Die Dämpfung für die dunkelblaue Kurve ist höher, als für die hellblaue Kurve.
			`
};

export const question6: SingleChoiceQuestion = {
    questionId: 'e3-driven-osc-6-damping-resonance-freq-exp',
    question: `Überlegen Sie, was diese Beobachtung für Konsequenzen für die Versuchsdurchführung hat:
            Je größer die Dämpfung, desto...`,
    options: [
        { value: 'answer1', label: '... vorsichtiger muss man sein bei Messungen im Bereich der Resonanzfrequenz, damit der Aufbau nicht kaputt geht.' },
        { value: 'answer2', label: '... kleinschrittiger sollte man die Frequenz im Bereich der Resonanzfrequenz variieren.' },
        { value: 'answer3', label: '... gleichmäßiger können die Schritte sein, in denen die Frequenz variiert wird.' },
    ],
    correctAnswer: 'answer1',
    containerId: 'question6-container',
    successMessage: `✓ Genau.<br><br>

            Um Ressourcen sinnvoll einzusetzen, kann es hilfrreich sein die Schritte, in denen man die Frequenz variiert, anzupassen.<br>
            Bei niedriger Dämpfung ist der Amplituden-Peak um die Resonanzfrequenz schmaler, weshalb es sinnvoll ist in diesem Bereich in kleineren und in Randbereichen in größeren Schritten zu messen.
            Bei größeren Dämpfungen ist der Amplituden-Peak breiter, weshalb eine Anpassung der Frequenzschritte weniger relevant ist.<br>
            Die genauen Abstände, in denen die Frequenz variiert werden sollte, hängt aber natürlich von der Fragestellung und vom System ab.
		`,
    incorrectMessage: `✗ Falsche Wahl!<br><br>

            Versuchen Sie es nochmals!
            Das ist in der Weise nicht korrekt.
            Betrachten Sie noch einmal die Abbildung. Je größer die Dämpfung ist, desto flacher und breiter ist der Amplituden-Peak. Hilft Ihnen das weiter?
			`
};

export const question7: SingleChoiceQuestion = {
    questionId: 'e3-driven-osc-7-exciting-frequency',
    question: `Entspricht die Anregungsfrequenz gerade der Resonanzfrequenz $\\omega_r$, so...`,
    options: [
        { value: 'answer1', label: '... ist die Phasenverschiebung kleiner als $\\pi/2$.' },
        { value: 'answer2', label: '... ist die Phasenverschiebung genau $\\pi/2$.' },
        { value: 'answer3', label: '... ist die Phasenverschiebung größer als $\\pi/2$.' },
        { value: 'answer4', label: '...  kann man keine Aussage über die Phasenverschiebung treffen.' },
    ],
    correctAnswer: 'answer1',
    containerId: 'question7-container',
    successMessage: `✓ Richtig.`,
    incorrectMessage: `✗ Falsche Wahl!<br><br>Versuchen Sie es nochmals!`
};

export const question8: SingleChoiceQuestion = {
    questionId: 'e3-driven-osc-8-measure-time-delta',
    question: `Sie vermessen die Reaktion eines gedämpften Schwungrads bei zwei unterschiedlichen Frequenzen,       $\\omega_1=200\\,\\mathrm{mHz}$ und $\\omega_2=400\\,\\mathrm{mHz}$.
            Bei der ersten Messung ist der zeitliche Abstand zwischen dem Nulldurchgang des Anregers und dem Nulldurchgang des Rads $\\Delta t=0{,}25\\,\\mathrm{s}$, bei der zweiten Messung ist der entsprechende Abstand $\\Delta t=1{,}4\\,\\mathrm{s}$.
            Was können Sie aus dieser Messung über die Größe der Resonanzfrequenz des Systems aussagen?`,
    options: [
        { value: 'answer1', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1=200\\,\\mathrm{mHz}$.' },
        { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
        { value: 'answer3', label: 'Die Resonanzfrequenz ist größer als $\\omega_2=400\\,\\mathrm{mHz}$.' },
        { value: 'answer4', label: 'Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' },
    ],
    correctAnswer: 'answer2',
    containerId: 'question8-container',
    successMessage: `✓ Richtig.`,
    incorrectMessage: `✗ Falsche Wahl!<br><br>Versuchen Sie es nochmals!`
};
