import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EffortRating } from './effort-rating';
import { EFFORT_UNITS } from './effort-units';
import { STORAGE_PREFIX } from './storage-prefix';

@Component({ template: '' })
class Blank {}

describe('EffortRating', () => {
    const UNIT = Object.keys(EFFORT_UNITS)[0];

    const create = (username: string | null = 'student-a') => {
        TestBed.resetTestingModule();
        if (username) localStorage.setItem(STORAGE_PREFIX + 'framework_session_id', username);
        TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', component: Blank }])] });
        return TestBed.inject(EffortRating);
    };

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('asks a logged-in student and goes on only after the answer', () => {
        const effort = create();
        const next = vi.fn();
        effort.rateThen(UNIT, next);
        expect(effort.pending()).toEqual({ unitId: UNIT, title: EFFORT_UNITS[UNIT] });
        expect(next).not.toHaveBeenCalled();

        effort.submit(7);
        expect(effort.pending()).toBeNull();
        expect(next).toHaveBeenCalledOnce();
        expect(effort.getUnsent()).toEqual([expect.objectContaining({ unitId: UNIT, rating: 7 })]);
    });

    it('asks once per unit: going back and on again goes straight on', () => {
        const effort = create();
        effort.rateThen(UNIT, () => {});
        effort.submit(3);
        const next = vi.fn();
        effort.rateThen(UNIT, next);
        expect(effort.pending()).toBeNull();
        expect(next).toHaveBeenCalledOnce();
    });

    it('stores "Keine Angabe" as null, and counts the unit as rated', () => {
        const effort = create();
        effort.rateThen(UNIT, () => {});
        effort.submit(null);
        expect(effort.getUnsent()[0].rating).toBeNull();
        expect(effort.isRated(UNIT)).toBe(true);
    });

    it('never asks guests, in dev mode, or for a unit that is not rated', () => {
        const guest = create(null);                   // a generated rogue_user_ id
        const next = vi.fn();
        guest.rateThen(UNIT, next);
        expect(guest.pending()).toBeNull();

        sessionStorage.setItem('devMode', 'true');
        const dev = create();
        dev.rateThen(UNIT, next);
        expect(dev.pending()).toBeNull();
        sessionStorage.clear();

        const student = create();
        student.rateThen('opt-chaos', next);
        expect(student.pending()).toBeNull();
        expect(next).toHaveBeenCalledTimes(3);       // synchronously each time
    });

    it('records how the unit was taken and the time to answer', async () => {
        const effort = create();
        await TestBed.inject(Router).navigateByUrl('/learning/x?page=3&flow=learning-first&path=learn');
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-11-24T10:00:00Z'));
        effort.rateThen(UNIT, () => {});
        vi.setSystemTime(new Date('2026-11-24T10:00:04Z'));
        effort.submit(5);
        vi.useRealTimers();
        const [row] = effort.getUnsent();
        expect(row.context).toEqual({ flow: 'learning-first', path: 'learn' });
        expect(row.answeredAt - row.shownAt).toBe(4000);
    });

    it('keeps ratings per student across reloads until they are sent', () => {
        create().rateThen(UNIT, () => {});
        TestBed.inject(EffortRating).submit(2);

        const reloaded = create();
        expect(reloaded.isRated(UNIT)).toBe(true);
        expect(reloaded.getUnsent().length).toBe(1);
        reloaded.markSent(reloaded.getUnsent());
        expect(create().getUnsent()).toEqual([]);

        expect(create('student-b').isRated(UNIT)).toBe(false);
    });

    it('takes units rated on another device from the saved progress', () => {
        const effort = create();
        effort.markRated([UNIT]);
        effort.rateThen(UNIT, () => {});
        expect(effort.pending()).toBeNull();
    });
});
