// Marking text (design_notes.md): a selection on a learning page becomes a text quote, with each formula written as
// its TeX source ($…$ or $$…$$), exactly as the content strings have it. The same quote is found again on the page
// (to highlight it), in the content strings (report, „Im Text ansehen“) and shown on its own with MathJax/KaTeX.
// Plain DOM, no Angular, so it can be tested on its own.

declare global {
    interface Window {
        MathJax: any;
    }
}


// Not markable: questions and their feedback, simulations, controls.
export const MARK_EXCLUDE = [
    'app-single-choice', 'app-multiple-choice', 'app-multiple-choice-image', 'app-image-choice', 'app-labeling',
    'app-drag-and-drop', 'app-sim-embed', 'app-sim-panel', 'canvas', 'iframe', 'video', 'svg',
    'button', 'input', 'select', 'textarea', '.button-container', '[data-no-mark]',
].join(', ');

const MATH = 'mjx-container';
export const MAX_QUOTE_LENGTH = 1000;


// One character of the text model: a character of a text node, or part of a formula's TeX.
type Entry = { node: Text; offset: number } | { math: Element } | { gap: true };

export interface TextModel {
    text: string;
    entries: Entry[];
}

export interface Span {
    start: number;
    end: number;
}

export interface QuoteAnchor {
    exact: string;      // the marked text, formulas as TeX
    prefix: string;     // up to 30 characters before it, to tell repeated passages apart
    suffix: string;     // up to 30 characters after it
    pos: number;        // where it starts in the page's text: the order of the marks on a page
}


// The TeX of each typeset formula below root, with its delimiters. Empty without MathJax (formula left out).
export function formulaTex(root: Element): Map<Element, string> {
    const map = new Map<Element, string>();
    const doc = typeof window !== 'undefined' ? window.MathJax?.startup?.document : null;
    if (!doc?.getMathItemsWithin) return map;
    for (const item of doc.getMathItemsWithin(root)) {
        if (item.typesetRoot) map.set(item.typesetRoot, item.display ? `$$${item.math}$$` : `$${item.math}$`);
    }
    return map;
}


// The page's text as a reader sees it: whitespace collapsed, blocks and line breaks as a space, formulas as TeX.
export function buildTextModel(root: Element, tex: Map<Element, string> = formulaTex(root)): TextModel {
    let text = '';
    const entries: Entry[] = [];

    const space = (entry: Entry) => {
        if (text === '' || text.endsWith(' ')) return;
        text += ' ';
        entries.push(entry);
    };

    const walk = (node: Node) => {
        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                const value = (child as Text).nodeValue ?? '';
                for (let i = 0; i < value.length; i++) {
                    if (/\s/.test(value[i])) space({ node: child as Text, offset: i });
                    else { text += value[i]; entries.push({ node: child as Text, offset: i }); }
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;
                if (el.matches(MATH)) {
                    const t = tex.get(el) ?? '';
                    const display = el.getAttribute('display') === 'true';
                    if (display) space({ math: el });
                    for (const ch of t) { text += ch; entries.push({ math: el }); }
                    if (display) space({ math: el });
                } else if (!el.matches(MARK_EXCLUDE)) {
                    const block = el.tagName === 'BR' || isBlock(el);
                    if (block) space({ gap: true });
                    walk(el);
                    if (block) space({ gap: true });
                }
            }
        }
    };
    walk(root);
    return { text, entries };
}


function isBlock(el: Element): boolean {
    if (/^(P|DIV|LI|UL|OL|H[1-6]|TABLE|TR|TD|TH|SECTION|FIGURE|FIGCAPTION|BLOCKQUOTE)$/.test(el.tagName)) return true;
    // a parsed content string has no window (and no styles)
    const view = el.ownerDocument?.defaultView;
    const display = view ? view.getComputedStyle(el).display : '';
    return display === 'block' || display === 'flex' || display === 'grid' || display === 'list-item';
}


// The selected part of the model, widened to whole formulas and trimmed; null if nothing markable is selected.
export function spanForRange(model: TextModel, range: Range): Span | null {
    let start = -1;
    let end = -1;
    model.entries.forEach((entry, i) => {
        let inside = false;
        if ('math' in entry) inside = range.intersectsNode(entry.math);
        else if ('node' in entry) {
            inside = range.comparePoint(entry.node, entry.offset) !== -1
                && range.comparePoint(entry.node, entry.offset + 1) !== 1;
        }
        if (inside) {
            if (start < 0) start = i;
            end = i + 1;
        }
    });
    if (start < 0) return null;
    // a formula or a word touched at the edge counts whole (touch selections are coarse)
    while (start > 0 && (sameMath(model, start - 1, start) || sameWord(model, start - 1, start))) start--;
    while (end < model.entries.length && (sameMath(model, end, end - 1) || sameWord(model, end, end - 1))) end++;
    while (start < end && model.text[start] === ' ') start++;
    while (end > start && model.text[end - 1] === ' ') end--;
    return end > start ? { start, end } : null;
}


// two neighbouring letters (or digits) of the text, not of a formula's TeX
function sameWord(model: TextModel, a: number, b: number): boolean {
    const ea = model.entries[a], eb = model.entries[b];
    const letter = /[\p{L}\p{N}]/u;
    return !!ea && !!eb && 'node' in ea && 'node' in eb && letter.test(model.text[a]) && letter.test(model.text[b]);
}


function sameMath(model: TextModel, a: number, b: number): boolean {
    const ea = model.entries[a], eb = model.entries[b];
    return !!ea && !!eb && 'math' in ea && 'math' in eb && ea.math === eb.math;
}


