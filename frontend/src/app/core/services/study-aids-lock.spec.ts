import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { StudyAidsLock, TEST_ID_BY_ROUTE } from './study-aids-lock';
import { DevModeService } from './dev-mode';
import { TestTracking } from './test-tracking';
import { routes } from '../../app.routes';

@Component({ standalone: true, template: '' })
class Blank {}

describe('StudyAidsLock', () => {
    let finished: Set<string>;
    let devMode: { isEnabled: boolean };
    let lock: StudyAidsLock;

    beforeEach(() => {
        finished = new Set();
        devMode = { isEnabled: false };
        TestBed.configureTestingModule({
            providers: [
                provideRouter([{ path: '**', component: Blank }]),
                { provide: DevModeService, useValue: devMode },
                { provide: TestTracking, useValue: { isTestFinished: (id: string) => finished.has(id) } },
            ],
        });
        lock = TestBed.inject(StudyAidsLock);
    });

    const at = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('locks while a test is unfinished', async () => {
        await at('/test/test-e-damped?path=test');
        expect(lock.isLocked()).toBe(true);
    });

    it('opens again once the test is finished', async () => {
        finished.add('e-damped-oscillations-test');
        await at('/test/test-e-damped?path=test');
        expect(lock.isLocked()).toBe(false);
    });

    it('never locks outside tests or in dev mode', async () => {
        await at('/learning/e2-damped-oscillations?page=1');
        expect(lock.isLocked()).toBe(false);
        devMode.isEnabled = true;
        await at('/test/test-t-driven');
        expect(lock.isLocked()).toBe(false);
    });

    it('knows every test route of the app', () => {
        const testRoutes = routes.map(r => '/' + r.path).filter(p => p.startsWith('/test/'));
        expect(Object.keys(TEST_ID_BY_ROUTE).sort()).toEqual(testRoutes.sort());
    });
});
