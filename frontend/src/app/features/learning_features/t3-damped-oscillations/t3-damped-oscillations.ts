import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';

declare global { interface Window { MathJax: any; } }

@Component({
    selector: 'app-t3-damped-oscillations',
    imports: [CommonModule, RouterLink, MultipleChoice],
    templateUrl: './t3-damped-oscillations.html',
    styleUrl: './t3-damped-oscillations.css',
})
export class T3DampedOscillations implements OnInit, AfterViewInit, OnDestroy {
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

    currentView = 'damped_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean { return this.currentView === 'damped_osc1'; }
    get isLastPage(): boolean { return this.currentView === 'damped_osc5'; }

    // +++ SafeHtml content +++

    t3Text1a!: SafeHtml;
    t3Text1b!: SafeHtml;
    t3Text1c!: SafeHtml;
    t3Text1d!: SafeHtml;
    t3Text1e!: SafeHtml;
    t3Text1spoiler!: SafeHtml;

    t3Text2a!: SafeHtml;
    t3Text2b!: SafeHtml;
    t3Text2c!: SafeHtml;
    t3Text2d!: SafeHtml;
    t3Text2spoiler!: SafeHtml;

    t3Text3a!: SafeHtml;
    t3Text3b!: SafeHtml;

    t3Text4a!: SafeHtml;
    t3Text4b!: SafeHtml;
    t3Text4c!: SafeHtml;

    t3Text5a!: SafeHtml;

    // +++ Question data +++

    question1 = {
        questionId: 't3-q1-exp-ansatz',
        question: 'Warum kann man die DGL des gedämpften Oszillators mit dem Exponentialansatz lösen?',
        options: [
            { value: 'answer1', label: 'Weil die DGL nicht linear ist.' },
            { value: 'answer2', label: 'Weil der Ansatz nur für ungedämpfte Systeme funktioniert.' },
            { value: 'answer3', label: 'Weil $e^{\\lambda t}$ bei Ableitung nur mit konstanten Faktoren multipliziert wird.' },
            { value: 'answer4', label: 'Weil die Lösung immer sinusförmig sein muss.' }
        ],
        correctAnswers: ['answer3'],
        containerId: 't3-q1-container',
        successMessage: '✓ Richtig. Exponentialfunktionen reproduzieren sich beim Ableiten – das ermöglicht das Kürzen in der DGL.',
        incompleteMessage: '✗ Überlegen Sie, was beim Ableiten von $e^{\\lambda t}$ passiert.',
        incorrectMessage: '✗ Überlegen Sie, was beim Ableiten von $e^{\\lambda t}$ passiert.'
    };

    question2 = {
        questionId: 't3-q2-gen-solution',
        question: 'Was lässt sich über die allgemeine Lösung $x(t) = e^{-\\gamma t}(c_1 e^{-i\\omega_e t} + c_2 e^{i\\omega_e t})$ aussagen?',
        options: [
            { value: 'answer1', label: 'Die Frequenz $\\omega_e$ ist durch $\\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$ bestimmt.' },
            { value: 'answer2', label: 'Die Parameter $c_1, c_2$ hängen ausschließlich von den Anfangsbedingungen ab.' },
            { value: 'answer3', label: 'Der Faktor $e^{-\\gamma t}$ sorgt dafür, dass alle Lösungen exponentiell abfallen.' },
            { value: 'answer4', label: 'Der Schwinganteil ist unabhängig vom Verhältnis $\\gamma/\\omega_0$.' },
            { value: 'answer5', label: 'Die Form der Lösung ist nur im Schwingfall physikalisch interpretierbar.' }
        ],
        correctAnswers: ['answer1', 'answer2', 'answer3'],
        containerId: 't3-q2-container',
        successMessage: '✓ Richtig. Frequenz, Anfangsbedingungen und exponentieller Abfall sind korrekt erkannt.',
        incompleteMessage: '✗ Beachten Sie, dass $\\omega_e$ von $\\gamma$ abhängt und der Schwinganteil fallabhängig ist.',
        incorrectMessage: '✗ Beachten Sie, dass $\\omega_e$ von $\\gamma$ abhängt und der Schwinganteil fallabhängig ist.'
    };

