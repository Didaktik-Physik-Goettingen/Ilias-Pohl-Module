import { Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { EffortRating, EFFORT_SCALE_LABELS } from '../../core/services/effort-rating';



// The mental-effort pop-up (design_notes.md, section 2): Paas's 9-point scale as nine labelled radio buttons,
// nothing preselected. "Weiter" waits for a choice; "Keine Angabe" skips. A click on the backdrop or Esc does
// not close it, so no rating is lost or skipped by accident. Same in both modules.
@Component({
    selector: 'app-effort-rating-dialog',
    templateUrl: './effort-rating-dialog.html',
    styleUrl: './effort-rating-dialog.css',
})
export class EffortRatingDialog {
    readonly labels = EFFORT_SCALE_LABELS;
    readonly selected = signal<number | null>(null);

    @ViewChild('dialog') dialog?: ElementRef<HTMLElement>;


    constructor(public effort: EffortRating) {
        // a fresh choice each time it opens, and focus into the dialog for keyboard and screen readers
        effect(() => {
            if (this.effort.pending()) {
                this.selected.set(null);
                setTimeout(() => this.dialog?.nativeElement.focus());
            }
        });
    }


    choose(value: number) {
        this.selected.set(value);
    }


    confirm() {
        const value = this.selected();
        if (value === null) return;
        this.effort.submit(value);
    }


    skip() {
        this.effort.submit(null);
    }


    // keep Tab inside the dialog while it is open
    onKeydown(event: KeyboardEvent) {
        if (event.key !== 'Tab' || !this.dialog) return;
        const focusable = Array.from(
            this.dialog.nativeElement.querySelectorAll<HTMLElement>('input:checked, button:not([disabled])')
        );
        const radios = this.dialog.nativeElement.querySelectorAll<HTMLInputElement>('input[type=radio]');
        if (!this.dialog.nativeElement.querySelector('input:checked') && radios.length) focusable.unshift(radios[0]);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === this.dialog.nativeElement)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }
}
