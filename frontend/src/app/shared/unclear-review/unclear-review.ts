import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { Mark, Marks } from '../../core/services/marks';
import { SummaryService } from '../../core/services/summary.service';
import { MarkQuote, toneOf } from '../marks-overlay/mark-quote';
import { MarkContextOverlay } from '../mark-context/mark-context-overlay.service';



// „Offene Stellen“: the first sub-page of the Abschluss (Pohl: of each Anleitung), before the Lernpfad and the guide.
// The passages the student marked „Unklar“, each to look at again in its text (an overlay, no jump: Carlo,
// 2026-11-27) and to tick off as „Geklärt“. Nothing has to be ticked off to go on. Purple, as part of the Abschluss.
@Component({
    selector: 'app-unclear-review',
    standalone: true,
    imports: [MarkQuote],
    templateUrl: './unclear-review.html',
    styleUrl: './unclear-review.css',
})
export class UnclearReview {
    @Input() heading = 'Abschluss';
    @Input() backLabel = '← Zurück';
    @Output() back = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    readonly toneOf = toneOf;

    private readonly unclear = computed(() => {
        this.marks.changes();
        return this.marks.list().filter(m => m.kind === 'unclear');
    });
    readonly groups = computed(() => this.summary.markGroups(this.unclear()));
    readonly total = computed(() => this.unclear().length);
    readonly resolved = computed(() => this.unclear().filter(m => m.resolvedAt !== null).length);


    constructor(
        private marks: Marks,
        private summary: SummaryService,
        private context: MarkContextOverlay
    ) {}


    show(mark: Mark, label: string): void {
        this.context.open(mark, label);
    }


    toggleResolved(mark: Mark): void {
        this.marks.setResolved(mark.id, mark.resolvedAt === null);
    }
}
