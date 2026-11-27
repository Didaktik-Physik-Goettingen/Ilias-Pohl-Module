import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, effect, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarkKind, Marks } from '../../core/services/marks';
import { StudyAidsLock } from '../../core/services/study-aids-lock';
import {
    MAX_QUOTE_LENGTH, QuoteAnchor, anchorFor, buildTextModel, fitFormulaBands, formulasInSpan, overlaps, rangeForSpan,
    spanForRange,
} from '../../core/services/mark-anchor';
import { MarkPainter } from './mark-painter';


// new: a selection to mark; existing: a click on a mark (switch its kind or remove it)
type BarState = 'new' | 'existing' | 'overlap' | 'too-long';

interface Bar {
    state: BarState;
    kind: MarkKind | null;  // existing: the mark's kind
    top: number;
    left: number;
    below: boolean;         // phones: below the passage, where the system's own selection menu isn't
    alignRight: boolean;
}

interface Pending {
    range: Range;
    // new
    route?: string;
    page?: string | null;
    anchor?: QuoteAnchor;
    formulas?: Element[];
    // existing
    markId?: string;
}

const PENDING = 'mark-pending';



// Marking in two steps: the student selects text on a learning page, a small bar next to the selection's end asks
// „Wichtig“ or „Unklar“, and only then the passage is saved (Marks). The marks stay highlighted on the page, green
// or orange (MarkPainter); a click on one opens the bar again, to switch its kind or remove it. Uses the CSS Custom
// Highlight API, which leaves the DOM of the page (Angular's [innerHTML], MathJax) untouched; browsers without it
// get no bar and no highlights (the marks are still listed in the overlay).
@Component({
    selector: 'app-mark-toolbar',
    standalone: true,
    templateUrl: './mark-toolbar.html',
    styleUrl: './mark-toolbar.css',
})
export class MarkToolbar implements OnInit, OnDestroy {
    readonly bar = signal<Bar | null>(null);

