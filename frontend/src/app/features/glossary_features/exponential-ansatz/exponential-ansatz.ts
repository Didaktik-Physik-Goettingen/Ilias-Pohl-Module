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
    selector: 'app-exponential-ansatz',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './exponential-ansatz.html',
	styleUrl: './exponential-ansatz.css',
})
export class ExponentialAnsatz extends GlossaryBase {
    exponential_ansatzText!: SafeHtml;
    exponential_ansatzFormulaText1!: SafeHtml;
	exponential_ansatzFormulaText2!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.exponential_ansatzText = this.sanitizer.bypassSecurityTrustHtml(`
			Der Exponentialansatz ist eine hilfreiche Methode im Lösen von linearen Differentialgleichungen 
			mit konstanten Koeffizienten. Es wird angenommen, dass sich die Lösungen durch eine exponentielle 
			Funktion mit Wachstumsfaktor $\\lambda$ beschreiben lässt:
			$$y(x) = e^{\\lambda x}$$
        `);

        this.exponential_ansatzFormulaText1 = this.sanitizer.bypassSecurityTrustHtml(`
			<strong>Beispiel: Homogene DGL</strong><br>
			Gegeben sei eine homogene Differentialgleichung (DGL) der Form:
			$$ay''(x) + by'(x) + cy(x) = 0$$
			Um diese zu lösen, wird eine Funktion gesucht, deren erste und zweite Ableitung dieselbe Form 
			wie die Funktion selbst haben. Hier bietet sich die <strong>Exponentialfunktion</strong> $e^x$ an.
			<br><br>
			Setzt man den Lösungsansatz $y(x) = e^{\\lambda x}$ in die DGL ein, so ergibt sich:
			$$a\\lambda^2 e^{\\lambda x} + b\\lambda e^{\\lambda x} + ce^{\\lambda x} = 0$$
			Da $e^{\\lambda x} \\neq 0$ ist, folgt die charakteristische Gleichung:
			$$a\\lambda^2 + b\\lambda + c = 0$$
			Diese kann natürlich ganz einfach nach $\\lambda$ gelöst werden.
        `);

        this.exponential_ansatzFormulaText2 = this.sanitizer.bypassSecurityTrustHtml(`
			<strong>Es wird unter drei Fällen unterschieden:</strong>
			<br><br>
			<strong>1. Fall: $b^2 - 4ac > 0$</strong><br>
			Zwei reelle verschiedene Lösungen $\\lambda_1$ und $\\lambda_2$<br>
			Allgemeine Lösung: 
			$$y_{\\text{hom}}(x) = Ae^{\\lambda_1 x} + Be^{\\lambda_2 x}$$
			mit Konstanten $A, B \\in \\mathbb{R}$
			<br><br>
			<strong>2. Fall: $b^2 - 4ac = 0$</strong><br>
			Eine doppelte reelle Lösung $\\lambda_1 = \\lambda_2 = \\lambda$<br>
			Allgemeine Lösung: 
			$$y_{\\text{hom}}(x) = (A + Bx)e^{\\lambda x}$$
			<br><br>
			<strong>3. Fall: $b^2 - 4ac < 0$</strong><br>
			Komplex konjugierte Lösungen 
			$$\\lambda_{1,2} = \\alpha \\pm i\\beta = -\\frac{b}{2a} \\pm i\\frac{\\sqrt{4ac - b^2}}{2a}$$
        `);
    }
}