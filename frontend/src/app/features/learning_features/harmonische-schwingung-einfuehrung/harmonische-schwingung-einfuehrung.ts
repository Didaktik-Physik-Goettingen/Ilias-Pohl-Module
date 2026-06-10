import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MultipleChoiceOption {
  id: number;
  formula: string;
  selected: boolean;
  correct: boolean;
}

@Component({
  selector: 'app-harmonische-schwingung-einfuehrung',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './harmonische-schwingung-einfuehrung.html',
  styleUrl: './harmonische-schwingung-einfuehrung.css'
})
export class HarmonischeSchwingungEinfuehrung implements AfterViewInit, AfterViewChecked {
  answerChecked = false;
  remainingAttempts = 2;
  private mathNeedsUpdate = true;

  multipleChoiceOptions: MultipleChoiceOption[] = [
    {
      id: 1,
      formula: '\\( x(t) = c_1 \\left( e^{i\\omega_0 t} + e^{-i\\omega_0 t} \\right) \\)',
      selected: false,
      correct: false
    },
    {
      id: 2,
      formula: '\\( x(t) = c_1 e^{i\\omega_0 t} + c_2 e^{-i\\omega_0 t} \\)',
      selected: false,
      correct: true
    },
    {
      id: 3,
      formula: '\\( x(t) = A \\cos(\\omega_0 t) + \\sin(\\phi) \\)',
      selected: false,
      correct: false
    },
    {
      id: 4,
      formula: '\\( x(t) = A \\cos(\\omega_0 t + \\phi) \\)',
      selected: false,
      correct: true
    }
  ];

  ngAfterViewInit(): void {
    this.typesetMath();
  }

  ngAfterViewChecked(): void {
    if (this.mathNeedsUpdate) {
      this.mathNeedsUpdate = false;
      this.typesetMath();
    }
  }

  toggleOption(option: MultipleChoiceOption, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    option.selected = checkbox.checked;
    this.answerChecked = false;
  }

  checkAnswer(): void {
    this.answerChecked = true;

    if (!this.isAnswerCorrect() && this.remainingAttempts > 0) {
      this.remainingAttempts--;
    }

    this.mathNeedsUpdate = true;
  }

  isAnswerCorrect(): boolean {
    return this.multipleChoiceOptions.every(option => option.selected === option.correct);
  }

  private typesetMath(): void {
    setTimeout(() => {
      const mathJax = (window as any).MathJax;

      if (mathJax?.typesetPromise) {
        mathJax.typesetPromise();
      } else if (mathJax?.typeset) {
        mathJax.typeset();
      }
    }, 0);
  }
}