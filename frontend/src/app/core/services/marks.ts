import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { STORAGE_PREFIX } from './storage-prefix';
import { QuoteAnchor } from './mark-anchor';



// „Wichtig“ (green) or „Unklar“ (orange): the two kinds of marks (Carlo, 2026-11-27)
export type MarkKind = 'important' | 'unclear';

export const MARK_KIND_LABEL: Record<MarkKind, string> = { important: 'Wichtig', unclear: 'Unklar' };

// A passage the student marked on a learning page (shared/mark-toolbar). It stays highlighted on the page and is
// listed in the overlay „Meine Markierungen“, on the Abschluss's „Offene Stellen“ (unclear ones) and in the Lernpfad.
export interface Mark {
    id: string;                 // made here (UUID), so a mark sent twice is stored once
    kind: MarkKind;
    route: string;              // '/learning/p5-precession'
    page: string | null;        // the sub-page (?page=), null for pages without
    anchor: QuoteAnchor;
    createdAt: number;
    resolvedAt: number | null;  // an unclear mark set to „Geklärt“; null while open (and for important ones)
}

// As mark_events stores it: marks are created, resolved/reopened and deleted, never edited, and the server only adds
// rows. Changing a mark's kind is a delete and a new mark.
export interface MarkEvent {
    eventId: string;            // made here, so an event sent twice is stored once
    markId: string;
    action: 'create' | 'delete' | 'resolve' | 'reopen';
    at: number;
    kind?: MarkKind;
    route?: string;
    page?: string | null;
    anchor?: QuoteAnchor;
}

interface StoredState {
    marks: Mark[];
    unsent: MarkEvent[];
}



// The student's marks in this module, per student in localStorage (a shared computer's next student must not see
// them), with the events not yet confirmed by the server, like the AttemptOutbox. Guests keep theirs locally only.
@Injectable({
    providedIn: 'root'
})
export class Marks {
    // bumped on every change, for views that list or paint the marks
    readonly changes = signal(0);

    private readonly isBrowser: boolean;
    private loadedKey: string | null = null;
    private state: StoredState = { marks: [], unsent: [] };


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }


    list(): Mark[] {
        this.load();
        return [...this.state.marks];
    }


    // the marks of one (sub-)page
    on(route: string, page: string | null): Mark[] {
        return this.list().filter(m => m.route === route && m.page === page);
    }


    add(kind: MarkKind, route: string, page: string | null, anchor: QuoteAnchor): Mark {
        this.load();
        const mark: Mark = { id: newId(), kind, route, page, anchor, createdAt: Date.now(), resolvedAt: null };
        this.state.marks.push(mark);
        this.state.unsent.push({ eventId: newId(), markId: mark.id, action: 'create', at: mark.createdAt, kind, route, page, anchor });
        this.save();
        return mark;
    }


    remove(id: string): void {
        this.load();
        if (!this.state.marks.some(m => m.id === id)) return;
        this.state.marks = this.state.marks.filter(m => m.id !== id);
        this.state.unsent.push({ eventId: newId(), markId: id, action: 'delete', at: Date.now() });
        this.save();
    }


    // the same passage as the other kind: a new mark in its place
    setKind(id: string, kind: MarkKind): Mark | null {
        const mark = this.list().find(m => m.id === id);
        if (!mark) return null;
        if (mark.kind === kind) return mark;
        this.remove(id);
        return this.add(kind, mark.route, mark.page, mark.anchor);
    }


    // an unclear mark: „Geklärt“ set or taken back
    setResolved(id: string, resolved: boolean): void {
        this.load();
        const mark = this.state.marks.find(m => m.id === id);
        if (!mark || mark.kind !== 'unclear' || (mark.resolvedAt !== null) === resolved) return;
        const at = Date.now();
        mark.resolvedAt = resolved ? at : null;
        this.state.unsent.push({ eventId: newId(), markId: id, action: resolved ? 'resolve' : 'reopen', at });
        this.save();
    }


    // From the saved progress: the marks the server has (on any device), with the events still waiting here applied
    // on top: a mark added here stays, one removed here stays removed, „Geklärt“ set here stays set.
    restore(serverMarks: Mark[]): void {
        this.load();
        const local = new Map(this.state.marks.map(m => [m.id, m]));
        const marks = new Map(serverMarks.map(m => [m.id, { ...m }]));
        for (const e of this.state.unsent) {
            if (e.action === 'create') {
                const own = local.get(e.markId);
                if (own) marks.set(e.markId, { ...own });
            } else if (e.action === 'delete') {
                marks.delete(e.markId);
            } else {
                const mark = marks.get(e.markId);
                if (mark) mark.resolvedAt = e.action === 'resolve' ? e.at : null;
            }
        }
        this.state.marks = [...marks.values()].sort((a, b) => a.createdAt - b.createdAt);
        this.save();
    }


    getUnsent(): MarkEvent[] {
        this.load();
        return [...this.state.unsent];
    }


    markSent(sent: MarkEvent[]): void {
        this.load();
        const done = new Set(sent.map(e => e.eventId));
        this.state.unsent = this.state.unsent.filter(e => !done.has(e.eventId));
        this.save();
    }


    private get storageKey(): string {
        return STORAGE_PREFIX + 'marks_' + (this.sessionService.sessionId() ?? 'unknown');
    }


    private load() {
        const key = this.storageKey;
        if (key === this.loadedKey) return;
        this.loadedKey = key;
        this.state = { marks: [], unsent: [] };
        if (!this.isBrowser) return;
        try {
            const stored = JSON.parse(localStorage.getItem(key) ?? 'null');
            if (stored && Array.isArray(stored.marks) && Array.isArray(stored.unsent)) this.state = upgrade(stored);
        } catch { /* ignore corrupt data */ }
    }


    private save() {
        this.changes.update(n => n + 1);
        if (!this.isBrowser) return;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch { /* storage full or blocked: the marks still go out while the page stays open */ }
    }
}


// marks stored before there were two kinds: „Wichtig“, open; events without an id get one
function upgrade(state: StoredState): StoredState {
    return {
        marks: state.marks.map(m => ({ ...m, kind: m.kind ?? 'important', resolvedAt: m.resolvedAt ?? null })),
        unsent: state.unsent.map(e => ({
            ...e,
            eventId: e.eventId ?? newId(),
            ...(e.action === 'create' && !e.kind ? { kind: 'important' as MarkKind } : {}),
        })),
    };
}


function newId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return `${hex(8)}-${hex(4)}-4${hex(3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${hex(3)}-${hex(12)}`;
}
