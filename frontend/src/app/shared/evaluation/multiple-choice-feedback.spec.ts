import { describe, expect, it } from 'vitest';
import {
    buildSelectionErrorMessage,
    formatSelectionErrorSummary,
    getSelectionErrorBreakdown
} from './multiple-choice-feedback';

describe('multiple-choice feedback', () => {
    it('finds no errors for a completely correct selection', () => {
        const errors = getSelectionErrorBreakdown(['a1', 'a3'], ['a1', 'a3']);
        expect(errors).toEqual({
            selectedIncorrect: [],
            missedCorrect: [],
            total: 0
        });
        expect(formatSelectionErrorSummary(errors)).toBe('Anzahl der Fehler: 0.');
        expect(buildSelectionErrorMessage(['a1', 'a3'], ['a1', 'a3'], '✓ Richtig!')).toBe(
            'Anzahl der Fehler: 0.<br><br>✓ Richtig!'
        );
    });

    it('counts only omitted correct answers', () => {
        const errors = getSelectionErrorBreakdown(['a1'], ['a1', 'a2', 'a3']);
        expect(formatSelectionErrorSummary(errors)).toBe(
            'Anzahl der Fehler: 2.'
        );
    });

    it('counts only additionally selected false answers', () => {
        const errors = getSelectionErrorBreakdown(['a1', 'a2', 'a3'], ['a1']);
        expect(formatSelectionErrorSummary(errors)).toBe(
            'Anzahl der Fehler: 2.'
        );
    });

    it('counts both error types without revealing their breakdown', () => {
        const errors = getSelectionErrorBreakdown(['a1', 'a4'], ['a1', 'a2', 'a3']);
        expect(formatSelectionErrorSummary(errors)).toBe(
            'Anzahl der Fehler: 3.'
        );
    });

    it('counts every correct answer as omitted when nothing is selected', () => {
        const errors = getSelectionErrorBreakdown([], ['a1', 'a2']);
        expect(formatSelectionErrorSummary(errors)).toBe(
            'Anzahl der Fehler: 2.'
        );
    });

    it('includes selected-incorrect and omitted-correct concepts', () => {
        const message = buildSelectionErrorMessage(
            ['false'],
            ['correct'],
            'Bestehende Rückmeldung',
            { false: 'Hinweis zur zusätzlichen Auswahl.', correct: 'Hinweis zur fehlenden Auswahl.' }
        );

        expect(message).toBe(
            'Anzahl der Fehler: 2.<br><br>Hinweis zur zusätzlichen Auswahl. Hinweis zur fehlenden Auswahl.'
        );
    });

    it('includes every omitted-correct concept in feedback-definition order', () => {
        expect(buildSelectionErrorMessage(['a'], ['a', 'b', 'c'], 'General prompt.', {
            b: 'First omission.', c: 'Second omission.'
        })).toBe('Anzahl der Fehler: 2.<br><br>First omission. Second omission.');
    });

    it('shows only the selection request for an empty submission', () => {
        expect(buildSelectionErrorMessage([], ['a', 'b'], 'Bitte wählen Sie mindestens eine Antwort aus.', {
            a: 'Hint A.', b: 'Hint B.'
        })).toBe('Bitte wählen Sie mindestens eine Antwort aus.');
    });

    it('uses the general prompt for an unannotated mismatch without dropping annotated concepts', () => {
        expect(buildSelectionErrorMessage(['wrong'], ['a'], 'General prompt.', { a: 'Omission.' }))
            .toBe('Anzahl der Fehler: 2.<br><br>General prompt. Omission.');
    });

    it('shows every distinct mismatch concept and no answer-key breakdown', () => {
        const message = buildSelectionErrorMessage(['x', 'y'], ['a', 'b'], 'General prompt.', {
            x: 'First hint.', y: 'Second hint.', a: 'Omission A.', b: 'Omission B.'
        });
        expect(message).toContain('First hint.');
        expect(message).toContain('Second hint.');
        expect(message).toContain('Omission A.');
        expect(message).toContain('Omission B.');
        expect(message).not.toMatch(/Du hast|richtige Antwort|falsche Antwort|ausgewählt/);
    });

    it('groups related mismatches by concept and applies explicit concept order', () => {
        const message = buildSelectionErrorMessage(['wrong-a', 'wrong-b'], ['needed'], 'General prompt.', {
            'wrong-a': { conceptId: 'initial-state', order: 20, message: 'Separate the initial state from the steady state.' },
            'wrong-b': { conceptId: 'initial-state', order: 20, message: 'Duplicate wording that must not be shown.' },
            needed: { conceptId: 'system-response', order: 10, message: 'Identify the persistent response first.' }
        });
        expect(message).toBe(
            'Anzahl der Fehler: 3.<br><br>Identify the persistent response first. Separate the initial state from the steady state.'
        );
        expect(message).not.toContain('Duplicate wording');
    });

    it('uses curated combined feedback for related concepts', () => {
        const combinedFeedback = {
            'drive+transient': 'First distinguish the decaying transient from the persistent driven response; then apply that distinction to the long-time motion.'
        };
        const message = buildSelectionErrorMessage(['wrong'], ['needed'], 'General prompt.', {
            wrong: { conceptId: 'transient', order: 1, message: 'Transient hint.', combinedFeedback },
            needed: { conceptId: 'drive', order: 2, message: 'Drive hint.' }
        });
        expect(message).toBe(`Anzahl der Fehler: 2.<br><br>${combinedFeedback['drive+transient']}`);
    });

    it('uses ordered steps only for independent concepts', () => {
        const message = buildSelectionErrorMessage(['wrong'], ['needed'], 'General prompt.', {
            wrong: { conceptId: 'units', order: 1, message: 'Check the units.', independent: true },
            needed: { conceptId: 'graph', order: 2, message: 'Inspect the graph.', independent: true }
        });
        expect(message).toBe(
            'Anzahl der Fehler: 2.<br><br><ol><li>Check the units.</li><li>Inspect the graph.</li></ol>'
        );
    });

    it('counts distinct options once', () => {
        expect(getSelectionErrorBreakdown(['a', 'a', 'd', 'd'], ['a', 'b', 'b']).total).toBe(2);
    });

    it('joins connected prerequisites in one paragraph and keeps four concepts within three blocks', () => {
        const feedback = {
            missing: [
                { conceptId: 'value', order: 1, paragraphId: 'initial', message: 'Check initial value.' },
                { conceptId: 'slope', order: 2, paragraphId: 'initial', message: 'Check initial slope.' },
                { conceptId: 'period', order: 3, paragraphId: 'period', message: 'Compare periods.' },
                { conceptId: 'energy', order: 4, paragraphId: 'energy', message: 'Compare energy.' }
            ],
            wrong: { conceptId: 'slope', order: 2, paragraphId: 'initial', message: 'Check initial slope.' }
        };
        expect(buildSelectionErrorMessage(['wrong'], ['missing'], '', feedback)).toBe(
            'Anzahl der Fehler: 2.<br><br>Check initial value. Check initial slope.<br><br>Compare periods.<br><br>Compare energy.'
        );
        expect(buildSelectionErrorMessage(['missing', 'wrong'], ['missing'], '', feedback)).toBe(
            'Anzahl der Fehler: 1.<br><br>Check initial slope.'
        );
    });

    it('does not apply a combined paragraph to only one of its concepts', () => {
        expect(buildSelectionErrorMessage(['needed', 'wrong'], ['needed'], '', {
            wrong: { conceptId: 'transient', order: 1, message: 'Transient only.', combinedFeedback: { 'drive+transient': 'Both concepts.' } },
            needed: { conceptId: 'drive', order: 2, message: 'Drive only.' }
        })).toBe('Anzahl der Fehler: 1.<br><br>Transient only.');
    });

    it('caps paragraph blocks without omitting concepts and avoids steps for mixed dependencies', () => {
        const feedback = Object.fromEntries(['one', 'two', 'three', 'four'].map((key, order) => [key, {
            conceptId: key, order, message: `${key}.`, paragraphId: key, independent: key !== 'four'
        }]));
        expect(buildSelectionErrorMessage(['one', 'two', 'three', 'four'], ['needed'], '', feedback)).toBe(
            'Anzahl der Fehler: 5.<br><br>one.<br><br>two.<br><br>three. four.'
        );
    });
});
