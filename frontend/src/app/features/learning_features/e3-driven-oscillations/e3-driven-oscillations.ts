import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageChoice } from '../../../shared/evaluation/image-choice/image-choice';
import { SingleChoice } from '../../../shared/evaluation/single-choice/single-choice';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';



@Component({
	selector: 'app-e3-driven-oscillations',
	imports: [CommonModule, RouterLink, SingleChoice, ImageChoice, MultipleChoice],
	templateUrl: './e3-driven-oscillations.html',
	styleUrl: './e3-driven-oscillations.css',
})
export class E3DrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay,
        public devMode: DevModeService
    ) {}

    private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

    @HostListener('click', ['$event'])
    onGlossaryLink(event: MouseEvent) {
        const link = (event.target as HTMLElement)
            ?.closest('a[href^="#glossary-"]') as HTMLAnchorElement | null;
        if (!link) return;
        event.preventDefault();
        const term = link.getAttribute('href')!.replace('#glossary-', '');
        this.glossaryOverlay.open(term);
    }


	// question 1 data
    question1 = {
		questionId: 'driven_osc-1-dgl-loesen',
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
			<a href="#glossary-hom-dgl" class="glossary-link">homogenen</a>
			oder
			<a href="#glossary-inhom-dgl" class="glossary-link">inhomogenen Differentialgleichungen</a>
			.
			`
    };


	// question 2 data
    question2 = {
		questionId: 'driven_osc-2-inhom-dgl',
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

    // question 3 data
	question3 = {
		questionId: 'driven_osc-3-swinging-process',
		question: `Woran kann man im Phasenraumdiagramm erkennen, dass der Einschwingvorgang abgeschlossen ist?<br>
            Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden?
            Überlegen Sie auf Basis der obigen Gleichung.<br>
            Das graue Kreuz markiert den ersten Messwert, das rote Kreuz markiert den letzten Messwert.`,
		options: [
			{ 
				value: 'answer1', 
				imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option1_3.png',
				// label: 'Plot 1'
			},
			{ 
				value: 'answer2', 
				imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option2_3.png',
				// label: 'Plot 2'
			},
			{ 
				value: 'answer3', 
				imageSrc: 'assets/images/e3_driven_oscillations/swinging_process_option3_3.png',
				// label: 'Plot3'
			},
		],
		correctAnswers: ['answer1'],
		containerId: 'question3-container',
		successMessage: `✓ Richtig, der Zusammenhang sollte etwa linear sein - je größer das wirkende Drehmoment, desto    stärker wird das Rad ausgelenkt. Es gilt der Zusammenhang $M=\\varphi D$.<br><br>
			Das Drehmoment kann nicht direkt im Versuch gemessen/variiert werden, Sie können aber durch das Anhängen unterschiedlicher Massekörper ein Drehmoment erzeugen.`,
        incorrectMessage: `✗ Falsche Wahl, versuchen Sie es nochmals!<br><br>
            Bei dieser Bewegung ist der Einschwingvorgang noch nicht abgeschlossen.
            Dass der Einschwingvorgang abgeschlossen ist, sieht man im Phasenraumdiagramm an einer geschlossenen Bahnkurve. Sowohl der Winkel, als auch die Winkelgeschwindigkeit verändern sich zu diesem Zeitpunkt periodisch, weshalb sich im Phasenraumdiagramm eine "geschlossene" Bewegung ergibt.`
	};

	// question 4 data
    question4 = {
		questionId: 'driven_osc-4-max-amp',
        question: 'Welche Parameter des System beeinflussen die maximale Amplitude des stationär schwingenden (gedämpften) Systems?',
        options: [
            { value: 'answer1', label: 'Trägheitsmoment des Schwungkörpers $\\theta$' },
            { value: 'answer2', label: 'Anfangsgeschwindigkeit $v_0$' },
            { value: 'answer3', label: 'Eigenfrequenz $\\omega_0$' },
            { value: 'answer4', label: 'Anfangsauslenkung $x_0$' },
            { value: 'answer5', label: 'Dämpfung (Wirbelstrombremse und Reibungsverluste) $\\rho$' },
            { value: 'answer6', label: 'Stärke der Dämpfung $\\beta$' },

        ],
        correctAnswers: ['answer1', 'answer3, answer5', 'answer6'],
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

	// question 5 data
    question5 = {
		questionId: 'driven_osc-5-damping-resonance-freq',
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

	// question 6 data
    question6 = {
		questionId: 'driven_osc-6-damping-resonance-freq-exp',
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

    // question 7 data
    question7 = {
        questionId: 'driven_osc-7-exciting-frequency',
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
    }


    // question 8 data
    question8 = {
        questionId: 'driven_osc-8-measure-time-delta',
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
    }


	// track completion
	isCorrect1 = false;
	isCorrect2 = false;
	isCorrect3 = false;
	isCorrect4 = false;
	isCorrect5 = false;
	isCorrect6 = false;
	isCorrect7 = false;
	isCorrect8 = false;


	// QA states
	showResult1 = false;
	showResult2 = false;
	showResult3 = false;
	showResult4 = false;
	showResult5 = false;
	showResult6 = false;
	showResult7 = false;
	showResult8 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }

    onQuestion2Answered(isCorrect: boolean) {
		this.isCorrect2 = isCorrect;
    }

    onQuestion3Answered(isCorrect: boolean) {
		this.isCorrect3 = isCorrect;
    }

    onQuestion4Answered(isCorrect: boolean) {
		this.isCorrect4 = isCorrect;
    }

    onQuestion5Answered(isCorrect: boolean) {
		this.isCorrect5 = isCorrect;
    }

    onQuestion6Answered(isCorrect: boolean) {
		this.isCorrect6 = isCorrect;
    }

    onQuestion7Answered(isCorrect: boolean) {
		this.isCorrect7 = isCorrect;
    }

    onQuestion8Answered(isCorrect: boolean) {
		this.isCorrect8 = isCorrect;
    }


	// +++ TeX rendering +++
	drivenOscText1a!: SafeHtml;
	drivenOscText1b!: SafeHtml;
	drivenOscText1c!: SafeHtml;
	drivenOscText2a!: SafeHtml;
	drivenOscText2b!: SafeHtml;
	drivenOscText2c!: SafeHtml;
	drivenOscText3a!: SafeHtml;
	drivenOscText3b!: SafeHtml;
    drivenOscText4!: SafeHtml;
    drivenOscText5a!: SafeHtml;
    drivenOscText5b!: SafeHtml;
    drivenOscText6!: SafeHtml;
    drivenOscText7!: SafeHtml;


    ngOnInit() {
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3', '4', '5', '6', '7'].includes(page)) {
            this.currentView = `driven_osc${page}`;
        }

        // read entry-flow so continue button can navigate correctly
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';

        // start tracking this module
        this.trackingService.startModule('driven_oscillations');

        // restore completion states from previous session
        this.restoreCompletionState();

		// sanitized string to enable LaTeX rendering
        this.drivenOscText1a = this.sanitizer.bypassSecurityTrustHtml(`
			Neben einer Wirbelstrombremse zur Dämpfung, verfügt der Aufbau auch über einen externen Antrieb. Über einen Schrittmotor, der über eine Software angesteuert wird, kann hierbei das Rad zusätzlich periodisch in Bewegung versetzt werden. Hierbei kann einerseits die Frequenz und andererseits die 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a>  
            verändert werden.<br><br>

			Da der externe Antrieb über ein Rad realisiert wird, kann dieser mathematisch modelliert werden als zusätzlicher Beitrag zur
			<a href="#glossary-inhom-dgl" class="glossary-link">Differentialgleichung</a>
			mit $F_\\text{ext}=A\\cos(\\omega t)$, wobei $\\omega$ die Frequenz des Antriebs ist und $A$ mit dessen <a href="#glossary-amplitude" class="glossary-link">Amplitude</a>  
            in Zusammenhang steht.
			Während die Frequenz über eine digitale Ansteuerung des Schrittmotors eingestellt wird, kann die Amplitude manuell durch Verschieben an der rechten Scheibe verändert werden.<br><br>

			Insgesamt ist die
			<a href="#glossary-inhom-dgl" class="glossary-link">Differentialgleichung</a>
			zur Beschreibung der Bewegung des Rades mit Dämpfung ($\\Theta$:
			<a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a>,
			$\\rho$: Reibungskoeffizient, $D^*$:
			<a href="#glossary-directive-moment" class="glossary-link">Richtmoment</a>
			der Feder) und externem Antrieb gegeben als:
			$$\\Theta\\ddot{\\varphi}+\\rho\\dot{\\varphi}+D^*\\varphi=A\\cos(\\omega t)$$
			In der Regel wird diese Gleichung in normierter Form betrachtet; wie bereits zuvor werden neue Variablen eingeführt:
			$$2\\beta:=\\frac{\\rho}{\\Theta},\\quad\\omega_0^2:=\\frac{D^*}{\\Theta},\\quad N:=\\frac{A}{\\Theta}.$$
			Diese Umbenennung vereinfacht die Schreibweise und entspricht der „Standardform" einer
			<a href="#glossary-inhom-dgl" class="glossary-link">inhomogenen linearen Differentialgleichung</a>
			2. Ordnung:
        `);

        this.drivenOscText1b = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t).$$
        `);   
        
        this.drivenOscText1c = this.sanitizer.bypassSecurityTrustHtml(`
			Beachte, dass hierbei $\\omega_0$ und $\\omega$ unterschiedliche Frequenzen sind, die nicht direkt in Zusammenhang miteinander stehen — während $\\omega_0$ die
			<a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>
			des ungedämpften Rades beschreibt, ist $\\omega$ die Frequenz des Antriebs. Zur Erinnerung: $\\beta$ ist der
			<a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>.
        `);
        
        this.drivenOscText2a = this.sanitizer.bypassSecurityTrustHtml(`
            Die Lösung der 
            <a href="#glossary-inhom-dgl" class="glossary-link">inhomogenen Differentialgleichung</a>
            $$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t)$$
            ergibt sich aus der Summe von homogener und spezieller Lösung:
            $$\\varphi(t)=\\varphi_\\text{homogen}(t)+\\varphi_\\text{speziell}(t).$$

            Die Lösung der homogenen Gleichung (ohne externen Antrieb) wurde bereits auf den vergangenen Seiten verwendet. Sie kann geschrieben werden als:
            $$\\varphi_\\text{homogen}=\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t},$$
            wobei sich die maximale Auslenkung $\\varphi_0$ und die Phase $\\Phi$ aus den Anfangsbedingungen ergeben und $\\omega_e=\\sqrt{\\omega_0^2-\\beta^2}$ ($\\omega_0$: 
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a> 
            des Systems; $\\beta$: 
            <a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskonstante</a>
            ).<br><br>

            Um eine spezielle Lösung zu finden, ist es ratsam, einen Ansatz zu wählen, der der Inhomogenität (in diesem Fall $N\\cos(\\omega t)$) ähnelt.<br><br>

            Eine Möglichkeit wäre als Ansatz $\\varphi_\\text{speziell}=\\varphi_s\\cos(\\omega t+\\Phi_s)$ zu wählen. Man setzt diesen Ansatz in die 
            <a href="#glossary-inhom-dgl" class="glossary-link">Differentialgleichung</a> 
            ein und bestimmt hieraus die beiden Variablen $\\varphi_s$ und $\\Phi_s$.<br><br>

            Eine andere Möglichkeit, bei der die Rechnung an einigen Stellen etwas leichter ist, wirkt zunächst wie ein Umweg: Man erweitert die Inhomogenität komplex. Statt $N\\cos(\\omega t)$ betrachtet man $Ne^{i\\omega t}$ — beachte $N\\cos(\\omega t)=\\text{Re}\\{Ne^{i\\omega t}\\}$. Mit dem Ansatz $\\tilde{\\varphi}_\\text{speziell}=Ae^{i\\omega t}$ (A komplexwertig) setzt man diesen in die 
            <a href="#glossary-inhom-dgl" class="glossary-link">inhomogene Differentialgleichung</a> 
            ein und bestimmt $A$. Die spezielle Lösung ergibt sich dann als $\\text{Re}\\{\\tilde{\\varphi}_\\text{speziell}\\}$.
        `)

        this.drivenOscText2b = this.sanitizer.bypassSecurityTrustHtml(`
            Wir verwenden den komplexen Erweiterungsansatz. Ausgangspunkt ist die inhomogene Differentialgleichung:
            $$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t).$$

            Anstatt der Inhomogenität $N\\cos(\\omega t)$ betrachten wir die komplexifizierte Gleichung mit der Inhomogenität $Ne^{i\\omega t}$
            und wählen den Ansatz $\\tilde{\\varphi}_\\text{speziell}=Ae^{i\\omega t}$, wobei $A\\in\\mathbb{C}$ komplexwertig ist.
            Beachte: $N\\cos(\\omega t)=\\text{Re}\\{Ne^{i\\omega t}\\}$, weshalb sich die gesuchte spezielle Lösung am Ende als Realteil ergibt.<br><br>

            Die Ableitungen des Ansatzes sind:
            $$\\dot{\\tilde{\\varphi}}=i\\omega A e^{i\\omega t},\\qquad\\ddot{\\tilde{\\varphi}}=-\\omega^2 A e^{i\\omega t}.$$

            Einsetzen in die Differentialgleichung und Division durch $e^{i\\omega t}\\neq 0$ liefert:
            $$A\\left(\\omega_0^2-\\omega^2+2i\\beta\\omega\\right)=N\\quad\\Rightarrow\\quad
            A=\\frac{N}{\\omega_0^2-\\omega^2+2i\\beta\\omega}.$$

            Zur Berechnung des Realteils multiplizieren wir mit dem konjugiert-komplexen Nenner:
            $$A=\\frac{N(\\omega_0^2-\\omega^2-2i\\beta\\omega)}{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}.$$

            Wir schreiben $A=|A|\\,e^{-i\\Phi_s}$ in Polarform:
            $$|A|=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}},\\qquad
            \\Phi_s=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right).$$

            Die spezielle Lösung der ursprünglichen Gleichung ergibt sich schließlich als:
            $$\\varphi_\\text{speziell}=\\text{Re}\\{\\tilde{\\varphi}_\\text{speziell}\\}=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos(\\omega t-\\Phi_s).$$
        `);

        this.drivenOscText2c = this.sanitizer.bypassSecurityTrustHtml(`
            Als Gesamtlösung des Systems ergibt sich nach dem vorgestellten Schema:
            $$\\varphi(t)=\\underbrace{\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t}}_{\\text{homogen}}+\\underbrace{\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right)}_{\\text{speziell}}$$

            Der erste Summand entspricht der homogenen Lösung, der zweite der speziellen Lösung. Der erste Term beschreibt das „freie" Schwingverhalten des Pendels; der zweite Term beinhaltet die Reaktion des Systems auf die externe Anregung.
        `);

        this.drivenOscText3a = this.sanitizer.bypassSecurityTrustHtml(`
            Im Versuch zur getriebenen Schwingung werden Sie sich auf eine Analyse der stationären Schwingung (nach der Einschwingphase),
            also auf den zweiten Term der Gesamtlösung, fokussieren.
            Da ein reales System immer gedämpft ist und sich daher nach einer Einschwingphase immer eine stationäre Lösung einstellt,
            ist diese Betrachtung im Realexperiment sinnvoll:
            $$\\varphi(t)=\\underbrace{\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t}}_{\\xrightarrow{\\;t\\to\\infty\\;}\\,0}
            +\\underbrace{\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right)}_{\\text{stationäre Lösung}}$$

            Wenn die Einschwingphase abgeschlossen ist, spielen die Anfangsbedingungen eine untergeordnete Rolle
            und das System schwingt periodisch mit der Frequenz $\\omega$ des Antriebs.<br><br>

            Der Zeitpunkt, zu dem die Einschwingphase abgeschlossen ist, ist sehr gut im sogenannten Phasenraumdiagramm sichtbar.
            In einem Phasenraumdiagramm wird die (Winkel-)geschwindigkeit über den Winkel aufgetragen.
        `);

        this.drivenOscText4 = this.sanitizer.bypassSecurityTrustHtml(`
            Im Folgenden betrachten wir nur die stationäre Lösung der Gleichung, also
            $$\\varphi(t)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right).$$

            Zunächst beschäftigen wir uns mit der 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a>
            :
            $$\\varphi_0(\\omega)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}.$$

            Sie haben sicher schon von dem Phänomen der „Resonanzkatastrophe" gehört. Man spricht hiervon, wenn die 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
            der Schwingung, bedingt durch die äußere Anregung, stark zunimmt. Doch wovon hängt es ab, ob es zu einer „Resonanzkatastrophe" kommt?
        `);

        this.drivenOscText5a = this.sanitizer.bypassSecurityTrustHtml(`
            Richtig, das Zusammenspiel unterschiedlicher Aspekte beeinflusst die Amplitude der Schwingung.
            Im Versuch werden Sie nicht alle Parameter variieren können. Der Versuchsaufbau erlaubt Ihnen einerseits die Anpassung der Dämpfung,
            andererseits die Anpassung der Amplitude und Frequenz des Antriebs.<br><br>

            Mathematisch ist die Amplitude gegeben als:
            $$\\varphi_0(\\omega)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}.$$
        `)

        this.drivenOscText5b = this.sanitizer.bypassSecurityTrustHtml(`
            Die Abbildung zeigt den Zusammenhang zwischen der normierten 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
            des Schwungrads und der Anregungsfrequenz $\\omega$
            für unterschiedliche 
            <a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskonstante</a> 
            $\\beta$ bei einem gleichbleibenden System
            ($\\omega_0$ ist im Versuch nicht variabel und dient hier daher zur Normierung).<br><br>

            Beachten Sie, dass die 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
            der Anregung ($N$) in $\\varphi_0(0)$ enthalten ist.<br><br>

            Die graue gestrichelte Kurve zeigt die normierte 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
            bei der 
            <a href="#glossary-resonance-frequency" class="glossary-link">Resonanzfrequenz</a> 
            für unterschiedliche Dämpfungen.<br><br>

            Die 
            <a href="#glossary-resonance-frequency" class="glossary-link">Resonanzfrequenz</a>
            gibt die Frequenz an, bei der die 
            <a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
            des schwingenden Rades maximal wird.
            Mathematisch ergibt sie sich zu:
            $$\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}.$$
        `)

        this.drivenOscText6 = this.sanitizer.bypassSecurityTrustHtml(`
            Im stationären Zustand hinkt ein gedämpftes Schwungrad dem Antrieb hinterher. Wie die Amplitude, so hängt auch die Phasenverschiebung von der Dämpfung $\\beta$, der 
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a> 
            $\\omega_0$ und der Frequenz des Antriebs $\\omega$ ab.<br><br>

            Gehen wir zurück auf die stationäre Lösung des gedämpften, getriebenen Systems:
            $$\\varphi(t)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right).$$

            Vergleichen wir diese Gleichung mit dem Antrieb des Systems,
            $$\\varphi_\\text{ext}=N\\cos(\\omega t),$$
            so fällt auf, dass die Argumente der Cosinus-Funktionen sich unterscheiden. Dieser Unterschied entspricht einer Phasenverschiebung $\\Phi$:
            $$\\Phi(\\omega)=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right).$$
        `)

        this.drivenOscText7 = this.sanitizer.bypassSecurityTrustHtml(`
            In der nebenstehenden Abbildung ist die Phasenverschiebung
            $$\\Phi(\\omega)=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$$
            für unterschiedliche 
            <a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskonstanten</a>
            $\\beta$ dargestellt.<br><br>

            Es zeigt sich, dass die 
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a> 
            $\\omega_0$ einen charakteristischen Punkt darstellt:
            Entspricht die Anregungsfrequenz gerade der 
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>
            , so ist die Phasenverschiebung $\\Phi(\\omega_0)=\\pi/2$.
        `)


    }


    ngAfterViewInit() {
        this.renderMath();
    }


   ngOnDestroy() {
        if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
        this.trackingService.endModule();
    }


    private restoreCompletionState() {
        // check if questions were already answered correctly
        this.isCorrect1 = this.trackingService.isQuestionCompleted(this.question1.questionId);
		this.isCorrect2 = this.trackingService.isQuestionCompleted(this.question2.questionId);
		this.isCorrect3 = this.trackingService.isQuestionCompleted(this.question3.questionId);
		this.isCorrect4 = this.trackingService.isQuestionCompleted(this.question4.questionId);
		this.isCorrect5 = this.trackingService.isQuestionCompleted(this.question5.questionId);
		this.isCorrect6 = this.trackingService.isQuestionCompleted(this.question6.questionId);
		this.isCorrect7 = this.trackingService.isQuestionCompleted(this.question7.questionId);
		this.isCorrect8 = this.trackingService.isQuestionCompleted(this.question8.questionId);
    }


    // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
			this.mathJaxTimeout = setTimeout(() => {
				this.mathJaxTimeout = null;
				if (window.MathJax) {
					window.MathJax.typesetPromise();
				}
			}, 100);
		}
	}


