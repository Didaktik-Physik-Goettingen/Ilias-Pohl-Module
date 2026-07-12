import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



@Component({
	selector: 'app-directive-moment',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './directive-moment.html',
	styleUrl: './directive-moment.css',
})
export class DirectiveMoment extends GlossaryBase {
    directiveMomentText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.directiveMomentText = this.sanitizer.bypassSecurityTrustHtml(`
			Das Richtmoment oder Direktionsmoment $D$ ist die Proportionalitätskonstante zwischen dem anliegenden Drehmoment $M$ und dem Drehwinkel $\\varphi$. Sie beschreibt wie stark, das von der Feder ausgeübte Drehmoment ist, wenn sie um einen bestimmten Winkel $\\varphi$ ausgelenkt/verdreht wird.
			<br><br>
			Es gilt allgemein:
			$$M = D\\varphi$$
			Für den Pohl Resonator ergibt sich dies zu:
			$$M = D^*\\varphi$$
			mit der Winkelrichtgröße $D^*$.
        `);
	}
}
