import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { VisitedPages } from './visited-pages';

describe('VisitedPages', () => {
    afterEach(() => localStorage.clear());

    it('keys sub-pages by path and page, page 1 also without the parameter', () => {
        expect(VisitedPages.keyOf('/learning/e2-damped-oscillations?page=2')).toBe('/learning/e2-damped-oscillations|2');
        expect(VisitedPages.keyOf('/learning/e2-damped-oscillations')).toBe('/learning/e2-damped-oscillations|1');
        expect(VisitedPages.keyOf('/?session_id=abc')).toBe('/|1');
    });

    it('remembers visited pages, also from the saved progress, for the next app start', () => {
        TestBed.inject(VisitedPages).add(['/learning/e1-intro-experiment?page=3', '/target/tar-experiment']);
        expect(TestBed.inject(VisitedPages).has('/learning/e1-intro-experiment', '3')).toBe(true);
        expect(TestBed.inject(VisitedPages).has('/learning/e1-intro-experiment', '2')).toBe(false);

        TestBed.resetTestingModule();                       // a new app instance, same browser and user
        expect(TestBed.inject(VisitedPages).has('/target/tar-experiment')).toBe(true);
    });
});