// +++ in-page navigation +++

    private updateUrl() {
        const page = this.currentView.replace('driven_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'driven_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean {
        return this.currentView === 'driven_osc1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'driven_osc7';
    }



    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'driven_osc1') {
            this.router.navigate(["/decision/e-driven-oscillations"]);
            return;
        } else if (this.currentView === 'driven_osc2') {
            this.currentView = 'driven_osc1';
        } else if (this.currentView === 'driven_osc3') {
            this.currentView = 'driven_osc2';
        } else if (this.currentView === 'driven_osc4') {
            this.currentView = 'driven_osc3';
        } else if (this.currentView === 'driven_osc5') {
            this.currentView = 'driven_osc4';
        } else if (this.currentView === 'driven_osc6') {
            this.currentView = 'driven_osc5';
        } else if (this.currentView === 'driven_osc7') {
            this.currentView = 'driven_osc6';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'driven_osc1') {
            this.currentView = 'driven_osc2';
        } else if (this.currentView === 'driven_osc2') {
            this.currentView = 'driven_osc3';
        } else if (this.currentView === 'driven_osc3') {
            this.currentView = 'driven_osc4';
        } else if (this.currentView === 'driven_osc4') {
            this.currentView = 'driven_osc5';
        } else if (this.currentView === 'driven_osc5') {
            this.currentView = 'driven_osc6';
        } else if (this.currentView === 'driven_osc6') {
            this.currentView = 'driven_osc7';
        } else if (this.currentView === 'driven_osc7') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-e-driven', 'true');
                this.router.navigate(['/decision/e-driven-oscillations']);
            } else {
                this.router.navigate(['/target/tar-experiment']);
            }
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
