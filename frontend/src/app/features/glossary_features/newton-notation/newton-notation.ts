import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



declare global {
    interface Window {
        MathJax: any;
    }
}



@Component({
    selector: 'app-newton-notation',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './newton-notation.html',
    styleUrl: './newton-notation.css',
})
export class NewtonNotation extends GlossaryBase {
    newtonNotationText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


    initContent() {
        this.newtonNotationText = this.sanitizer.bypassSecurityTrustHtml(`
            Die Newtonsche Notation kennzeichnet Ableitungen einer Größe nach der Zeit durch Punkte über
            dem Formelzeichen. Ein Punkt steht für die erste Zeitableitung und zwei Punkte stehen für die
            zweite Zeitableitung:
            $$\\dot{x}=\\frac{dx}{dt}, \\qquad \\ddot{x}=\\frac{d^2x}{dt^2}$$
            Für die Winkelauslenkung $\\varphi$ gilt entsprechend:
            $$\\dot{\\varphi}=\\frac{d\\varphi}{dt}, \\qquad
            \\ddot{\\varphi}=\\frac{d^2\\varphi}{dt^2}$$
            Dabei bezeichnet $\\dot{\\varphi}$ die Winkelgeschwindigkeit und $\\ddot{\\varphi}$ die
            Winkelbeschleunigung.
        `);
    }
}
