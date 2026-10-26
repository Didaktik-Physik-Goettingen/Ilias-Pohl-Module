/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import * as e1Questions from './e1-intro-experiment/e1-intro-experiment-questions';
import * as e2Questions from './e2-damped-oscillation/e2-damped-oscillation-questions';
import * as e3Questions from './e3-driven-oscillations/e3-driven-oscillations-questions';
import * as t1Questions from './t1-intro-theory/t1-intro-theory-questions';
import * as t2Questions from './t2-free-oscillations/t2-free-oscillations-questions';
import * as t3Questions from './t3-damped-oscillations/t3-damped-oscillations-questions';
import * as t4Questions from './t4-driven-oscillations/t4-driven-oscillations-questions';
import { PAGE_REGISTRY } from '../../core/services/learning-report-registry';
import { AdaptiveAnswerHint, AnyQuestion } from '../../shared/evaluation/question.types';
import { buildSelectionErrorMessage } from '../../shared/evaluation/multiple-choice-feedback';
import * as e1Content from './e1-intro-experiment/e1-intro-experiment-content';
import * as t1Content from './t1-intro-theory/t1-intro-theory-content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ASTWithSource, parseTemplate, TmplAstElement, TmplAstIfBlock, TmplAstNode } from '@angular/compiler';

type FeedbackQuestion = Extract<AnyQuestion, { correctAnswers: string[] }>;

function isFeedbackQuestion(question: AnyQuestion): question is FeedbackQuestion {
    return 'correctAnswers' in question;
}

const questionGroups = [
    e1Questions,
    e2Questions,
    e3Questions,
    t1Questions,
    t2Questions,
    t3Questions,
    t4Questions
];

const definitions = questionGroups.flatMap(group => Object.values(group)) as AnyQuestion[];
const visibleIds = new Set(PAGE_REGISTRY.flatMap(page => page.blocks)
    .filter(block => block.type === 'question').map(block => block.questionId));
const activeQuestions = definitions.filter(question => visibleIds.has(question.questionId));
const disabledQuestions = definitions.filter(question => !visibleIds.has(question.questionId));
const multipleChoiceLearningQuestions = activeQuestions.filter(isFeedbackQuestion);

