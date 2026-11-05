import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { STORAGE_PREFIX } from './storage-prefix';
import { Session } from './session';
import { Analytics } from './analytics';
import { ResultsTracking } from './results-tracking';
import { TestTracking } from './test-tracking';
import { VisitedPages } from './visited-pages';

describe('Storage prefix', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_PREFIX + 'framework_session_id', 'student-a');
    TestBed.configureTestingModule({});
  });

  it('keeps all of this module\'s state under its own prefix', () => {
    const results = TestBed.inject(ResultsTracking);
    results.startModule('mod');
    results.trackQuestionResult('q', true, ['a'], ['a']);
    const tests = TestBed.inject(TestTracking);
    tests.startTest('t', 1, 10);
    tests.trackQuestionResult('t1', true, 'a', 'a', 10, 10);
    TestBed.inject(Analytics);
    TestBed.inject(VisitedPages).add(['/learning/x?page=2']);
    window.dispatchEvent(new Event('pagehide'));

    const keys = Object.keys(localStorage);
    expect(keys.length).toBeGreaterThanOrEqual(5);
    expect(keys.filter(k => !k.startsWith(STORAGE_PREFIX))).toEqual([]);
  });

  it('ignores the state of another module on the same origin', () => {
    localStorage.clear();
    localStorage.setItem('other:framework_session_id', 'student-a');
    localStorage.setItem('other:module-results_student-a', JSON.stringify([['other-mod', { moduleId: 'other-mod', results: [] }]]));
    localStorage.setItem('framework_session_id', 'student-a');                      // the old, shared key
    localStorage.setItem('module-results_student-a', JSON.stringify([['old-mod', { moduleId: 'old-mod', results: [] }]]));
    TestBed.inject(Router);
    expect(TestBed.inject(Session).isRogueUser()).toBe(true);
    expect(TestBed.inject(ResultsTracking).getAllResults()).toEqual([]);
  });
});
