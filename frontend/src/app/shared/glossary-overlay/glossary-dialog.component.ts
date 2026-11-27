import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { GLOSSARY_TERMS, GlossaryTerm, glossaryTerm } from '../../features/glossary/glossary-terms';



// The glossary as an overlay, with two views: the list of all terms (with search) and one term.
// Opened with a term from a link in the text, or with the list from the "Glossar" button; no routing either way.
@Component({
    selector: 'app-glossary-dialog',
    standalone: true,
    imports: [NgComponentOutlet],
    templateUrl: './glossary-dialog.component.html',
    styleUrl: './glossary-dialog.component.css',
})
export class GlossaryDialogComponent {
    readonly terms = GLOSSARY_TERMS;
    term: GlossaryTerm | null = null;
    missingSlug: string | null = null;
    search = '';

    @ViewChild('body') private body?: ElementRef<HTMLElement>;


    constructor(
        @Inject(DIALOG_DATA) data: { term: string | null },
        private dialogRef: DialogRef
    ) {
        if (data.term) this.showTerm(data.term);
    }


    get filteredTerms(): readonly GlossaryTerm[] {
        const q = this.search.trim().toLowerCase();
        if (!q) return this.terms;
        return this.terms.filter(t => t.title.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
    }


    showTerm(slug: string): void {
        this.term = glossaryTerm(slug) ?? null;
        this.missingSlug = this.term ? null : slug;
        this.scrollToTop();
    }


    showList(): void {
        this.term = null;
        this.missingSlug = null;
        this.scrollToTop();
    }


    onSearch(event: Event): void {
        this.search = (event.target as HTMLInputElement).value;
    }


    close(): void {
        this.dialogRef.close();
    }


    private scrollToTop(): void {
        if (this.body) this.body.nativeElement.scrollTop = 0;
    }
}
