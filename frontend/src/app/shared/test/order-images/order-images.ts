import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestTracking } from '../../../core/services/test-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';



interface ImageOption {
    id: string;
    imageSrc: string;
    label?: string;
}



@Component({
    selector: 'app-test-order-images',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './order-images.html',
    styleUrl: './order-images.css'
})
export class TestOrderImages implements OnInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction!: string;
    @Input() images!: ImageOption[];
    @Input() correctOrder!: string[];
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: string[];
        pointsAwarded: number;
    }>();


    orderedImages: ImageOption[] = [];
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';


    constructor(private testTracking: TestTracking, private shuffleOrder: ShuffleOrder) {}


    ngOnInit() {
        this.restorePreviousAnswer();
    }


    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was already answered - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            
            // Restore the user's order
            const userOrder = previousResult.userAnswer as string[];
            this.orderedImages = userOrder.map(id => 
                this.images.find(img => img.id === id)!
            ).filter(img => img !== undefined);
            
            // Restore feedback message
            if (this.isCorrect) {
                this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
            } else {
                this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
            }
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: userOrder,
                pointsAwarded: this.pointsAwarded
            });
            
            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
        } else {
            const order = this.shuffleOrder.getOrCreate(this.questionId, this.images.length);
            this.orderedImages = order.map(i => this.images[i]);
        }
    }


    drop(event: CdkDragDrop<ImageOption[]>) {
        if (this.isSubmitted) return; // Can't reorder after submission

        moveItemInArray(this.orderedImages, event.previousIndex, event.currentIndex);
    }


    submitAnswer() {
        if (this.isSubmitted) return; // Already submitted

        this.isSubmitted = true;

        // get user's order
        const userOrder = this.orderedImages.map(img => img.id);

        // check if correct
        this.isCorrect = this.arraysEqual(userOrder, this.correctOrder);

        // award points
        this.pointsAwarded = this.isCorrect ? this.maxPoints : 0;

        // feedback
        if (this.isCorrect) {
            this.feedbackMessage = `✓ Richtig! Sie haben ${this.pointsAwarded} von ${this.maxPoints} Punkten erreicht.`;
        } else {
            this.feedbackMessage = `✗ Leider falsch. Sie haben 0 von ${this.maxPoints} Punkten erreicht.`;
        }

        // emit result
        this.onSubmit.emit({
            isCorrect: this.isCorrect,
            userAnswer: userOrder,
            pointsAwarded: this.pointsAwarded
        });
    }


    private arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}