describe('learning-question feedback data', () => {
    it('matches the question components in the actual templates, excluding @if (false)', () => {
        const directories = [
            'e1-intro-experiment', 'e2-damped-oscillation', 'e3-driven-oscillations',
            't1-intro-theory', 't2-free-oscillations', 't3-damped-oscillations', 't4-driven-oscillations'
        ];
        const templateIds: string[] = [];
        const disabledIds: string[] = [];
        directories.forEach((directory, index) => {
            const filename = join(process.cwd(), 'src/app/features/learning_features', directory, `${directory}.html`);
            const parsed = parseTemplate(readFileSync(filename, 'utf8'), filename);
            expect(parsed.errors).toBeNull();
            const questions = questionGroups[index] as Record<string, AnyQuestion>;
            function visit(nodes: TmplAstNode[], disabled = false) {
                for (const node of nodes) {
                    if (node instanceof TmplAstIfBlock) {
                        for (const branch of node.branches) {
                            const expression = branch.expression instanceof ASTWithSource ? branch.expression.source : '';
                            visit(branch.children, disabled || expression === 'false');
                        }
                    } else if (node instanceof TmplAstElement) {
                        const binding = node.inputs.find(input => input.name === 'questionId');
                        if (binding) {
                            const name = binding.value instanceof ASTWithSource ? binding.value.source?.split('.')[0] ?? '' : '';
                            (disabled ? disabledIds : templateIds).push(questions[name].questionId);
                        }
                        visit(node.children, disabled);
                    }
                }
            }
            visit(parsed.nodes);
        });
        expect(templateIds).toHaveLength(33);
        expect(disabledIds).toHaveLength(10);
        expect(templateIds.sort()).toEqual([...visibleIds].sort());
        expect(disabledIds.sort()).toEqual(disabledQuestions.map(question => question.questionId).sort());
    });
    it('distinguishes 33 visible questions (28 MC) from 10 disabled definitions', () => {
        expect(definitions).toHaveLength(43);
        expect(visibleIds.size).toBe(33);
        expect(activeQuestions).toHaveLength(33);
        expect(multipleChoiceLearningQuestions).toHaveLength(28);
        expect(disabledQuestions.map(q => q.questionId).sort()).toEqual([
            t2Questions.question3.questionId, t2Questions.question5.questionId,
            t3Questions.question3.questionId, t3Questions.question4.questionId, t3Questions.question6.questionId,
            t4Questions.question2.questionId, t4Questions.question5.questionId, t4Questions.question6.questionId,
            t4Questions.question9.questionId, t4Questions.question11.questionId
        ].sort());
    });

    it.each(activeQuestions)('$questionId has a nontrivial, valid answer set and formal feedback', question => {
        const correct = 'correctAnswers' in question ? question.correctAnswers : [question.correctAnswer];
        expect(correct.length).toBeGreaterThan(0);
        expect(correct.length).toBeLessThan(question.options.length);
        expect(new Set(correct).size).toBe(correct.length);
        expect(correct.every(value => question.options.some(option => option.value === value))).toBe(true);
        expect(question.successMessage).not.toMatch(/Falsche Wahl|Versuchen Sie es nochmals|Völlig richtig|Frage am Rande|\b(?:du|dein|dich|dir)\b/i);
        if ('correctAnswers' in question) {
            expect(question.incompleteMessage).toBe(question.incorrectMessage);
            expect(question.incorrectMessage).not.toMatch(/fehlt|falsch|richtige Antwort|noch nicht|Mindestens/i);
        }
    });

    it('accepts both increasing linear graphs and only the graph compatible with release from rest', () => {
        expect(e1Questions.question5.correctAnswers).toEqual(['answer1', 'answer2']);
        expect(e1Questions.question6.correctAnswers).toEqual(['answer4']);
    });

    it('uses an unambiguous quarter-period phase measurement and a discriminating decrement question', () => {
        expect(e3Questions.question8.correctAnswer).toBe('answer1');
        expect(e3Questions.question8.question).toContain('aufwärts gerichteten');
        expect(e3Questions.question8.question).toContain('0{,}625');
        expect(e3Questions.question8.question).not.toContain('mHz');
        expect(t3Questions.question7.correctAnswers).toEqual(['answer1', 'answer2', 'answer3']);
    });

    it.each(multipleChoiceLearningQuestions)(
        '$questionId has a short hint for every answer option',
        question => {
            expect(Object.keys(question.answerFeedback ?? {}).sort()).toEqual(
                question.options.map(option => option.value).sort()
            );

            for (const hint of Object.values(question.answerFeedback ?? {})) {
                for (const block of Array.isArray(hint) ? hint : [hint]) {
                    const message = typeof block === 'string' ? block : block.message;
                    expect(message.trim()).not.toBe('');
                    expect(message.length).toBeLessThan(650);
                    expect(message).not.toMatch(/\b(?:richtig|falsch|korrekt)\b/i);
                    expect(message).not.toMatch(/\bAntwort(?:möglichkeit)?\s*\d+/i);
                }
            }
        }
    );

    it.each(multipleChoiceLearningQuestions)(
        '$questionId composes every possible selection without repetition, omissions or untriggered concepts',
        question => {
            const concepts = new Map<string, AdaptiveAnswerHint>();
            const byAnswer = new Map<string, AdaptiveAnswerHint[]>();
            for (const [answer, feedback] of Object.entries(question.answerFeedback!)) {
                const hints = (Array.isArray(feedback) ? feedback : [feedback]).map(h =>
                    typeof h === 'string' ? { message: h } : h);
                byAnswer.set(answer, hints);
                for (const hint of hints) {
                    const id = hint.conceptId ?? hint.message;
                    if (concepts.has(id)) expect(hint).toEqual(concepts.get(id));
                    concepts.set(id, hint);
                }
            }
            for (let mask = 0; mask < 2 ** question.options.length; mask++) {
                const selected = question.options.filter((_, i) => mask & (1 << i)).map(o => o.value);
                const mismatches = question.options.filter(o =>
                    selected.includes(o.value) !== question.correctAnswers.includes(o.value));
                const correct = mismatches.length === 0;
                const message = buildSelectionErrorMessage(selected, question.correctAnswers,
                    correct ? question.successMessage! : question.incorrectMessage!, question.answerFeedback);
                if (!selected.length) {
                    expect(message).toBe('Bitte wählen Sie mindestens eine Antwort aus.');
                    continue;
                }
                if (correct) {
                    expect(message).toBe(`Anzahl der Fehler: 0.<br><br>${question.successMessage}`);
                    continue;
                }
                const triggered = new Set(mismatches.flatMap(o => byAnswer.get(o.value)!)
                    .map(h => h.conceptId ?? h.message));
                const expected = [...triggered].map(id => concepts.get(id)!)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                let previous = -1;
                for (const hint of expected) {
                    expect(message.split(hint.message)).toHaveLength(2);
                    const position = message.indexOf(hint.message);
                    expect(position).toBeGreaterThan(previous);
                    previous = position;
                }
                for (const [id, hint] of concepts) {
                    if (!triggered.has(id)) expect(message).not.toContain(hint.message);
                }
                expect(message).toContain(`Anzahl der Fehler: ${mismatches.length}.`);
                expect(message).not.toMatch(/Zunächst:|Anschließend:|Darauf aufbauend:|answer\d|richtige Antworten/);
                expect(message.split('<br><br>').length - 1).toBeLessThanOrEqual(3);
            }
        }
    );

    it('places the prerequisites immediately before the questions in lessons and reports', () => {
        for (const [directory, number, name, content] of [
            ['e1-intro-experiment', 1, 'wheelPrerequisite', e1Content.wheelPrerequisite],
            ['e1-intro-experiment', 3, 'eddyCurrentPrerequisite', e1Content.eddyCurrentPrerequisite],
            ['t1-intro-theory', 1, 'realSolutionPrerequisite', t1Content.realSolutionPrerequisite]
        ] as const) {
            const template = readFileSync(join(process.cwd(), 'src/app/features/learning_features', directory, `${directory}.html`), 'utf8');
            expect(template).toMatch(new RegExp(`<p \\[innerHTML\\]="${name}"></p>\\s*<app-multiple-choice(?:-image)?\\s*\\[questionId\\]="question${number}.questionId"`));
            const question = (questionGroups[directory === 't1-intro-theory' ? 3 : 0] as Record<string, AnyQuestion>)[`question${number}`];
            const page = PAGE_REGISTRY.find(p => p.blocks.some(b => b.type === 'question' && b.questionId === question.questionId))!;
            const index = page.blocks.findIndex(b => b.type === 'question' && b.questionId === question.questionId);
            expect(page.blocks[index - 1]).toEqual({ type: 'text', html: content });
        }
    });

    it('keeps E3 Q2 incorrect without requiring phase analysis and E3 Q3 independent of time direction', () => {
        expect(e3Questions.question2.options[1].label).toContain('stationäre Anteil');
        expect(e3Questions.question2.correctAnswers).not.toContain('answer2');
        expect(JSON.stringify(e3Questions.question2.answerFeedback)).not.toMatch(/Phase|ungedämpft/);
        expect(JSON.stringify(e3Questions.question3)).not.toMatch(/zuletzt|letzten|früher|innen nach außen/);
    });

    it('explains the remaining amplitude fraction rather than calling the ratio a loss', () => {
        expect(t3Questions.question5.successMessage).toContain('verbleibt');
        expect(t3Questions.question5.successMessage).not.toContain('Amplitudenverlust');
        expect(JSON.stringify(t3Questions.question10.answerFeedback)).not.toMatch(/Abbildung|Rückkehrkurven/);
    });

    it('targets E1 Q6 answer3 at the initial slope and orders the full graph checklist', () => {
        const q = e1Questions.question6;
        const slopeOnly = buildSelectionErrorMessage(['answer4', 'answer3'], q.correctAnswers, '', q.answerFeedback);
        expect(slopeOnly).toContain('waagerechte Tangente');
        expect(slopeOnly).not.toMatch(/Spitze|Anfangsauslenkung|Maxima|Energie/);
        const full = buildSelectionErrorMessage(['answer1', 'answer2', 'answer3', 'answer5', 'answer6'], q.correctAnswers, '', q.answerFeedback);
        expect(full.indexOf('Anfangsauslenkung')).toBeLessThan(full.indexOf('waagerechte Tangente'));
        expect(full.indexOf('waagerechte Tangente')).toBeLessThan(full.indexOf('Maxima'));
        expect(full.indexOf('Maxima')).toBeLessThan(full.indexOf('mechanische Energie'));
        expect(full.split('waagerechte Tangente')).toHaveLength(2);
        expect(full.split('<br><br>')).toHaveLength(4); // Count plus three paragraphs.
    });

    it.each([e3Questions.question4, t4Questions.question7])(
        '$questionId shows initial conditions before system parameters, and only when mismatched', q => {
            const initial = q === e3Questions.question4 ? 'answer2' : 'answer3';
            const parameter = q.correctAnswers[0];
            const selections = [
                [...q.correctAnswers, initial], // One initial-state concept.
                q.correctAnswers.filter(a => a !== parameter), // One parameter concept.
                [...q.correctAnswers.filter(a => a !== parameter), initial] // Both connected concepts.
            ];
            const messages = selections.map(selected => buildSelectionErrorMessage(selected, q.correctAnswers, '', q.answerFeedback));
            expect(messages[0]).toContain('Anfangsauslenkung');
            expect(messages[0]).not.toContain('Grundgröße');
            expect(messages[1]).toContain('Grundgröße');
            expect(messages[1]).not.toContain('Anfangsauslenkung');
            expect(messages[2].indexOf('Anfangsauslenkung')).toBeLessThan(messages[2].indexOf('Grundgröße'));
            expect(messages[1]).toContain(q === e3Questions.question4 ? '$N=A/\\Theta$' : '$N=M/\\Theta$');
        }
    );

    it('orders static reasoning, geometry and required quantities in E1 Q4', () => {
        const q = e1Questions.question4;
        const output = buildSelectionErrorMessage(['answer1', 'answer2', 'answer3', 'answer7'], q.correctAnswers, '', q.answerFeedback);
        expect(output.indexOf('statischen Gleichgewicht')).toBeLessThan(output.indexOf('Hebelarm'));
        expect(output.indexOf('Hebelarm')).toBeLessThan(output.indexOf('nach $D$'));
        expect(output.split('statischen Gleichgewicht')).toHaveLength(2);
    });

    it('orders frequency before phase and describes the real part only once', () => {
        const q = t4Questions.question10;
        const output = buildSelectionErrorMessage(['answer1', 'answer2', 'answer4'], q.correctAnswers, '', q.answerFeedback);
        expect(output.indexOf('links oder rechts')).toBeLessThan(output.indexOf('Die Phase wächst'));
        const ansatz = t4Questions.question4;
        const feedback = buildSelectionErrorMessage(['answer1', 'answer2', 'answer4'], ansatz.correctAnswers, '', ansatz.answerFeedback);
        expect(feedback.split('Realteil')).toHaveLength(2);
        expect(feedback.split('Exponentialfunktion')).toHaveLength(2);
    });

    it.each([e3Questions.question5, e3Questions.question6])(
        '$questionId supplies the revised hint for every incorrect radio option', q => {
            for (const option of q.options) {
                if (option.value === q.correctAnswer) continue;
                expect(q.answerFeedback?.[option.value]).toBeTruthy();
            }
            if (q === e3Questions.question5) {
                expect(q.answerFeedback?.['answer2']).toContain('Bei gleicher Amplitude und Frequenz');
            } else {
                expect(q.answerFeedback?.['answer1']).toContain('Breite des Resonanzmaximums');
                expect(q.answerFeedback?.['answer2']).toContain('zwischen zwei Messpunkten');
            }
        }
    );
});
