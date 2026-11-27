import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



@Component({
    selector: 'app-angular-momentum',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './angular-momentum.html',
    styleUrl: './angular-momentum.css',
})
export class AngularMomentum extends GlossaryBase {
    angular_momentumText!: SafeHtml;
    angular_momentumFormulaText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.angular_momentumText = this.sanitizer.bypassSecurityTrustHtml(`
			Das Drehmoment beschreibt die Drehwirkung einer Kraft auf einen Körper. 
			Es verhält sich analog zur Kraft in geradlinigen Bewegungen und kann somit beschleunigend oder abbremsend wirken.
			Ein Drehmoment entsteht, wenn eine Kraft im Abstand $r$ von der Drehachse angreift. Je größer dieser Abstand und je größer die Kraft, desto größer ist das Drehmoment.
        `);

        this.angular_momentumFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Beim Pohlschen Rad wirken mehrere Drehmomente gleichzeitig:
			<ol>
				<li><strong>Rückstellmoment der Spiralfeder</strong><br> $M_{\\text{Rück}} = D \\cdot \\varphi$</li>
				<li><strong>Dämpfungs- bzw. Reibungsmoment</strong><br> $M_{\\text{Dämpf}} = \\rho \\dot{\\varphi}$</li>
				<li><strong>Äußeres, periodisches Anregungsmoment</strong><br> $M_{\\text{ext}} = M_0 \\cos(\\omega t)$</li>
			</ol>
        `);
    }
}