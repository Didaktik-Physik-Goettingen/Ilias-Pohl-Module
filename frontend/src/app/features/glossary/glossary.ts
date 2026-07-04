import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



// properties of each glossary term
interface GlossaryTerm {
    title: string;
    definition: string;
    link?: string;
}



@Component({
    selector: 'app-glossary',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule],
    templateUrl: './glossary.html',
    styleUrl: './glossary.css',
})



export class Glossary {
    searchTerm: string = '';
    
    terms: GlossaryTerm[] = [
        {
            title: 'Amplitude',
            definition: 'Die Amplitude ist der Betrag der maximalen Auslenkung der Schwingung aus der Ruhelage und wird oft als φ₀ oder x₀ bezeichnet. Bei einer getriebenen Schwingung ist die Amplitude abhängig von der Erregerfrequenz.',
			link: '/glossary/amplitude'
		},
        {
            title: 'Aperiodischer Grenzfall',
            definition: 'Der aperiodische Grenzfall beschreibt einen Dämpfungszustand eines harmonischen Oszillators, bei dem die Dämpfung gerade so groß ist, dass sich die Auslenkung ohne Überschwingen (=Richtungswechsel) der Ruhelage annähert.',
			link: '/glossary/critical-damping'
		},
        {
            title: 'Dämpfungskoeffizient',
            definition: 'Der Dämpfungskoeffizient β beschreibt wie stark die Dämpfung einer Schwingung ist und somit die Amplitude durch Energieverluste abnimmt. Beim Pohlschen Rad ist β einstellbar.',
			link: '/glossary/damping-coefficient'
		},
        {
            title: 'Drehmoment',
            definition: 'Das Drehmoment beschreibt die Drehwirkung einer Kraft auf einen Körper. Es verhält sich analog zur Kraft in geradlinigen Bewegungen und kann somit beschleunigend oder abbremsend wirken. Ein Drehmoment entsteht, wenn eine Kraft mit einem Hebelarm auf einen Körper wirkt.',
			link: '/glossary/angular-momentum'
		},
        {
            title: 'Eigenschwingfrequenz',
            definition: 'Die Eigenschwingfrequenz f beschreibt die Frequenz, mit der ein System nach einer Auslenkung schwingt, wenn keine äußere Kraft wirkt.',
			link: '/glossary/natural-frequency'
		},
        {
            title: 'Exponentialansatz',
            definition: 'Der Exponentialansatz ist eine hilfreiche Methode im Lösen von linearen Differentialgleichungen mit konstanten Koeffizienten. Es wird angenommen, dass sich die Lösungen durch eine exponentielle Funktion darstellen lassen.',
			link: '/glossary/exponential-ansatz'
		},
        {
            title: 'Federkonstante',
            definition: 'Die Federkonstante D ist eine materialabhängige Konstante, die umgangssprachlich Steifigkeit genannt wird. Sie gibt das Verhältnis von einer wirkenden Kraft und der daraus resultierenden Verformung an.',
			link: '/glossary/spring-constant'
		},
        {
            title: 'Homogene Differentialgleichung',
            definition: 'Eine homogene Differentialgleichung beschreibt ein System, dass frei von Anregung schwingt/sich bewegt. Es wirken nur innere Kräfte (Trägheit, Dämpfung, Rückstellkraft,...), somit ist eine Seite der Gleichung gleich Null.',
			link: '/glossary/hom-dgl'
		},
        {
            title: 'Inhomogene Differentialgleichung',
            definition: 'Inhomogene (lineare) Differentialgleichungen werden in der Physik genutzt, um die Schwingung eines Systems zu beschreiben. Im Gegensatz zur homogenen Differentialgleichung werden äußere Kräfte und Anregungen berücksichtigt.',
			link: '/glossary/inhom-dgl'
		},
        {
            title: 'Kreisfrequenz',
            definition: 'Unter der Kreisfrequenz ω einer Schwingung wird allgemein der überstrichene Winkel φ pro Zeitspanne verstanden.',
			link: '/glossary/angular-frequency'
        },
        {
            title: 'Resonanzfrequenz',
            definition: 'Die Resonanzfrequenz einer erzwungenen Schwingung ist die Frequenz bei der ihre Amplitude maximal wird.',
				link: '/glossary/resonance-frequency'
			},
        {
            title: 'Richtmoment',
            definition: 'Das Richtmoment (oder Direktionsmoment) D ist die Proportionalitätskonstante zwischen dem anliegenden Drehmoment M und dem Drehwinkel φ. Es beschreibt, wie stark das von der Feder ausgeübte Drehmoment bei einer bestimmten Auslenkung ist.',
				link: '/glossary/directive-moment'
			},
        {
            title: 'Trägheitsmoment',
            definition: 'Das Trägheitsmoment Θ ist ein Maß für den Widerstand, den ein Körper der Änderung seiner Winkelgeschwindigkeit entgegensetzt. Es spielt damit bei einer Drehbewegung die gleiche Rolle wie die (träge) Masse im Verhältnis von Kraft und Beschleunigung (Translationsbewegeung).',
			link: '/glossary/moment-of-inertia'
        }
    ];

    filteredTerms: GlossaryTerm[] = [...this.terms];

    filterTerms() {
        if (!this.searchTerm) {
            this.filteredTerms = [...this.terms];
            return;
        }

        const search = this.searchTerm.toLowerCase();
        this.filteredTerms = this.terms.filter(term => 
            term.title.toLowerCase().includes(search) || 
            term.definition.toLowerCase().includes(search)
        );
    }
}
