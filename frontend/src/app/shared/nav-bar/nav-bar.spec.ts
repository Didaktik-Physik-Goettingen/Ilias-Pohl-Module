import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { DevModeService } from '../../core/services/dev-mode';
import { TestTracking } from '../../core/services/test-tracking';
import { VisitedPages } from '../../core/services/visited-pages';
import { NavBar } from './nav-bar';

@Component({ template: '' })
class EmptyPage {}

// inside a parent, as in the app: the host bindings of a fixture's root component aren't refreshed
@Component({ imports: [NavBar], template: '<app-nav-bar></app-nav-bar>' })
class Parent {}

describe('NavBar', () => {
    let fixture: ComponentFixture<Parent>;
    let router: Router;
    let devMode: { isEnabled: boolean };
    let visited: Set<string>;
    let finishedTests: Set<string>;

    const rows = (): HTMLButtonElement[] => [...fixture.nativeElement.querySelectorAll('button')];

    const row = (label: string): HTMLButtonElement => {
        const found = rows().find(button => button.textContent!.includes(label));
        if (!found) throw new Error(`no row "${label}"`);
        return found;
    };

    const hasRow = (label: string) => rows().some(button => button.textContent!.includes(label));

    const openAt = async (url: string) => {
        await router.navigateByUrl(url);
        // no router-outlet here: in the app, its new page is what marks the views for a refresh after a navigation
        fixture.componentRef.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    beforeEach(() => {
        localStorage.clear();
        devMode = { isEnabled: false };
        finishedTests = new Set();
        visited = new Set([
            '/|1',
            '/learning/e1-intro-experiment|1',
            '/decision/dec-e-damped|1',
            '/learning/e2-damped-oscillations|1',
            '/learning/e2-damped-oscillations|2',
        ]);
        TestBed.configureTestingModule({
            imports: [NavBar],
            providers: [
                provideRouter([{ path: '**', component: EmptyPage }]),
                { provide: DevModeService, useValue: devMode },
                { provide: VisitedPages, useValue: { has: (path: string, page = '1') => visited.has(`${path}|${page}`) } },
                { provide: TestTracking, useValue: { isTestFinished: (id: string) => finishedTests.has(id) } },
            ]
        });
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(Parent);
    });

    describe('outside dev mode', () => {
        it('never opens a segment, the Startseite or the Anleitung, reached or not', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            for (const label of ['Startseite', 'Einstieg', 'Gedämpfte', 'Getriebene', 'Anleitung']) {
                expect(row(label).disabled).toBe(true);
                expect(row(label).classList).not.toContain('nav-row--open');
            }
        });

        it('marks the path so far without opening it', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(row('Einstieg').classList).toContain('nav-row--reached');
            expect(row('Startseite').classList).toContain('nav-row--reached');
            expect(row('Getriebene').classList).not.toContain('nav-row--reached');
            expect(row('Anleitung').classList).not.toContain('nav-row--reached');
        });

        it('counts a visited decision page as reaching its segment', async () => {
            visited = new Set(['/decision/dec-e-driven|1', '/learning/e1-intro-experiment|1']);
            await openAt('/learning/e1-intro-experiment');
            expect(row('Getriebene').classList).toContain('nav-row--reached');
        });

        it('counts any target page as reaching the Anleitung', async () => {
            visited.add('/target/tar-chaos|1');
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(row('Anleitung').classList).toContain('nav-row--reached');
        });

        it('opens a visited sub-page of the current chapter', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(row('(1/3)').disabled).toBe(false);

            row('(1/3)').click();
            await fixture.whenStable();
            expect(router.url).toBe('/learning/e2-damped-oscillations?page=1&path=learn');
        });

        it('keeps a locked sub-page locked', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(row('(3/3)').disabled).toBe(true);

            row('(3/3)').click();
            await fixture.whenStable();
            expect(router.url).toBe('/learning/e2-damped-oscillations?page=2');
        });

        it('lists only the sub-pages of the current chapter', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(hasRow('(1/4)')).toBe(false);     // sub-pages of the visited chapter before
        });

        it('keeps flow in the URL within a page, and does nothing on the current row', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2&flow=learning-first');
            row('(2/3)').click();
            await fixture.whenStable();
            expect(router.url).toBe('/learning/e2-damped-oscillations?page=2&flow=learning-first');

            row('(1/3)').click();
            await fixture.whenStable();
            expect(router.url).toContain('flow=learning-first');
            expect(router.url).toContain('page=1');
        });

        it('shows no sub-pages on a decision page', async () => {
            await openAt('/decision/dec-e-damped');
            expect(row('Gedämpfte').getAttribute('aria-current')).toBe('step');
            expect(hasRow('(1/3)')).toBe(false);
        });
    });

    describe('tests', () => {
        beforeEach(() => {
            visited.add('/test/test-e-damped|1');
        });

        it('locks every row while the test is unfinished, and keeps the path drawn', async () => {
            await openAt('/test/test-e-damped?path=test&page=2');
            expect(rows().every(button => button.disabled)).toBe(true);
            expect(row('(1/3)').classList).toContain('sub-btn--reached');
            expect(row('Einstieg').classList).toContain('nav-row--reached');
        });

        it('opens the visited rows again once the test is finished', async () => {
            finishedTests.add('e-damped-oscillations-test');
            await openAt('/test/test-e-damped?path=test&page=6');
            expect(row('(1/3)').disabled).toBe(false);
            expect(row('Test').disabled).toBe(false);
        });

        it('keeps a test left unfinished closed from the other rows', async () => {
            await openAt('/learning/e2-damped-oscillations?page=1');
            expect(row('Test').disabled).toBe(true);
            expect(row('(2/3)').disabled).toBe(false);
        });

        it('opens a finished test from the other rows', async () => {
            finishedTests.add('e-damped-oscillations-test');
            await openAt('/learning/e2-damped-oscillations?page=1');
            expect(row('Test').disabled).toBe(false);
        });

        it('hides the test of the chapter until it was visited', async () => {
            visited.delete('/test/test-e-damped|1');
            await openAt('/learning/e2-damped-oscillations?page=1');
            expect(hasRow('Test')).toBe(false);
        });

        it('lists the current test even if the chapter was entered through the learning pages', async () => {
            await openAt('/learning/e2-damped-oscillations?page=1');
            await openAt('/test/test-e-damped?path=test');
            expect(row('Test').getAttribute('aria-current')).toBe('page');
        });
    });

    describe('strands and stations', () => {
        const stations = () =>
            ([...fixture.nativeElement.querySelectorAll('.seg-list > .nav-row')] as HTMLElement[])
                .map(button => button.textContent!.replace(/\s+/g, ' ').trim());

        it('shows the experiment strand as numbered stations, with no number in the labels', async () => {
            await openAt('/learning/e2-damped-oscillations?page=2');
            expect(stations()).toEqual(['1 Einstieg Versuchsaufbau', '2 Gedämpfte Schwingungen', '3 Getriebene Schwingungen']);
        });

        it('makes Aufbau a station of the theory line with an icon, not a number or an optional page', async () => {
            await openAt('/learning/t1-intro-theory');
            await openAt('/learning/opt-setup');
            expect(stations()).toEqual([
                '1 Einstieg Theorie', '2 Freie Schwingungen', '3 Gedämpfte Schwingungen',
                '4 Getriebene Schwingungen', 'Versuchsaufbau',
            ]);
            expect(row('Versuchsaufbau').querySelector('.nav-marker svg')).not.toBeNull();
            expect(fixture.nativeElement.textContent).not.toContain('Optionale Vertiefungen');
            expect(row('Versuchsaufbau').getAttribute('aria-current')).toBe('step');
        });

        it('keeps Aufbau in the optional group on the experiment strand', async () => {
            await openAt('/learning/e1-intro-experiment');
            await openAt('/learning/opt-setup?next=chaos');
            expect(stations()).not.toContain('Versuchsaufbau');
            expect(fixture.nativeElement.textContent).toContain('Optionale Vertiefungen');
            expect(row('(1/1) - Versuchsaufbau').getAttribute('aria-current')).toBe('page');
        });

        it('shows the chosen strand as plain text, not as a button', async () => {
            await openAt('/learning/t1-intro-theory');
            expect(fixture.nativeElement.querySelector('.nav-strand').textContent).toContain('Struktur: Theorie');
            expect(hasRow('Struktur')).toBe(false);
            expect(hasRow('⇄')).toBe(false);
        });

        it('shows an optional page only while it is open', async () => {
            await openAt('/learning/e1-intro-experiment');
            expect(hasRow('Chaos')).toBe(false);

            await openAt('/learning/opt-chaos');
            expect(row('Chaos').getAttribute('aria-current')).toBe('step');
            expect(fixture.nativeElement.querySelectorAll('.seg-list > .nav-row[aria-current]').length).toBe(0);
        });
    });

    it('marks the current segment and sub-page', async () => {
        await openAt('/learning/e2-damped-oscillations?page=2');
        expect(row('Gedämpfte').getAttribute('aria-current')).toBe('step');
        expect(row('Gedämpfte').classList).toContain('nav-row--active');
        expect(row('(2/3)').getAttribute('aria-current')).toBe('page');
        expect(row('(1/3)').getAttribute('aria-current')).toBeNull();
        expect(row('Einstieg').getAttribute('aria-current')).toBeNull();
    });

    it('opens everything in dev mode', async () => {
        devMode.isEnabled = true;
        await openAt('/test/test-e-damped?path=test');
        for (const button of rows()) expect(button.disabled).toBe(false);
        expect(row('Getriebene').classList).toContain('nav-row--open');
        expect(row('Glossar').disabled).toBe(false);
    });

    it('offers the other strand beside the heading in dev mode', async () => {
        devMode.isEnabled = true;
        await openAt('/learning/e1-intro-experiment');
        expect(fixture.nativeElement.querySelector('.nav-strand').textContent).toContain('Struktur: Experiment');
        expect(fixture.nativeElement.querySelector('.nav-strand button')).toBe(row('⇄ Theorie'));
        expect(hasRow('Struktur')).toBe(false);     // no row for it below the line

        row('⇄ Theorie').click();
        await fixture.whenStable();
        expect(router.url).toBe('/learning/t1-intro-theory');
    });

    it('frees the column on the start page', async () => {
        await openAt('/');
        expect(fixture.nativeElement.querySelector('app-nav-bar').classList).toContain('nav-hidden');
    });

    it('keeps the column on the other pages', async () => {
        await openAt('/learning/e1-intro-experiment');
        expect(fixture.nativeElement.querySelector('app-nav-bar').classList).not.toContain('nav-hidden');
    });
});
