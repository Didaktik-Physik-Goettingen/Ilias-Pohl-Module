import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TestTracking } from '../../../core/services/test-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';



interface ImageOption {
    value: string;
    imageSrc: string;
    label: string;
}



@Component({
    selector: 'app-test-image-choice',
    standalone: true,
    imports: [],
    templateUrl: './image-choice.html',
    styleUrl: './image-choice.css'
})
export class TestImageChoice implements OnInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction!: string;
    @Input() options!: ImageOption[];
    @Input() correctAnswer!: string; // Single correct answer
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: string;
        pointsAwarded: number;
    }>();

    shuffledOptions: ImageOption[] = [];
    selectedAnswer: string = '';
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';

    constructor(private testTracking: TestTracking, private shuffleOrder: ShuffleOrder) {}

    ngOnInit() {
        const order = this.shuffleOrder.getOrCreate(this.questionId, this.options.length);
        this.shuffledOptions = order.map(i => this.options[i]);
        this.restorePreviousAnswer();
    }

    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was answered correctly before - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            this.selectedAnswer = previousResult.userAnswer as string;

            // Restore feedback message
            if (this.isCorrect) {
                this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
            } else {
                this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
            } 
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: this.selectedAnswer,
                pointsAwarded: this.pointsAwarded
            });

            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
        }
    }

    selectOption(value: string) {
        if (this.isSubmitted) return; // Can't change after submission
        this.selectedAnswer = value;
    }

    submitAnswer() {
        if (this.isSubmitted) return; // Already submitted
        if (!this.selectedAnswer) {
            alert('Bitte wählen Sie eine Antwort aus.');
            return;
        }
        
        this.isSubmitted = true;

        // Check if correct
        this.isCorrect = this.selectedAnswer === this.correctAnswer;

        // Award points
        this.pointsAwarded = this.isCorrect ? this.maxPoints : 0;

        // Feedback
        if (this.isCorrect) {
            this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
        } else {
            this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
        }
        
        // Emit result
        this.onSubmit.emit({
            isCorrect: this.isCorrect,
            userAnswer: this.selectedAnswer,
            pointsAwarded: this.pointsAwarded
        });
    }
}