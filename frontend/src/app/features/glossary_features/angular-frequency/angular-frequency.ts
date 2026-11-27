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
    selector: 'app-angular-frequency',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './angular-frequency.html',
	styleUrl: './angular-frequency.css',
})
export class AngularFrequency extends GlossaryBase {
    angular_frequencyText!: SafeHtml;
    angular_frequencyFormulaText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.angular_frequencyText = this.sanitizer.bypassSecurityTrustHtml(`
            Unter der Kreisfrequenz $\\omega$ einer Schwingung wird allgemein der überstrichene Winkel 
			$\\varphi$ pro Zeitspanne verstanden.
			<br>
			Sie ist definiert als:
			$$\\omega = 2\\pi f = \\frac{2\\pi}{T}$$
        `);

        this.angular_frequencyFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Beim Pohlschen Resonator treten zwei verschiedene Kreisfrequenzen auf:
			<ol>
				<li><strong>Die Eigenkreisfrequenz</strong> $\\omega_e$, die von der Federsteifigkeit und der Massenträgheit abhängt
					$$\\omega_0 = \\sqrt{\\frac{D^*}{\\Theta}}$$
				</li>
				<li><strong>Die Erregerkreisfrequenz</strong> $\\omega$, mit der das System von außen periodisch angeregt wird</li>
			</ol>
        `);
    }
}