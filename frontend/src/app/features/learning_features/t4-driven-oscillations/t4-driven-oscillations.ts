import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';
import { ImageChoice } from '../../../shared/evaluation/image-choice/image-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';
import { DevModeService } from '../../../core/services/dev-mode';

@Component({
    selector: 'app-t4-driven-oscillations',
    imports: [CommonModule, RouterLink, MultipleChoice, ImageChoice],
    templateUrl: './t4-driven-oscillations.html',
    styleUrl: './t4-driven-oscillations.css',
})
export class T4DrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
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

    currentView = 'driven_osc1';
    navigationFlow: string = '';

    get isFirstPage(): boolean { return this.currentView === 'driven_osc1'; }
    get isLastPage(): boolean { return this.currentView === 'driven_osc8'; }

    // +++ SafeHtml content +++

    t4Text1a!: SafeHtml;
    t4Text1b!: SafeHtml;
    t4Text1c!: SafeHtml;

    t4Text2a!: SafeHtml;
    t4Text2b!: SafeHtml;
    t4Text2c!: SafeHtml;

    t4Text3a!: SafeHtml;
    t4Text3b!: SafeHtml;
    t4Text3c!: SafeHtml;

    t4Text4a!: SafeHtml;
    t4Text4b!: SafeHtml;
    t4Text4c!: SafeHtml;
    t4Text4d!: SafeHtml;
    t4Text4spoiler!: SafeHtml;

    t4Text5a!: SafeHtml;
    t4Text5b!: SafeHtml;
    t4Text5spoiler!: SafeHtml;
    t4Text5c!: SafeHtml;

    t4Text6a!: SafeHtml;
    t4Text6b!: SafeHtml;
    t4Text6c!: SafeHtml;

    t4Text7a!: SafeHtml;
    t4Text7b!: SafeHtml;
    t4Text7c!: SafeHtml;

    t4Text8a!: SafeHtml;
    t4Text8b!: SafeHtml;
    t4Text8c!: SafeHtml;

    // +++ Question data +++

    question1 = {
        questionId: 't4-q1-driven-oscillator',
        question: 'Beurteilen Sie die folgenden Aussagen über den gedämpften, getriebenen harmonischen Oszillator. Welche Aussagen sind richtig?',
        options: [
            { value: 'answer1', label: 'Die äußere Kraft $F_{\\text{ext}}\\cos(\\omega t)$ hängt von der Zeit und zusätzlich von der momentanen Auslenkung $x(t)$ ab.' },
            { value: 'answer2', label: 'Die DGL nennt man inhomogen, weil der äußere Anregungsterm unabhängig von der Schwingungsauslenkung $x(t)$ oder $\\dot{x}(t)$ ist.' },
            { value: 'answer3', label: 'Der Term $2\\gamma\\dot{x}$ in der Normalform entsteht durch eine Reibungskraft, die proportional zur Geschwindigkeit ist.' },
            { value: 'answer4', label: 'Ein System kann nur dann als „getrieben" bezeichnet werden, wenn seine Eigenfrequenz gleich der Anregungsfrequenz ist.' },
        ],
        correctAnswers: ['answer2', 'answer3'],
        containerId: 't4-q1-container',
        successMessage: '✓ Richtig. Die äußere Kraft hängt nur von der Zeit ab – das macht die DGL inhomogen.',
        incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie: „getrieben" bedeutet äußere Kraft, nicht Resonanz.',
        incorrectMessage: '✗ Noch nicht ganz richtig. „Inhomogen" bedeutet, der Anregungsterm hängt nicht von x oder ẋ ab.',
    };

    question2 = {
        questionId: 't4-q2-pohl-term',
        question: 'Was beschreibt der Term $2\\beta\\dot{\\varphi}$ in der DGL des Pohlschen Rads?',
        options: [
            { value: 'answer1', label: 'Den dämpfenden Anteil, proportional zur Winkelgeschwindigkeit' },
            { value: 'answer2', label: 'Die äußere Anregung des Systems' },
            { value: 'answer3', label: 'Die Rückstellkraft' },
            { value: 'answer4', label: 'Das Trägheitsmoment des Systems' },
        ],
        correctAnswers: ['answer1'],
        containerId: 't4-q2-container',
        successMessage: '✓ Richtig. $2\\beta\\dot{\\varphi}$ ist proportional zur Winkelgeschwindigkeit – das ist der Dämpfungsterm.',
        incompleteMessage: '✗ Noch nicht vollständig. Schauen Sie sich die Terme in der DGL genauer an.',
        incorrectMessage: '✗ Noch nicht ganz richtig. $2\\beta := \\rho/\\Theta$ ist der Reibungskoeffizient bezogen aufs Trägheitsmoment.',
    };

    question3 = {
        questionId: 't4-q3-gesamtloesung',
        question: 'Die Gesamtbewegung wird als $\\varphi(t) = \\varphi_h(t) + \\varphi_p(t)$ dargestellt. Welche Aussagen treffen zu?',
        options: [
            { value: 'answer1', label: '$\\varphi_h(t)$ enthält alle äußeren wirkenden Drehmomente.' },
            { value: 'answer2', label: 'Der homogene Anteil $\\varphi_h(t)$ entspricht der Lösung ohne äußere Anregung.' },
            { value: 'answer3', label: 'Der spezielle Anteil $\\varphi_p(t)$ wird als „partikuläre" oder „spezielle" Lösung bezeichnet.' },
            { value: 'answer4', label: '$\\varphi_p(t)$ beschreibt die Stärke der Dämpfung.' },
            { value: 'answer5', label: 'Es ergibt sich die Gesamtbewegung durch Addition der homogenen und der speziellen Lösung.' },
        ],
        correctAnswers: ['answer2', 'answer3', 'answer5'],
        containerId: 't4-q3-container',
        successMessage: '✓ Richtig. $\\varphi_h$ ist die freie Schwingung, $\\varphi_p$ die partikuläre Lösung. Addition ergibt die Gesamtbewegung.',
        incompleteMessage: '✗ Noch nicht vollständig. $\\varphi_h$ enthält keine äußeren Drehmomente – es ist die Lösung ohne Antrieb.',
        incorrectMessage: '✗ Noch nicht ganz richtig. $\\varphi_h$ enthält keine äußeren Drehmomente – es ist die Lösung der homogenen DGL.',
    };

    question4 = {
        questionId: 't4-q4-partikular-ansatz',
        question: 'Warum wird für die partikuläre Lösung der Ansatz $\\tilde{\\varphi}_p(t) = Ae^{i\\omega t}$ verwendet?',
        options: [
            { value: 'answer1', label: 'Weil der Ansatz automatisch eine reelle Lösung ergibt.' },
            { value: 'answer2', label: 'Weil die homogene Lösung ebenfalls exponentiell ist.' },
            { value: 'answer3', label: 'Weil die Inhomogenität $N\\cos(\\omega t)$ die Struktur einer komplexen Exponentialfunktion besitzt.' },
            { value: 'answer4', label: 'Weil die partikuläre Lösung unabhängig von der Anregungsfrequenz ist.' },
        ],
        correctAnswers: ['answer3'],
        containerId: 't4-q4-container',
        successMessage: '✓ Richtig. Der Ansatz spiegelt die Struktur der Inhomogenität wider – Exponentialfunktionen gehen bei Ableitung in sich selbst über.',
        incompleteMessage: '✗ Noch nicht vollständig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Die Inhomogenität ist eine komplexe e-Funktion. Der Ansatz muss dieselbe Struktur haben.',
    };

    question5 = {
        questionId: 't4-q5-partikular-loesung',
        question: 'Die reelle partikuläre Lösung lautet $\\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi)$. Welche Aussagen folgen allein aus dieser Darstellung?',
        options: [
            { value: 'answer1', label: 'Der Wert von $\\varphi_p(t)$ bleibt konstant, wenn $\\omega$ sehr groß wird.' },
            { value: 'answer2', label: 'Die partikuläre Lösung schwingt mit der extern vorgegebenen Frequenz $\\omega$.' },
            { value: 'answer3', label: 'Der Ausdruck unter der Wurzel ist positiv.' },
            { value: 'answer4', label: 'Die Phase $\\Phi$ beschreibt eine Verschiebung zwischen äußerer Anregung und Antwort des Systems.' },
        ],
        correctAnswers: ['answer2', 'answer3', 'answer4'],
        containerId: 't4-q5-container',
        successMessage: '✓ Richtig. Die partikuläre Lösung schwingt mit der aufgezwungenen Frequenz $\\omega$, und $\\Phi$ beschreibt die Phasenverschiebung.',
        incompleteMessage: '✗ Noch nicht vollständig. Beachten Sie den Cosinus-Term – seine Frequenz ist $\\omega$, nicht $\\omega_0$.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Beachten Sie den Cosinus-Term – seine Frequenz ist $\\omega$, nicht $\\omega_0$.',
    };

    question6 = {
        questionId: 't4-q6-einschwing',
        question: 'Bei welcher der folgenden Abbildungen kann der Einschwingvorgang als abgeschlossen angesehen werden? (Das graue Kreuz markiert den ersten, das rote Kreuz den letzten Messwert.)',
        options: [
            { value: 'answer1', imageSrc: 'assets/images/t4_driven_oscillations/17_phasenraumdiagramme_und_stationaere_schwingung_1.svg' },
            { value: 'answer2', imageSrc: 'assets/images/t4_driven_oscillations/18_phasenraumdiagramme_und_stationaere_schwingung_2.svg' },
            // { value: 'answer3', imageSrc: 'assets/images/t4_driven_oscillations/19_phasenraumdiagramme_und_stationaere_schwingung_3.svg' },
            { value: 'answer4', imageSrc: 'assets/images/t4_driven_oscillations/20_phasenraumdiagramme_und_stationaere_schwingung_4.svg' },
        ],
        correctAnswers: ['answer4'],
        containerId: 't4-q6-container',
        successMessage: '✓ Richtig. Abbildung d) zeigt eine geschlossene Trajektorie – der Einschwingvorgang ist abgeschlossen.',
        incompleteMessage: '✗ Noch nicht vollständig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Achten Sie darauf, bei welcher Abbildung die Trajektorie eine geschlossene, stabile Kurve bildet.',
    };

    question7 = {
        questionId: 't4-q7-amplitude-params',
        question: 'Welche Parameter des Systems beeinflussen die maximale Amplitude des stationär schwingenden (gedämpften) Systems?',
        options: [
            { value: 'answer1', label: 'Eigenfrequenz $\\omega_0$' },
            { value: 'answer2', label: 'Trägheitsmoment des Schwungkörpers $\\Theta$' },
            { value: 'answer3', label: 'Anfangsauslenkung $\\varphi(t=0)$' },
            { value: 'answer4', label: 'Anfangsgeschwindigkeit $\\dot{\\varphi}(t=0)$' },
            { value: 'answer5', label: 'Stärke der Dämpfung $\\beta$' },
            { value: 'answer6', label: 'Dämpfung (Wirbelstrombremse &amp; Reibungsverluste) $\\rho$' },
        ],
        correctAnswers: ['answer1', 'answer2', 'answer5', 'answer6'],
        containerId: 't4-q7-container',
        successMessage: '✓ Richtig. Das Zusammenspiel dieser Systemparameter beeinflusst die Amplitude der Schwingung.',
        incompleteMessage: '✗ Noch nicht vollständig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Im stationären Zustand verschwinden die Anfangsbedingungen – nur Systemparameter zählen.',
    };

    question8 = {
        questionId: 't4-q8-damping-amplitude',
        question: 'Je stärker die Dämpfung, desto…',
        options: [
            { value: 'answer1', label: '… größer die Resonanzfrequenz.' },
            { value: 'answer2', label: '… größer die Amplitude bei der Resonanzfrequenz.' },
            { value: 'answer3', label: '… größer die Abweichung der Resonanzfrequenz von der Eigenfrequenz $\\omega_0$.' },
        ],
        correctAnswers: ['answer3'],
        containerId: 't4-q8-container',
        successMessage: '✓ Richtig. $\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$ verschiebt sich mit steigendem $\\beta$ stärker von $\\omega_0$ weg.',
        incompleteMessage: '✗ Noch nicht vollständig. Stärkere Dämpfung senkt die Resonanzfrequenz.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Stärkere Dämpfung senkt die Resonanzfrequenz und damit auch die maximale Amplitude.',
    };

    question9 = {
        questionId: 't4-q9-versuch',
        question: 'Überlegen Sie, welche Konsequenzen stärkere Dämpfung für die Versuchsdurchführung hat. Je stärker die Dämpfung, desto…',
        options: [
            { value: 'answer1', label: '… vorsichtiger muss man bei Messungen im Bereich der Resonanzfrequenz sein, damit der Aufbau nicht beschädigt wird.' },
            { value: 'answer2', label: '… gleichmäßiger können die Frequenzschritte bei der Messung gewählt werden.' },
            { value: 'answer3', label: '… kleinschrittiger sollte man die Frequenz im Bereich der Resonanzfrequenz variieren.' },
        ],
        correctAnswers: ['answer2'],
        containerId: 't4-q9-container',
        successMessage: '✓ Richtig. Stärkere Dämpfung verbreitert den Resonanzpeak – gleichmäßige Frequenzschritte sind ausreichend.',
        incompleteMessage: '✗ Noch nicht vollständig. Je schärfer der Resonanzpeak, desto kleinere Schritte sind nötig.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Je schärfer der Resonanzpeak (geringe Dämpfung), desto kleinschrittiger muss gemessen werden.',
    };

    question10 = {
        questionId: 't4-q10-resonanz-phase',
        question: 'Entspricht die Anregungsfrequenz gerade der Resonanzfrequenz $\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$, so…',
        options: [
            { value: 'answer1', label: 'ist die Phasenverschiebung genau $\\frac{\\pi}{2}$.' },
            { value: 'answer2', label: 'ist die Phasenverschiebung größer als $\\frac{\\pi}{2}$.' },
            { value: 'answer3', label: 'ist die Phasenverschiebung kleiner als $\\frac{\\pi}{2}$.' },
            { value: 'answer4', label: 'kann man keine Aussage über die Phasenverschiebung treffen.' },
        ],
        correctAnswers: ['answer3'],
        containerId: 't4-q10-container',
        successMessage: '✓ Richtig. Die Resonanzfrequenz $\\omega_r < \\omega_0$, und da $\\Phi = \\pi/2$ nur bei $\\omega_0$ gilt, ist $\\Phi(\\omega_r) < \\pi/2$.',
        incompleteMessage: '✗ Noch nicht vollständig. $\\Phi = \\pi/2$ gilt nur bei $\\omega = \\omega_0$, nicht bei der Resonanzfrequenz.',
        incorrectMessage: '✗ Noch nicht ganz richtig. $\\Phi = \\pi/2$ gilt nur bei $\\omega = \\omega_0$ (Eigenfrequenz), nicht bei $\\omega_r$.',
    };

    question11 = {
        questionId: 't4-q11-messung',
        question: 'Sie vermessen ein gedämpftes Schwungrad bei zwei Frequenzen: $\\omega_1 = 200\\,\\text{mHz}$ und $\\omega_2 = 400\\,\\text{mHz}$. Bei $\\omega_1$ beträgt der zeitliche Abstand zwischen den Nulldurchgängen von Antrieb und Rad $\\Delta t_1 = 0{,}25\\,\\text{s}$, bei $\\omega_2$ ist er $\\Delta t_2 = 1{,}4\\,\\text{s}$. Was können Sie über die Resonanzfrequenz des Systems aussagen?',
        options: [
            { value: 'answer1', label: 'Die Resonanzfrequenz ist größer als $\\omega_2 = 400\\,\\text{mHz}$.' },
            { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
            { value: 'answer3', label: 'Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' },
            { value: 'answer4', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1 = 200\\,\\text{mHz}$.' },
        ],
        correctAnswers: ['answer2'],
        containerId: 't4-q11-container',
        successMessage: '✓ Richtig. Bei $\\omega_1$ ist $\\Phi_1 < \\pi/2$ (Antrieb unter Eigenfrequenz), bei $\\omega_2$ ist $\\Phi_2 > \\pi/2$ – die Resonanz liegt dazwischen.',
        incompleteMessage: '✗ Noch nicht vollständig. Berechnen Sie $\\Phi = \\omega \\cdot \\Delta t$. Liegt $\\Phi < \\pi/2$, ist $\\omega < \\omega_0$.',
        incorrectMessage: '✗ Noch nicht ganz richtig. Berechnen Sie $\\Phi = \\omega \\cdot \\Delta t$ für beide Frequenzen und vergleichen Sie mit $\\pi/2$.',
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
    isCorrect11 = false; onQuestion11Answered(v: boolean): void { this.isCorrect11 = v; }

    // +++ Lifecycle +++

    ngOnInit(): void {
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page) this.currentView = `driven_osc${page}`;
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';
        this.trackingService.startModule('t4-driven-oscillations-module');
        this.restoreCompletionState();

        // Page 1 — Getriebener harmonischer Oszillator
        this.t4Text1a = this.sanitizer.bypassSecurityTrustHtml(`
            Wird ein gedämpfter harmonischer Oszillator zusätzlich durch eine periodische äußere Kraft
            angetrieben, spricht man von einem <strong>getriebenen</strong> Oszillator. Die Gesamtkraft
            setzt sich aus Rückstellkraft, Reibungskraft und Antriebskraft zusammen:
            $$m\\ddot{x} = -Dx - b\\dot{x} + F_{\\text{ext}}\\cos(\\omega t)$$
            Mit den Abkürzungen $\\omega_0^2 := D/m$, $2\\gamma := b/m$ und $K := F_{\\text{ext}}/m$
            lautet die <strong>Normalform</strong>:
        `);

        this.t4Text1b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = K\\cos(\\omega t)$$
        `);

        this.t4Text1c = this.sanitizer.bypassSecurityTrustHtml(`
            Diese 
            <a href="#glossary-inhom-dgl" class="glossary-link">Differentialgleichung</a>
            nennt man:
            <ul>
                <li><strong>gedämpft</strong>, weil eine zur Geschwindigkeit proportionale Reibungskraft wirkt,</li>
                <li><strong>getrieben</strong>, weil eine äußere, periodische Anregung im System wirkt, und</li>
                <li><strong>harmonisch</strong>, weil Sinus- und Cosinusfunktionen die Schwingungsform beschreiben.</li>
            </ul>
            Sie ist <strong>inhomogen</strong>, da der Anregungsterm $K\\cos(\\omega t)$ nicht von
            der Auslenkung $x$ oder ihrer Ableitung abhängt.
        `);

        // Page 2 — DGL des Pohlschen Rads
        this.t4Text2a = this.sanitizer.bypassSecurityTrustHtml(`
            Beim Pohlschen Rad betrachten wir eine <strong>Rotationsbewegung</strong>. Die DGL ergibt
            sich aus der Bilanz der
            <a href="#glossary-angular-momentum" class="glossary-link">Drehmomente</a>
            $\\Theta\\ddot{\\varphi} = \\sum_i M_i$ mit dem
            <a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a>
            $\\Theta$:
            <ul>
                <li>Rückstellmoment: $-D^*\\varphi$ mit dem
                    <a href="#glossary-directive-moment" class="glossary-link">Richtmoment</a> $D^*$</li>
                <li>Dämpfungsmoment: $-\\rho\\dot{\\varphi}$ mit dem Reibungskoeffizienten $\\rho$</li>
                <li>Antriebsmoment: $M\\cos(\\omega t)$</li>
            </ul>
            Mit den Abkürzungen $2\\beta := \\rho/\\Theta$, $\\omega_0^2 := D^*/\\Theta$ und
            $N := M/\\Theta$ lautet die DGL:
        `);

        this.t4Text2b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\ddot{\\varphi} + 2\\beta\\dot{\\varphi} + \\omega_0^2\\varphi = N\\cos(\\omega t)$$
        `);

        this.t4Text2c = this.sanitizer.bypassSecurityTrustHtml(`
            Diese Gleichung ist formal identisch mit der Normalform des linearen Falls --- lediglich die
            Auslenkung $x$ wird durch den Winkel $\\varphi$ ersetzt und $\\gamma$ durch $\\beta$.<br><br>
            Zur Lösung der 
            <a href="#glossary-inhom-dgl" class="glossary-link"><strong>inhomogenen</strong> Differentialgleichung</a>
            addiert man die Lösungen des homogenen
            und partikulären Anteils:
            $$\\varphi(t) = \\varphi_h(t) + \\varphi_p(t)$$
        `);

        // Page 3 — Komplexe Erweiterung
        this.t4Text3a = this.sanitizer.bypassSecurityTrustHtml(`
            Um die 
            <a href="#glossary-inhom-dgl" class="glossary-link">inhomogene Differentialgleichung</a> 
            zu lösen, nutzt man einen eleganten Trick: Die reelle Inhomogenität
            $N\\cos(\\omega t)$ wird als Realteil einer komplexen Exponentialfunktion geschrieben:
            $$N\\cos(\\omega t) = \\operatorname{Re}\\!\\left[N e^{i\\omega t}\\right]$$
            Gleichzeitig lässt man zu, dass die Lösung $\\varphi$ komplex ist: $\\varphi \\to \\tilde{\\varphi}$.
            Die physikalische (reelle) Lösung erhält man am Ende als Realteil von $\\tilde{\\varphi}$.<br><br>
            Die <strong>komplexe DGL</strong> lautet:
        `);

        this.t4Text3b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\ddot{\\tilde{\\varphi}} + 2\\beta\\dot{\\tilde{\\varphi}} + \\omega_0^2\\tilde{\\varphi} = N e^{i\\omega t}$$
        `);

        this.t4Text3c = this.sanitizer.bypassSecurityTrustHtml(`
            Der Vorteil dieser Methode: Die komplexe Exponentialfunktion $e^{i\\omega t}$ verhält sich
            unter Ableitung besonders einfach ($\\frac{d}{dt}e^{i\\omega t} = i\\omega e^{i\\omega t}$) ---
            es entstehen nur konstante Vorfaktoren, keine Übergänge zwischen Sinus und Cosinus.
            Das vereinfacht das Einsetzen des Ansatzes erheblich.
        `);

        // Page 4 — Partikuläre Lösung
        this.t4Text4a = this.sanitizer.bypassSecurityTrustHtml(`
            Zur Lösung der komplexen 
            <a href="#glossary-inhom-dgl" class="glossary-link">inhomogenen Differentialgleichung</a> 
            wählt man einen Ansatz, dessen Struktur der
            Inhomogenität ähnelt - also eine komplexe Exponentialfunktion mit der <em>gleichen</em>
            Frequenz $\\omega$ wie die Anregung:
        `);

        this.t4Text4b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\tilde{\\varphi}_p(t) = A\\,e^{i\\omega t}, \\qquad A \\in \\mathbb{C}$$
        `);

        this.t4Text4c = this.sanitizer.bypassSecurityTrustHtml(`
            Durch Einsetzen und Auflösen nach der <strong>komplexen Amplitude</strong> $A$ findet man
            deren Betrag und Phase. Die reelle partikuläre Lösung ergibt sich als Realteil:
        `);

        this.t4Text4d = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi)$$
            mit der Phasenverschiebung $\\Phi = \\arctan\\!\\left(\\dfrac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$.
        `);

        this.t4Text4spoiler = this.sanitizer.bypassSecurityTrustHtml(`
            Die zeitlichen Ableitungen des Ansatzes $\\tilde{\\varphi}_p = A\\,e^{i\\omega t}$ lauten:
            $$\\dot{\\tilde{\\varphi}}_p = i\\omega A\\,e^{i\\omega t}, \\qquad
              \\ddot{\\tilde{\\varphi}}_p = -\\omega^2 A\\,e^{i\\omega t}$$
            Einsetzen in die komplexe DGL und Ausklammern von $e^{i\\omega t} \\neq 0$:
            $$A\\left(-\\omega^2 + 2i\\beta\\omega + \\omega_0^2\\right) = N$$
            Daraus folgt:
            $$A = \\frac{N}{\\omega_0^2 - \\omega^2 + 2i\\beta\\omega}$$
            Mit $|A| = \\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}$ und
            $\\arg(A) = -\\Phi$ ergibt sich die reelle partikuläre Lösung als $\\operatorname{Re}[A\\,e^{i\\omega t}]$.
        `);

        // Page 5 — Homogene Lösung
        this.t4Text5a = this.sanitizer.bypassSecurityTrustHtml(`
            Die homogene Lösung $\\varphi_h(t)$ --- die Lösung <em>ohne</em> äußere Anregung --- entspricht
            den drei Dämpfungsfällen aus der gedämpften freien Schwingung. Im realen Experiment liegt
            in der Regel der <strong>Schwingfall</strong> ($\\beta < \\omega_0$) vor:
        `);

        this.t4Text5b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\varphi_h(t) = e^{-\\beta t}\\!\\left(c_1\\cos(\\omega_d t) + c_2\\sin(\\omega_d t)\\right),
              \\qquad \\omega_d = \\sqrt{\\omega_0^2 - \\beta^2}$$
        `);

        this.t4Text5spoiler = this.sanitizer.bypassSecurityTrustHtml(`
            <strong>Schwache Dämpfung</strong> ($\\beta < \\omega_0$) --- Schwingfall:
            $$\\varphi_h(t) = e^{-\\beta t}\\!\\left(c_1\\cos(\\omega_d t) + c_2\\sin(\\omega_d t)\\right),
              \\quad \\omega_d = \\sqrt{\\omega_0^2-\\beta^2}$$
            <strong>Kritische Dämpfung</strong> ($\\beta = \\omega_0$) --- Aperiodischer Grenzfall:
            $$\\varphi_h(t) = (C_1 + C_2 t)\\,e^{-\\beta t}$$
            <strong>Starke Dämpfung</strong> ($\\beta > \\omega_0$) --- Kriechfall:
            $$\\varphi_h(t) = C_1 e^{\\lambda_1 t} + C_2 e^{\\lambda_2 t},
              \\quad \\lambda_{1,2} = -\\beta \\pm \\sqrt{\\beta^2 - \\omega_0^2} \\in \\mathbb{R}$$
        `);

        this.t4Text5c = this.sanitizer.bypassSecurityTrustHtml(`
            Die Konstanten $c_1, c_2$ ergeben sich in allen Fällen aus den Anfangsbedingungen.
            Im <strong>stationären Zustand</strong> klingt die homogene Lösung vollständig ab ---
            übrig bleibt nur die partikuläre Lösung.
        `);

        // Page 6 — Vollständige Lösung und Einschwingvorgang
        this.t4Text6a = this.sanitizer.bypassSecurityTrustHtml(`
            Die vollständige Lösung ergibt sich als Summe der homogenen und partikulären Lösung.
            Für den Schwingfall ($\\beta < \\omega_0$):
        `);

        this.t4Text6b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\varphi(t) = \\underbrace{\\varphi_0\\cos(\\omega_d t+\\phi)\\,e^{-\\beta t}}_{\\text{Einschwingvorgang}}
              + \\underbrace{\\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}
              \\cos\\!\\left(\\omega t - \\Phi\\right)}_{\\text{Stationäre Antwort}}$$
        `);

        this.t4Text6c = this.sanitizer.bypassSecurityTrustHtml(`
            Physikalisch überlagern sich zwei Schwingungen: die freie Schwingung $\\varphi_h$ und die
            erzwungene $\\varphi_p$. Nach einer gewissen <strong>Einschwingzeit</strong> klingt
            $\\varphi_h(t)$ ab --- danach schwingt das System nur noch mit der aufgezwungenen Frequenz
            $\\omega$ im <strong>stationären Zustand</strong>.<br><br>
            Im <strong>Phasenraumdiagramm</strong> ist der Abschluss des Einschwingvorgangs gut
            erkennbar: Die Trajektorie wird zu einer <strong>geschlossenen, stabilen Ellipse</strong>.
        `);

        // Page 7 — Amplitude
        this.t4Text7a = this.sanitizer.bypassSecurityTrustHtml(`
            Im stationären Zustand ($\\varphi \\approx \\varphi_p$) schwingt das System mit der
            Anregungsfrequenz $\\omega$. Die <strong>Amplitude</strong> hängt vom Verhältnis
            zwischen Anregungsfrequenz und Eigenfrequenz ab:
        `);

        this.t4Text7b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\varphi_0(\\omega) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}$$
        `);

        this.t4Text7c = this.sanitizer.bypassSecurityTrustHtml(`
            Die <strong>Resonanzfrequenz</strong> --- bei der die Amplitude maximal wird --- ist etwas
            kleiner als die Eigenfrequenz:
            $$\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$$
            Mit zunehmender Dämpfung $\\beta$ verschiebt sich $\\omega_r$ stärker von $\\omega_0$ weg
            und die Maximalamplitude nimmt ab. Bei starker Dämpfung ($\\beta > \\omega_0/\\sqrt{2}$)
            tritt kein Resonanzpeak mehr auf.
        `);

        // Page 8 — Phasenverschiebung
        this.t4Text8a = this.sanitizer.bypassSecurityTrustHtml(`
            Im stationären Zustand hinkt das Schwungrad dem Antrieb hinterher. Die
            <strong>Phasenverschiebung</strong> zwischen Antrieb $N\\cos(\\omega t)$ und
            Systemantwort $\\varphi_p(t) = \\varphi_0\\cos(\\omega t - \\Phi)$ beträgt:
        `);

        this.t4Text8b = this.sanitizer.bypassSecurityTrustHtml(`
            $$\\Phi(\\omega) = \\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$$
        `);

        this.t4Text8c = this.sanitizer.bypassSecurityTrustHtml(`
            Besonders charakteristisch: Wenn die Anregungsfrequenz genau der
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>
            $\\omega_0$ entspricht, gilt stets
            $\\Phi(\\omega_0) = \\pi/2$ - unabhängig von der Dämpfung. Diese Eigenschaft
            lässt sich im Experiment nutzen, um $\\omega_0$ zu bestimmen.<br><br>
            Für $\\omega < \\omega_0$ gilt $\\Phi < \\pi/2$ (Antrieb und System nahezu in Phase),
            für $\\omega > \\omega_0$ gilt $\\Phi > \\pi/2$ (System läuft dem Antrieb stark hinterher).
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
        this.isCorrect11 = this.trackingService.isQuestionCompleted(this.question11.questionId);
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
        if (this.currentView === 'driven_osc1') {
            this.router.navigate(['/decision/t-driven-oscillations']); return;
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
        } else if (this.currentView === 'driven_osc8') { 
            this.currentView = 'driven_osc7';
        }
        this.updateUrl(); this.renderMath();
    }

    goForward(): void {
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
            this.currentView = 'driven_osc8';
        } else if (this.currentView === 'driven_osc8') {
            if (this.navigationFlow === 'learning-first') {
                sessionStorage.setItem('learning-done-t-driven', 'true');
                this.router.navigate(['/decision/t-driven-oscillations']);
            } else {
                this.router.navigate(['/learning/t-setup']);
            }
            return;
        }
        this.updateUrl(); this.renderMath();
    }

    private updateUrl(): void {
        const page = this.currentView.replace('driven_osc', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
