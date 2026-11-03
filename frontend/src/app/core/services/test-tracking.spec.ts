import { TestBed } from '@angular/core/testing';

import { TestTracking } from './test-tracking';
import { AttemptOutbox, AttemptRow } from './attempt-outbox';

describe('TestTracking', () => {
  let service: TestTracking;

  const backendRow = (questionId: string): AttemptRow => ({
    kind: 'test', unitId: 't', questionId, attemptNo: 1, isCorrect: true, answer: 'a', correctAnswer: 'a',
    pointsAwarded: 10, maxPoints: 10, texts: { questionText: 'Frage?' }, answeredAt: Date.UTC(2026, 10, 1)
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

    it('keeps an answer only known locally', () => {
      service.startTest('t', 2, 20);
      service.trackQuestionResult('q2', false, 'b', 'a', 0, 10);
      service.restoreFromBackend([backendRow('q1')]);
      expect(service.getTestResults('t')?.results.map(r => r.questionId)).toEqual(['q2', 'q1']);
      expect(service.isTestFinished('t')).toBe(true);
    });

    it('restores the texts for the summary', () => {
      service.restoreFromBackend([backendRow('q1')]);
      expect(service.getTestResults('t')?.results[0].questionText).toBe('Frage?');
    });

    it('keeps a completely answered test finished', () => {
      service.restoreFromBackend([backendRow('q1'), backendRow('q2')]);
      service.startTest('t', 2, 20);
      expect(service.isTestFinished('t')).toBe(true);
    });
  });

  describe('per student', () => {
    it('queues each answer for the server, once', () => {
      localStorage.setItem('framework_session_id', 'student-a');
      TestBed.resetTestingModule();
      const tracking = TestBed.inject(TestTracking);
      tracking.startTest('t', 2, 20);
      tracking.trackQuestionResult('q1', true, 'a', 'a', 10, 10);
      tracking.trackQuestionResult('q1', false, 'b', 'a', 0, 10);
      const rows = TestBed.inject(AttemptOutbox).getAll();
      expect(rows.map(r => [r.kind, r.unitId, r.questionId, r.attemptNo, r.pointsAwarded]))
        .toEqual([['test', 't', 'q1', 1, 10]]);
    });

    it('does not inherit the answers of another student on the same browser', () => {
      localStorage.setItem('framework_session_id', 'student-a');
      TestBed.resetTestingModule();
      const a = TestBed.inject(TestTracking);
      a.startTest('t', 1, 10);
      a.trackQuestionResult('q1', true, 'a', 'a', 10, 10);

      localStorage.setItem('framework_session_id', 'student-b');
      TestBed.resetTestingModule();
      expect(TestBed.inject(TestTracking).getAllTests()).toEqual([]);
      expect(TestBed.inject(AttemptOutbox).getAll()).toEqual([]);
    });
  });
});
