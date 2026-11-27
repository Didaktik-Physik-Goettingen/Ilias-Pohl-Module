import { anchorFor, buildTextModel, formulasInSpan, locate, overlaps, rangeForSpan, spanForRange, wrapSpan } from './mark-anchor';

// MathJax isn't loaded in tests: stand-in <mjx-container> elements, with their TeX passed in as MathJax would give it.
describe('mark-anchor', () => {
    let root: HTMLElement;
    let tex: Map<Element, string>;

    beforeEach(() => {
        document.body.innerHTML = `
            <main>
                <h1>Präzession (1/3)</h1>
                <p id="a">Nun hängen Sie im Abstand <mjx-container id="r"><mjx-math>r</mjx-math></mjx-container> ein
                   Zusatzgewicht   an.<br>Seine Kraft
                   <mjx-container id="d" display="true"><mjx-math>D</mjx-math></mjx-container>
                   wirkt.</p>
                <app-single-choice><p>Frage: Wohin zeigt das Drehmoment?</p></app-single-choice>
                <p id="b">Das Drehmoment ändert <mjx-container id="l"><mjx-math>L</mjx-math></mjx-container> seitlich.</p>
            </main>`;
        root = document.querySelector('main')!;
        tex = new Map([
            [document.getElementById('r')!, '$r$'],
            [document.getElementById('d')!, '$$\\vec{D} = \\vec{r}\\times\\vec{F}.$$'],
            [document.getElementById('l')!, '$\\vec{L}$'],
        ]);
    });

    const textNode = (id: string, containing: string): Text => {
        const walker = document.createTreeWalker(document.getElementById(id)!, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) if ((n as Text).nodeValue!.includes(containing)) return n as Text;
        throw new Error(containing);
    };

    it('reads the page as text: whitespace collapsed, formulas as TeX, questions left out', () => {
        const { text } = buildTextModel(root, tex);
        expect(text.trim()).toBe(
            'Präzession (1/3) Nun hängen Sie im Abstand $r$ ein Zusatzgewicht an. Seine Kraft ' +
            '$$\\vec{D} = \\vec{r}\\times\\vec{F}.$$ wirkt. Das Drehmoment ändert $\\vec{L}$ seitlich.'
        );
        expect(text).not.toContain('Frage');
    });

    it('widens a selection ending inside a formula to the whole formula', () => {
        const model = buildTextModel(root, tex);
        const range = document.createRange();
        const start = textNode('b', 'Das Drehmoment');
        range.setStart(start, start.nodeValue!.indexOf('ändert'));
        range.setEnd(document.querySelector('#l mjx-math')!.firstChild!, 0);
        const span = spanForRange(model, range)!;
        expect(anchorFor(model, span).exact).toBe('ändert $\\vec{L}$');
        expect(formulasInSpan(model, span)).toEqual([document.getElementById('l')]);
    });

    it('trims spaces and keeps context to tell repeated passages apart', () => {
        const model = buildTextModel(root, tex);
        const node = textNode('a', 'Zusatzgewicht');
        const range = document.createRange();
        range.setStart(node, node.nodeValue!.indexOf('Zusatzgewicht') - 1);
        range.setEnd(node, node.nodeValue!.indexOf('an.') + 3);
        const anchor = anchorFor(model, spanForRange(model, range)!);
        expect(anchor.exact).toBe('Zusatzgewicht an.');
        expect(anchor.prefix.endsWith('Abstand $r$ ein ')).toBe(true);
        expect(anchor.suffix.startsWith(' Seine Kraft')).toBe(true);
        expect(anchor.pos).toBe(model.text.indexOf('Zusatzgewicht'));
    });

    it('widens a selection that cuts a word to the whole word', () => {
        const model = buildTextModel(root, tex);
        const node = textNode('a', 'Zusatzgewicht');
        const range = document.createRange();
        range.setStart(node, node.nodeValue!.indexOf('Zusatzgewicht') + 3);   // "atzgewicht an"
        range.setEnd(node, node.nodeValue!.indexOf('an.') + 1);
        expect(anchorFor(model, spanForRange(model, range)!).exact).toBe('Zusatzgewicht an');
    });

    it('takes a display formula whole, and gives the range back over it', () => {
        const model = buildTextModel(root, tex);
        const range = document.createRange();
        range.selectNode(document.getElementById('d')!);
        const span = spanForRange(model, range)!;
        expect(anchorFor(model, span).exact).toBe('$$\\vec{D} = \\vec{r}\\times\\vec{F}.$$');
        const back = rangeForSpan(model, span);
        expect(back.intersectsNode(document.getElementById('d')!)).toBe(true);
        expect(back.intersectsNode(document.getElementById('r')!)).toBe(false);
    });

    it('finds nothing markable in a question', () => {
        const model = buildTextModel(root, tex);
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('app-single-choice p')!);
        expect(spanForRange(model, range)).toBeNull();
    });

    it('finds a stored quote again: on the page, and in the content string with the formulas still as TeX', () => {
        const model = buildTextModel(root, tex);
        const node = textNode('b', 'Das Drehmoment');
        const range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(textNode('b', 'seitlich'), textNode('b', 'seitlich').nodeValue!.indexOf('seitlich') + 8);
        const span = spanForRange(model, range)!;
        const anchor = anchorFor(model, span);
        expect(locate(model, anchor)).toEqual(span);

        // the content string: TeX with its own spacing, in a document of its own
        const doc = document.implementation.createHTMLDocument('');
        doc.body.innerHTML = '<p>Das  Drehmoment ändert $\\vec{L}$\n seitlich.</p>';
        const source = buildTextModel(doc.body, new Map());
        const found = locate(source, anchor)!;
        expect(source.text.slice(found.start, found.end)).toBe('Das Drehmoment ändert $\\vec{L}$ seitlich');
        expect(locate(source, { ...anchor, exact: 'nicht da' })).toBeNull();
    });

    it('picks the place whose context fits among repeated passages', () => {
        const doc = document.implementation.createHTMLDocument('');
        doc.body.innerHTML = '<p>erst die Kraft, dann die Kraft und am Ende die Kraft.</p>';
        const model = buildTextModel(doc.body, new Map());
        const span = locate(model, { exact: 'die Kraft', prefix: 'dann ', suffix: ' und', pos: 0 })!;
        expect(span.start).toBe(model.text.indexOf('dann die Kraft') + 5);
        expect(overlaps(span, { start: span.end, end: span.end + 3 })).toBe(false);
        expect(overlaps(span, { start: span.end - 1, end: span.end + 3 })).toBe(true);
    });

    it('wraps a passage across elements in one element per text node, formulas whole', () => {
        const doc = document.implementation.createHTMLDocument('');
        doc.body.innerHTML = '<p>Der <b>Drehimpuls $\\vec{L}$</b> bleibt erhalten.</p>';
        const model = buildTextModel(doc.body, new Map());
        const span = locate(model, { exact: 'Drehimpuls $\\vec{L}$ bleibt', prefix: '', suffix: '', pos: 0 })!;
        wrapSpan(model, span, d => d.createElement('mark'));
        expect(doc.body.innerHTML).toBe('<p>Der <b><mark>Drehimpuls $\\vec{L}$</mark></b><mark> bleibt</mark> erhalten.</p>');
    });
});
