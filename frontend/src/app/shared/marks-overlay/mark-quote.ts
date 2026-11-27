import { Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Mark } from '../../core/services/marks';



// how a mark is coloured when shown on its own (.mark-hl--* in styles.css)
export type MarkTone = 'important' | 'unclear' | 'resolved';

export function toneOf(mark: Mark): MarkTone {
    return mark.kind === 'important' ? 'important' : mark.resolvedAt !== null ? 'resolved' : 'unclear';
}



// A marked passage: text with its formulas ($…$, $$…$$) typeset again, in the mark's colour like a marker stroke.
@Component({
    selector: 'app-mark-quote',
    standalone: true,
    template: '',
    styles: [':host { display: block; }'],
})
export class MarkQuote implements OnChanges {
    @Input({ required: true }) text = '';
    @Input() tone: MarkTone | null = null;

    private rendered: string | null = null;


    constructor(
        private host: ElementRef<HTMLElement>,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}


    ngOnChanges(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const key = `${this.tone}|${this.text}`;
        if (this.rendered === key) return;
        this.rendered = key;
        const el = this.host.nativeElement;
        const body = document.createElement('span');
        if (this.tone) body.className = `mark-hl mark-hl--${this.tone}`;
        body.textContent = this.text;
        el.replaceChildren(body);
        typesetTex(body);
    }
}


// Typesets the $…$ / $$…$$ in the text below root. Each formula is converted here (MathJax.tex2chtmlPromise) rather
// than left for a typeset pass over the element: pages typeset the whole document at times (the Abschluss page
// does), and two passes over the same text typeset it twice. Until MathJax is ready, the TeX shows as text in an
// element MathJax's own passes skip (mathjax_ignore).
export function typesetTex(root: Element): Promise<void> {
    const formulas: { slot: HTMLElement; tex: string; display: boolean }[] = [];
    const doc = root.ownerDocument;
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!(n.parentElement?.closest('mjx-container, .mathjax_ignore'))) nodes.push(n as Text);
    }
    for (const node of nodes) {
        const parts = splitTex(node.nodeValue ?? '');
        if (parts.length < 2) continue;
        const pieces: Node[] = [];
        parts.forEach((part, i) => {
            if (i % 2 === 0) {
                if (part) pieces.push(doc.createTextNode(part));
                return;
            }
            const display = part.startsWith('$$');
            const slot = doc.createElement('span');
            slot.className = 'mathjax_ignore tex2jax_ignore';
            slot.textContent = part;
            pieces.push(slot);
            formulas.push({ slot, tex: part.slice(display ? 2 : 1, display ? -2 : -1), display });
        });
        node.replaceWith(...pieces);
    }
    return formulas.length ? convert(formulas) : Promise.resolve();
}


async function convert(formulas: { slot: HTMLElement; tex: string; display: boolean }[]): Promise<void> {
    const mathJax = window.MathJax;
    try {
        await mathJax?.startup?.promise;
        if (!mathJax?.tex2chtmlPromise) return;
        for (const f of formulas) {
            const node = await mathJax.tex2chtmlPromise(f.tex, { display: f.display });
            f.slot.replaceWith(node);
        }
        // add the CSS for any characters new to the page. Not document.clear()/updateDocument(): that would drop
        // MathJax's list of the page's formulas, which marking reads the TeX from (mark-anchor.ts).
        mathJax.chtmlStylesheet?.();
    } catch {
        /* the TeX stays readable as text */
    }
}


// text, formula, text, formula, …: the odd entries are the formulas with their delimiters
export function splitTex(text: string): string[] {
    return text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
}
