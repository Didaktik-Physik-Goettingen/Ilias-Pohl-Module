import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlossaryBase } from '../glossary-base';



@Component({
	selector: 'app-resonance-frequency',
	standalone: true,
	imports: [RouterLink, CommonModule],
	templateUrl: './resonance-frequency.html',
	styleUrl: './resonance-frequency.css',
})
export class ResonanceFrequency extends GlossaryBase {
	resonanceText!: SafeHtml;
	resonancePropText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.resonanceText = this.sanitizer.bypassSecurityTrustHtml(`
			Die Resonanzfrequenz einer erzwungenen Schwingung ist die Frequenz bei der ihre <b>Amplitude maximal</b> wird.
        `);

        this.resonancePropText = this.sanitizer.bypassSecurityTrustHtml(`
			<b>Merkmale der Resonanzfrequenz:</b>
            <ul>
                <li>Ein System kann mehrere Resonanzfrequenzen haben, wenn es mehrere Eigenfrequenzen hat</li>
                <li>Mit steigender Dämpfung sinkt die Resonanzfrequenz</li>
            </ul>
        `);
    }
}
