import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';

declare global {
	interface Window {
		MathJax: any;
    }
}

@Component({
  selector: 'app-chaotic-behavior',
  imports: [CommonModule, RouterLink],
  templateUrl: './chaotic-behavior.html',
  styleUrl: './chaotic-behavior.css',
})

export class ChaoticBehavior implements OnInit, OnDestroy {
    constructor(
		private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private router: Router,
		private trackingService: ResultsTracking,
        public glossaryOverlay: GlossaryOverlay
    ) {}

    @HostListener('click', ['$event'])
    onGlossaryLink(event: MouseEvent) {
        const link = (event.target as HTMLElement)
            ?.closest('a[href^="#glossary-"]') as HTMLAnchorElement | null;
        if (!link) return;
        event.preventDefault();
        const term = link.getAttribute('href')!.replace('#glossary-', '');
        this.glossaryOverlay.open(term);
    }

	AbschnittPotential!: SafeHtml;
  differentialgleichung!: SafeHtml;

  ngOnInit() {
      // restore subpage from URL query param
      const page = this.route.snapshot.queryParamMap.get('page');
      if (page && ['1','2','3','4'].includes(page)) {
          this.currentView = `chaos_${page}`;
      }

      // start tracking this module
      this.trackingService.startModule('chaotic-behavior');

      // sanitized string to enable LaTeX rendering
      this.AbschnittPotential = this.sanitizer.bypassSecurityTrustHtml(`
          Wenn man allerdings eine zusätzliche Masse an das Schwungrad anbringt, bewirkt diese ein zusätzliches cosinus-förmiges Potential
          ($V\_{\\text{Zusatzmasse}}(\\phi) = mgR\\cos(\\phi)$).
          Aus der Überlagerung des quadratischen und des cosinus-förmingen Potentials resultiert, wie die obere Abbildung zeigt, 
          ein Potential mit zwei lokalen Minima im relevanten Winkelbereich. Ein solches Potential wird häufig als "W-Potential" bezeichnet.<br>
          Eine zusätzliche Masse bewirkt somit, dass es keinen stabilen Gleichgewichtspunkt des Rades mehr in der Ausgangsposition gibt, 
          sondern $\\phi=0$ zu einem labilen Gleichgewichtspunkt wird, an dem kleine Änderungen des Auslenkwinkels die Dynamik entscheidend bestimmen.
          Stattdessen entstehen zwei neue, symmetrisch um den Ursprung verteilte Gleichgewichtslagen.
      `);
      this.differentialgleichung = this.sanitizer.bypassSecurityTrustHtml(`
          $$\\ddot{\\varphi} + 2\\tilde{\\beta} \\dot{\\varphi} + \\tilde{\\omega}_0^2\\phi + \\alpha\\sin{\\phi} = N\\cos{\\omega t} $$
          Beachte, dass durch Tilden über den Variablen angezeigt werden soll, dass sich das aufgrund der Zusatzmassen das 
          <a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a> geändert hat. 
          Zudem haben wir die Variable $\\alpha = \\frac{mgr}{\\Theta_1}$ mit dem neuen <a href="#glossary-moment-of-inertia" class="glossary-link">Trägheitsmoment</a><br>
          Für sehr kleine Nichtlinearitäten, können wir bei kleinen Auslenkungen die Sinusfunktion in erster Näherung betrachten: 
          $\\sin(\\phi) \\approx \\phi$, wodurch sich wieder eine lineare Schwingungsgleichung ergibt:
          $$\\ddot{\\varphi} + 2\\tilde{\\beta} \\dot{\\varphi} +( \\tilde{\\omega}_0^2+\\alpha)\\phi = N\\cos{\\omega t} $$<br>
          Diese Gleichung kann wie gewohnt gelöst werden und es zeigt sich, dass die zusätzliche Masse lediglich eine Änderung der
          <a href="#glossary-angular-frequency" class="glossary-link">Eigenschwingfrequenz</a> bewirkt.<br>
          Für größere Auslenkungen müssen weitere Terme der Taylorentwicklung berücksichtigt werden, die zu einer Verzerrung (zu höheren Frequenzen) der Resonanzfrequenz-Kurve führen.<br><br>
          Im Versuch werden Sie sich mit Nicht-Linearitäten beschäftigen, die zur Ausbildung neuer Ruhelagen führen. Um das Schwingungsverhalten in diesem Fall für kleine Auslenkungen zu betrachten, 
          können wir in ähnlicher Weise vorgehen, wie soeben beschrieben, wobei wir die Entwicklung des Sinus um eine der neuen Gleichgewichtspositionen betrachten, also um 
          $\\phi_0 \\neq 0$. Eine solche Rechnung zeigt ebenfalls, dass die zusätzliche Masse zu einer Verschiebung der 
          <a href="#glossary-resonance-frequency" class="glossary-link">Resonanzfrequenz</a> führt, wobei die Verzerrung hin zu kleineren Frequenzen ist.<br><br>
          Verringert man die Dämpfung in einem System mit ausgeprägten Nichtlinearitäten, tritt zunächst eine sogenannte <b>Bifurkation</b> auf. 
          Dabei spaltet sich die ursprünglich einfache Grundamplitude auf. Das Pendel schwingt dann nicht mehr mit nur einer Frequenz, 
          sondern zeigt eine <b>Überlagerung aus zwei verschiedenen Frequenzen</b>, also höheren Harmonischen der Grundfrequenz.
          Im Phasenraumdiagramm erkennt man dies daran, dass die Bewegung nicht mehr einer einzigen Ellipse entspricht, sondern als <b>zwei ineinander übergehende Ellipsen</b> erscheint.<br><br>
          Reduziert man die Dämpfung weitere, so kann die Bewegung zunächst noch durch die weitere Überlagerung mit Schwingungen höherer Frequenzen beschrieben werden, 
          geht dann aber in ein chaotisches Verhalten über. 
          Selbst wenn man die Bewegung über einen längeren Zeitraum hinweg betrachtet, lässt sich keine Periodizität ausmachen. 
          Im Phasenraum lässt sich ein solches deterministisches Chaos darin erkennen, dass die Trajektorie nicht wieder in sich selbst übergeht, 
          sondern immer weitere Bereiche des Phasenraums überdeckt werden.
        `)

      this.renderMath();
  }

