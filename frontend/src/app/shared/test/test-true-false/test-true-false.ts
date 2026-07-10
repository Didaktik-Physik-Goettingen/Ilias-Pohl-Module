import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTracking } from '../../../core/services/test-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';

interface TrueFalseoption {
  value: string;
  label: string;
}
@Component({
  selector: 'app-test-true-false',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-true-false.html',
  styleUrl: './test-true-false.css',
})
export class TestTrueFalse implements OnInit{
  @Input() questionId!: string;
  @Input() question!: string;
  @Input() questionInstruction?: string;
  @Input() statements!: {id: string; text: string; isCorrect: boolean}[];
  @Input() maxPoints!: number;
  @Input() containerId!: string;
  @Input() pointsPerCorrectClick: number = 5;
  @Output() onSubmit = new EventEmitter<{
    isCorrect: boolean;
    userAnswer: { statementId: string; selected: 'true' | 'false'}[];
    pointsAwarded: number;
    pointsBreakdown: string;
  }>();

  shuffledStatements: {id: string; text: string; isCorrect: boolean}[] = [];
  selectedAnswers: Map<string, 'true' | 'false'> = new Map();
  isSubmitted = false;
  isCorrect = false;
  pointsAwarded = 0;
  feedbackMessage = '';
  pointsBreakdown = '';

  constructor(private testTracking: TestTracking, private shuffleOrder: ShuffleOrder) {}

  ngOnInit() {
    const order = this.shuffleOrder.getOrCreate(this.questionId, this.statements.length);
    this.shuffledStatements = order.map(i => this.statements[i]);
    this.restorePreviousAnswer();
  }
  private restorePreviousAnswer() {
    const previousResult = this.testTracking.getQuestionResult(this.questionId);
    if (previousResult) {
      this.isSubmitted = true;
      this.isCorrect = previousResult.isCorrect;
      this.pointsAwarded = previousResult.pointsAwarded;
      previousResult.userAnswer.forEach((ans: any) => {
        this.selectedAnswers.set(ans.statementId, ans.selected)
      });
      this.calculatePointsBreakdown();
      this.feedbackMessage = this.buildFeedbackMessage();

      // Notify parent that this question is already answered
      this.onSubmit.emit({
        isCorrect: this.isCorrect,
        userAnswer: Array.from(this.selectedAnswers.entries()).map(([id, selected]) => ({statementId: id, selected})),
        pointsAwarded: this.pointsAwarded,
        pointsBreakdown: this.pointsBreakdown
      });

      console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
    }
  }

  toggleStatement(statementId: string, value: 'true' | 'false') {
    if (this.isSubmitted) return;
    this.selectedAnswers.set(statementId,value);
  }

  getSelectedValue(statementId: string): 'true' | 'false' | null {
    return this.selectedAnswers.get(statementId) || null;
  }

  isCorrectStatement(statementId: string): boolean {
    const statement = this.statements.find(s => s.id === statementId);
    return statement ? statement.isCorrect : false;
  }

  private calculatePointsBreakdown() {
    let correctClicks = 0;
    const totalStatements = this.statements.length;

    this.statements.forEach(statement => {
      const userSelection = this.selectedAnswers.get(statement.id);
      const isCorrect = statement.isCorrect;

      if (userSelection !== undefined && userSelection === (isCorrect ? 'true' : 'false')) {
        correctClicks++;
      }
    });

    this.pointsAwarded = correctClicks * this.pointsPerCorrectClick;

    this.pointsBreakdown = `${correctClicks} von ${totalStatements} korrekte Aussagen x ${this.pointsPerCorrectClick} Punkte = ${this.pointsAwarded} Punkte`;
    this.pointsBreakdown += `<br><strong>Gesamt: ${this.pointsAwarded} von ${this.maxPoints} Punkten </strong>`;

    this.isCorrect = this.pointsAwarded === this.maxPoints;
  }

  private buildFeedbackMessage(): string {
    if (this.isCorrect) {
      return `✓ Perfekt! Sie haben alle ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
    } else if (this.pointsAwarded > 0) {
      return `○ Teilweise richtig. Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
    } else {
      return `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
    }
  }

  submitAnswer() {
    if (this.isSubmitted) return; // Already submitted

    this.isSubmitted = true;
    
    const userAnswers = Array.from(this.selectedAnswers.entries()).map(([id, selected]) => ({
      statementId: id,
      selected
    }));

    this.calculatePointsBreakdown();
    this.feedbackMessage = this.buildFeedbackMessage();

    this.onSubmit.emit({
      isCorrect: this.isCorrect,
      userAnswer: userAnswers,
      pointsAwarded: this.pointsAwarded,
      pointsBreakdown: this.pointsBreakdown
    });
  }
}

