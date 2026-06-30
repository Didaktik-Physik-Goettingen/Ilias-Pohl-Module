import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';



@Component({
  selector: 'app-e2-damped-oscillation',
  imports: [CommonModule, RouterLink, MultipleChoice],
  templateUrl: './e2-damped-oscillation.html',
  styleUrl: './e2-damped-oscillation.css',
})
export class E2DampedOscillation {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay
    ) {}

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
        question: 'Welche der folgenden Aussagen trifft auf das schwingfende Rad zu',
        options: [
            { value: 'answer1', label: ' Je größer der Überlapp zwischen Magnet und Schwungrad, desto größer ist die Periodenlänge der Schwingung.' },
            { value: 'answer2', label: ' Die Größe des Überlapps zwischen Magnet und Schwungrad hat keinen Einfluss auf die Bewegung des Schwungrads.' },
            { value: 'answer3', label: 'Die Einstellung der Wirbelstrombremse bedingt nur die Abnahme der Amplitude, die Frequenz ist hiervon unabhängig.' },
            { value: 'answer4', label: ' Je größer der Überlapp zwischen Magnet und Schwungrad, desto kleiner ist die Periodenlänge der Schwingung.' }
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


    ngOnInit() {
        // restore subpage from URL query param
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page && ['1','2','3'].includes(page)) {
            this.currentView = `damped_osc${page}`;
        }

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
			Die DGL für die Bewegung des Schwungrads lautet also
			$$\\Theta\\ddot{\\varphi}+\\rho\\dot{\\varphi}+D\\varphi=0$$
			Häufig verwendet man die sogenannte "Normalform", also die Form, in der kein zusätzlicher Faktor in dem Term mit der höchsten Ableitung steht. In dieser Form lautet die Differentialgleichung:
		`)

		this.dampedOscText1d = this.sanitizer.bypassSecurityTrustHtml(`
			$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega^2_0\\varphi=0$$
		`)

		this.dampedOscText1e = this.sanitizer.bypassSecurityTrustHtml(`
			mit den Abkürzungen $2\\beta:=\\rho/\\Theta$ ($\\beta$:
			<a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>;
			die Wahl des Faktor 2 ist hier zunächst beliebig, es zeigt sich in der Lösung der Gleichung, dass diese Wahl geschickt ist) und  $\\omega_0^2:=D/\\Theta$ ($\\omega_0$: <b>ungedämpfte Eigenfrequenz</b>).
		`)

		this.dampedOscText2a = this.sanitizer.bypassSecurityTrustHtml(`
			Diese Differentialgleichung beschreibt, bis auf Anfangsbedingungen, das System vollständig, die Lösung der Gleichung gibt aber einen deutlich besseren Einblick darein, wie die Bewegung möglicherweise aussieht.<br><br>

			Zur Lösung der Differentialgleichung kann der sogenannte "Exponentialansatz" verwendet werden.
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
			Für den <b>Schwingfall</b> ($\\omega_0^2>\\beta^2$), wenn also die Dämpfung klein im Vergleich zur Eigenfrequenz des Systems ist, kann die Lösung in zwei äquivalenten Weisen angegeben werden:
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
			und $\\omega_0$ die ungedämpfte Eigenfrequenz, die durch 
			<a href="#glossary-directive-moment" class="glossary-link">Richtmoment</a>
			und 
			<a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a> 
			bestimmt ist.
			<br><br>
			Die Variablen $a$ und $b$ in der obigen Gleichung sowie $\\varphi_0$ (Maximalamplitude) und $\\phi$ (Phasenverschiebung) in der unteren Gleichung ergeben sich aus den Anfangsbedingungen (Anfangsauslenkung und -geschwindigkeit).
			<br><br>
			Die gedämpfte Eigenfrequenz kann im Experiment aus der Periodenlänge $T=\\frac{1}{\\omega_e}$ bestimmt werden.
		`)

        this.renderMath();
    }


    ngOnDestroy() {
        // End tracking when leaving the module
        this.trackingService.endModule();
    }


    private restoreCompletionState() {
        // check if questions were already answered correctly
        this.isCorrect1 = this.trackingService.isQuestionCompleted(this.question1.questionId);
    }


    // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (window.MathJax) {
					// Clear all previous MathJax processing
					const elements = document.querySelectorAll('.MathJax');
					elements.forEach(el => el.remove());

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
    get isFirstPage(): boolean {
        return this.currentView === 'damped_osc1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'damped_osc3';
    }



    // going back shows the previous subpage / home page
    goBack() {
        if (this.currentView === 'damped_osc1') {
            this.router.navigate(["/decision/e-damped-oscillations"]);
            return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc3';
        }
        this.updateUrl();
        this.renderMath();
    }


    // go forward shows next subpage / page
    goForward() {
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc4';
        } else if (this.currentView === 'damped_osc4') {
            this.router.navigate(['/decision/e-damped-oscillations']);
            return;
        }
        this.updateUrl();
        this.renderMath();
    }
}
