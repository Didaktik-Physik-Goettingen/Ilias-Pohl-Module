import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { GlossaryDialogComponent } from './glossary-dialog.component';
import { GLOSSARY_TERMS } from '../../features/glossary/glossary-terms';

// Module-independent: the expectations come from the module's own registry.
describe('GlossaryDialogComponent', () => {
    let fixture: ComponentFixture<GlossaryDialogComponent>;

    async function openWith(term: string | null) {
        await TestBed.configureTestingModule({
            imports: [GlossaryDialogComponent],
            providers: [
                provideRouter([]),
                { provide: DIALOG_DATA, useValue: { term } },
                { provide: DialogRef, useValue: { close: vi.fn() } },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(GlossaryDialogComponent);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    const el = () => fixture.nativeElement as HTMLElement;
    const cards = () => [...el().querySelectorAll('.glossary-item')] as HTMLButtonElement[];
    const titles = () => cards().map(c => c.querySelector('.term-title')!.textContent);
    const shows = (component: unknown) => !!fixture.debugElement.query(By.directive(component as never));
    const search = (q: string) => {
        const input = el().querySelector('.search-input') as HTMLInputElement;
        input.value = q;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    };

    it('opens on the list of all terms without a term', async () => {
        await openWith(null);
        expect(titles()).toEqual(GLOSSARY_TERMS.map(t => t.title));
        expect(el().querySelector('.overlay-title')?.textContent).toContain('Glossar');
        expect(el().querySelector('.overlay-back')).toBeNull();
    });

    it('opens a card in the overlay and goes back to the list', async () => {
        await openWith(null);
        const second = GLOSSARY_TERMS[1];
        cards()[1].click();
        fixture.detectChanges();
        expect(shows(second.component)).toBe(true);
        expect(cards().length).toBe(0);

        (el().querySelector('.overlay-back') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(cards().length).toBe(GLOSSARY_TERMS.length);
    });

    it('opens a term from a link straight away, with the way to the list', async () => {
        const last = GLOSSARY_TERMS[GLOSSARY_TERMS.length - 1];
        await openWith(last.slug);
        expect(shows(last.component)).toBe(true);
        expect(el().querySelector('.overlay-back')).not.toBeNull();
    });

    it('filters by title and definition, and keeps the search when coming back', async () => {
        await openWith(null);
        const q = GLOSSARY_TERMS[0].title.slice(0, 5).toLowerCase();
        const expected = GLOSSARY_TERMS
            .filter(t => t.title.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
            .map(t => t.title);
        search(q.toUpperCase());
        expect(titles()).toEqual(expected);

        cards()[0].click();
        fixture.detectChanges();
        (el().querySelector('.overlay-back') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(titles()).toEqual(expected);
    });

    it('says so when nothing matches, and for an unknown term', async () => {
        await openWith(null);
        search('xyzxyz');
        expect(el().querySelector('.overlay-missing')?.textContent).toContain('Kein Begriff');
        TestBed.resetTestingModule();
        await openWith('no-such-term');
        expect(el().querySelector('.overlay-missing')?.textContent).toContain('no-such-term');
    });

    it('has a distinct slug for every term', () => {
        const slugs = GLOSSARY_TERMS.map(t => t.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });
});
