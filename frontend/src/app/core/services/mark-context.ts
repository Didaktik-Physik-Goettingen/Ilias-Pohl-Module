import { Mark } from './marks';
import { PAGE_LOOKUP, PageDefinition, ReportBlock } from './learning-report-registry';
import { buildTextModel, locate, wrapSpan } from './mark-anchor';



// The marks in the page texts the report registry holds (the content strings, formulas still as TeX): for the
// Lernpfad export, which highlights them in place, and for „Im Text ansehen“ on the Offene Stellen. Plain DOM.

export function pageDefinition(route: string, page: string | null): PageDefinition | undefined {
    return PAGE_LOOKUP.get(`${route}:${page ?? '1'}`);
}


// the markable HTML of a block: its text, a spoiler's body, an image's caption; questions can't be marked
export function blockHtml(block: ReportBlock): string | null {
    switch (block.type) {
        case 'text':
        case 'spoiler':
            return block.html;
        case 'image':
            return block.caption ?? null;
        case 'question':
            return null;
    }
}


export interface MarkedBlocks {
    html: Map<number, string>;  // block index → its HTML with the marks wrapped (only blocks that got one)
    missing: Mark[];            // not found: the text was changed since, or it is not in the registry
}


// Wraps each mark's passage in <mark class="…"> elements (one per text node it touches).
export function markBlocks(def: PageDefinition, marks: Mark[], className: (mark: Mark) => string): MarkedBlocks {
    const doc = document.implementation.createHTMLDocument('');
    const holders = new Map<number, HTMLElement>();
    def.blocks.forEach((block, i) => {
        const html = blockHtml(block);
        if (html === null) return;
        const holder = doc.createElement('div');
        holder.innerHTML = html;
        doc.body.append(holder);
        holders.set(i, holder);
    });
    const missing: Mark[] = [];
    for (const mark of marks) {
        // a fresh model each time: wrapping splits the text nodes
        const model = buildTextModel(doc.body, new Map());
        const span = locate(model, mark.anchor);
        if (!span) {
            missing.push(mark);
            continue;
        }
        wrapSpan(model, span, d => {
            const el = d.createElement('mark');
            el.className = className(mark);
            el.setAttribute('data-mark-id', mark.id);
            return el;
        });
    }
    const html = new Map<number, string>();
    for (const [i, holder] of holders) if (holder.querySelector('mark')) html.set(i, holder.innerHTML);
    return { html, missing };
}
