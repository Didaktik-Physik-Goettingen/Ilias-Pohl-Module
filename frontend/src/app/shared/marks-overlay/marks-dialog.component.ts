import { Component, Injector, afterNextRender, computed, signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { createGlobalPositionStrategy } from '@angular/cdk/overlay';
import { MARK_KIND_LABEL, Mark, MarkKind, Marks } from '../../core/services/marks';
import { SummaryService } from '../../core/services/summary.service';
import { MarkQuote, toneOf } from './mark-quote';


type Tab = 'all' | MarkKind;



// „Meine Markierungen“: the marked passages by page, each with its kind as a bar on the left and „Entfernen“; an
// unclear one can be set to „Geklärt“ here as well. Three tabs: „Alle“ (first), „Wichtig“, „Unklar“. No link to the
// passage: a jump from here would bypass the nav's rules (Carlo, 2026-11-27).
@Component({
    selector: 'app-marks-dialog',
    standalone: true,
    imports: [MarkQuote],
    templateUrl: './marks-dialog.component.html',
    styleUrl: './marks-dialog.component.css',
})
export class MarksDialogComponent {
    readonly toneOf = toneOf;
    readonly tabs: { id: Tab; label: string }[] = [
        { id: 'all', label: 'Alle' },
        { id: 'important', label: MARK_KIND_LABEL.important },
        { id: 'unclear', label: MARK_KIND_LABEL.unclear },
    ];
    readonly tab = signal<Tab>('all');

    private readonly all = computed(() => {
        this.marks.changes();
        return this.marks.list();
    });
    readonly counts = computed<Record<Tab, number>>(() => ({
        all: this.all().length,
        important: this.all().filter(m => m.kind === 'important').length,
        unclear: this.all().filter(m => m.kind === 'unclear').length,
    }));
    readonly groups = computed(() => {
        const tab = this.tab();
        return this.summary.markGroups(tab === 'all' ? this.all() : this.all().filter(m => m.kind === tab));
    });


    constructor(
        private dialogRef: DialogRef,
        private marks: Marks,
        private summary: SummaryService,
        private injector: Injector
    ) {
        // opened centred with all marks; then held at that top edge, so a shorter tab doesn't move the overlay
        afterNextRender(() => this.pinTop());
    }


    remove(mark: Mark): void {
        this.marks.remove(mark.id);
    }


    toggleResolved(mark: Mark): void {
        this.marks.setResolved(mark.id, mark.resolvedAt === null);
    }


    // arrow keys move between the tabs (WAI-ARIA tabs pattern)
    onTabKey(event: KeyboardEvent): void {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const ids = this.tabs.map(t => t.id);
        const step = event.key === 'ArrowRight' ? 1 : -1;
        const next = ids[(ids.indexOf(this.tab()) + step + ids.length) % ids.length];
        this.tab.set(next);
        (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
    }


    close(): void {
        this.dialogRef.close();
    }


    private pinTop(): void {
        const overlayRef = this.dialogRef.overlayRef;
        const top = overlayRef?.overlayElement?.getBoundingClientRect().top;
        if (top === undefined) return;
        overlayRef.updatePositionStrategy(createGlobalPositionStrategy(this.injector).centerHorizontally().top(`${Math.max(0, Math.round(top))}px`));
    }
}
