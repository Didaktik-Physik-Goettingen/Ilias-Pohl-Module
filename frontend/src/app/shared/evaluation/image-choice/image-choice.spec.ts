import { ImageChoice } from './image-choice';
import { selectionFeedbackTests } from '../selection-feedback.testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';

selectionFeedbackTests(ImageChoice);

describe('ImageChoice checkbox keyboard selection', () => {
    let fixture: ComponentFixture<ImageChoice>;
    let component: ImageChoice;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageChoice],
            providers: [
                { provide: ResultsTracking, useValue: { getQuestionResult: vi.fn(), trackQuestionResult: vi.fn() } },
                { provide: ShuffleOrder, useValue: { getOrCreate: () => [0, 1, 2] } }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ImageChoice);
        for (const [name, value] of Object.entries({
            questionId: 'keyboard-test', containerId: 'keyboard-test', question: 'Bildauswahl',
            options: ['a', 'b', 'wrong'].map(value => ({ value, imageSrc: `${value}.png` })),
            correctAnswers: ['a', 'b'], successMessage: 'Erklärung.',
            answerFeedback: { a: 'Hinweis A.', b: 'Hinweis B.', wrong: 'Hinweis C.' }
        })) fixture.componentRef.setInput(name, value);
        component = fixture.componentInstance;
        vi.useFakeTimers();
        fixture.detectChanges();
    });
    afterEach(() => { fixture.destroy(); vi.clearAllTimers(); vi.useRealTimers(); });
    const inputs = () => [...fixture.nativeElement.querySelectorAll('input[type="checkbox"]')] as HTMLInputElement[];
    function refresh() { fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); }
    function space(index: number) {
        inputs()[index].focus();
        const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true });
        inputs()[index].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        inputs()[index].dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));
        refresh();
    }
    function expectConsistent() {
        for (const [index, value] of ['a', 'b', 'wrong'].entries()) {
            expect(inputs()[index].checked).toBe(component.isSelected(value));
            expect(inputs()[index].disabled).toBe(component.isCorrect);
        }
    }
    it('toggles once with Space before evaluation and keeps native state consistent', () => {
        space(0);
        expect(component.selectedValues).toEqual(new Set(['a']));
        expectConsistent();
        space(0);
        expect(component.selectedValues.size).toBe(0);
        expectConsistent();
    });
    it('clears stale feedback when Space changes an incorrectly evaluated selection', () => {
        space(2); component.evaluateAnswer(); refresh();
        expect(component.showResult).toBe(true);
        expect(component.isCorrect).toBe(false);
        space(2);
        expect(component.selectedValues.size).toBe(0);
        expect(component.showResult).toBe(false);
        expect(component.resultMessage).toBe('');
        expectConsistent();
        space(0); space(1); component.evaluateAnswer(); refresh();
        expect(component.isCorrect).toBe(true);
        expectConsistent();
    });
    it('disables every checkbox and preserves success after Space or pointer interaction', () => {
        space(0); space(1); component.evaluateAnswer(); refresh();
        const message = component.resultMessage;
        expect(inputs().every(input => input.disabled)).toBe(true);
        for (let index = 0; index < 3; index++) {
            // Even a synthetic key event bypassing native disabled dispatch is guarded.
            space(index);
            inputs()[index].click();
            fixture.nativeElement.querySelectorAll('.image-option')[index].click();
        }
        refresh();
        expect(component.selectedValues).toEqual(new Set(['a', 'b']));
        expect(component.showResult).toBe(true);
        expect(component.resultMessage).toBe(message);
        expectConsistent();
    });
    it('shares the guarded handler with checkbox clicks without bubbling a second toggle', () => {
        const toggle = vi.spyOn(component, 'toggleSelection');
        inputs()[0].click(); refresh();
        expect(toggle).toHaveBeenCalledTimes(1);
        expect(component.selectedValues).toEqual(new Set(['a']));
        expectConsistent();
        fixture.nativeElement.querySelectorAll('.image-option')[1].click(); refresh();
        expect(toggle).toHaveBeenCalledTimes(2);
        expect(component.selectedValues).toEqual(new Set(['a', 'b']));
        expectConsistent();
    });
});
