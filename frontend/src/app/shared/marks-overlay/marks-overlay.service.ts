import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { MarksDialogComponent } from './marks-dialog.component';

@Injectable({ providedIn: 'root' })
export class MarksOverlay {
    constructor(private dialog: Dialog) {}

    open(): void {
        if (this.dialog.openDialogs.some(d => d.componentInstance instanceof MarksDialogComponent)) return;
        this.dialog.open(MarksDialogComponent, {
            ariaLabel: 'Meine Markierungen',
            hasBackdrop: true,
            backdropClass: 'glossary-overlay-backdrop',
            panelClass: 'glossary-overlay-panel',
            closeOnNavigation: true,
            autoFocus: false,
            width: '90vw',
            maxWidth: '720px',
        });
    }
}
