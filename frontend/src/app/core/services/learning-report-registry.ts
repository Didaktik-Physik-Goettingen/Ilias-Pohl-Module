import * as e1Content from '../../features/learning_features/e1-intro-experiment/e1-intro-experiment-content';
import * as e2Content from '../../features/learning_features/e2-damped-oscillation/e2-damped-oscillation-content';
import * as e3Content from '../../features/learning_features/e3-driven-oscillations/e3-driven-oscillations-content';
import * as t1Content from '../../features/learning_features/t1-intro-theory/t1-intro-theory-content';
import * as t2Content from '../../features/learning_features/t2-free-oscillations/t2-free-oscillations-content';
import * as t3Content from '../../features/learning_features/t3-damped-oscillations/t3-damped-oscillations-content';
import * as t4Content from '../../features/learning_features/t4-driven-oscillations/t4-driven-oscillations-content';
import * as chaosContent from '../../features/learning_features/t-chaos/t-chaos-content';
import * as simContent from '../../features/learning_features/t-simulation/t-simulation-content';

export type TextStyle = 'normal' | 'lamp' | 'glossary';

export type ReportBlock =
    | { type: 'text';     html: string; style?: TextStyle }
    | { type: 'image';    src: string; alt: string; caption?: string }
    | { type: 'question'; questionId: string }
    | { type: 'spoiler';  label: string; html: string };

export interface PageDefinition {
    route: string;
    page: number;
    title: string;
    subtitle?: string;
    blocks: ReportBlock[];
}

