import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';



@Component({
	selector: 'app-e2-damped-oscillation',
	imports: [CommonModule, RouterLink, MultipleChoice],
	templateUrl: './e2-damped-oscillation.html',
	styleUrl: './e2-damped-oscillation.css',
})
export class E2DampedOscillation implements AfterViewInit {
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


	// +++ QA data +++

	// question 1 data
    question1 = {
		questionId: 'damped_osc-1-schwungrad',
        question: 'Welche der folgenden Aussagen trifft auf das schwingfende Rad zu?',
        options: [
            { value: 'answer1', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1=200\\,\\mathrm{mHz}$.' },
            { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
            { value: 'answer3', label: 'Die Resonanzfrequenz ist größer als $\\omega_2=400\\,\\mathrm{mHz}$.' },
            { value: 'answer4', label: ' Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' }
        ],
        correctAnswers: ['answer1'],
        containerId: 'question1-container',
        successMessage: `✓ Völlig richtig, die Dämpfung beeinflusst das System in doppelter Weise. Einerseits führt die Dämpfung dazu, dass die Amplitude mit der Zeit abnimmt. Andererseits führt die Dämpfung aber auch zu einer Veränderung der Schwingungsfrequenz.<br><br>

		`,
        incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>`,
        incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>`
    };


	// track completion
	isCorrect1 = false;


	// QA states
	showResult1 = false;


	// actions upon aswering questions
    onQuestion1Answered(isCorrect: boolean) {
		this.isCorrect1 = isCorrect;
    }



	// +++ TeX rendering +++
	dampedOscText1a!: SafeHtml;
	dampedOscText1b!: SafeHtml;
	dampedOscText1c!: SafeHtml;
	dampedOscText1d!: SafeHtml;
	dampedOscText1e!: SafeHtml;

	dampedOscText2a!: SafeHtml;
	dampedOscText2b!: SafeHtml;
	dampedOscText2c!: SafeHtml;
	dampedOscText2d!: SafeHtml;
	dampedOscText2e!: SafeHtml;

	dampedOscText3a!: SafeHtml;
	dampedOscText3b!: SafeHtml;


    ngOnInit() {
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3'].includes(page)) {
            this.currentView = `damped_osc${page}`;
        }

        // read entry-flow so continue button can navigate correctly
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';

        // start tracking this module
        this.trackingService.startModule('damped_oscillations');

        // restore completion states from previous session
        this.restoreCompletionState();

		// sanitized string to enable LaTeX rendering
        this.dampedOscText1a = this.sanitizer.bypassSecurityTrustHtml(`
			Sie haben sich bereits mit drei wichtigen physikalischen Bauelementen des Versuchs vertraut gemacht, dem Schwungrad, der Feder und der Wirbelstrombremse. In diesem Abschnitt werden Sie sich damit auseinandersetzen, wie man den Einfluss dieser unterschiedlichen Bauelemente auf die Dynamik des Schwungrads modellieren kann.<br><br>

            Wie Sie bereits gelesen haben, wirken sowohl die Feder, als auch (indirekt) die Wirbelstrombremse ein
			<a href="#glossary-angular-momentum" class="glossary-link">Drehmoment</a>
			auf das Schwungrad aus.
            Die Wirkung der Feder hängt hierbei vom Winkel $\\varphi$ ab --- $M = -D\\varphi$ mit dem
			<a href="#glossary-directive-moment" class="glossary-link">Richtmoment</a>
			$D$ ---
            die Wirkung der Wirbelstrombremse hängt von der Winkelgeschwindigkeit $\\dot{\\varphi}$ ab --- $M = -\\rho\\dot{\\varphi}$ mit dem Reibungskoeffizienten $\\rho$.
            <br><br>
            Mit diesen Annahmen können wir die Bewegungsgleichung für die Rotationsbewegung aufstellen.
            <br><br>
            Für Rotationsbewegungen gilt im Allgemeinen, dass
            $$\\Theta\\ddot{\\varphi} = \\sum_i M_i,$$
            wobei $\\Theta$ das
			<a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a>
			ist.<br><br>
        `);

		this.dampedOscText1b = this.sanitizer.bypassSecurityTrustHtml(`
			Das Aufstellen der Bewegungsgleichung für Rotationsbewegungen erfolgt analog zum Aufstellen von Bewegungsgleichungen für lineare Bewegungen. Es ist allerdings zu beachten, dass nicht die Kräfte, sondern die Drehmomente gleichgesetzt werden. Während die Bewegungsgleichung für lineare Bewegungen $m\\ddot{x}=\\sum_iF_i$ aus der Impulserhaltung abgeleitet werden können, resultiert die Bewegungsgleichung für Rotationsbewegungen aus der Drehimpulserhaltung.
		`)

		this.dampedOscText1c = this.sanitizer.bypassSecurityTrustHtml(`
			Die 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a>
			für die Bewegung des Schwungrads lautet also
			$$\\Theta\\ddot{\\varphi}+\\rho\\dot{\\varphi}+D\\varphi=0$$
			Häufig verwendet man die sogenannte "Normalform", also die Form, in der kein zusätzlicher Faktor in dem Term mit der höchsten Ableitung steht. In dieser Form lautet die 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a>
			:
		`)

		this.dampedOscText1d = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega^2_0\\varphi=0$$
		`)

		this.dampedOscText1e = this.sanitizer.bypassSecurityTrustHtml(`
			mit den Abkürzungen $2\\beta:=\\rho/\\Theta$ ($\\beta$:
			<a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>;
			die Wahl des Faktor 2 ist hier zunächst beliebig, es zeigt sich in der Lösung der Gleichung, dass diese Wahl geschickt ist) und  $\\omega_0^2:=D/\\Theta$ ($\\omega_0$:
			<a href="#glossary-natural-frequency" class="glossary-link">ungedämpfte Eigenfrequenz</a>
			).
		`)

		this.dampedOscText2a = this.sanitizer.bypassSecurityTrustHtml(`
			Diese 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a>
			beschreibt, bis auf Anfangsbedingungen, das System vollständig, die Lösung der Gleichung gibt aber einen deutlich besseren Einblick darein, wie die Bewegung möglicherweise aussieht.<br><br>

			Zur Lösung der 
			<a href="#glossary-hom-dgl" class="glossary-link">Differentialgleichung</a>
			kann der sogenannte 
			<a href="#glossary-exponential-ansatz" class="glossary-link">Exponentialansatz</a>
			verwendet werden.
			Dieser Ansatz bietet sich bei vielen Bewegungsgleichungen an und die grundsätzliche Idee ist, dass man annimmt die Lösung sei von der Form $\\varphi(t)=exp(\\lambda t)$ und dann durch Einsetzen schaut, für welche $\\lambda$ dieser Ansatz gerechtfertigt ist.
		`)

		this.dampedOscText2b = this.sanitizer.bypassSecurityTrustHtml(`
			Zum Lösen der Differentialgleichung verwenden wir den Exponentialansatz. Dieser bietet sich in unserem Fall an, da alle Terme die Funktion selbst ($\\varphi(t)$) und deren Ableitungen enthalten.
			<br><br>
			Wir verwenden also den Ansatz $\\varphi(t)=\\exp(\\lambda t)$.
			Wir gehen davon aus, dass die tatsächliche Lösung eine Linearkombination von Funktionen dieser Form ist, dass also gilt $\\varphi(t)=\\sum_{i=1}^n a_i\\exp(\\lambda_i t)$, wobei $n$ den Grad der höchsten Ableitung in der Bewegungsgleichung darstellt.
			<br><br>
			Im nächsten Schritt setzen wir diesen Ansatz in unsere Differentialgleichung ein:
			$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=0$$
			$$-\\lambda^2\\exp(\\lambda t)+2i\\beta\\lambda\\exp(\\lambda t)+\\omega_0^2\\exp(\\lambda t)=0$$
			$$-\\lambda^2\\varphi(t)+2i\\beta\\lambda\\varphi(t)+\\omega_0^2\\varphi(t)=0$$
			$$(-\\lambda^2+2i\\beta\\lambda+\\omega_0^2)\\varphi(t)=0$$
			<br>
			Nun müssen wir schauen, für welche Werte $\\lambda$ diese Gleichung gelöst wird, wir setzen also $-\\lambda^2+2i\\beta\\lambda+\\omega_0^2=0$ und finden als Bedingung für $\\lambda$:
			$$\\lambda_{1,2}=-i\\beta\\pm\\sqrt{-\\beta^2+\\omega_0^2}=-i\\beta\\pm\\sqrt{\\omega_0^2-\\beta^2}$$
			<br>
			Der Wurzel-Ausdruck bedingt hierbei, dass es drei unterschiedliche Lösungen der Differentialgleichung gibt, da die Wurzel größer, kleiner oder gleich Null sein kann. Diese Fälle beschreiben den Kriechfall, aperiodischen Grenzfall oder den Schwingfall.
			<br><br>
			Für den Schwingfall, der bei $\\beta^2<\\omega_0^2$ eintritt, und den Kriechfall, der bei $\\beta^2>\\omega_0^2$ eintritt, ergibt sich als Lösung:
			$$\\varphi(t)=c_1\\exp(\\lambda_1 t)+c_2\\exp(\\lambda_2 t),$$
			wobei $c_1$ und $c_2$ komplexe Zahlen sind, deren Größe sich aus den Anfangsbedingungen (Auslenkung und Geschwindigkeit) ergibt.
			<br><br>
			Einsetzen der $\\lambda$-Werte, Ausklammern des Terms $\\exp(-\\beta t)$ und Umformen der Gleichung ergibt die unten stehende Gleichung.
			<br><br>
			Für den aperiodischen Grenzfall, der bei $\\beta^2=\\omega_0^2$ eintritt, ergibt sich als Lösung:
			$$\\varphi(t)=c_1\\exp(\\lambda t)+c_2 t\\exp(\\lambda t),$$
			wobei zu beachten ist, dass die zusätzliche lineare Abhängigkeit von $t$ im zweiten Term daraus resultiert, dass in diesem Spezialfall $\\lambda_1=\\lambda_2=\\lambda$ gilt.
			(Für weitere Begründungen referenzieren wir an dieser Stelle auf die Rechenmethoden-Vorlesungen bzw. auf Grundlagenliteratur in diesem Gebiet.)
		`)

		this.dampedOscText2c = this.sanitizer.bypassSecurityTrustHtml(`
			Für den <b>Schwingfall</b> ($\\omega_0^2>\\beta^2$), wenn also die Dämpfung klein im Vergleich zur <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a> 
			des Systems ist, kann die Lösung in zwei äquivalenten Weisen angegeben werden:
		`)

		this.dampedOscText2d = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\varphi(t)=(a\\sin(\\omega_e t)+b\\cos(\\omega_e t))e^{-\\beta t}$$
			bzw.
			$$\\varphi(t)=\\varphi_0\\cos(\\omega_e t+\\phi)e^{-\\beta t},$$
			wobei $\\omega_e=\\sqrt{\\omega_0^2-\\beta^2}$ die Eigenfrequenz des (gedämpften) Systems ist.
		`)



		this.dampedOscText2e = this.sanitizer.bypassSecurityTrustHtml(`
			Zur Erinnerung: $\\beta$ ist der 
			<a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a> 
			und $\\omega_0$ die 
			<a href="#glossary-natural-frequency" class="glossary-link">ungedämpfte Eigenfrequenz</a>
			, die durch 
			<a href="#glossary-directive-moment" class="glossary-link">Richtmoment</a>
			und 
			<a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a> 
			bestimmt ist.
			<br><br>
			Die Variablen $a$ und $b$ in der obigen Gleichung sowie $\\varphi_0$ (
			<a href="#glossary-amplitude" class="glossary-link">Maximalamplitude</a> 
			) und $\\phi$ (Phasenverschiebung) in der unteren Gleichung ergeben sich aus den Anfangsbedingungen (Anfangsauslenkung und -geschwindigkeit).
			<br><br>
			Die  
			<a href="#glossary-natural-frequency" class="glossary-link">gedämpfte Eigenfrequenz</a> 
			kann im Experiment aus der Periodenlänge $T=\\frac{1}{\\omega_e}$ bestimmt werden.
		`)

		this.dampedOscText3a = this.sanitizer.bypassSecurityTrustHtml(`
			In der linken Abbildung ist exemplarisch der zeitliche Verlauf der Winkelauslenkung eines gedämpften Systems dargestellt, wobei die Anfangsauslenkung $x_0>0$ und die Anfangsgeschwindigkeit $v_0=0$ sind.<br><br>

			Die blaue Kurve zeigt jeweils die Winkelauslenkung des Rades über die Zeit, die rote gestrichelte Kurve deutet die abnehmende 
			<a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
			über die Zeit an — sie wird auch Einhüllende genannt.<br><br>

			Je stärker der Überlapp zwischen Magnet und Schwungrad, desto schneller nimmt die 
			<a href="#glossary-amplitude" class="glossary-link">Amplitude</a> 
			des Systems ab. In den Abbildungen links nimmt die Dämpfung von oben nach unten zu, in der untersten Abbildung zeichnet sich bereits der Übergang zum 
			<a href="#glossary-critical-damping" class="glossary-link">aperischen Grenzfall</a> 
			ab.<br><br>

			Kennt man den zeitlichen Verlauf, so kann das Verhältnis der 
			<a href="#glossary-amplitude" class="glossary-link">Amplituden</a>  
			in Kombination mit der Periodendauer $T$ genutzt werden, um den 
			<a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a> 
			$\\beta$ zu bestimmen.<br><br>

			Als zusätzliche Hilfsgröße zur Analyse der Dämpfung wird hierfür das „logarithmische Dekrement" $\\Lambda$, das sich explizit auf das Verhältnis benachbarter Maxima (zeitlicher Abstand = Periodendauer $T$) bezieht:
			$$\\Lambda=\\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right)=\\ln(\\exp(\\beta T))=\\beta T.$$
		`)

		this.dampedOscText3b = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\Lambda=\\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right)$$
			Setzen wir hier die allgemeine Lösung der Differentialgleichung von der vorangegangenen Seite ein, erhalten wir:
			$$\\Lambda=\\ln\\left(\\frac{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)}{\\varphi_0\\cos(\\omega_e(t+T)+\\phi)\\exp(-\\beta(t+T))}\\right)$$
			Beachten wir die Periodizität der Cosinus-Funktion, also dass $\\cos(\\omega t+\\phi)=\\cos(\\omega(t+T)+\\phi)$, und die Additivität der Exponentialfunktion $\\exp(a+b)=\\exp(a)\\exp(b)$, ergibt sich:
			$$\\Lambda=\\ln\\left(\\frac{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)}{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)\\exp(-\\beta T)}\\right)$$
			Damit können wir einige Faktoren kürzen und erhalten den behaupteten Zusammenhang:
			$$\\Lambda=\\ln(\\exp(\\beta T))=\\beta T.$$
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
        const page = this.currentView.replace('damped_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'damped_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean {
        return this.currentView === 'damped_osc1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'damped_osc3';
    }



    // going back shows the previous subpage / home page
    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.router.navigate(["/decision/e-damped-oscillations"]);
            return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            if (this.navigationFlow === 'learning-first') {
                this.router.navigate(['/simulation/sim-e-damped-osc'], { queryParams: { flow: 'learning-first' } });
            } else {
                this.router.navigate(['/decision/e-driven-oscillations']);
            }
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