export function anchorFor(model: TextModel, span: Span): QuoteAnchor {
    return {
        exact: model.text.slice(span.start, span.end),
        prefix: model.text.slice(Math.max(0, span.start - 30), span.start),
        suffix: model.text.slice(span.end, span.end + 30),
        pos: span.start,
    };
}


// The DOM range of a span, from the first to the last character (formulas whole).
export function rangeForSpan(model: TextModel, span: Span): Range {
    const first = model.entries[span.start];
    const range = (('node' in first ? first.node : 'math' in first ? first.math : null)?.ownerDocument ?? document).createRange();
    const last = model.entries[span.end - 1];
    if ('math' in first) range.setStartBefore(first.math);
    else if ('node' in first) range.setStart(first.node, first.offset);
    if ('math' in last) range.setEndAfter(last.math);
    else if ('node' in last) range.setEnd(last.node, last.offset + 1);
    return range;
}


// Where a stored quote is in a text model, or null. Whitespace doesn't count (a formula's TeX keeps its own spacing
// on the page, a parsed content string collapses it). Of several places, the one whose surroundings fit the stored
// prefix and suffix best wins, then the one nearest the stored position.
export function locate(model: TextModel, anchor: QuoteAnchor): Span | null {
    const index: number[] = [];
    let compact = '';
    for (let i = 0; i < model.text.length; i++) {
        if (/\s/.test(model.text[i])) continue;
        compact += model.text[i];
        index.push(i);
    }
    const squeeze = (s: string) => s.replace(/\s+/g, '');
    const exact = squeeze(anchor.exact);
    if (!exact) return null;
    const prefix = squeeze(anchor.prefix);
    const suffix = squeeze(anchor.suffix);
    let best: { at: number; score: number; distance: number } | null = null;
    for (let at = compact.indexOf(exact); at >= 0; at = compact.indexOf(exact, at + 1)) {
        let score = 0;
        while (score < prefix.length && compact[at - 1 - score] === prefix[prefix.length - 1 - score]) score++;
        let after = 0;
        while (after < suffix.length && compact[at + exact.length + after] === suffix[after]) after++;
        score += after;
        const distance = Math.abs(index[at] - anchor.pos);
        if (!best || score > best.score || (score === best.score && distance < best.distance)) best = { at, score, distance };
    }
    if (!best) return null;
    return { start: index[best.at], end: index[best.at + exact.length - 1] + 1 };
}


export function overlaps(a: Span, b: Span): boolean {
    return a.start < b.end && b.start < a.end;
}


// Wraps the text of a span in elements (one per text node it touches), e.g. <mark> in a parsed content string.
// The formulas are still TeX there, so a span (whole formulas) never splits one.
export function wrapSpan(model: TextModel, span: Span, make: (doc: Document) => HTMLElement): HTMLElement[] {
    const parts = new Map<Text, { from: number; to: number }>();
    for (let i = span.start; i < span.end; i++) {
        const entry = model.entries[i];
        if (!('node' in entry)) continue;
        const part = parts.get(entry.node);
        if (part) part.to = entry.offset + 1;
        else parts.set(entry.node, { from: entry.offset, to: entry.offset + 1 });
    }
    const wrappers: HTMLElement[] = [];
    for (const [node, { from, to }] of parts) {
        const middle = from > 0 ? node.splitText(from) : node;
        if (to - from < (middle.nodeValue ?? '').length) middle.splitText(to - from);
        const wrapper = make(node.ownerDocument);
        middle.replaceWith(wrapper);
        wrapper.append(middle);
        wrappers.push(wrapper);
    }
    return wrappers;
}


export function formulasInSpan(model: TextModel, span: Span): Element[] {
    const found = new Set<Element>();
    for (let i = span.start; i < span.end; i++) {
        const entry = model.entries[i];
        if ('math' in entry) found.add(entry.math);
    }
    return [...found];
}


// MathJax draws its glyphs as CSS content, which ::highlight() doesn't paint; a formula gets the background
// itself (class + CSS variables). Inline formulas get the height of the text band of their line, measured on a
// neighbouring character, so text and formula read as one band.
export function fitFormulaBands(containers: Element[]): void {
    for (const container of containers) {
        const math = container.querySelector('mjx-math') as HTMLElement | null;
        if (!math) continue;
        math.style.removeProperty('--mark-band-top');
        math.style.removeProperty('--mark-band-height');
        if (container.getAttribute('display') === 'true') continue;
        const mathRect = math.getBoundingClientRect();
        const line = neighbourRects(container)
            .find(r => r.height > 0 && r.bottom > mathRect.top && r.top < mathRect.bottom);
        if (!line) continue;
        math.style.setProperty('--mark-band-top', `${line.top - mathRect.top}px`);
        math.style.setProperty('--mark-band-height', `${line.height}px`);
    }
}


function neighbourRects(container: Element): DOMRect[] {
    const rects: DOMRect[] = [];
    const prev = container.previousSibling;
    const next = container.nextSibling;
    if (prev?.nodeType === Node.TEXT_NODE) {
        const i = (prev.nodeValue ?? '').search(/\S\s*$/);
        if (i >= 0) rects.push(charRect(prev as Text, i));
    }
    if (next?.nodeType === Node.TEXT_NODE) {
        const i = (next.nodeValue ?? '').search(/\S/);
        if (i >= 0) rects.push(charRect(next as Text, i));
    }
    return rects;
}


function charRect(node: Text, offset: number): DOMRect {
    const range = document.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    return range.getBoundingClientRect();
}
