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
    selector: 'app-spring-constant',
    standalone: true,
    imports: [CommonModule],
	templateUrl: './spring-constant.html',
	styleUrl: './spring-constant.css',
})
export class SpringConstant extends GlossaryBase {
    spring_constantText!: SafeHtml;
    spring_constantFormulaText!: SafeHtml;


    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) platformId: Object,
        route: ActivatedRoute
    ) {
        super(platformId, route);
    }


	// bypassing math rendering errors
    initContent() {        
        this.spring_constantText = this.sanitizer.bypassSecurityTrustHtml(`
			Die Federkonstante $D$ ist eine materialabhänigege Konstante, die umgangssprachlich Steifigkeit genannt wird. 
			Sie gibt das Verhätnis von einer wirkenden Kraft und der daraus resultierenden Verbiegung/Dehnung einer Feder an.
        `);

        this.spring_constantFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Beim Pohlschen Resonator wird statt der Federkonstante, die Winkelrichtgröße $D^*$ genutzt, 
			die das rücktriebende Drehmoment bestimmt:
			$$M_{\\text{Rück}} = D^* \\cdot \\varphi$$
        `);
    }
}