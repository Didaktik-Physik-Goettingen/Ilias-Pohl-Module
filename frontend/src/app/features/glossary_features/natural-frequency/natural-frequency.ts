import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



@Component({
    selector: 'app-natural-frequency',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './natural-frequency.html',
	styleUrl: './natural-frequency.css',
})
export class NaturalFrequency extends GlossaryBase {
    natural_frequencyText!: SafeHtml;
    undamped_natural_frequencyFormulaText!: SafeHtml;
	damped_natural_frequencyFormulaText!: SafeHtml;



    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }



	// bypassing math rendering errors
    initContent() {        
        this.natural_frequencyText = this.sanitizer.bypassSecurityTrustHtml(`
            Die Eigenschwingfrequenz $f$ beschreibt die Frequenz, mit der ein System nach einer Auslenkung schwingt, wenn keine äußere Kraft wirkt.
        `);

        this.undamped_natural_frequencyFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			<strong>Ungedämpfte Eigenschwingfrequenz</strong>
			$$f_0 = \\frac{1}{2\\pi} \\sqrt{\\frac{D}{\\Theta}}$$
			Die Eigenschwingfrequenz $f$ und Eigenkreisfrequenz $\\omega = \\sqrt{\\frac{D}{\\Theta}}$ 
			sind über $\\omega = 2\\pi f$ miteinander verbunden. Somit gilt:
			$$\\omega_0 = \\sqrt{\\frac{D}{\\Theta}}$$
        `);

        this.damped_natural_frequencyFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
            <strong>Gedämpfte Eigenschwingfrequenz</strong><br>
			Eine Dämpfung ($\\beta > 0$) hat eine Verringerung der Schwingfrequenz zur Folge. Es gilt:
			$$f_d = \\frac{1}{2\\pi} \\sqrt{\\omega_0^2 - \\beta^2}$$
			beziehungsweise für die Eigenkreisfrequenz:
			$$\\omega_d = \\sqrt{\\omega_0^2 - \\beta^2}$$
        `);
    }
}
