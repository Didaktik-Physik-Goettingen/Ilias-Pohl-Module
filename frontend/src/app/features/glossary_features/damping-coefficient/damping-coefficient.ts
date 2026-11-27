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
    selector: 'app-damping-coefficient',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './damping-coefficient.html',
	styleUrl: './damping-coefficient.css',
})
export class DampingCoefficient extends GlossaryBase {
    damping_coefficientText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.damping_coefficientText = this.sanitizer.bypassSecurityTrustHtml(`
			Der Dämpfungskoeffizient $\\beta$ beschreibt wie stark die <strong>Dämpfung</strong> einer Schwingung ist 
			und somit die <strong>Amplitude durch Energieverluste</strong> abnimmt. Beim Pohlschen Rad ist $\\beta$ über 
			die Dämpfungskonstante $\\rho$ und das Trägheitsmoment $\\Theta$ definiert:
			$$\\beta = \\frac{\\rho}{2\\Theta}$$
        `);
    }
}
