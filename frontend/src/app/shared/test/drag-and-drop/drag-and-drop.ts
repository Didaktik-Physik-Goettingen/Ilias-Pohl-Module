import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestTracking } from '../../../core/services/test-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';

declare global {
    interface Window {
        MathJax: any;
    }
}

interface ResultContainer {
    id: string;
    imageSrc: string;
    imageAlt?: string;
    correctAnswerIds: string[];
    assignedAnswerIds: string[];
}

interface DraggableAnswer {
    id: string;
    label: string;
}

@Component({
    selector: 'app-test-drag-and-drop',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './drag-and-drop.html',
    styleUrl: './drag-and-drop.css'
})
export class TestDragDrop implements OnInit, AfterViewInit {
    @Input() questionId!: string;
    @Input() question!: string;
    @Input() questionInstruction?: string;
    @Input() containers!: ResultContainer[];
    @Input() answers!: DraggableAnswer[];
    @Input() maxPoints!: number;
    @Input() containerId!: string;
    @Input() pointsPerCorrectAnswer: number = 5; // Points for each correct answer placement
    @Input() pointsPerPerfectContainer: number = 5; // Bonus points for completely correct container
    
    @Output() onSubmit = new EventEmitter<{
        isCorrect: boolean;
        userAnswer: { [containerId: string]: string[] };
        pointsAwarded: number;
        pointsBreakdown: string;
    }>();

    resultContainers: ResultContainer[] = [];
    availableAnswers: DraggableAnswer[] = [];
    isSubmitted = false;
    isCorrect = false;
    pointsAwarded = 0;
    feedbackMessage = '';
    pointsBreakdown = '';

    constructor(
        private testTracking: TestTracking,
        private shuffleOrder: ShuffleOrder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        this.resultContainers = this.containers.map(c => ({
            ...c,
            assignedAnswerIds: []
        }));
        const deep: DraggableAnswer[] = JSON.parse(JSON.stringify(this.answers));
        const order = this.shuffleOrder.getOrCreate(this.questionId, deep.length);
        this.availableAnswers = order.map(i => deep[i]);

        this.restorePreviousAnswer();
    }

    ngAfterViewInit() {
        // Render MathJax after view is initialized
        this.renderMath();
    }

    private restorePreviousAnswer() {
        const previousResult = this.testTracking.getQuestionResult(this.questionId);
        
        if (previousResult) {
            // Question was already answered - restore state
            this.isSubmitted = true;
            this.isCorrect = previousResult.isCorrect;
            this.pointsAwarded = previousResult.pointsAwarded;
            
            const userAnswer = previousResult.userAnswer as { [key: string]: string[] };
            
            // Restore assignments
            const usedAnswerIds = new Set<string>();
            this.resultContainers.forEach(container => {
                const assignedIds = userAnswer[container.id] || [];
                container.assignedAnswerIds = [...assignedIds];
                assignedIds.forEach(id => usedAnswerIds.add(id));
            });
            
            // Remove used answers from available
            this.availableAnswers = this.availableAnswers.filter(a => !usedAnswerIds.has(a.id));
            
            // Recalculate points breakdown for display
            this.calculatePointsBreakdown();
            
            // Restore feedback message
            this.feedbackMessage = this.buildFeedbackMessage();
            
            // Notify parent that this question is already answered
            this.onSubmit.emit({
                isCorrect: this.isCorrect,
                userAnswer: userAnswer,
                pointsAwarded: this.pointsAwarded,
                pointsBreakdown: this.pointsBreakdown
            });
            
            console.log(`Restored test question: ${this.questionId} (${this.pointsAwarded}/${this.maxPoints} points)`);
            
            // Render math after restoration
            setTimeout(() => this.renderMath(), 100);
        }
    }