    private readonly isBrowser: boolean;
    private readonly enabled: boolean;
    private painter: MarkPainter | null = null;
    private pending: Pending | null = null;
    private pointerDown = false;
    private selectionTimer: ReturnType<typeof setTimeout> | null = null;
    private paintTimer: ReturnType<typeof setTimeout> | null = null;
    private observer: MutationObserver | null = null;
    private routerSub: Subscription | null = null;
    private readonly listeners: [EventTarget, string, EventListener, boolean][] = [];


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(DOCUMENT) private doc: Document,
        private router: Router,
        private marks: Marks,
        private lock: StudyAidsLock
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.enabled = this.isBrowser && supported();
        // a mark added, removed or switched (here, in the overlay or by restoring from the server): repaint
        effect(() => {
            this.marks.changes();
            this.schedulePaint(0);
        });
    }


    ngOnInit(): void {
        if (!this.enabled) return;
        const win = this.doc.defaultView!;
        this.painter = new MarkPainter(this.doc);
        // a new selection starts: the old one's bar goes, and the browser's selection colour comes back
        this.listen(this.doc, 'pointerdown', e => {
            if (this.inBar(e)) return;
            this.pointerDown = true;
            this.dismiss();
        });
        this.listen(this.doc, 'pointerup', e => {
            this.pointerDown = false;
            if (this.inBar(e)) return;
            const { clientX, clientY, target } = e as PointerEvent;
            setTimeout(() => {
                const sel = this.doc.getSelection();
                if (!sel || sel.isCollapsed) this.evaluateClick(clientX, clientY, target as Element | null);
                else this.evaluate();
            });
        });
        this.listen(this.doc, 'keyup', e => {
            if ((e as KeyboardEvent).key === 'Escape') this.cancel();
            else if ((e as KeyboardEvent).shiftKey) this.evaluate();
        });
        // touch: the selection handles move without pointer events on the page
        this.listen(this.doc, 'selectionchange', () => {
            if (this.selectionTimer) clearTimeout(this.selectionTimer);
            this.selectionTimer = setTimeout(() => { if (!this.pointerDown) this.evaluate(); }, 400);
        });
        this.listen(win, 'scroll', () => this.place(), true);
        this.listen(win, 'resize', () => { this.place(); this.schedulePaint(150); });
        this.routerSub = this.router.events.subscribe(e => {
            if (e instanceof NavigationStart) this.dismiss();
            if (e instanceof NavigationEnd) this.schedulePaint(150);
        });
        // the page re-renders (?page= switch, MathJax typesetting): the marks are found again
        const root = this.root();
        if (root) {
            this.observer = new MutationObserver(() => this.schedulePaint(150));
            this.observer.observe(root, { childList: true, subtree: true, characterData: true });
        }
        this.schedulePaint(0);
    }


    ngOnDestroy(): void {
        for (const [target, type, fn, capture] of this.listeners) target.removeEventListener(type, fn, capture);
        this.routerSub?.unsubscribe();
        this.observer?.disconnect();
        if (this.selectionTimer) clearTimeout(this.selectionTimer);
        if (this.paintTimer) clearTimeout(this.paintTimer);
        this.painter?.clear();
    }


    // „Wichtig“ / „Unklar“: a new mark, or an existing one switched to that kind
    choose(kind: MarkKind): void {
        const p = this.pending;
        const b = this.bar();
        if (!p || !b) return;
        if (b.state === 'new' && p.route && p.anchor) {
            this.marks.add(kind, p.route, p.page ?? null, p.anchor);
            this.doc.getSelection()?.removeAllRanges();
        } else if (b.state === 'existing' && p.markId && kind !== b.kind) {
            this.marks.setKind(p.markId, kind);
        }
        this.dismiss();
        this.paintNow();
    }


    remove(): void {
        const id = this.pending?.markId;
        if (id) this.marks.remove(id);
        this.dismiss();
        this.paintNow();
    }


    cancel(): void {
        if (!this.pending) return;
        this.dismiss();
        this.doc.getSelection()?.removeAllRanges();
    }


    // ── Selection → new mark ────────────────────────────────────────────────

    private evaluate(): void {
        const sel = this.doc.getSelection();
        if (sel?.isCollapsed && this.bar()?.state === 'existing') return;   // the click on a mark set a caret
        const root = this.root();
        const where = this.where();
        if (!sel || sel.isCollapsed || !sel.rangeCount || !root || !where) {
            this.dismiss();
            return;
        }
        const range = sel.getRangeAt(0);
        if (!root.contains(range.commonAncestorContainer)) {
            this.dismiss();
            return;
        }
        const model = buildTextModel(root);
        const span = spanForRange(model, range);
        if (!span) {
            this.dismiss();
            return;
        }
        const anchor = anchorFor(model, span);
        this.clearPending();
        this.pending = { ...where, anchor, range: rangeForSpan(model, span), formulas: formulasInSpan(model, span) };

        root.classList.add('marking-pending');
        this.paintPending(this.pending.range, this.pending.formulas!);

        // the painter's spans are of the same page text, so they compare directly
        this.paintNow();
        const state: BarState = anchor.exact.length > MAX_QUOTE_LENGTH ? 'too-long'
            : this.painter!.painted.some(p => overlaps(p.span, span)) ? 'overlap' : 'new';
        this.place(state, null);
    }


    // a click (no selection) on a marked passage: the bar for that mark
    private evaluateClick(x: number, y: number, target: Element | null): void {
        if (!this.where() || !this.painter || target?.closest?.('a, button, input, select, textarea, label')) {
            this.dismiss();
            return;
        }
        const hit = this.painter.at(x, y);
        if (!hit) {
            this.dismiss();
            return;
        }
        this.clearPending();
        this.pending = { range: hit.range, markId: hit.mark.id };
        this.place('existing', hit.mark.kind);
    }


    // a learning page on which marking is allowed: its route and sub-page
    private where(): { route: string; page: string | null } | null {
        const [path, query] = this.router.url.split('?');
        if (!path.startsWith('/learning/') || this.lock.isLocked()) return null;
        return { route: path, page: new URLSearchParams(query ?? '').get('page') };
    }


    private place(state: BarState | undefined = this.bar()?.state, kind: MarkKind | null = this.bar()?.kind ?? null): void {
        if (!this.pending || !state) return;
        const rects = Array.from(this.pending.range.getClientRects()).filter(r => r.width > 0 && r.height > 0);
        const last = rects[rects.length - 1];
        if (!last) return;
        const win = this.doc.defaultView!;
        const below = win.matchMedia('(pointer: coarse)').matches || win.innerWidth < 600;
        const room = win.innerWidth - last.right;
        const width = state === 'existing' ? 350 : 240;     // the bar's width, about
        if (below) {
            this.bar.set({ state, kind, top: last.bottom + 8, left: Math.max(8, last.right), below, alignRight: last.right > width - 10 });
        } else if (room > width) {
            this.bar.set({ state, kind, top: last.top + last.height / 2, left: last.right + 8, below, alignRight: false });
        } else {
            this.bar.set({ state, kind, top: last.bottom + 8, left: last.right, below: true, alignRight: true });
        }
    }


    private dismiss(): void {
        this.clearPending();
        this.bar.set(null);
    }


    private clearPending(): void {
        this.root()?.classList.remove('marking-pending');
        CSS.highlights?.delete(PENDING);
        this.doc.querySelectorAll('.' + PENDING).forEach(el => el.classList.remove(PENDING));
        this.pending = null;
    }


    // ── Painting ────────────────────────────────────────────────────────────

    // the selection while the bar asks: blue, above the marks' colours
    private paintPending(range: Range, formulas: Element[]): void {
        const highlight = new Highlight(range);
        highlight.priority = 1;
        CSS.highlights.set(PENDING, highlight);
        for (const f of formulas) f.classList.add(PENDING);
        fitFormulaBands(formulas);
    }


    private schedulePaint(delay: number): void {
        if (!this.enabled) return;
        if (this.paintTimer) clearTimeout(this.paintTimer);
        this.paintTimer = setTimeout(() => this.paintNow(), delay);
    }


    private paintNow(): void {
        if (this.paintTimer) clearTimeout(this.paintTimer);
        this.paintTimer = null;
        const root = this.root();
        const where = this.where();
        if (!this.painter || !root) return;
        if (!where) {
            this.painter.clear();
            return;
        }
        this.painter.paint(root, this.marks.on(where.route, where.page));
    }


    private root(): Element | null {
        return this.doc.querySelector('main.main-content');
    }


    private inBar(e: Event): boolean {
        return !!(e.target as Element | null)?.closest?.('.mark-bar');
    }


    private listen(target: EventTarget, type: string, fn: EventListener, capture = false): void {
        target.addEventListener(type, fn, capture);
        this.listeners.push([target, type, fn, capture]);
    }
}


function supported(): boolean {
    return typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';
}