    question3 = {
        questionId: 't3-q3-schwingfall-condition',
        question: 'Wann spricht man beim harmonischen Oszillator vom schwach gedämpften Schwingfall?',
        options: [
            { value: 'answer1', label: 'Wenn $\\gamma = 0$' },
            { value: 'answer2', label: 'Wenn $\\gamma > \\omega_0$' },
            { value: 'answer3', label: 'Wenn $\\gamma < \\omega_0$' }
        ],
        correctAnswers: ['answer3'],
        containerId: 't3-q3-container',
        successMessage: '✓ Richtig. Wenn $\\gamma < \\omega_0$ sind die Lösungen komplex und das System schwingt periodisch.',
        incompleteMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.',
        incorrectMessage: '✗ Beachten Sie das Verhältnis von Dämpfung und Eigenfrequenz.'
    };

    question4 = {
        questionId: 't3-q4-schwingfall-matching',
        question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Ausdruck und Bedeutung sind korrekt?',
        options: [
            { value: 'answer1', label: 'Gedämpfter Schwingungsanteil → $\\cos(\\omega_e t)$' },
            { value: 'answer2', label: 'Exponentieller Abfall der Amplitude → $e^{-\\gamma t}$' },
            { value: 'answer3', label: 'Eigenfrequenz des gedämpften Systems → $\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$' },
            { value: 'answer4', label: 'Gedämpfter Schwingungsanteil → $e^{-\\gamma t}$' },
            { value: 'answer5', label: 'Eigenfrequenz des gedämpften Systems → $\\cos(\\omega_e t)$' }
        ],
        correctAnswers: ['answer1', 'answer2', 'answer3'],
        containerId: 't3-q4-container',
        successMessage: '✓ Richtig. Die Terme sind korrekt zugeordnet.',
        incompleteMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.',
        incorrectMessage: '✗ Überlegen Sie, welcher Term die Amplitude beschreibt.'
    };

    question5 = {
        questionId: 't3-q5-exp-factor',
        question: 'Was beschreibt der Faktor $x(t+T)/x(t) = e^{-\\gamma T}$ in der Lösung des gedämpften Oszillators?',
        options: [
            { value: 'answer1', label: 'Die ungedämpfte Schwingung' },
            { value: 'answer2', label: 'Die zeitlich konstante Eigenfrequenz' },
            { value: 'answer3', label: 'Die exponentielle Abnahme der Amplitude' },
            { value: 'answer4', label: 'Die Beschleunigung des Systems' }
        ],
        correctAnswers: ['answer3'],
        containerId: 't3-q5-container',
        successMessage: '✓ Richtig. $e^{-\\gamma T}$ beschreibt den exponentiellen Amplitudenabfall.',
        incompleteMessage: '✗ Betrachten Sie, wie sich $e^{-\\gamma t}$ mit der Zeit verhält.',
        incorrectMessage: '✗ Betrachten Sie, wie sich $e^{-\\gamma t}$ mit der Zeit verhält.'
    };

    question6 = {
        questionId: 't3-q6-amplitude-ratio',
        question: 'Wie verändert sich der Quotient $e^{-\\gamma T}$, wenn die Dämpfung $\\gamma$ größer wird?',
        options: [
            { value: 'answer1', label: 'Er wird größer als 1, weil die Amplitude wächst.' },
            { value: 'answer2', label: 'Er bleibt gleich, weil die Amplitude unabhängig von der Dämpfung abfällt.' },
            { value: 'answer3', label: 'Er wird exakt 0, weil ein einziges Maximum danach sofort vollständig verschwindet.' },
            { value: 'answer4', label: 'Er wird kleiner, weil es zu einem stärkeren Abfall der Amplitude von einem Maximum zum nächsten kommt.' }
        ],
        correctAnswers: ['answer4'],
        containerId: 't3-q6-container',
        successMessage: '✓ Richtig. Größeres $\\gamma$ → stärkerer Abfall → $e^{-\\gamma T}$ wird kleiner.',
        incompleteMessage: '✗ Denken Sie daran: $e^{-\\gamma T}$ nimmt mit größerem $\\gamma$ ab.',
        incorrectMessage: '✗ Denken Sie daran: $e^{-\\gamma T}$ nimmt mit größerem $\\gamma$ ab.'
    };

