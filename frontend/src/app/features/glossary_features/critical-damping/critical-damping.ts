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
    selector: 'app-critical-damping',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './critical-damping.html',
	styleUrl: './critical-damping.css',
})
export class CriticalDamping extends GlossaryBase {
    critical_dampingText!: SafeHtml;
    critical_dampingFormulaText!: SafeHtml;
	critical_dampingPlotText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.critical_dampingFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
            <strong>Kennzeichen:</strong>
            <ul>
                <li>Annäherung an die Gleichgewichtslage in kürzester Zeit</li>
                <li><strong>Keine Überschwingen</strong> der Ruhelage</li>
                <li>Monotones, exponentielles Abklingen der Auslenkung</li>
                <li>Tritt auf, wenn $\\beta = \\omega_0$ (kritische Dämpfung)</li>
                <li>Bei stärkerer Dämpfung ($\\beta > \\omega_0$) geht das System in den überaperiodischen Fall (Kriechfall) über</li>
            </ul>
        `);
    }
}