import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Mark } from '../../core/services/marks';
import { MarkContextDialogComponent } from './mark-context-dialog.component';

@Injectable({ providedIn: 'root' })
export class MarkContextOverlay {
    constructor(private dialog: Dialog) {}

    open(mark: Mark, label: string): void {
        this.dialog.open(MarkContextDialogComponent, {
            data: { mark, label },
            ariaLabel: 'Textstelle: ' + label,
            hasBackdrop: true,
            backdropClass: 'glossary-overlay-backdrop',
            panelClass: 'glossary-overlay-panel',
            closeOnNavigation: true,
            autoFocus: false,
            width: '90vw',
            maxWidth: '760px',
        });
    }
}
