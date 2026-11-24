import { TestBed, ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EffortRatingDialog } from './effort-rating-dialog';
import { EffortRating } from '../../core/services/effort-rating';
import { EFFORT_UNITS } from '../../core/services/effort-units';
import { STORAGE_PREFIX } from '../../core/services/storage-prefix';

describe('EffortRatingDialog', () => {
    const UNIT = Object.keys(EFFORT_UNITS)[0];
    let fixture: ComponentFixture<EffortRatingDialog>;
    let effort: EffortRating;
    let next: ReturnType<typeof vi.fn<() => void>>;
    const el = () => fixture.nativeElement as HTMLElement;

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(STORAGE_PREFIX + 'framework_session_id', 'student-a');
        fixture = TestBed.createComponent(EffortRatingDialog);
        effort = TestBed.inject(EffortRating);
        next = vi.fn<() => void>();
        fixture.detectChanges();
    });

    afterEach(() => localStorage.clear());

    const open = () => {
        effort.rateThen(UNIT, next);
        fixture.detectChanges();
    };

    it('shows nothing until a unit is to be rated', () => {
        expect(el().querySelector('[role=dialog]')).toBeNull();
        open();
        expect(el().querySelector('[role=dialog]')).not.toBeNull();
        expect(el().textContent).toContain(EFFORT_UNITS[UNIT]);
    });

    it('offers nine labelled options with none chosen, and "Weiter" waits for a choice', () => {
        open();
        const radios = el().querySelectorAll<HTMLInputElement>('input[type=radio]');
        expect(radios.length).toBe(9);
        expect(Array.from(radios).some(r => r.checked)).toBe(false);
        expect(el().querySelectorAll('.effort-label')[0].textContent).toContain('sehr, sehr geringe');
        expect(el().querySelectorAll('.effort-label')[8].textContent).toContain('sehr, sehr hohe');

        const confirm = el().querySelector<HTMLButtonElement>('.effort-confirm')!;
        expect(confirm.disabled).toBe(true);

        radios[5].click();
        fixture.detectChanges();
        expect(confirm.disabled).toBe(false);
        confirm.click();
        expect(effort.getUnsent()[0].rating).toBe(6);
        expect(next).toHaveBeenCalledOnce();
    });

    it('can be skipped with "Keine Angabe"', () => {
        open();
        el().querySelector<HTMLButtonElement>('.effort-skip')!.click();
        expect(effort.getUnsent()[0].rating).toBeNull();
        expect(next).toHaveBeenCalledOnce();
    });

    it('does not close on a click beside it or on Esc', () => {
        open();
        el().querySelector<HTMLElement>('.effort-overlay')!.click();
        el().querySelector<HTMLElement>('[role=dialog]')!
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();
        expect(el().querySelector('[role=dialog]')).not.toBeNull();
        expect(next).not.toHaveBeenCalled();
    });

    it('starts without a choice when it opens again for the next unit', () => {
        open();
        el().querySelectorAll<HTMLInputElement>('input[type=radio]')[2].click();
        fixture.detectChanges();
        el().querySelector<HTMLButtonElement>('.effort-confirm')!.click();
        fixture.detectChanges();

        effort.rateThen(Object.keys(EFFORT_UNITS)[1], next);
        fixture.detectChanges();
        expect(Array.from(el().querySelectorAll<HTMLInputElement>('input[type=radio]')).some(r => r.checked)).toBe(false);
        expect(el().querySelector<HTMLButtonElement>('.effort-confirm')!.disabled).toBe(true);
    });
});