export const PAGE_REGISTRY: PageDefinition[] = [

    // ── E1: Einstieg Experimentalpfad ─────────────────────────────────────
    {
        route: '/learning/e1-intro-experiment', page: 1,
        title: '[E-1] Einstieg Experimentalpfad', subtitle: 'Einführung',
        blocks: [
            { type: 'text',  html: e1Content.introExpText1a },
            { type: 'image', src: 'assets/images/e1_intro_experiment/experiment_schematic_1.png',
              alt: 'Versuchsaufbau', caption: e1Content.introExpText1b },
            { type: 'text',  html: e1Content.introExpText1c },
        ],
    },
    {
        route: '/learning/e1-intro-experiment', page: 2,
        title: '[E-1] Einstieg Experimentalpfad', subtitle: 'Komponenten',
        blocks: [
            { type: 'image', src: 'assets/images/e1_intro_experiment/experiment_schematic_2.png',
              alt: 'Versuchsaufbau' },
            { type: 'text',  html: e1Content.introExpText2a },
            { type: 'question', questionId: 'intro-exp-1-schwungrad' },
            { type: 'question', questionId: 'intro-exp-2-feder' },
            { type: 'question', questionId: 'intro-exp-3-wirbelstrombremse' },
        ],
    },
    {
        route: '/learning/e1-intro-experiment', page: 3,
        title: '[E-1] Einstieg Experimentalpfad', subtitle: 'Direktionsmoment',
        blocks: [
            { type: 'image', src: 'assets/images/e1_intro_experiment/schwungrad_3.png',
              alt: 'Schwungrad mit Massestück' },
            { type: 'text',  html: e1Content.introExpText3a },
            { type: 'question', questionId: 'intro-exp-4-direktionsmoment' },
            { type: 'question', questionId: 'intro-exp-5-winkel-drehmoment' },
            { type: 'text',  html: e1Content.introExpText3b },
        ],
    },
    {
        route: '/learning/e1-intro-experiment', page: 4,
        title: '[E-1] Einstieg Experimentalpfad', subtitle: 'Winkel-Zeit',
        blocks: [
            { type: 'question', questionId: 'intro-exp-6-winkel-zeit' },
        ],
    },

    // ── E2: Gedämpfte Schwingungen (Experiment) ───────────────────────────
    {
        route: '/learning/e2-damped-oscillations', page: 1,
        title: '[E-2] Gedämpfte Schwingungen', subtitle: 'Grundlagen',
        blocks: [
            { type: 'text', html: e2Content.dampedOscText1a },
            { type: 'text', html: e2Content.dampedOscText1b, style: 'glossary' },
            { type: 'text', html: e2Content.dampedOscText1c },
            { type: 'text', html: e2Content.dampedOscText1d, style: 'lamp' },
            { type: 'text', html: e2Content.dampedOscText1e },
        ],
    },
    {
        route: '/learning/e2-damped-oscillations', page: 2,
        title: '[E-2] Gedämpfte Schwingungen', subtitle: 'Lösung der Differentialgleichung',
        blocks: [
            { type: 'text',    html: e2Content.dampedOscText2a },
            { type: 'spoiler', label: 'EXKURS: Weitere Hinweise zur Lösung der Differentialgleichung (für Interessierte)',
              html: e2Content.dampedOscText2b },
            { type: 'text',    html: e2Content.dampedOscText2c },
            { type: 'text',    html: e2Content.dampedOscText2d, style: 'lamp' },
            { type: 'text',    html: e2Content.dampedOscText2e },
            { type: 'question', questionId: 'damped_osc-1-schwungrad' },
        ],
    },
    {
        route: '/learning/e2-damped-oscillations', page: 3,
        title: '[E-2] Gedämpfte Schwingungen', subtitle: 'Logarithmisches Dekrement',
        blocks: [
            { type: 'image',   src: 'assets/images/e2_damped_oscillations/vergleich_daempfungen2.png',
              alt: 'Vergleich der Dämpfungsfälle' },
            { type: 'text',    html: e2Content.dampedOscText3a },
            { type: 'spoiler', label: 'EXKURS: Erläuterung der Rechnung zum logarithmischen Dekrement',
              html: e2Content.dampedOscText3b },
        ],
    },

    // ── E3: Getriebene Schwingungen (Experiment) ──────────────────────────
    {
        route: '/learning/e3-driven-oscillations', page: 1,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Versuchsaufbau',
        blocks: [
            { type: 'image', src: 'assets/images/e3_driven_oscillations/Antrieb.jpg', alt: 'Antrieb',
              caption: 'Antrieb über Schrittmotor (hier nicht sichtbar), der über die Stange die Position des Aufhängungspunkts der Feder periodisch variiert.' },
            { type: 'text',  html: e3Content.drivenOscText1a },
            { type: 'text',  html: e3Content.drivenOscText1b, style: 'lamp' },
            { type: 'text',  html: e3Content.drivenOscText1c },
            { type: 'question', questionId: 'driven_osc-1-dgl-loesen' },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 2,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Lösungsansatz',
        blocks: [
            { type: 'text',    html: e3Content.drivenOscText2a },
            { type: 'spoiler', label: 'EXKURS: Detaillierte Lösung der Differentialgleichung – nicht für den Versuch erforderlich',
              html: e3Content.drivenOscText2b },
            { type: 'text',    html: e3Content.drivenOscText2c },
            { type: 'question', questionId: 'driven_osc-2-inhom-dgl' },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 3,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Einschwingvorgang',
        blocks: [
            { type: 'text',     html: e3Content.drivenOscText3a },
            { type: 'question', questionId: 'driven_osc-3-swinging-process' },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 4,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Amplitude im Stationärzustand',
        blocks: [
            { type: 'text',     html: e3Content.drivenOscText4 },
            { type: 'question', questionId: 'driven_osc-4-max-amp' },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 5,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Resonanz',
        blocks: [
            { type: 'text',  html: e3Content.drivenOscText5a },
            { type: 'image', src: 'assets/images/e3_driven_oscillations/Amplitude_Daempfung.png',
              alt: 'Amplitude für verschiedene Dämpfungen' },
            { type: 'text',  html: e3Content.drivenOscText5b },
            { type: 'question', questionId: 'driven_osc-5-damping-resonance-freq' },
            { type: 'question', questionId: 'driven_osc-6-damping-resonance-freq-exp' },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 6,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Vorbereitung',
        blocks: [
            { type: 'text', html: e3Content.drivenOscText6 },
        ],
    },
    {
        route: '/learning/e3-driven-oscillations', page: 7,
        title: '[E-3] Getriebene Schwingungen', subtitle: 'Phasenverschiebung',
        blocks: [
            { type: 'text',  html: e3Content.drivenOscText7 },
            { type: 'image', src: 'assets/images/e3_driven_oscillations/Phasenverschub_Daempfung.png',
              alt: 'Phasenverschub für verschiedene Dämpfungen' },
            { type: 'question', questionId: 'driven_osc-7-exciting-frequency' },
            { type: 'question', questionId: 'driven_osc-8-measure-time-delta' },
        ],
    },

    // ── T1: Einstieg Theoriepfad ──────────────────────────────────────────
    {
        route: '/learning/t1-intro-theory', page: 1,
        title: '[T-1] Einstieg Theoriepfad', subtitle: 'Grundlagen',
        blocks: [
            { type: 'text',  html: '<strong>Beachten Sie:</strong> In diesem Versuch beschäftigen Sie sich nur mit eindimensionalen Bewegungen. Auch der theoretische Überblick beschränkt sich daher auf diese Betrachtung. Wenn Sie sich für die Weiterführung in mehreren Dimensionen interessieren, dann folgen Sie an gegebener Stelle den Hinweisen.', style: 'glossary' },
            { type: 'text',  html: t1Content.introTheoText1a },
            { type: 'image', src: 'assets/images/t1_intro_theory/Feder_Grundlagen.png',
              alt: 'Schwungrad mit Massestück' },
            { type: 'text',  html: t1Content.introTheoText1b, style: 'lamp' },
            { type: 'text',  html: t1Content.introTheoText1c },
            { type: 'question', questionId: 't1-q1-dgl-solutions' },
            { type: 'text',  html: t1Content.introTheoText1d },
            { type: 'image', src: 'assets/images/t1_intro_theory/schwingung0.svg',
              alt: 'Schwingung' },
        ],
    },

    // ── T2: Freie Schwingungen ────────────────────────────────────────────
    {
        route: '/learning/t2-free-oscillations', page: 1,
        title: '[T-2] Freie Schwingungen', subtitle: 'Differentialgleichung und Lösungsansatz',
        blocks: [
            { type: 'text',    html: t2Content.freeOscText1a },
            { type: 'text',    html: t2Content.freeOscText1b, style: 'lamp' },
            { type: 'text',    html: t2Content.freeOscText1c, style: 'glossary' },
            { type: 'text',    html: t2Content.freeOscText1d },
            { type: 'text',    html: t2Content.freeOscText1e, style: 'lamp' },
            { type: 'text',    html: t2Content.freeOscText1f },
            { type: 'spoiler', label: 'EXKURS: Bestimmung der Konstanten',
              html: t2Content.freeOscText1g },
            { type: 'question', questionId: 't2-q2-reality' },
            { type: 'spoiler', label: 'EXKURS: Komplexe Lösungen bei reellen Gleichungen',
              html: t2Content.freeOscText1h },
            { type: 'question', questionId: 't2-q1-oscillator' },
        ],
    },
    {
        route: '/learning/t2-free-oscillations', page: 2,
        title: '[T-2] Freie Schwingungen', subtitle: 'Phasenraum',
        blocks: [
            { type: 'text',  html: t2Content.freeOscText2a },
            { type: 'image', src: 'assets/images/t2_free_oscillations/Pendulum_phase_portrait_illustration.svg',
              alt: 'Phasenportrait des Pendels' },
            { type: 'text',  html: t2Content.freeOscText2b, style: 'lamp' },
            { type: 'text',  html: t2Content.freeOscText2c },
            { type: 'image', src: 'assets/images/t2_free_oscillations/phasenraumtrajektorie_Demtröder_432.png',
              alt: 'Phasenraumtrajektorie' },
            { type: 'question', questionId: 't2-q4-phase' },
            { type: 'spoiler', label: 'EXKURS: Definition des Phasenraums',
              html: t2Content.freeOscText2d },
            { type: 'question', questionId: 't2-q6-pohl' },
        ],
    },

    // ── T3: Gedämpfte Schwingungen (Theorie) ──────────────────────────────
    {
        route: '/learning/t3-damped-oscillations', page: 1,
        title: '[T-3] Gedämpfte Schwingungen', subtitle: 'Exponentialansatz',
        blocks: [
            { type: 'text',    html: t3Content.t3Text1a },
            { type: 'text',    html: t3Content.t3Text1b, style: 'lamp' },
            { type: 'text',    html: t3Content.t3Text1c },
            { type: 'text',    html: t3Content.t3Text1d, style: 'lamp' },
            { type: 'text',    html: t3Content.t3Text1e, style: 'glossary' },
            { type: 'spoiler', label: 'EXKURS: Herleitung der Bestimmungsgleichung',
              html: t3Content.t3Text1spoiler },
            { type: 'question', questionId: 't3-q1-exp-ansatz' },
            { type: 'question', questionId: 't3-q2-gen-solution' },
        ],
    },
    {
        route: '/learning/t3-damped-oscillations', page: 2,
        title: '[T-3] Gedämpfte Schwingungen', subtitle: 'Schwingfall',
        blocks: [
            { type: 'text',  html: t3Content.t3Text2a },
            { type: 'text',  html: t3Content.t3Text2b, style: 'lamp' },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/01_gedaempfte_schwingung_schwingfall.svg',
              alt: 'Zeitlicher Verlauf der gedämpften freien Schwingung',
              caption: 'Zeitlicher Verlauf der gedämpften freien Schwingung mit x₀ > 0, v₀ = 0 (blau). Die rote Kurve zeigt die Einhüllende des exponentiellen Amplitudenabfalls.' },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/vergleich_daempfungen4gamma.png',
              alt: 'Vergleich zweier gedämpfter freier Schwingungen',
              caption: 'Vergleich zweier gedämpfter Schwingungen mit einfacher und vierfacher Dämpfung.' },
            { type: 'text',    html: t3Content.t3Text2c },
            { type: 'text',    html: t3Content.t3Text2d, style: 'lamp' },
            { type: 'spoiler', label: 'EXKURS: Herleitung des logarithmischen Dekrements',
              html: t3Content.t3Text2spoiler },
            { type: 'image',   src: 'assets/images/t3_damped_oscillations/phasenraum_10.png',
              alt: 'Aufeinanderfolgende Maxima der gedämpften Schwingung',
              caption: 'Aufeinanderfolgende Maxima nehmen mit dem Faktor e<sup>−γT</sup> ab.' },
            { type: 'question', questionId: 't3-q5-exp-factor' },
            { type: 'question', questionId: 't3-q7-log-dekrement' },
        ],
    },
    {
        route: '/learning/t3-damped-oscillations', page: 3,
        title: '[T-3] Gedämpfte Schwingungen', subtitle: 'Kriechfall',
        blocks: [
            { type: 'text',  html: t3Content.t3Text3a },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/kriechfall.png',
              alt: 'Kriechfall' },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/kriechfall2.png',
              alt: 'Kriechfall Vergleich' },
            { type: 'text',  html: t3Content.t3Text3b, style: 'lamp' },
        ],
    },
    {
        route: '/learning/t3-damped-oscillations', page: 4,
        title: '[T-3] Gedämpfte Schwingungen', subtitle: 'Aperiodischer Grenzfall',
        blocks: [
            { type: 'text',  html: t3Content.t3Text4a },
            { type: 'text',  html: t3Content.t3Text4b, style: 'lamp' },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/Demtroeder_I_Abb11-18.png',
              alt: 'Auslenkung für kritische Dämpfung und Kriechfall',
              caption: 'Auslenkung des Oszillators für kritische Dämpfung (rot, aperiodischer Grenzfall) und überkritische Dämpfung (schwarz, Kriechfall).' },
            { type: 'text',  html: t3Content.t3Text4c },
            { type: 'question', questionId: 't3-q8-aper-grenzfall' },
        ],
    },
    {
        route: '/learning/t3-damped-oscillations', page: 5,
        title: '[T-3] Gedämpfte Schwingungen', subtitle: 'Zusammenfassung',
        blocks: [
            { type: 'text',  html: t3Content.t3Text5a, style: 'glossary' },
            { type: 'image', src: 'assets/images/t3_damped_oscillations/vergleich_faelle.png',
              alt: 'Vergleich der Dämpfungsfälle' },
            { type: 'question', questionId: 't3-q9-summary-matching' },
            { type: 'text',  html: t3Content.t3Text5b },
            { type: 'question', questionId: 't3-q10-gebaude' },
        ],
    },

    // ── T4: Getriebene Schwingungen (Theorie) ─────────────────────────────
    {
        route: '/learning/t4-driven-oscillations', page: 1,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Differentialgleichung',
        blocks: [
            { type: 'text',     html: t4Content.t4Text1a },
            { type: 'text',     html: t4Content.t4Text1b, style: 'lamp' },
            { type: 'text',     html: t4Content.t4Text1c, style: 'glossary' },
            { type: 'question', questionId: 't4-q1-driven-oscillator' },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 2,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Gesamtlösung',
        blocks: [
            { type: 'text',     html: t4Content.t4Text2a, style: 'glossary' },
            { type: 'text',     html: t4Content.t4Text2b, style: 'lamp' },
            { type: 'text',     html: t4Content.t4Text2c },
            { type: 'question', questionId: 't4-q3-gesamtloesung' },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 3,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Stationäre Lösung',
        blocks: [
            { type: 'text', html: t4Content.t4Text3a },
            { type: 'text', html: t4Content.t4Text3b, style: 'lamp' },
            { type: 'text', html: t4Content.t4Text3c },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 4,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Partikuläre Lösung',
        blocks: [
            { type: 'text',    html: t4Content.t4Text4a },
            { type: 'text',    html: t4Content.t4Text4b, style: 'lamp' },
            { type: 'spoiler', label: 'EXKURS: Detaillierte Herleitung der partikulären Lösung',
              html: t4Content.t4Text4spoiler },
            { type: 'text',    html: t4Content.t4Text4c },
            { type: 'text',    html: t4Content.t4Text4d, style: 'lamp' },
            { type: 'question', questionId: 't4-q4-partikular-ansatz' },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 5,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Dämpfungsfälle',
        blocks: [
            { type: 'text',    html: t4Content.t4Text5a },
            { type: 'text',    html: t4Content.t4Text5b, style: 'lamp' },
            { type: 'spoiler', label: 'EXKURS: Alle drei Dämpfungsfälle im Überblick',
              html: t4Content.t4Text5spoiler },
            { type: 'text',    html: t4Content.t4Text5c },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 6,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Einschwingvorgang',
        blocks: [
            { type: 'text', html: t4Content.t4Text6a },
            { type: 'text', html: t4Content.t4Text6b, style: 'lamp' },
            { type: 'text', html: t4Content.t4Text6c },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 7,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Resonanzamplitude',
        blocks: [
            { type: 'text',  html: t4Content.t4Text7a },
            { type: 'text',  html: t4Content.t4Text7b, style: 'lamp' },
            { type: 'image', src: 'assets/images/t4_driven_oscillations/amplitude_damping.png',
              alt: 'Normierte Amplitude für unterschiedliche Dämpfungen',
              caption: 'Normierte Amplitude für unterschiedliche Dämpfungen in Abhängigkeit von der Anregungsfrequenz. Die graue gestrichelte Kurve zeigt die normierte Amplitude bei der Resonanzfrequenz.' },
            { type: 'text',  html: t4Content.t4Text7c },
            { type: 'question', questionId: 't4-q7-amplitude-params' },
            { type: 'question', questionId: 't4-q8-damping-amplitude' },
        ],
    },
    {
        route: '/learning/t4-driven-oscillations', page: 8,
        title: '[T-4] Getriebene Schwingungen', subtitle: 'Phasenverschiebung',
        blocks: [
            { type: 'text',  html: t4Content.t4Text8a },
            { type: 'text',  html: t4Content.t4Text8b, style: 'lamp' },
            { type: 'text',  html: t4Content.t4Text8c },
            { type: 'image', src: 'assets/images/t4_driven_oscillations/25_phase.svg',
              alt: 'Phasenverschiebung in Abhängigkeit von der Anregungsfrequenz',
              caption: 'Phasenverschiebung Φ(ω) für unterschiedliche Dämpfungskonstanten β. Bei ω = ω₀ gilt stets Φ = π/2.' },
            { type: 'question', questionId: 't4-q10-resonanz-phase' },
            { type: 'image', src: 'assets/images/t4_driven_oscillations/35_illustration_zur_phasenverschiebung.svg',
              alt: 'Veranschaulichung der Phasenverschiebung zwischen Antrieb und Schwungrad',
              caption: 'Veranschaulichung der Phasenverschiebung: Der Antrieb eilt dem Schwungrad um die Phase Φ voraus.' },
        ],
    },

    // ── T-Chaos ───────────────────────────────────────────────────────────
    {
        route: '/learning/t-chaos', page: 1,
        title: '[T] Chaos', subtitle: 'Nichtlineares Pendel',
        blocks: [
            { type: 'text',  html: chaosContent.chaosText1a },
            { type: 'image', src: 'assets/images/t_chaos/potential.png',
              alt: 'Potential mit angehängter Zusatzmasse' },
            { type: 'text',  html: chaosContent.chaosText1b },
            { type: 'text',  html: chaosContent.chaosText1c },
        ],
    },
    {
        route: '/learning/t-chaos', page: 2,
        title: '[T] Chaos', subtitle: 'Bewegungsgleichung',
        blocks: [
            { type: 'text', html: chaosContent.chaosText2a },
            { type: 'text', html: chaosContent.chaosText2b, style: 'lamp' },
            { type: 'text', html: chaosContent.chaosText2c },
        ],
    },

    // ── T-Simulation ──────────────────────────────────────────────────────
    {
        route: '/learning/t-simulation', page: 1,
        title: '[T] Simulation', subtitle: 'Numerische Methoden',
        blocks: [
            { type: 'text', html: simContent.simText1a },
            { type: 'text', html: simContent.simText1b, style: 'glossary' },
            { type: 'text', html: simContent.simText1c },
            { type: 'text', html: simContent.simText1d },
            { type: 'text', html: simContent.simText1e },
            { type: 'text', html: simContent.simText1f },
        ],
    },
];

export const PAGE_LOOKUP = new Map<string, PageDefinition>(
    PAGE_REGISTRY.map(p => [`${p.route}:${p.page}`, p])
);
