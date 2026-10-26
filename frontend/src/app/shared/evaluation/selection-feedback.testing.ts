import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Type } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MultipleChoice } from './multiple-choice/multiple-choice';
import { MultipleChoiceImage } from './multiple-choice-image/multiple-choice-image';
import { ImageChoice } from './image-choice/image-choice';
import { ResultsTracking } from '../../core/services/results-tracking';
import { ShuffleOrder } from '../../core/services/shuffle-order';

export function selectionFeedbackTests(componentType: Type<MultipleChoice | MultipleChoiceImage | ImageChoice>) {
    describe(`${componentType.name} selection feedback lifecycle`, () => {
        let fixture: ComponentFixture<MultipleChoice | MultipleChoiceImage | ImageChoice>;
        let tracking: { getQuestionResult: ReturnType<typeof vi.fn>; trackQuestionResult: ReturnType<typeof vi.fn> };

        beforeEach(async () => {
            tracking = { getQuestionResult: vi.fn(), trackQuestionResult: vi.fn() };
            await TestBed.configureTestingModule({
                imports: [componentType],
                providers: [
                    { provide: ResultsTracking, useValue: tracking },
                    { provide: ShuffleOrder, useValue: { getOrCreate: () => [0, 1, 2] } }
                ]
            }).compileComponents();
            fixture = TestBed.createComponent(componentType);
            fixture.componentRef.setInput('questionId', 'feedback-test');
            fixture.componentRef.setInput('containerId', 'feedback-test-container');
            fixture.componentRef.setInput('question', 'Welche Beziehungen gelten?');
            fixture.componentRef.setInput('options', [
                { value: 'a', label: 'A', imageSrc: 'a.png' },
                { value: 'b', label: 'B', imageSrc: 'b.png' },
                { value: 'wrong', label: 'C', imageSrc: 'c.png' }
            ]);
            fixture.componentRef.setInput('correctAnswers', ['a', 'b']);
            fixture.componentRef.setInput('successMessage', 'Physical explanation.');
            fixture.componentRef.setInput('incompleteMessage', 'General prompt.');
            fixture.componentRef.setInput('incorrectMessage', 'General prompt.');
            fixture.componentRef.setInput('answerFeedback', { a: 'Hint A.', b: 'Hint B.', wrong: 'Targeted hint.' });
            vi.useFakeTimers();
        });
        afterEach(() => { fixture.destroy(); vi.clearAllTimers(); vi.useRealTimers(); });

        function visibleMessage(): string {
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            return fixture.nativeElement.querySelector('.evaluation-result').textContent.trim();
        }

        it('handles selection and evaluation through the rendered controls', () => {
            fixture.detectChanges();
            if (fixture.componentInstance instanceof ImageChoice) {
                fixture.nativeElement.querySelectorAll('.image-option')[2].click();
            } else {
                fixture.nativeElement.querySelector('input[value="wrong"]').click();
            }
            fixture.detectChanges();
            fixture.nativeElement.querySelector('.evaluation-submit-btn').click();
            expect(visibleMessage()).toBe('Anzahl der Fehler: 3.Hint A. Hint B. Targeted hint.');
            if (fixture.componentInstance instanceof ImageChoice) {
                fixture.nativeElement.querySelectorAll('.image-option')[0].click();
            } else {
                fixture.nativeElement.querySelector('input[value="a"]').click();
            }
            fixture.detectChanges();
            expect(visibleMessage()).toBe('');
            expect(fixture.componentInstance.showResult).toBe(false);
        });

        it('renders the error count and every needed concept after evaluation', () => {
            fixture.detectChanges();
            const c = fixture.componentInstance;
            c.toggleSelection('a'); c.toggleSelection('wrong'); c.evaluateAnswer();
            expect(visibleMessage()).toBe('Anzahl der Fehler: 2.Hint B. Targeted hint.');
            expect(visibleMessage()).not.toMatch(/Du hast|richtige Antwort|falsche Antwort/);
            expect(tracking.trackQuestionResult).toHaveBeenCalledWith(
                'feedback-test', false, ['a', 'wrong'], ['a', 'b'], expect.any(Object)
            );
        });

        it('requests a selection without option hints for an empty submission', () => {
            fixture.detectChanges(); fixture.componentInstance.evaluateAnswer();
            expect(visibleMessage()).toBe('Bitte wählen Sie mindestens eine Antwort aus.');
            expect(visibleMessage()).not.toMatch(/Hint|Targeted/);
        });

        it('clears an unsuccessful message on a changed selection and reevaluates it', () => {
            fixture.detectChanges();
            const c = fixture.componentInstance;
            c.toggleSelection('wrong'); c.evaluateAnswer();
            c.toggleSelection('wrong'); c.toggleSelection('a');
            expect(c.showResult).toBe(false); expect(c.resultMessage).toBe('');
            expect(visibleMessage()).toBe('');
            c.evaluateAnswer();
            expect(visibleMessage()).toBe('Anzahl der Fehler: 1.Hint B.');
        });

        it.each([true, false])('restores feedback with saved isCorrect=%s', savedCorrect => {
            const selected = savedCorrect ? ['a', 'b'] : ['a', 'wrong'];
            tracking.getQuestionResult.mockReturnValue({ isCorrect: savedCorrect, selectedAnswers: selected });
            fixture.detectChanges();
            expect(fixture.componentInstance.selectedValues).toEqual(new Set(selected));
            expect(fixture.componentInstance.isCorrect).toBe(savedCorrect);
            expect(visibleMessage()).toBe(savedCorrect
                ? 'Anzahl der Fehler: 0.Physical explanation.' : 'Anzahl der Fehler: 2.Hint B. Targeted hint.');
            const checkboxes = [...fixture.nativeElement.querySelectorAll('input[type="checkbox"]')] as HTMLInputElement[];
            expect(checkboxes.map(input => input.checked)).toEqual(savedCorrect ? [true, true, false] : [true, false, true]);
        });

        it('rechecks saved success against the current key and clears feedback when edited', () => {
            tracking.getQuestionResult.mockReturnValue({ isCorrect: true, selectedAnswers: ['a'] });
            fixture.detectChanges();
            expect(fixture.componentInstance.isCorrect).toBe(false);
            expect(visibleMessage()).toBe('Anzahl der Fehler: 1.Hint B.');
            fixture.componentInstance.toggleSelection('b');
            expect(fixture.componentInstance.showResult).toBe(false);
            fixture.componentInstance.evaluateAnswer();
            expect(visibleMessage()).toBe('Anzahl der Fehler: 0.Physical explanation.');
        });

        it('keeps completed feedback and selection stable on revisit', () => {
            tracking.getQuestionResult.mockReturnValue({ isCorrect: true, selectedAnswers: ['a', 'b'] });
            fixture.detectChanges(); fixture.componentInstance.toggleSelection('wrong');
            expect(fixture.componentInstance.selectedValues).toEqual(new Set(['a', 'b']));
            expect(visibleMessage()).toBe('Anzahl der Fehler: 0.Physical explanation.');
        });
    });
}
