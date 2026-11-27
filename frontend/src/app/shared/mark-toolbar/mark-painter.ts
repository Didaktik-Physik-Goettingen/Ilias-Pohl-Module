import { Mark } from '../../core/services/marks';
import { Span, TextModel, buildTextModel, fitFormulaBands, formulasInSpan, locate, rangeForSpan } from '../../core/services/mark-anchor';



export interface PaintedMark {
    mark: Mark;
    span: Span;
    range: Range;
    formulas: Element[];
}

// The highlight of each kind (styles.css, ::highlight() and the formula classes); an unclear mark set to „Geklärt“
// keeps a fainter orange.
export const MARK_HIGHLIGHTS = ['mark-important', 'mark-unclear', 'mark-resolved'] as const;

export function highlightOf(mark: Mark): typeof MARK_HIGHLIGHTS[number] {
    return mark.kind === 'important' ? 'mark-important' : mark.resolvedAt !== null ? 'mark-resolved' : 'mark-unclear';
}



// Shows the marks of the current page with the CSS Custom Highlight API: no change to the page's DOM (Angular's
// [innerHTML], MathJax), only the formulas get a class, as MathJax draws its glyphs as CSS content, which
// ::highlight() doesn't paint. Repainted whenever the page re-renders (MarkToolbar); a mark whose text is no longer
// on the page is just not shown.
export class MarkPainter {
    painted: PaintedMark[] = [];
    model: TextModel | null = null;

    constructor(private doc: Document) {}


    paint(root: Element, marks: Mark[]): void {
        this.clear();
        if (!marks.length) return;
        const model = buildTextModel(root);
        this.model = model;
        const ranges = new Map<string, Range[]>(MARK_HIGHLIGHTS.map(name => [name, []]));
        const formulas: Element[] = [];
        for (const mark of marks) {
            const span = locate(model, mark.anchor);
            if (!span) continue;
            const painted: PaintedMark = { mark, span, range: rangeForSpan(model, span), formulas: formulasInSpan(model, span) };
            this.painted.push(painted);
            const name = highlightOf(mark);
            ranges.get(name)!.push(painted.range);
            for (const f of painted.formulas) f.classList.add(name);
            formulas.push(...painted.formulas);
        }
        for (const [name, list] of ranges) if (list.length) CSS.highlights.set(name, new Highlight(...list));
        fitFormulaBands(formulas);
    }


    clear(): void {
        this.painted = [];
        this.model = null;
        for (const name of MARK_HIGHLIGHTS) {
            CSS.highlights.delete(name);
            this.doc.querySelectorAll('mjx-container.' + name).forEach(el => el.classList.remove(name));
        }
    }


    // the mark under a click, if any: by the boxes of its passage (formulas included)
    at(x: number, y: number): PaintedMark | null {
        return this.painted.find(p => Array.from(p.range.getClientRects()).some(r =>
            r.width > 0 && x >= r.left - 1 && x <= r.right + 1 && y >= r.top - 1 && y <= r.bottom + 1)) ?? null;
    }
}