    question7 = {
        questionId: 't3-q7-log-dekrement',
        question: 'Das logarithmische Dekrement ist definiert als $\\Lambda = \\ln(x(t)/x(t+T)) = 2\\pi\\gamma/\\sqrt{\\omega_0^2-\\gamma^2} = \\gamma\\cdot T$. Welche der folgenden Aussagen treffen zu?',
        options: [
            { value: 'answer1', label: 'Ein größeres logarithmisches Dekrement bedeutet stärkere Dämpfung.' },
            { value: 'answer2', label: 'Mit steigender Dämpfung vergrößert sich die Periodendauer $T$.' },
            { value: 'answer3', label: 'Ein kleineres $\\Lambda$ zeigt, dass die Amplitude zwischen zwei Maxima kaum abnimmt.' },
            { value: 'answer4', label: 'Bei größerer Dämpfung wird die Kreisfrequenz $\\omega_e$ kleiner.' }
        ],
        correctAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
        containerId: 't3-q7-container',
        successMessage: '✓ Richtig. Alle vier Aussagen treffen zu.',
        incompleteMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres $\\omega_e$ → größeres $T$.',
        incorrectMessage: '✗ Bedenken Sie: größere Dämpfung → kleineres $\\omega_e$ → größeres $T$.'
    };

    question8 = {
        questionId: 't3-q8-aper-grenzfall',
        question: 'Welche Aussagen zum aperiodischen Grenzfall sind korrekt?',
        options: [
            { value: 'answer1', label: 'Das System kehrt schneller zur Ruhelage zurück als im Kriechfall ($\\gamma > \\omega_0$).' },
            { value: 'answer2', label: 'Die Lösung besitzt kein Maximum.' },
            { value: 'answer3', label: 'Die Lösungen der Bestimmungsgleichung sind reell und verschieden.' },
            { value: 'answer4', label: 'Die allgemeine Lösung lautet $x(t) = (c_1 t + c_2)e^{-\\gamma t}$.' }
        ],
        correctAnswers: ['answer1', 'answer4'],
        containerId: 't3-q8-container',
        successMessage: '✓ Richtig. Der aperiodische Grenzfall ist schneller als der Kriechfall und hat entartete (gleiche) Lösungen.',
        incompleteMessage: '✗ Beachten Sie: $\\lambda_1 = \\lambda_2 = -\\gamma$ bedeutet entartet, nicht verschieden.',
        incorrectMessage: '✗ Beachten Sie: $\\lambda_1 = \\lambda_2 = -\\gamma$ bedeutet entartet, nicht verschieden.'
    };

    question9 = {
        questionId: 't3-q9-summary-matching',
        question: 'Ordnen Sie zu: Welche der folgenden Zuordnungen zwischen Kennzeichen und Dämpfungsfall sind korrekt?',
        options: [
            { value: 'answer1', label: '$\\gamma = \\omega_0$ → Aperiodischer Grenzfall' },
            { value: 'answer2', label: 'Langsame Rückkehr zur Ruhelage → Kriechfall' },
            { value: 'answer3', label: 'Frequenz $\\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$ → Gedämpfte Schwingung (Schwingfall)' },
            { value: 'answer4', label: '$\\gamma = \\omega_0$ → Kriechfall' },
            { value: 'answer5', label: 'Langsame Rückkehr zur Ruhelage → Aperiodischer Grenzfall' }
        ],
        correctAnswers: ['answer1', 'answer2', 'answer3'],
        containerId: 't3-q9-container',
        successMessage: '✓ Richtig. Die drei Fälle sind korrekt ihren Kennzeichen zugeordnet.',
        incompleteMessage: '✗ $\\gamma = \\omega_0$ ist der Grenzfall, $\\gamma > \\omega_0$ der Kriechfall.',
        incorrectMessage: '✗ $\\gamma = \\omega_0$ ist der Grenzfall, $\\gamma > \\omega_0$ der Kriechfall.'
    };

