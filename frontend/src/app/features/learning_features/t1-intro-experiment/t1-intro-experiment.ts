import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MultipleChoice } from '../../../shared/evaluation/multiple-choice/multiple-choice';

declare global { interface Window { MathJax: any; } }

@Component({
  selector: 'app-t1-intro-experiment',
  standalone: true,
  imports: [CommonModule, RouterLink, MultipleChoice],
  templateUrl: './t1-intro-experiment.html',
  styleUrl: './t1-intro-experiment.css',
})
export class T1IntroExperiment implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  private mathJaxTimeout: ReturnType<typeof setTimeout> | null = null;

  currentView = 't1_page1';
  get isFirstPage(): boolean { return this.currentView === 't1_page1'; }
  get isLastPage(): boolean { return this.currentView === 't1_page1'; }

  // ── Question data ────────────────────────────────────────────────────────

  question1 = {
    questionId: 't1-q1-dgl-solutions',
    question: 'Welche der folgenden Gleichungen sind allgemeine Lösungen der Differentialgleichung des harmonischen Oszillators? Beachten Sie, dass alle Variablen als konstant angenommen werden sollen.',
    options: [
      { value: 'answer1', label: '\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)' },
      { value: 'answer2', label: '\\( x(t) = c_1\\left(e^{i\\omega_0t} + e^{-i\\omega_0t}\\right) \\)' },
      { value: 'answer3', label: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)' },
      { value: 'answer4', label: '\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)' }
    ],
    correctAnswers: ['answer3', 'answer4'],
    containerId: 't1-q1-container',
    successMessage: '✓ Richtig. Die komplexe Linearkombination und die Kosinuslösung mit Phase sind allgemeine Lösungen.',
    incompleteMessage: '✗ Das ist noch nicht ganz richtig – einige Lösungen fehlen. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.',
    incorrectMessage: '✗ Das ist noch nicht ganz richtig. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.'
  };

  isCorrect1 = false;
  onQuestion1Answered(isCorrect: boolean): void { this.isCorrect1 = isCorrect; }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    const page = this.route.snapshot.queryParamMap.get('page');
    if (page === '1') this.currentView = 't1_page1';
  }

  ngAfterViewInit(): void { this.renderMath(); }

  ngOnDestroy(): void {
    if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  goBack(): void { this.router.navigate(['/']); }

  goForward(): void { this.router.navigate(['/learning/t2-free-oscillations']); }

  // ── MathJax ──────────────────────────────────────────────────────────────

  renderMath(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mathJaxTimeout !== null) clearTimeout(this.mathJaxTimeout);
      this.mathJaxTimeout = setTimeout(() => {
        this.mathJaxTimeout = null;
        const mj = (window as any).MathJax;
        if (mj?.typesetPromise) mj.typesetPromise();
        else if (mj?.typeset) mj.typeset();
      }, 100);
    }
  }
}
