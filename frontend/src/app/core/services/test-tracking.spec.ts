import { TestBed } from '@angular/core/testing';

import { TestTracking } from './test-tracking';

describe('TestTracking', () => {
  let service: TestTracking;

  const backendRow = (questionId: string) => ({
    question_id: questionId, test_id: 't', is_correct: 1, user_answer: 'a', correct_answer: 'a',
    points_awarded: 10, max_points: 10, answered_at: '2026-11-01 10:00:00', session_id: 's'
  });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestTracking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isTestFinished', () => {
    it('is false for a test that was never started', () => {
      expect(service.isTestFinished('t')).toBe(false);
    });

    it('is true only once every question is submitted', () => {
      service.startTest('t', 2, 20);
      service.trackQuestionResult('q1', true, 'a', 'a', 10, 10);
      expect(service.isTestFinished('t')).toBe(false);
      service.trackQuestionResult('q2', true, 'a', 'a', 10, 10);
      expect(service.isTestFinished('t')).toBe(true);
    });

    it('stays false after leaving a test half-way, although endTest writes a score', () => {
      service.startTest('t', 2, 20);
      service.trackQuestionResult('q1', true, 'a', 'a', 10, 10);
      service.endTest();
      expect(service.getTestResults('t')?.percentageScore).toBe(50);
      expect(service.isTestFinished('t')).toBe(false);
    });
  });

  describe('restoring from the backend', () => {
    it('does not make a half-done test look finished once the page has started it', () => {
      service.restoreFromBackend([backendRow('q1')]);
      service.startTest('t', 2, 20);
      expect(service.isTestFinished('t')).toBe(false);
      expect(service.getTestResults('t')?.maxPoints).toBe(20);
    });

    it('keeps the totals if the page started the test before the restore arrived', () => {
      service.startTest('t', 2, 20);
      service.restoreFromBackend([backendRow('q1')]);
      expect(service.isTestFinished('t')).toBe(false);
      expect(service.getTestResults('t')?.percentageScore).toBe(50);
    });

    it('keeps a completely answered test finished', () => {
      service.restoreFromBackend([backendRow('q1'), backendRow('q2')]);
      service.startTest('t', 2, 20);
      expect(service.isTestFinished('t')).toBe(true);
    });
  });
});
