import { Type } from '@angular/core';

import { Amplitude }           from '../glossary_features/amplitude/amplitude';
import { AngularFrequency }    from '../glossary_features/angular-frequency/angular-frequency';
import { AngularMomentum }     from '../glossary_features/angular-momentum/angular-momentum';
import { CriticalDamping }     from '../glossary_features/critical-damping/critical-damping';
import { DampingCoefficient }  from '../glossary_features/damping-coefficient/damping-coefficient';
import { DirectiveMoment }     from '../glossary_features/directive-moment/directive-moment';
import { ExponentialAnsatz }   from '../glossary_features/exponential-ansatz/exponential-ansatz';
import { HomDgl }              from '../glossary_features/hom-dgl/hom-dgl';
import { InhomDgl }            from '../glossary_features/inhom-dgl/inhom-dgl';
import { MomentOfInertia }     from '../glossary_features/moment-of-inertia/moment-of-inertia';
import { NaturalFrequency }    from '../glossary_features/natural-frequency/natural-frequency';
import { NewtonNotation }      from '../glossary_features/newton-notation/newton-notation';
import { ResonanceFrequency }  from '../glossary_features/resonance-frequency/resonance-frequency';
import { SpringConstant }      from '../glossary_features/spring-constant/spring-constant';



// One entry per glossary term: the overlay's list and term view, the term routes (/glossary/<slug>) and the
// links in the content (data-glossary="<slug>") all read this list. A new term goes here and nowhere else.
export interface GlossaryTerm {
    slug: string;
    title: string;
    definition: string;     // the short text on the list's card
    component: Type<unknown>;
}



// in the list's order (alphabetical by title)
export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
    {
        slug: 'amplitude',
        title: 'Amplitude',
        definition: 'Die Amplitude ist der Betrag der maximalen Auslenkung der Schwingung aus der Ruhelage und wird oft als φ₀ oder x₀ bezeichnet. Bei einer getriebenen Schwingung ist die Amplitude abhängig von der Erregerfrequenz.',
        component: Amplitude,
    },
    {
        slug: 'critical-damping',
        title: 'Aperiodischer Grenzfall',
        definition: 'Der aperiodische Grenzfall beschreibt einen Dämpfungszustand eines harmonischen Oszillators, bei dem die Dämpfung gerade so groß ist, dass sich die Auslenkung ohne Überschwingen (=Richtungswechsel) der Ruhelage annähert.',
        component: CriticalDamping,
    },
    {
        slug: 'damping-coefficient',
        title: 'Dämpfungskoeffizient',
        definition: 'Der Dämpfungskoeffizient β beschreibt wie stark die Dämpfung einer Schwingung ist und somit die Amplitude durch Energieverluste abnimmt. Beim Pohlschen Rad ist β einstellbar.',
        component: DampingCoefficient,
    },
    {
    // the slug is a historical name: the term is the torque (Drehmoment); content links use it
        slug: 'angular-momentum',
        title: 'Drehmoment',
        definition: 'Das Drehmoment beschreibt die Drehwirkung einer Kraft auf einen Körper. Es verhält sich analog zur Kraft in geradlinigen Bewegungen und kann somit beschleunigend oder abbremsend wirken. Ein Drehmoment entsteht, wenn eine Kraft mit einem Hebelarm auf einen Körper wirkt.',
        component: AngularMomentum,
    },
    {
        slug: 'natural-frequency',
        title: 'Eigenschwingfrequenz',
        definition: 'Die Eigenschwingfrequenz f beschreibt die Frequenz, mit der ein System nach einer Auslenkung schwingt, wenn keine äußere Kraft wirkt.',
        component: NaturalFrequency,
    },
    {
        slug: 'exponential-ansatz',
        title: 'Exponentialansatz',
        definition: 'Der Exponentialansatz ist eine hilfreiche Methode im Lösen von linearen Differentialgleichungen mit konstanten Koeffizienten. Es wird angenommen, dass sich die Lösungen durch eine exponentielle Funktion darstellen lassen.',
        component: ExponentialAnsatz,
    },
    {
        slug: 'spring-constant',
        title: 'Federkonstante',
        definition: 'Die Federkonstante D ist eine materialabhängige Konstante, die umgangssprachlich Steifigkeit genannt wird. Sie gibt das Verhältnis von einer wirkenden Kraft und der daraus resultierenden Verformung an.',
        component: SpringConstant,
    },
    {
        slug: 'hom-dgl',
        title: 'Homogene Differentialgleichung',
        definition: 'Eine homogene Differentialgleichung beschreibt ein System, dass frei von Anregung schwingt/sich bewegt. Es wirken nur innere Kräfte (Trägheit, Dämpfung, Rückstellkraft,...), somit ist eine Seite der Gleichung gleich Null.',
        component: HomDgl,
    },
    {
        slug: 'inhom-dgl',
        title: 'Inhomogene Differentialgleichung',
        definition: 'Inhomogene (lineare) Differentialgleichungen werden in der Physik genutzt, um die Schwingung eines Systems zu beschreiben. Im Gegensatz zur homogenen Differentialgleichung werden äußere Kräfte und Anregungen berücksichtigt.',
        component: InhomDgl,
    },
    {
        slug: 'angular-frequency',
        title: 'Kreisfrequenz',
        definition: 'Unter der Kreisfrequenz ω einer Schwingung wird allgemein der überstrichene Winkel φ pro Zeitspanne verstanden.',
        component: AngularFrequency,
    },
    {
        slug: 'newton-notation',
        title: 'Newtonsche Notation',
        definition: 'Die Newtonsche Notation kennzeichnet Ableitungen einer Größe nach der Zeit durch Punkte über dem Formelzeichen. Ein Punkt steht für die erste Zeitableitung und zwei Punkte stehen für die zweite Zeitableitung.',
        component: NewtonNotation,
    },
    {
        slug: 'resonance-frequency',
        title: 'Resonanzfrequenz',
        definition: 'Die Resonanzfrequenz einer erzwungenen Schwingung ist die Frequenz bei der ihre Amplitude maximal wird.',
        component: ResonanceFrequency,
    },
    {
        slug: 'directive-moment',
        title: 'Richtmoment',
        definition: 'Das Richtmoment (oder Direktionsmoment) D ist die Proportionalitätskonstante zwischen dem anliegenden Drehmoment M und dem Drehwinkel φ. Es beschreibt, wie stark das von der Feder ausgeübte Drehmoment bei einer bestimmten Auslenkung ist.',
        component: DirectiveMoment,
    },
    {
        slug: 'moment-of-inertia',
        title: 'Trägheitsmoment',
        definition: 'Das Trägheitsmoment Θ ist ein Maß für den Widerstand, den ein Körper der Änderung seiner Winkelgeschwindigkeit entgegensetzt. Es spielt damit bei einer Drehbewegung die gleiche Rolle wie die (träge) Masse im Verhältnis von Kraft und Beschleunigung (Translationsbewegeung).',
        component: MomentOfInertia,
    },
];


export function glossaryTerm(slug: string): GlossaryTerm | undefined {
    return GLOSSARY_TERMS.find(t => t.slug === slug);
}
