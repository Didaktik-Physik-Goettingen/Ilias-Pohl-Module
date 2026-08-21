import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';
import { isSolutionsMode } from '../../../core/services/report-mode';
import { QuestionOption } from '../question.types';



declare global {
	interface Window {
		MathJax: any;
    }
}



@Component({
	selector: 'app-single-choice',
	standalone: true,
	templateUrl: './single-choice.html',
	styleUrl: './single-choice.css',
})
export class SingleChoice implements OnInit {
    @Input() question!: string;
    @Input() options!: QuestionOption[];
    @Input() correctAnswer!: string;
    @Input() containerId!: string;
    @Input() questionId!: string;

    // Custom messages
    @Input() successMessage?: string;
    @Input() emptySelectionMessage?: string = '✗ Bitte wählen Sie eine Antwort aus.';
    @Input() incorrectMessage?: string = '✗ Das ist leider nicht richtig.';

    @Output() onCorrectAnswer = new EventEmitter<void>();
    @Output() onAnswerEvaluated = new EventEmitter<boolean>();

    shuffledOptions: QuestionOption[] = [];
    showResult = false;
    isCorrect = false;
    resultMessage: SafeHtml = '';
    selectedValue: string = '';


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
        this.selectedValue = this.correctAnswer;
        this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.successMessage || '✓ Richtig!');
        setTimeout(() => {
            this.restoreSelectedAnswer(this.correctAnswer);
            this.renderMath();
        }, 100);
        this.onAnswerEvaluated.emit(true);
    }


    private restorePreviousAnswer() {
        const previousResult = this.trackingService.getQuestionResult(this.questionId);

        if (previousResult && previousResult.isCorrect) {
            this.isCorrect = true;
            this.showResult = true;
            this.selectedValue = previousResult.selectedAnswers[0] ?? '';

            const message = this.successMessage || '✓ Richtig!';
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);

            setTimeout(() => {
                this.restoreSelectedAnswer(this.selectedValue);
                this.renderMath();
            }, 100);

            this.onAnswerEvaluated.emit(true);
        }
    }


    private restoreSelectedAnswer(value: string) {
        const radios = document.querySelectorAll(
            `.${this.containerId} input[type="radio"]`
        );
        radios.forEach((radio: any) => {
            if (radio.value === value) {
                radio.checked = true;
            }
        });
    }


    evaluateAnswer() {
        const radios = document.querySelectorAll(
            `.${this.containerId} input[type="radio"]`
        );
        let selectedAnswer = '';
        radios.forEach((radio: any) => {
            if (radio.checked) {
                selectedAnswer = radio.value;
            }
        });

        this.selectedValue = selectedAnswer;
        this.isCorrect = selectedAnswer === this.correctAnswer;
        this.showResult = true;

        const selectedAnswerText = this.options.find(o => o.value === selectedAnswer)?.label;
        const correctAnswerText  = this.options.find(o => o.value === this.correctAnswer)?.label ?? this.correctAnswer;
        this.trackingService.trackQuestionResult(
            this.questionId,
            this.isCorrect,
            selectedAnswer ? [selectedAnswer] : [],
            [this.correctAnswer],
            {
                questionText:        this.question,
                selectedAnswerTexts: selectedAnswerText ? [selectedAnswerText] : [],
                correctAnswerTexts:  [correctAnswerText],
            }
        );

        if (this.isCorrect) {
            this.onCorrectAnswer.emit();
        }

        this.onAnswerEvaluated.emit(this.isCorrect);
        this.updateResultMessage(selectedAnswer);

        setTimeout(() => {
            this.renderMath();
        }, 100);
    }


    updateResultMessage(selectedAnswer: string) {
        if (this.isCorrect) {
            const message = this.successMessage || '✓ Richtig!';
            this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(message);
        } else {
            if (!selectedAnswer) {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.emptySelectionMessage!);
            } else {
                this.resultMessage = this.sanitizer.bypassSecurityTrustHtml(this.incorrectMessage!);
            }
        }
    }


    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    const resultElement = document.querySelector(`.${this.containerId} .evaluation-result`);
                    if (resultElement) {
                        window.MathJax.typesetPromise([resultElement]).catch((err: any) => {
                            console.error('MathJax rendering error:', err);
                        });
                    }
                }
            }, 100);
        }
    }
}