  ngOnDestroy() {
      // End tracking when leaving the module
      this.trackingService.endModule();
  }

  // trigger MathJax rendering
	renderMath() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (window.MathJax) {
					// Clear all previous MathJax processing
					const elements = document.querySelectorAll('.MathJax');
					elements.forEach(el => el.remove());
					
					window.MathJax.typesetPromise();
				}
			}, 100);
		}
	}

  	// +++ in-page navigation +++

    private updateUrl() {
        const page = this.currentView.replace('chaotic-behavior', '');
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    // navigation helpers
	currentView: string = 'chaos_1';
    get isFirstPage(): boolean {
        return this.currentView === 'chaos_1';
    }
    get isLastPage(): boolean {
        return this.currentView === 'chaos_4';
    }

	// page completion tracking
	page1Complete = true;
	page2Complete = true;
	page3Complete = true;
  page4Complete = true;
	

    // ability to proceed in the module: depending on the Q+A performance (all questions have to be answered)
    get canProceed(): boolean {
        // if (this.currentView === 'intro_exp1') return this.page1Complete;
        // if (this.currentView === 'intro_exp2') return this.page2Complete;
        // if (this.currentView === 'intro_exp3') return this.page3Complete;
		// if (this.currentView === 'intro_exp4') return this.page4Complete;
        // return false;
        return true;
    }


    // going back always enabled (for now at least)
    get canGoBack(): boolean {
		// if (this.currentView === 'intro_exp1') return false;
        return true;
    }

    // going back shows the previous subpage / home page
    goBack() {
        if (this.currentView === 'chaos_1') {
            this.router.navigate(['/']);
            return;
        } else if (this.currentView === 'chaos_2') {
            this.currentView = 'chaos_1';
        } else if (this.currentView === 'chaos_3') {
            this.currentView = 'chaos_2';
        }else if (this.currentView === 'chaos_4') {
            this.currentView = 'chaos_3';
        }
        this.updateUrl();
        this.renderMath();
    }

    // go forward shows next subpage / page
    goForward() {
        if (this.canProceed) {
            if (this.currentView === 'chaos_1') {
                this.currentView = 'chaos_2';
            } else if (this.currentView === 'chaos_2') {
                this.currentView = 'chaos_3';
            } else if (this.currentView === 'chaos_3') {
                this.currentView = 'chaos_4';
            }  else if (this.currentView === 'chaos3') {
                this.router.navigate(['abschlussseite']);
                return;
            }
            this.updateUrl();
            this.renderMath();
        }
    }
}
