import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';
import { isSolutionsMode } from '../../../core/report-mode';



declare global {
	interface Window {
		MathJax: any;
    }
}



interface ImageOption {
    value: string;
    imageSrc: string;
    label?: string;
}



@Component({
    selector: 'app-image-choice',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-choice.html',
    styleUrl: './image-choice.css'
})


export class ImageChoice implements OnInit {
    @Input() question!: string;
    @Input() options!: ImageOption[];
    @Input() correctAnswers!: string[];
    @Input() containerId!: string;
    @Input() questionId!: string;
    
    // Custom messages
    @Input() successMessage?: string;
    @Input() emptySelectionMessage?: string = '✗ Bitte wählen Sie mindestens eine Antwort aus.';
    @Input() incompleteMessage?: string = '✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.';
    @Input() incorrectMessage?: string = '✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.';
    
    @Output() onCorrectAnswer = new EventEmitter<void>();
    @Output() onAnswerEvaluated = new EventEmitter<boolean>();

    shuffledOptions: ImageOption[] = [];
    showResult = false;
    isCorrect = false;
    resultMessage: SafeHtml = '';
    selectedValues: Set<string> = new Set();

    constructor(
        private sanitizer: DomSanitizer,
        private trackingService: ResultsTracking,
        private shuffleOrder: ShuffleOrder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}


    ngOnInit() {
        const order = this.shuffleOrder.getOrCreate(this.questionId, this.options.length);
        this.shuffledOptions = order.map(i => this.options[i]);
        if (isSolutionsMode()) {
            this.revealSolution();
            return;
        }
        this.restorePreviousAnswer();
    }


    // Renders the correct answers as if they had been chosen (report authoring).
    // Does not record a result — purely presentational.
    private revealSolution() {
        this.isCorrect = true;
        this.showResult = true;
        this.selectedValues = new Set(this.correctAnswers);
        this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.successMessage || '✓ Richtig!');
        this.onAnswerEvaluated.emit(true);
        setTimeout(() => this.renderMath(), 100);
    }


    private restorePreviousAnswer() {
        const previousResult = this.trackingService.getQuestionResult(this.questionId);
        
        if (previousResult && previousResult.isCorrect) {
            // Question was answered correctly before - restore state
            this.isCorrect = true;
            this.showResult = true;
            
            // Restore selected images
            this.selectedValues = new Set(previousResult.selectedAnswers);
            
            // Restore success message
            const message = this.successMessage || '✓ Richtig!';
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
            
            // Notify parent that this question is already complete
            this.onAnswerEvaluated.emit(true);
        }
    }


    toggleSelection(value: string) {
        if (this.isCorrect) return; // Disable if already correct
        
        if (this.selectedValues.has(value)) {
            this.selectedValues.delete(value);
        } else {
            this.selectedValues.add(value);
        }
    }


    isSelected(value: string): boolean {
        return this.selectedValues.has(value);
    }
    

    evaluateAnswer() {
        const selectedAnswers = Array.from(this.selectedValues);

        const allCorrectSelected = this.correctAnswers.every(answer =>
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer =>
            this.correctAnswers.includes(answer)
        );

        this.isCorrect = allCorrectSelected && noIncorrectSelected;
        this.showResult = true;

        // track the result — use imageSrc when no label exists so images can be shown in summary
        const selectedAnswerTexts = selectedAnswers.map(v => {
            const opt = this.options.find(o => o.value === v);
            return opt?.label ?? opt?.imageSrc ?? v;
        });
        const correctAnswerTexts = this.correctAnswers.map(v => {
            const opt = this.options.find(o => o.value === v);
            return opt?.label ?? opt?.imageSrc ?? v;
        });
        this.trackingService.trackQuestionResult(
            this.questionId,
            this.isCorrect,
            selectedAnswers,
            this.correctAnswers,
            { questionText: this.question, selectedAnswerTexts, correctAnswerTexts }
        );

        if (this.isCorrect) {
            this.onCorrectAnswer.emit();
        }
        
        this.onAnswerEvaluated.emit(this.isCorrect);
        this.updateResultMessage(selectedAnswers, allCorrectSelected);

        // render math after evaluating answer
        setTimeout(() => {
            this.renderMath();
        }, 100);
    }


    updateResultMessage(selectedAnswers: string[], allCorrectSelected: boolean) {
        if (this.isCorrect) {
            const message = this.successMessage || '✓ Richtig!';
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
        } else {
            if (selectedAnswers.length === 0) {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.emptySelectionMessage!);
            } else if (!allCorrectSelected) {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.incompleteMessage!);
            } else {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.incorrectMessage!);
            }
        }
    }


    // trigger MathJax rendering
    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    // Get ONLY the result element for THIS question
                    const resultElement = document.querySelector(`.${this.containerId} .evaluation-result`);
                    
                    if (resultElement) {
                        // Only render THIS specific element
                        window.MathJax.typesetPromise([resultElement]).catch((err: any) => {
                            console.error('MathJax rendering error:', err);
                        });
                    }
                }
            }, 100);
        }
    }
}