    question10 = {
        questionId: 't3-q10-gebaude',
        question: 'Welcher der drei Schwingungsfälle wäre für ein hohes Gebäude aus Komfort- und Sicherheitsgründen am besten geeignet?',
        options: [
            { value: 'answer1', label: 'Eine Kombination aus Schwingfall und Kriechfall, da beide ähnlich reagieren.' },
            { value: 'answer2', label: 'Schwingfall, da die Auslenkung gleichmäßig verteilt wird.' },
            { value: 'answer3', label: 'Aperiodischer Grenzfall, da das Gebäude möglichst schnell in die Ruhelage zurückkehrt, ohne nachzuschwingen.' },
            { value: 'answer4', label: 'Kriechfall, da die Bewegung langsam abklingt und weiche Bewegungen entstehen.' }
        ],
        correctAnswers: ['answer3'],
        containerId: 't3-q10-container',
        successMessage: '✓ Richtig. Der aperiodische Grenzfall kehrt schnellstmöglich ohne Nachschwingen zur Ruhe zurück – ideal für Gebäude.',
        incompleteMessage: '✗ Schwingfall schwingt zu lange nach, Kriechfall ist zu langsam.',
        incorrectMessage: '✗ Schwingfall schwingt zu lange nach, Kriechfall ist zu langsam.'
    };

    isCorrect1 = false;  onQuestion1Answered(v: boolean): void  { this.isCorrect1 = v; }
    isCorrect2 = false;  onQuestion2Answered(v: boolean): void  { this.isCorrect2 = v; }
    isCorrect3 = false;  onQuestion3Answered(v: boolean): void  { this.isCorrect3 = v; }
    isCorrect4 = false;  onQuestion4Answered(v: boolean): void  { this.isCorrect4 = v; }
    isCorrect5 = false;  onQuestion5Answered(v: boolean): void  { this.isCorrect5 = v; }
    isCorrect6 = false;  onQuestion6Answered(v: boolean): void  { this.isCorrect6 = v; }
    isCorrect7 = false;  onQuestion7Answered(v: boolean): void  { this.isCorrect7 = v; }
    isCorrect8 = false;  onQuestion8Answered(v: boolean): void  { this.isCorrect8 = v; }
    isCorrect9 = false;  onQuestion9Answered(v: boolean): void  { this.isCorrect9 = v; }
    isCorrect10 = false; onQuestion10Answered(v: boolean): void { this.isCorrect10 = v; }

    // +++ Lifecycle +++

    ngOnInit(): void {
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page) this.currentView = `damped_osc${page}`;
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';
        this.trackingService.startModule('t3-damped-oscillations-module');
        this.restoreCompletionState();

        // Page 1 — Exponentialansatz
        this.t3Text1a = this.sanitizer.bypassSecurityTrustHtml(`
            Die Differentialgleichung (DGL) des <strong>gedämpften, freien harmonischen Oszillators</strong>
            ergibt sich aus der Bilanzierung aller Kräfte: Rückstellkraft $F_D = -Dx$, Reibungskraft
            $F_R = -b\\dot{x}$ und keine äußere Anregung. In der Normalform lautet die Gleichung:
        `);

        this.t3Text1b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$$
        `);

        this.t3Text1c = this.sanitizer.bypassSecurityTrustHtml(`
            mit den Abkürzungen $\\omega_0^2 := D/m$ (ungedämpfte
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>)
            und $2\\gamma := b/m$ ($\\gamma > 0$:
            <a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>).
            Der Faktor 2 in $2\\gamma$ erweist sich in der Lösung als rechnerisch günstig.<br><br>

