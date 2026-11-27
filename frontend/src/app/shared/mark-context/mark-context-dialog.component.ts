import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Mark } from '../../core/services/marks';
import { MarkedBlocks, markBlocks, pageDefinition } from '../../core/services/mark-context';
import { PageDefinition } from '../../core/services/learning-report-registry';
import { GlossaryOverlay } from '../glossary-overlay/glossary-overlay.service';
import { MarkQuote, toneOf, typesetTex } from '../marks-overlay/mark-quote';



export interface MarkContextData {
    mark: Mark;
    label: string;      // 'Präzession (2/4)'
}


// „Im Text ansehen“: the text of the page a mark is on, with the passage highlighted and scrolled to, in an overlay.
// Not a jump to the page: that would bypass the nav's rules and leave the student somewhere else (Carlo,
// 2026-11-27). The text comes from the report registry, as the Lernpfad export has it: texts, light-bulb boxes,
// captions and images; questions and simulations are left out.
@Component({
    selector: 'app-mark-context-dialog',
    standalone: true,
    imports: [MarkQuote],
    templateUrl: './mark-context-dialog.component.html',
    styleUrl: './mark-context-dialog.component.css',
})
export class MarkContextDialogComponent implements AfterViewInit {
    @ViewChild('text') textRef?: ElementRef<HTMLElement>;

    readonly mark: Mark;
    readonly label: string;
    readonly tone: ReturnType<typeof toneOf>;
    readonly found: boolean;
    private readonly def: PageDefinition | undefined;
    private readonly marked: MarkedBlocks | null;


    constructor(
        @Inject(DIALOG_DATA) data: MarkContextData,
        private dialogRef: DialogRef,
        private glossary: GlossaryOverlay
    ) {
        this.mark = data.mark;
        this.label = data.label;
        this.tone = toneOf(data.mark);
        this.def = pageDefinition(this.mark.route, this.mark.page);
        this.marked = this.def ? markBlocks(this.def, [this.mark], () => `mark-hl mark-hl--${this.tone}`) : null;
        this.found = !!this.marked && this.marked.missing.length === 0;
    }


    ngAfterViewInit(): void {
        const def = this.def;
        const marked = this.marked;
        const host = this.textRef?.nativeElement;
        if (!this.found || !def || !marked || !host) return;     // the quote is shown on its own
        def.blocks.forEach((block, i) => {
            if (block.type === 'question') return;
            if (block.type === 'image') {
                const figure = document.createElement('figure');
                figure.className = 'context-image';
                const img = document.createElement('img');
                img.src = block.src;
                img.alt = block.alt;
                figure.append(img);
                if (block.caption) {
                    const caption = document.createElement('figcaption');
                    caption.innerHTML = marked.html.get(i) ?? block.caption;
                    figure.append(caption);
                }
                host.append(figure);
                return;
            }
            const div = document.createElement('div');
            div.className = block.type === 'spoiler' ? 'context-spoiler'
                : block.style === 'lamp' ? 'learning-lamp' : 'context-text';
            if (block.type === 'spoiler') {
                const label = document.createElement('div');
                label.className = 'context-spoiler-label';
                label.textContent = 'Exkurs: ' + block.label.replace(/^EXKURS:\s*/i, '');
                div.append(label);
            }
            const body = document.createElement('div');
            body.innerHTML = marked.html.get(i) ?? block.html;
            div.append(body);
            host.append(div);
        });
        // to the passage, again once the formulas are typeset and the images loaded (both move it)
        const toMark = () => host.querySelector('mark')?.scrollIntoView({ block: 'center' });
        toMark();
        typesetTex(host).then(toMark);
        host.querySelectorAll('img').forEach(img => img.addEventListener('load', toMark, { once: true }));
    }


    // the content's glossary links work here too (on top of this overlay)
    onTextClick(event: MouseEvent): void {
        const link = (event.target as Element | null)?.closest?.('a[data-glossary]');
        if (!link) return;
        event.preventDefault();
        this.glossary.open(link.getAttribute('data-glossary')!);
    }


    close(): void {
        this.dialogRef.close();
    }
}
