import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DevModeService } from './dev-mode';
import { TestTracking } from './test-tracking';



// The test pages and the id each test tracks itself under (the nav's test rows carry the same ids).
export const TEST_ID_BY_ROUTE: Readonly<Record<string, string>> = {
    '/test/test-e-damped': 'e-damped-oscillations-test',
    '/test/test-e-driven': 'e-driven-oscillations-test',
    '/test/test-t-damped': 't-damped-oscillations-test',
    '/test/test-t-driven': 't-driven-oscillations-test',
};



// While a test is running, the learning pages' answers must stay out of reach: the nav opens no row
// (NavBar.isTestLocked), and glossary and marks ("study aids", shared/side-dock) are greyed out.
// A test can be reopened and has no route guard, so "running" is: on a test page whose test is unfinished.
// The precession module has its own version of this file (no tests: never locked); the side dock is the same in both.
@Injectable({
    providedIn: 'root'
})
export class StudyAidsLock {
    constructor(
        private router: Router,
        private devMode: DevModeService,
        private testTracking: TestTracking
    ) {}

    isLocked(): boolean {
        if (this.devMode.isEnabled) return false;
        const testId = TEST_ID_BY_ROUTE[this.router.url.split('?')[0]];
        return !!testId && !this.testTracking.isTestFinished(testId);
    }
}
