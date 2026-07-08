import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTracking } from '../../../core/services/test-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';

interface ChoiceOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-test-multiple-choice',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './multiple-choice.html',
    styleUrl: './multiple-choice.css'
})
export class TestMultipleChoice implements OnInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction?: string;
    @Input() options!: ChoiceOption[];
    @Input() correctAnswers!: string[]; // Multiple correct answers
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    @Input() pointsPerCorrectClick: number = 5; // Points for each correct selection/deselection
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: string[];
        pointsAwarded: number;
        pointsBreakdown: string;
    }>();

    shuffledOptions: ChoiceOption[] = [];
    selectedAnswers: Set<string> = new Set();
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';
    pointsBreakdown = '';

    constructor(private testTracking: TestTracking, private shuffleOrder: ShuffleOrder) {}

    ngOnInit() {
        const order = this.shuffleOrder.getOrCreate(this.questionId, this.options.length);
        this.shuffledOptions = order.map(i => this.options[i]);
        this.restorePreviousAnswer();
    }

    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was already answered - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            this.selectedAnswers = new Set(previousResult.userAnswer as string[]);
            
            // Recalculate points breakdown for display
            this.calculatePointsBreakdown();
            
            // Restore feedback message
            this.feedbackMessage = this.buildFeedbackMessage();
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: Array.from(this.selectedAnswers),
                pointsAwarded: this.pointsAwarded,
                pointsBreakdown: this.pointsBreakdown
            });
            
            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
        }
    }

    toggleOption(value: string) {
        if (this.isSubmitted) return; // Can't change after submission
        
        if (this.selectedAnswers.has(value)) {
            this.selectedAnswers.delete(value);
        } else {
            this.selectedAnswers.add(value);
        }
    }

    isSelected(value: string): boolean {
        return this.selectedAnswers.has(value);
    }

    isCorrectAnswer(value: string): boolean {
        return this.correctAnswers.includes(value);
    }

    // Calculate partial points with breakdown
    private calculatePointsBreakdown() {
        let correctClicks = 0;
        let totalClickableOptions = this.options.length;

        this.options.forEach(option => {
            const isCorrect = this.correctAnswers.includes(option.value);
            const isSelected = this.selectedAnswers.has(option.value);

            // Award points if:
            // - Correct answer is selected (checked when should be checked)
            // - Incorrect answer is NOT selected (unchecked when should be unchecked)
            if ((isCorrect && isSelected) || (!isCorrect && !isSelected)) {
                correctClicks++;
            }
        });

        this.pointsAwarded = correctClicks * this.pointsPerCorrectClick;
        
        // Build breakdown string
        this.pointsBreakdown = `${correctClicks} von ${totalClickableOptions} korrekte Entscheidungen × ${this.pointsPerCorrectClick} Punkte = ${this.pointsAwarded} Punkte`;
        this.pointsBreakdown += `<br><strong>Gesamt: ${this.pointsAwarded} von ${this.maxPoints} Punkten</strong>`;

        // Check if completely correct (all points earned)
        this.isCorrect = this.pointsAwarded === this.maxPoints;
    }

    // Build feedback message
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

        const userAnswers = Array.from(this.selectedAnswers);

        // Calculate partial points
        this.calculatePointsBreakdown();

        // Build feedback message
        this.feedbackMessage = this.buildFeedbackMessage();

        // Emit result
        this.onSubmit.emit({
            isCorrect: this.isCorrect,
            userAnswer: userAnswers,
            pointsAwarded: this.pointsAwarded,
            pointsBreakdown: this.pointsBreakdown
        });
    }
}