            Diese Gleichung nennt man <strong>gedämpft</strong>, weil die Reibungskraft proportional zur
            Geschwindigkeit ist, und <strong>frei</strong>, weil keine äußere Anregung wirkt (
			<a href="#glossary-hom-dgl" class="glossary-link">homogene Differentialgleichung</a>
			).<br><br>

            Zur Lösung verwendet man den
            <a href="#glossary-exponential-ansatz" class="glossary-link">Exponentialansatz</a>
            $x(t) = c\\,e^{\\lambda t}$ ($c \\neq 0$). Da $e^{\\lambda t}$ beim Ableiten nur mit konstanten
            Faktoren multipliziert wird, lassen sich alle Terme nach dem Einsetzen durch $e^{\\lambda t}$
            kürzen. Man erhält die <strong>Bestimmungsgleichung</strong>:
            $$\\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0$$
            Ihre Lösungen folgen aus der pq-Formel:
        `);

        this.t3Text1d = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\lambda_{1,2} = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2}$$
        `);

        this.t3Text1e = this.sanitizer.bypassSecurityTrustHtml(`
            Mit der gedämpften 
			<a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a> 
			$\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$ lautet die
            allgemeine Lösung:
            $$x(t) = e^{-\\gamma t}\\!\\left(c_1\\,e^{-i\\omega_e t} + c_2\\,e^{i\\omega_e t}\\right)$$
            Der Ausdruck unter der Wurzel bestimmt, welcher der drei Dämpfungsfälle vorliegt:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): $\\lambda$ komplex, System schwingt periodisch mit abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): $\\lambda$ reell, System kriecht monoton zur Ruhe</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): entartete Lösung, schnellste Rückkehr ohne Schwingen</li>
            </ul>
        `);

        this.t3Text1spoiler = this.sanitizer.bypassSecurityTrustHtml(`
            Wir verwenden den Ansatz $x(t) = c\\,e^{\\lambda t}$ ($c \\neq 0$). Die Ableitungen sind:
            $$\\dot{x}(t) = c\\lambda\\,e^{\\lambda t}, \\qquad \\ddot{x}(t) = c\\lambda^2\\,e^{\\lambda t}$$
            Einsetzen in $\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$ und Ausklammern von $c\\,e^{\\lambda t} \\neq 0$:
            $$\\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0$$
        `);

        // Page 2 — Schwingfall
        this.t3Text2a = this.sanitizer.bypassSecurityTrustHtml(`
            Im <strong>Schwingfall</strong> ($\\gamma < \\omega_0$) sind die Lösungen der Bestimmungsgleichung komplex:
            $$\\lambda_{1,2} = -\\gamma \\pm i\\omega_e, \\qquad \\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$$
            Die allgemeine Lösung ist eine gedämpfte Schwingung. Für die gebräuchlichsten Anfangsbedingungen
            $x(0) = A$, $\\dot{x}(0) = 0$ vereinfacht sie sich zu:
        `);

        this.t3Text2b = this.sanitizer.bypassSecurityTrustHtml(`
            $$x(t) = A\\,e^{-\\gamma t}\\cos(\\omega_e t)$$
        `);

        this.t3Text2c = this.sanitizer.bypassSecurityTrustHtml(`
            Der Faktor $e^{-\\gamma t}$ beschreibt den exponentiellen Amplitudenabfall, $\\cos(\\omega_e t)$
            den periodischen Schwingungsanteil mit der <em>gedämpften</em> Eigenfrequenz $\\omega_e < \\omega_0$.<br><br>

            <strong>Phasenraumdarstellung:</strong> Im Phasenraum $(x,\\, \\dot{x}/\\omega_0)$ ergibt sich eine
            einwärts spiralende Kurve. Der Nullpunkt ist ein <em>stabiler Attraktor</em>, da die
            Energie stetig abnimmt.<br><br>

            <strong>Logarithmisches Dekrement:</strong> Das Verhältnis zweier aufeinanderfolgender Maxima
            (zeitlicher Abstand = Periodendauer $T = 2\\pi/\\omega_e$) beträgt:
            $$\\frac{x(t)}{x(t+T)} = e^{\\gamma T}$$
            Daraus definiert man das <strong>logarithmische Dekrement</strong>:
        `);

        this.t3Text2d = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\Lambda = \\ln\\frac{x(t)}{x(t+T)} = \\gamma T = \\frac{2\\pi\\gamma}{\\sqrt{\\omega_0^2 - \\gamma^2}}$$
        `);

        this.t3Text2spoiler = this.sanitizer.bypassSecurityTrustHtml(`
            Einsetzen der Lösung $x(t) = A\\,e^{-\\gamma t}\\cos(\\omega_e t)$ in den Logarithmus:
            $$\\Lambda = \\ln\\frac{A\\,e^{-\\gamma t}\\cos(\\omega_e t)}{A\\,e^{-\\gamma(t+T)}\\cos(\\omega_e(t+T))}$$
            Da $\\cos(\\omega_e(t+T)) = \\cos(\\omega_e t + 2\\pi) = \\cos(\\omega_e t)$ (Periodizität), kürzen
            sich die Cosinus-Terme heraus. Mit $e^{-\\gamma t}/e^{-\\gamma(t+T)} = e^{\\gamma T}$ folgt:
            $$\\Lambda = \\ln(e^{\\gamma T}) = \\gamma T$$
        `);

        // Page 3 — Kriechfall
        this.t3Text3a = this.sanitizer.bypassSecurityTrustHtml(`
            Im <strong>Kriechfall</strong> ($\\gamma > \\omega_0$) sind beide Lösungen der
            Bestimmungsgleichung reell und negativ:
            $$\\lambda_{1,2} = -\\gamma \\pm \\alpha, \\qquad \\alpha = \\sqrt{\\gamma^2 - \\omega_0^2} \\in \\mathbb{R},\\quad \\alpha < \\gamma$$
            Da $\\alpha < \\gamma$, sind beide Exponenten $\\lambda_{1,2}$ negativ: das System kehrt ohne
            Schwingungen langsam zur Ruhe zurück. Die allgemeine Lösung lautet:
        `);

        this.t3Text3b = this.sanitizer.bypassSecurityTrustHtml(`
            $$x(t) = e^{-\\gamma t}\\!\\left(c_1\\,e^{\\alpha t} + c_2\\,e^{-\\alpha t}\\right)$$
            Der Term $e^{-\\gamma t}$ dominiert für große $t$, da $\\alpha < \\gamma$ gilt. Für die
            Anfangsbedingungen $x(0) = 0$, $\\dot{x}(0) = v_0$ ergibt sich die Speziallösung:
            $$x(t) = \\frac{v_0}{\\alpha}\\,e^{-\\gamma t}\\sinh(\\alpha t)$$
            Für $x(0) = A$, $\\dot{x}(0) = 0$:
            $$x(t) = \\frac{A}{\\alpha}\\,e^{-\\gamma t}\\!\\left(\\alpha\\cosh(\\alpha t) + \\gamma\\sinh(\\alpha t)\\right)$$
            Im Vergleich zum aperiodischen Grenzfall fällt der Kriechfall <em>langsamer</em> ab, da
            die stärkere Dämpfung das System träger macht.
        `);

        // Page 4 — Aperiodischer Grenzfall
        this.t3Text4a = this.sanitizer.bypassSecurityTrustHtml(`
            Im <strong>aperiodischen Grenzfall</strong> gilt $\\gamma = \\omega_0$. Die Bestimmungsgleichung
            hat dann eine doppelte Nullstelle:
            $$\\lambda_1 = \\lambda_2 = \\lambda = -\\gamma$$
            Da die allgemeine Lösung zwei freie Integrationskonstanten benötigt, reicht der einfache
            Exponentialansatz nicht aus. Man erweitert ihn durch einen linearen Vorfaktor:
        `);

        this.t3Text4b = this.sanitizer.bypassSecurityTrustHtml(`
            $$x(t) = (c_1 t + c_2)\\,e^{-\\gamma t}$$
        `);

        this.t3Text4c = this.sanitizer.bypassSecurityTrustHtml(`
            Für $x(0) = A$, $\\dot{x}(0) = 0$ ergibt sich $x(t) = A(1 + \\gamma t)\\,e^{-\\gamma t}$;
            für $x(0) = 0$, $\\dot{x}(0) = v_0$ folgt $x(t) = v_0 t\\,e^{-\\gamma t}$.<br><br>

            Der aperiodische Grenzfall kehrt <em>schneller zur Ruhe zurück als der Kriechfall</em> — er
            ist der Übergang zwischen Schwingfall und Kriechfall. Das Maximum bei $t_\\text{max} = 1/\\gamma$
            ist das einzige und es wird kein weiteres Vorzeichenwechsel beobachtet.<br><br>

            Dieses Verhalten ist technisch besonders interessant: Messgerätezeiger und Gebäudedämpfer
            werden oft nahe am aperiodischen Grenzfall ausgelegt, um schnell zur Ruhe zu kommen ohne
            nachzuschwingen.
        `);

        // Page 5 — Zusammenfassung
        this.t3Text5a = this.sanitizer.bypassSecurityTrustHtml(`
            Die drei Dämpfungsfälle lassen sich anhand des Verhältnisses $\\gamma/\\omega_0$ klassifizieren:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): periodische Schwingung mit exponentiell abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): monotones Abklingen, langsamer als der Grenzfall</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): schnellste Rückkehr zur Ruhe ohne Schwingen</li>
            </ul>
            Im Schwingfall sind viele Schwingungen zu beobachten, Kriechfall und aperiodischer
            Grenzfall zeigen eine einzelne monotone Auslenkung, die gegen Null geht.
        `);
    }

    ngAfterViewInit(): void { this.renderMath(); }

    ngOnDestroy(): void {
        if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
        this.trackingService.endModule();
    }

    private restoreCompletionState(): void {
        this.isCorrect1  = this.trackingService.isQuestionCompleted(this.question1.questionId);
        this.isCorrect2  = this.trackingService.isQuestionCompleted(this.question2.questionId);
        this.isCorrect3  = this.trackingService.isQuestionCompleted(this.question3.questionId);
        this.isCorrect4  = this.trackingService.isQuestionCompleted(this.question4.questionId);
        this.isCorrect5  = this.trackingService.isQuestionCompleted(this.question5.questionId);
        this.isCorrect6  = this.trackingService.isQuestionCompleted(this.question6.questionId);
        this.isCorrect7  = this.trackingService.isQuestionCompleted(this.question7.questionId);
        this.isCorrect8  = this.trackingService.isQuestionCompleted(this.question8.questionId);
        this.isCorrect9  = this.trackingService.isQuestionCompleted(this.question9.questionId);
        this.isCorrect10 = this.trackingService.isQuestionCompleted(this.question10.questionId);
    }

    renderMath(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
            this.mathJaxTimeout = setTimeout(() => {
                this.mathJaxTimeout = null;
                if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise();
            }, 100);
        }
    }

    // +++ Navigation +++

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.router.navigate(['/decision/t-damped-oscillations']); return;
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc1';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc5') {
            this.currentView = 'damped_osc4';
        }
        this.updateUrl(); this.renderMath();
    }

    goForward(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.currentView === 'damped_osc1') {
            this.currentView = 'damped_osc2';
        } else if (this.currentView === 'damped_osc2') {
            this.currentView = 'damped_osc3';
        } else if (this.currentView === 'damped_osc3') {
            this.currentView = 'damped_osc4';
        } else if (this.currentView === 'damped_osc4') {
            this.currentView = 'damped_osc5';
        } else if (this.currentView === 'damped_osc5') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-t-damped', 'true');
                this.router.navigate(['/decision/t-damped-oscillations']);
            } else {
                this.router.navigate(['/learning/t4-driven-oscillations']);
            }
            return;
        }
        this.updateUrl(); this.renderMath();
    }

    private updateUrl(): void {
        const page = this.currentView.replace('damped_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
