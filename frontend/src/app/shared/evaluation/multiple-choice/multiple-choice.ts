import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';
import { isSolutionsMode } from '../../../core/services/report-mode';
import { AnswerFeedback, QuestionOption } from '../question.types';
import { buildSelectionErrorMessage } from '../multiple-choice-feedback';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
	selector: 'app-multiple-choice',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './multiple-choice.html',
	styleUrl: './multiple-choice.css',
})
export class MultipleChoice implements OnInit {
    @Input() question!: string;
    @Input() options!: QuestionOption[];
    @Input() correctAnswers!: string[];
    @Input() containerId!: string;
    @Input() questionId!: string;
    
    // Custom messages
    @Input() successMessage?: string;
    @Input() emptySelectionMessage?: string = 'Bitte wählen Sie mindestens eine Antwort aus.';
    @Input() incompleteMessage?: string = 'Prüfen Sie Ihre Auswahl anhand der Aufgabenstellung.';
    @Input() incorrectMessage?: string = 'Prüfen Sie Ihre Auswahl anhand der Aufgabenstellung.';
    @Input() answerFeedback?: AnswerFeedback;
    
    @Output() onCorrectAnswer = new EventEmitter<void>();
    @Output() onAnswerEvaluated = new EventEmitter<boolean>();

    shuffledOptions: QuestionOption[] = [];
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


    private revealSolution() {
        this.isCorrect = true;
        this.showResult = true;
        this.selectedValues = new Set(this.correctAnswers);
        this.updateResultMessage(this.correctAnswers, true);
        setTimeout(() => {
            this.renderMath();
        }, 100);
        this.onAnswerEvaluated.emit(true);
    }


    private restorePreviousAnswer() {
        const previousResult = this.trackingService.getQuestionResult(this.questionId);
        if (!previousResult) return;
        const selected = previousResult.selectedAnswers;
        this.selectedValues = new Set(selected);
        const allCorrectSelected = this.correctAnswers.every(answer => this.selectedValues.has(answer));
        this.isCorrect = selected.length > 0 && allCorrectSelected
            && selected.every(answer => this.correctAnswers.includes(answer));
        this.showResult = true;
        this.updateResultMessage(selected, allCorrectSelected);
        setTimeout(() => this.renderMath(), 100);
        this.onAnswerEvaluated.emit(this.isCorrect);
    }


    toggleSelection(value: string) {
        if (this.isCorrect) return; // Disable if already correct
        
        this.showResult = false;
        this.resultMessage = '';

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
            const message = buildSelectionErrorMessage(
                selectedAnswers,
                this.correctAnswers,
                this.successMessage || '✓ Richtig!'
            );
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
        } else {
            let statusMessage: string;
            if (selectedAnswers.length === 0) {
                statusMessage = this.emptySelectionMessage!;
            } else if (!allCorrectSelected) {
                statusMessage = this.incompleteMessage!;
            } else {
                statusMessage = this.incorrectMessage!;
            }
            const message = buildSelectionErrorMessage(
                selectedAnswers,
                this.correctAnswers,
                statusMessage,
                this.answerFeedback
            );
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
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
