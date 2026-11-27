import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



declare global {
    interface Window {
        MathJax: any;
    }
}



@Component({
    selector: 'app-hom-dgl',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './hom-dgl.html',
	styleUrl: './hom-dgl.css',
})
export class HomDgl extends GlossaryBase {
    hom_dglFormulaText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }
    

	// bypassing math rendering errors
    initContent() {        
        this.hom_dglFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Die Differentialgleichung 
			$$m\\ddot{x} + b\\dot{x} + Dx = 0$$
			beschreibt die freie, gedämpfte Schwingung eines Federpendels mit der Masse $m$, 
			der Federkonstante $D$ und einem Dämpfungskoeffizienten $b$, der die Reibungskraft bestimmt.
			<br><br>
			Beim <strong>Pohlschen Resonator</strong> gilt die gleiche Form, nur in Drehbewegung:
			$$\\Theta\\ddot{\\varphi} + \\rho\\dot{\\varphi} + D^*\\varphi = 0$$
			Dabei entsprechen $\\Theta$ der Masse $m$, $\\rho$ der Dämpfungskonstante $b$ und 
			$D^*$ der Federkonstante $D$.
        `);
    }
}