    // Render MathJax
    private renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise().catch((err: any) => {
                        console.error('MathJax rendering error:', err);
                    });
                }
            }, 100);
        }
    }

    // Get all connected drop lists (for CDK drag-drop)
    getConnectedLists(): string[] {
        const containerIds = this.resultContainers.map(c => `container-${c.id}`);
        return ['available-answers', ...containerIds];
    }

    // Handle drop event
    drop(event: CdkDragDrop<DraggableAnswer[]>) {
        if (this.isSubmitted) return;

        if (event.previousContainer === event.container) {
            // Same list - just reorder
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            // Different lists - transfer the answer
            const answer = event.previousContainer.data[event.previousIndex];
            const sourceListId = event.previousContainer.id;
            const targetListId = event.container.id;

            // Remove from source
            if (sourceListId === 'available-answers') {
                // Remove from available answers array
                const index = this.availableAnswers.findIndex(a => a.id === answer.id);
                if (index !== -1) {
                    this.availableAnswers.splice(index, 1);
                }
            } else {
                // Remove from source container
                const sourceContainerId = sourceListId.replace('container-', '');
                const sourceContainer = this.resultContainers.find(c => c.id === sourceContainerId);
                if (sourceContainer) {
                    const index = sourceContainer.assignedAnswerIds.indexOf(answer.id);
                    if (index !== -1) {
                        sourceContainer.assignedAnswerIds.splice(index, 1);
                    }
                }
            }

            // Add to target
            if (targetListId === 'available-answers') {
                // Add back to available answers
                this.availableAnswers.push(answer);
            } else {
                // Add to target container
                const targetContainerId = targetListId.replace('container-', '');
                const targetContainer = this.resultContainers.find(c => c.id === targetContainerId);
                if (targetContainer) {
                    targetContainer.assignedAnswerIds.push(answer.id);
                }
            }
        }

        // Re-render MathJax after drag-drop
        setTimeout(() => this.renderMath(), 50);
    }

    // Remove answer from container
    removeAnswer(container: ResultContainer, answerId: string) {
        if (this.isSubmitted) return;

        const index = container.assignedAnswerIds.indexOf(answerId);
        if (index !== -1) {
            container.assignedAnswerIds.splice(index, 1);
            
            // Return to available answers
            const answer = this.answers.find(a => a.id === answerId);
            if (answer) {
                this.availableAnswers.push(answer);
            }
        }

        // Re-render MathJax after removal
        setTimeout(() => this.renderMath(), 50);
    }

    // Get answer object by ID
    getAnswerById(id: string): DraggableAnswer | undefined {
        return this.answers.find(a => a.id === id);
    }

    // Get assigned answers for a container (returns full answer objects for display)
    getAssignedAnswersForDisplay(container: ResultContainer): DraggableAnswer[] {
        return container.assignedAnswerIds
            .map(id => this.getAnswerById(id))
            .filter(a => a !== undefined) as DraggableAnswer[];
    }

    // Check if container has correct answers (all correct, no incorrect)
    isContainerCorrect(container: ResultContainer): boolean {
        if (container.assignedAnswerIds.length !== container.correctAnswerIds.length) {
            return false;
        }
        
        // Check all correct answers are present
        const allCorrectPresent = container.correctAnswerIds.every(id => 
            container.assignedAnswerIds.includes(id)
        );
        
        // Check no incorrect answers are present
        const noIncorrectPresent = container.assignedAnswerIds.every(id =>
            container.correctAnswerIds.includes(id)
        );
        
        return allCorrectPresent && noIncorrectPresent;
    }

    // Check if answer should be highlighted as correct/incorrect
    isAnswerCorrect(container: ResultContainer, answerId: string): boolean {
        return container.correctAnswerIds.includes(answerId);
    }

    // Count correct answers in a container
    countCorrectAnswersInContainer(container: ResultContainer): number {
        return container.assignedAnswerIds.filter(id => 
            container.correctAnswerIds.includes(id)
        ).length;
    }

    // Calculate partial points with breakdown
    private calculatePointsBreakdown() {
        let correctAnswersCount = 0;
        let perfectContainersCount = 0;

        this.resultContainers.forEach(container => {
            const correctInContainer = this.countCorrectAnswersInContainer(container);
            correctAnswersCount += correctInContainer;

            if (this.isContainerCorrect(container)) {
                perfectContainersCount++;
            }
        });

        const pointsFromCorrectAnswers = correctAnswersCount * this.pointsPerCorrectAnswer;
        const pointsFromPerfectContainers = perfectContainersCount * this.pointsPerPerfectContainer;

        this.pointsAwarded = pointsFromCorrectAnswers + pointsFromPerfectContainers;
        
        // Build breakdown string
        this.pointsBreakdown = `${correctAnswersCount} korrekte Zuordnungen × ${this.pointsPerCorrectAnswer} Punkte = ${pointsFromCorrectAnswers} Punkte`;
        if (perfectContainersCount > 0) {
            this.pointsBreakdown += `<br>${perfectContainersCount} vollständig korrekte Container × ${this.pointsPerPerfectContainer} Bonuspunkte = ${pointsFromPerfectContainers} Bonuspunkte`;
        }
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
        if (this.isSubmitted) return;

        this.isSubmitted = true;

        // Build user answer object
        const userAnswer: { [key: string]: string[] } = {};
        this.resultContainers.forEach(container => {
            userAnswer[container.id] = [...container.assignedAnswerIds];
        });

        // Calculate partial points
        this.calculatePointsBreakdown();

        // Build feedback message
        this.feedbackMessage = this.buildFeedbackMessage();

        // Emit result
        this.onSubmit.emit({
            isCorrect: this.isCorrect,
            userAnswer: userAnswer,
            pointsAwarded: this.pointsAwarded,
            pointsBreakdown: this.pointsBreakdown
        });
    }
}