import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';



declare global {
	interface Window {
		MathJax: any;
    }
}



interface QuestionOption {
	value: string;
	label: string;
}



@Component({
	selector: 'app-multiple-choice-image',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './multiple-choice-image.html',
	styleUrl: './multiple-choice-image.css',
})



export class MultipleChoiceImage implements OnInit {
    @Input() imageSrc!: string;
    @Input() imageAlt!: string;
    @Input() question!: string;
    @Input() options!: QuestionOption[];
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

    showResult = false;
    isCorrect = false;
    resultMessage: SafeHtml = '';
    selectedValues: Set<string> = new Set();


    constructor(
        private sanitizer: DomSanitizer,
        private trackingService: ResultsTracking,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}


    ngOnInit() {
        // check if this question was already answered correctly in this session
        this.restorePreviousAnswer();
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

            // Restore selected checkboxes after DOM is ready
            setTimeout(() => {
                this.restoreSelectedAnswers(previousResult.selectedAnswers);
                this.renderMath();
            }, 100);
            
            // Notify parent that this question is already complete
            this.onAnswerEvaluated.emit(true);
        }
    }


    private restoreSelectedAnswers(selectedAnswers: string[]) {
        const checkboxes = document.querySelectorAll(
            `.${this.containerId} input[type="checkbox"]`
        );
        
        checkboxes.forEach((checkbox: any) => {
            if (selectedAnswers.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }


    evaluateAnswer() {
        const checkboxes = document.querySelectorAll(
            `.${this.containerId} input[type="checkbox"]`
        );
        const selectedAnswers: string[] = [];

        checkboxes.forEach((checkbox: any) => {
            if (checkbox.checked) {
                selectedAnswers.push(checkbox.value);
            }
        });

        const allCorrectSelected = this.correctAnswers.every(answer =>
            selectedAnswers.includes(answer)
        );
        const noIncorrectSelected = selectedAnswers.every(answer =>
            this.correctAnswers.includes(answer)
        );

        this.isCorrect = allCorrectSelected && noIncorrectSelected;
        this.showResult = true;

        // Track the result
        const selectedAnswerTexts = selectedAnswers.map(v => this.options.find(o => o.value === v)?.label ?? v);
        const correctAnswerTexts  = this.correctAnswers.map(v => this.options.find(o => o.value === v)?.label ?? v);
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