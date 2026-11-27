import { TestBed } from '@angular/core/testing';
import { Marks, Mark } from './marks';
import { Session } from './session';
import { STORAGE_PREFIX } from './storage-prefix';

describe('Marks', () => {
    let marks: Marks;
    let sessionId: string;

    const anchor = (exact: string) => ({ exact, prefix: '', suffix: '', pos: 0 });

    beforeEach(() => {
        localStorage.clear();
        sessionId = 'student-a';
        TestBed.configureTestingModule({
            providers: [{ provide: Session, useValue: { sessionId: () => sessionId } }],
        });
        marks = TestBed.inject(Marks);
    });

    it('adds and removes, with a create and a delete event to send', () => {
        const m = marks.add('important', '/learning/p5-precession', '2', anchor('Präzession'));
        expect(marks.on('/learning/p5-precession', '2')).toEqual([m]);
        expect(marks.on('/learning/p5-precession', '1')).toEqual([]);
        marks.remove(m.id);
        expect(marks.list()).toEqual([]);
        const events = marks.getUnsent();
        expect(events.map(e => e.action)).toEqual(['create', 'delete']);
        expect(events[0]).toEqual(expect.objectContaining({ kind: 'important', route: '/learning/p5-precession', page: '2' }));
        expect(new Set(events.map(e => e.eventId)).size).toBe(2);
    });

    it('switches a mark\'s kind as a new mark in its place', () => {
        const m = marks.add('important', '/learning/p5-precession', '1', anchor('a'));
        const switched = marks.setKind(m.id, 'unclear')!;
        expect(switched.id).not.toBe(m.id);
        expect(marks.list()).toEqual([switched]);
        expect(switched).toEqual(expect.objectContaining({ kind: 'unclear', anchor: m.anchor, resolvedAt: null }));
        expect(marks.getUnsent().map(e => e.action)).toEqual(['create', 'delete', 'create']);
    });

    it('resolves and reopens an unclear mark, not an important one', () => {
        const unclear = marks.add('unclear', '/learning/p5-precession', '1', anchor('u'));
        const important = marks.add('important', '/learning/p5-precession', '1', anchor('i'));
        marks.setResolved(unclear.id, true);
        marks.setResolved(unclear.id, true);        // no second event
        marks.setResolved(important.id, true);
        expect(marks.list().find(m => m.id === unclear.id)!.resolvedAt).not.toBeNull();
        expect(marks.list().find(m => m.id === important.id)!.resolvedAt).toBeNull();
        marks.setResolved(unclear.id, false);
        expect(marks.list().find(m => m.id === unclear.id)!.resolvedAt).toBeNull();
        expect(marks.getUnsent().map(e => e.action)).toEqual(['create', 'create', 'resolve', 'reopen']);
    });

    it('forgets sent events, and keeps the marks', () => {
        marks.add('important', '/learning/p5-precession', '1', anchor('a'));
        marks.markSent(marks.getUnsent());
        expect(marks.getUnsent()).toEqual([]);
        expect(marks.list().length).toBe(1);
    });

    it('keeps each student\'s marks apart', () => {
        marks.add('important', '/learning/p5-precession', '1', anchor('a'));
        sessionId = 'student-b';
        expect(marks.list()).toEqual([]);
        expect(localStorage.getItem(STORAGE_PREFIX + 'marks_student-a')).toContain('"exact":"a"');
    });

    it('reads marks stored before there were two kinds as important ones', () => {
        localStorage.setItem(STORAGE_PREFIX + 'marks_student-a', JSON.stringify({
            marks: [{ id: 'old', route: '/learning/p2-rotation', page: '1', anchor: anchor('old'), createdAt: 1 }],
            unsent: [{ markId: 'old', action: 'create', at: 1, route: '/learning/p2-rotation', page: '1', anchor: anchor('old') }],
        }));
        expect(marks.list()).toEqual([expect.objectContaining({ id: 'old', kind: 'important', resolvedAt: null })]);
        expect(marks.getUnsent()).toEqual([expect.objectContaining({ kind: 'important', eventId: expect.any(String) })]);
    });

    it('takes the server\'s marks, but unsent changes here win', () => {
        const sent = marks.add('important', '/learning/p2-rotation', '1', anchor('sent and kept'));
        const removedHere = marks.add('important', '/learning/p2-rotation', '1', anchor('removed here'));
        const resolvedHere = marks.add('unclear', '/learning/p2-rotation', '1', anchor('resolved here'));
        marks.markSent(marks.getUnsent());
        marks.remove(removedHere.id);
        marks.setResolved(resolvedHere.id, true);
        const newHere = marks.add('unclear', '/learning/p2-rotation', '1', anchor('new here'));
        const otherDevice: Mark = {
            id: 'x', kind: 'important', route: '/learning/p4-gyroscope', page: '1', anchor: anchor('other device'),
            createdAt: 1, resolvedAt: null,
        };

        // the server has the first three as sent (the delete and the resolve haven't arrived) and one from another
        // device; a mark deleted on another device (sent here before) is no longer among them
        marks.restore([sent, removedHere, { ...resolvedHere, resolvedAt: null }, otherDevice]);
        expect(marks.list().map(m => m.anchor.exact).sort()).toEqual(['new here', 'other device', 'resolved here', 'sent and kept']);
        expect(marks.list().some(m => m.id === newHere.id)).toBe(true);
        expect(marks.list().find(m => m.id === resolvedHere.id)!.resolvedAt).not.toBeNull();

        marks.restore([otherDevice]);
        expect(marks.list().map(m => m.anchor.exact).sort()).toEqual(['new here', 'other device']);
    });
});
