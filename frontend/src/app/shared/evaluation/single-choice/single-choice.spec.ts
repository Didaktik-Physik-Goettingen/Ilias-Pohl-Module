import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoice } from './single-choice';
import { ResultsTracking } from '../../../core/services/results-tracking';
import { ShuffleOrder } from '../../../core/services/shuffle-order';
import { afterEach, expect, it, vi } from 'vitest';

describe('SingleChoice', () => {
  let component: SingleChoice;
  let fixture: ComponentFixture<SingleChoice>;
  const tracking = { getQuestionResult: vi.fn(), trackQuestionResult: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleChoice],
      providers: [
        { provide: ResultsTracking, useValue: tracking },
        { provide: ShuffleOrder, useValue: { getOrCreate: () => [0, 1] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleChoice);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('questionId', 'phase-test');
    fixture.componentRef.setInput('containerId', 'phase-test-container');
    fixture.componentRef.setInput('options', [{ value: 'current', label: 'Current' }, { value: 'old', label: 'Old' }]);
    fixture.componentRef.setInput('correctAnswer', 'current');
    fixture.componentRef.setInput('successMessage', 'Physical explanation.');
    fixture.componentRef.setInput('incorrectMessage', 'Check the phase diagram.');
    fixture.componentRef.setInput('answerFeedback', { old: 'The old key no longer matches the physical relation.' });
    vi.useFakeTimers();
    tracking.getQuestionResult.mockReset();
  });

  afterEach(() => { fixture.destroy(); vi.clearAllTimers(); vi.useRealTimers(); });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('re-evaluates saved success against the revised answer key', () => {
    tracking.getQuestionResult.mockReturnValue({ isCorrect: true, selectedAnswers: ['old'] });
    fixture.detectChanges();
    expect(component.isCorrect).toBe(false);
    expect(component.resultMessage.toString()).toContain('The old key no longer matches the physical relation.');
  });

  it('uses feedback for the selected wrong option and clears it when selection changes', () => {
    tracking.getQuestionResult.mockReturnValue(undefined);
    fixture.detectChanges();
    const oldRadio = fixture.nativeElement.querySelector('input[value="old"]') as HTMLInputElement;
    oldRadio.click();
    fixture.nativeElement.querySelector('.evaluation-submit-btn').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.evaluation-result').textContent.trim())
      .toBe('The old key no longer matches the physical relation.');

    const currentRadio = fixture.nativeElement.querySelector('input[value="current"]') as HTMLInputElement;
    currentRadio.click();
    fixture.detectChanges();
    expect(component.showResult).toBe(false);
    expect(component.resultMessage).toBe('');
    expect(fixture.nativeElement.querySelector('.evaluation-result').textContent.trim()).toBe('');
  });

  it('restores current success and the selected radio', () => {
    tracking.getQuestionResult.mockReturnValue({ isCorrect: true, selectedAnswers: ['current'] });
    fixture.detectChanges(); vi.advanceTimersByTime(100); fixture.detectChanges();
    expect(component.isCorrect).toBe(true);
    expect(fixture.nativeElement.querySelector('input[value="current"]').checked).toBe(true);
    expect(component.resultMessage.toString()).toContain('Physical explanation.');
  });
});
