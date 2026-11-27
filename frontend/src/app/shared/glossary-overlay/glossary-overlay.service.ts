import { Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { GlossaryDialogComponent } from './glossary-dialog.component';

@Injectable({ providedIn: 'root' })
export class GlossaryOverlay {
    private ref: DialogRef<unknown, GlossaryDialogComponent> | null = null;

    constructor(private dialog: Dialog) {}

    // a term from a link in the text; without one, the list of all terms
    open(term?: string): void {
        this.ref?.close();
        const ref = this.dialog.open(GlossaryDialogComponent, {
            data: { term: term ?? null },
            ariaLabel: 'Glossar',
            hasBackdrop: true,
            backdropClass: 'glossary-overlay-backdrop',
            panelClass: 'glossary-overlay-panel',
            closeOnNavigation: true,
            autoFocus: false,
            width: '90vw',
            maxWidth: '720px',
        });
        this.ref = ref;
        ref.closed.subscribe(() => { if (this.ref === ref) this.ref = null; });
    }

    openList(): void {
        this.open();
    }
}
