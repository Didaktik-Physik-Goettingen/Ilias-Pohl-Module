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
    selector: 'app-inhom-dgl',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './inhom-dgl.html',
	styleUrl: './inhom-dgl.css',
})
export class InhomDgl extends GlossaryBase {
    inhom_dglFormulaText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.inhom_dglFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Allgemein gilt:
			$$m\\ddot{x} + b\\dot{x} + kx = F(t)$$
			Beim Pohlschen Rad ergibt sich dies zu:
			$$\\Theta\\ddot{\\varphi} + \\rho\\dot{\\varphi} + D^*\\varphi = M_0\\cos(\\omega t)$$
        `);
    }
}