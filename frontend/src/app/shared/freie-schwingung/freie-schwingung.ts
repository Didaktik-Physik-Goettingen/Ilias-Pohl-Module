import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChoiceOption {
  id: number;
  label: string;
  selected: boolean;
  correct: boolean;
}

interface ChoiceTask {
  checked: boolean;
  remainingAttempts: number;
  options: ChoiceOption[];
}

interface TrueFalseStatement {
  id: number;
  text: string;
  selected: boolean | null;
  correct: boolean;
}

interface MatchingOption {
  id: string;
  label: string;
}

interface MatchingItem {
  id: number;
  prompt: string;
  selectedRightId: string;
  correctRightId: string;
}

@Component({
  selector: 'app-freie-schwingung',
  imports: [CommonModule],
  templateUrl: './freie-schwingung.html',
  styleUrl: './freie-schwingung.css',
})
export class FreieSchwingung {
  private mathNeedsUpdate = true;

  formulas = {
    mainDgl: '\\( \\frac{d^2x}{dt^2} + \\omega_0^2 x = 0 \\)',
    omegaDefinition: '\\( \\omega_0^2 := \\frac{D}{m} \\)',
    newtonNotation: '\\( \\ddot{x} + \\omega_0^2x = 0 \\)',
    exponentialAnsatz: '\\( x(t) = c \\cdot e^{\\lambda t}, \\quad c \\neq 0 \\)',
    firstDerivative: '\\( \\dot{x}(t) = c\\lambda \\cdot e^{\\lambda t} \\)',
    secondDerivative: '\\( \\ddot{x}(t) = c\\lambda^2 \\cdot e^{\\lambda t} \\)',
    substitution: '\\( c\\lambda^2e^{\\lambda t} + c\\omega_0^2e^{\\lambda t} = c e^{\\lambda t}(\\lambda^2 + \\omega_0^2) = 0 \\)',
    characteristicEquation: '\\( \\lambda^2 + \\omega_0^2 = 0 \\)',
    lambdaSquared: '\\( \\lambda^2 = -\\omega_0^2 \\)',
    lambdaSolutions: '\\( \\lambda_1 = +i\\omega_0, \\quad \\lambda_2 = -i\\omega_0 \\)',
    solutionOne: '\\( x_1(t) = c_1e^{i\\omega_0t} \\)',
    solutionTwo: '\\( x_2(t) = c_2e^{-i\\omega_0t} \\)',
    complexGeneralSolution: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)',
    realGeneralSolution: '\\( x(t) = c_1\\cos(\\omega_0t) + c_2\\sin(\\omega_0t) \\)',
    realityCondition: '\\( x(t) = x^*(t) \\)',
    conjugatedSolution: '\\( x^*(t) = c_1^*e^{-i\\omega_0t} + c_2^*e^{i\\omega_0t} \\)',
    coefficientConditionOne: '\\( c_1 - c_2^* = 0 \\)',
    coefficientConditionTwo: '\\( c_1^* - c_2 = 0 \\)',
    conjugatedConstants: '\\( c_2 = c_1^* \\)',
    complexC: '\\( c = a + ib, \\quad a,b \\in \\mathbb{R} \\)',
    complexRealSolution: '\\( x(t) = ce^{i\\omega_0t} + c^*e^{-i\\omega_0t} \\)',
    boundaryCondition: '\\( x(t=0) := 0, \\quad \\dot{x}(t=0) = v_0 \\)',
    exampleResult: '\\( x(t) = \\frac{v_0}{\\omega_0}\\sin(\\omega_0t) \\)',
    glossaryMoment: '\\( M_{\\text{Rück}} = D^* \\cdot \\varphi \\)'
  };

  firstTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      {
        id: 1,
        label: '\\( x(t) = c_1 \\left( e^{i\\omega_0t} + e^{-i\\omega_0t} \\right) \\)',
        selected: false,
        correct: false
      },
      {
        id: 2,
        label: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)',
        selected: false,
        correct: true
      },
      {
        id: 3,
        label: '\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)',
        selected: false,
        correct: false
      },
      {
        id: 4,
        label: '\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)',
        selected: false,
        correct: true
      }
    ]
  };

  trueFalseStatements: TrueFalseStatement[] = [
    {
      id: 1,
      text: 'Für eine reelle Lösung muss gelten: \\( c_2 = c_1^* \\).',
      selected: null,
      correct: true
    },
    {
      id: 2,
      text: 'Die Reellheitsbedingung folgt daraus, dass \\( x(t) = x^*(t) \\) gelten muss.',
      selected: null,
      correct: true
    },
    {
      id: 3,
      text: 'Wenn \\( c_1 \\) rein reell ist, ist die gesamte Lösung automatisch reell.',
      selected: null,
      correct: false
    },
    {
      id: 4,
      text: 'Die Bedingung \\( c_1 - c_2^* = 0 \\) folgt aus dem Vergleich der Koeffizienten der Exponentialterme.',
      selected: null,
      correct: true
    }
  ];

  trueFalseChecked = false;
  trueFalseRemainingAttempts = 2;

  matchingOptions: MatchingOption[] = [
    {
      id: 'complex-pair',
      label: 'λ = α ± iβ'
    },
    {
      id: 'undamped',
      label: 'α = 0'
    },
    {
      id: 'damped',
      label: 'e^(αt)cos(βt) und e^(αt)sin(βt)'
    },
    {
      id: 'pure-sine-cosine',
      label: 'Reine Sinus- und Kosinuslösung'
    }
  ];

  matchingItems: MatchingItem[] = [
    {
      id: 1,
      prompt: 'Komplex konjugiertes Paar',
      selectedRightId: '',
      correctRightId: 'complex-pair'
    },
    {
      id: 2,
      prompt: 'Ungedämpfter Fall',
      selectedRightId: '',
      correctRightId: 'undamped'
    },
    {
      id: 3,
      prompt: 'Gedämpfte harmonische Schwingung',
      selectedRightId: '',
      correctRightId: 'damped'
    },
    {
      id: 4,
      prompt: 'Lösung des ungedämpften Falls',
      selectedRightId: '',
      correctRightId: 'pure-sine-cosine'
    }
  ];

  matchingChecked = false;
  matchingRemainingAttempts = 2;

  finalTask: ChoiceTask = {
    checked: false,
    remainingAttempts: 2,
    options: [
      {
        id: 1,
        label: 'Die Lösung ist im Allgemeinen komplex, kann aber immer auf eine reelle Form zurückgeführt werden.',
        selected: false,
        correct: true
      },
      {
        id: 2,
        label: 'Die DGL ist homogen, weil eine äußere Kraft auf das System wirkt.',
        selected: false,
        correct: false
      },
      {
        id: 3,
        label: 'Die allgemeine Lösung lässt sich stets als Linearkombination von \\( e^{\\lambda t} \\)-Termen ausdrücken.',
        selected: false,
        correct: true
      },
      {
        id: 4,
        label: 'Die Schwingungsfrequenz hängt von der Masse ab.',
        selected: false,
        correct: true
      },
      {
        id: 5,
        label: 'Die Bestimmungsgleichung besitzt immer zwei reelle Lösungen.',
        selected: false,
        correct: false
      }
    ]
  };

  ngAfterViewInit(): void {
    this.typesetMath();
  }

  ngAfterViewChecked(): void {
    if (this.mathNeedsUpdate) {
      this.mathNeedsUpdate = false;
      this.typesetMath();
    }
  }

  toggleChoiceOption(task: ChoiceTask, option: ChoiceOption, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    option.selected = checkbox.checked;
    task.checked = false;
    this.queueMathUpdate();
  }

  checkChoiceTask(task: ChoiceTask): void {
    task.checked = true;

    if (!this.isChoiceTaskCorrect(task) && task.remainingAttempts > 0) {
      task.remainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isChoiceTaskCorrect(task: ChoiceTask): boolean {
    return task.options.every(option => option.selected === option.correct);
  }

  selectTrueFalse(statement: TrueFalseStatement, value: boolean): void {
    statement.selected = value;
    this.trueFalseChecked = false;
    this.queueMathUpdate();
  }

  checkTrueFalseTask(): void {
    this.trueFalseChecked = true;

    if (!this.isTrueFalseTaskCorrect() && this.trueFalseRemainingAttempts > 0) {
      this.trueFalseRemainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isTrueFalseTaskCorrect(): boolean {
    return this.trueFalseStatements.every(statement => {
      return statement.selected !== null && statement.selected === statement.correct;
    });
  }

  draggingOptionId = '';

  onDragStart(event: DragEvent, optionId: string): void {
    this.draggingOptionId = optionId;
    event.dataTransfer?.setData('text/plain', optionId);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropMatchingOption(item: MatchingItem, event: DragEvent): void {
    event.preventDefault();
    const optionId = event.dataTransfer?.getData('text/plain') || this.draggingOptionId;
    if (!optionId) return;
    this.matchingItems.forEach(i => { if (i.selectedRightId === optionId) i.selectedRightId = ''; });
    item.selectedRightId = optionId;
    this.matchingChecked = false;
    this.draggingOptionId = '';
    this.queueMathUpdate();
  }

  onDragEnd(): void {
    this.draggingOptionId = '';
  }

  clearMatchingItem(item: MatchingItem): void {
    item.selectedRightId = '';
    this.matchingChecked = false;
    this.queueMathUpdate();
  }

  getAvailableMatchingOptions(): MatchingOption[] {
    const usedIds = new Set(this.matchingItems.filter(i => i.selectedRightId !== '').map(i => i.selectedRightId));
    return this.matchingOptions.filter(opt => !usedIds.has(opt.id));
  }

  getMatchingOptionLabel(id: string): string {
    return this.matchingOptions.find(opt => opt.id === id)?.label ?? '';
  }

  checkMatchingTask(): void {
    this.matchingChecked = true;

    if (!this.isMatchingTaskCorrect() && this.matchingRemainingAttempts > 0) {
      this.matchingRemainingAttempts--;
    }

    this.queueMathUpdate();
  }

  isMatchingTaskCorrect(): boolean {
    return this.matchingItems.every(item => {
      return item.selectedRightId !== '' && item.selectedRightId === item.correctRightId;
    });
  }

  resetMatchingTask(): void {
    this.matchingItems.forEach(item => {
      item.selectedRightId = '';
    });

    this.matchingChecked = false;
    this.matchingRemainingAttempts = 2;
    this.queueMathUpdate();
  }

  private queueMathUpdate(): void {
    this.mathNeedsUpdate = true;
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