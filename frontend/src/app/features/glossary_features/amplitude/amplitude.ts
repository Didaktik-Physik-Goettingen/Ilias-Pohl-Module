import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



@Component({
    selector: 'app-amplitude',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './amplitude.html',
    styleUrl: './amplitude.css',
})
export class Amplitude extends GlossaryBase {
    amplitudeText!: SafeHtml;
    amplitudeFormulaText!: SafeHtml;
	amplitudePlotText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.amplitudeText = this.sanitizer.bypassSecurityTrustHtml(`
            Die Amplitude ist der Betrag der maximalen Auslenkung der Schwingung aus der Ruhelage 
            und wird oft als $\\varphi_0$ oder $x_0$ bezeichnet. Bei einer getriebenen Schwingung ist die 
            Amplitude stark abhängig von der Anregungsfrequenz und hat ihren maximalen Wert bei 
            der Frequenz $\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$, mit der Eigenschwingfrequenz $\\omega_0$ und der 
            Dämpfungskonstante $\\beta$.
        `);

        this.amplitudeFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
            Bei einer angetriebenen, gedämpften Schwingung wird die Amplitude (nach der Einschwingphase) 
            durch folgende Beziehung beschrieben:
            $$\\varphi_0(\\omega) = \\frac{N}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}}$$
            Mit
            <ul>
                <li>$N$: Proportionalitätsfaktor (Anregungsstärke)</li>
                <li>$\\omega_0$: Eigenkreisfrequenz des Systems</li>
                <li>$\\beta$: Dämpfungskonstante</li>
                <li>$\\omega$: Erregerkreisfrequenz</li>
                <li>$\\varphi_0(\\omega)$: Amplitude in Abhängigkeit von der Erregerfrequenz</li>
            </ul>
        `);

        this.amplitudePlotText = this.sanitizer.bypassSecurityTrustHtml(`
            <strong>Beispiel: Die Amplitude in Abhängigkeit von der Dämpfung</strong><br>
            Dargestellt ist die normierte Amplitude $\\frac{\\varphi_0(\\omega)}{\\varphi_0(0)}$ in Abhängigkeit 
            von der Erregerfrequenz $\\frac{\\omega}{\\omega_0}$ für verschiedene Dämpfungsverhältnisse 
            $\\frac{\\beta}{\\omega_0}$. Mit zunehmender Dämpfung sinkt das Amplitudenmaximum.
        `);
    }
}