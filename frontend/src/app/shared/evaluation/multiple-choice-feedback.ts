import { AdaptiveAnswerHint, AnswerFeedback } from './question.types';

export interface SelectionErrorBreakdown {
    selectedIncorrect: string[];
    missedCorrect: string[];
    total: number;
}

export function getSelectionErrorBreakdown(
    selectedAnswers: string[],
    correctAnswers: string[]
): SelectionErrorBreakdown {
    const selected = new Set(selectedAnswers);
    const correct = new Set(correctAnswers);
    const selectedIncorrect = [...selected].filter(answer => !correct.has(answer));
    const missedCorrect = [...correct].filter(answer => !selected.has(answer));

    return {
        selectedIncorrect,
        missedCorrect,
        total: selectedIncorrect.length + missedCorrect.length
    };
}

export function formatSelectionErrorSummary(errors: SelectionErrorBreakdown): string {
    return `Anzahl der Fehler: ${errors.total}.`;
}

export function buildSelectionErrorMessage(
    selectedAnswers: string[],
    correctAnswers: string[],
    statusMessage: string,
    answerFeedback?: AnswerFeedback
): string {
    if (selectedAnswers.length === 0) {
        return 'Bitte wählen Sie mindestens eine Antwort aus.';
    }

    const errors = getSelectionErrorBreakdown(selectedAnswers, correctAnswers);
    const summary = formatSelectionErrorSummary(errors);
    if (errors.total === 0) {
        return [summary, statusMessage].filter(Boolean).join('<br><br>');
    }

    const feedbackOrder = new Map(
        Object.keys(answerFeedback ?? {}).map((answer, index) => [answer, index])
    );
    const mismatches = [...errors.selectedIncorrect, ...errors.missedCorrect];
    const concepts = new Map<string, AdaptiveAnswerHint & { order: number }>();
    let hasUnexplainedMismatch = false;

    for (const answer of mismatches) {
        const feedback = answerFeedback?.[answer];
        if (!feedback) {
            hasUnexplainedMismatch = true;
            continue;
        }
        const answerHints = Array.isArray(feedback) ? feedback : [feedback];
        for (const feedbackHint of answerHints) {
            const hint: AdaptiveAnswerHint = typeof feedbackHint === 'string'
                ? { message: feedbackHint }
                : feedbackHint;
            const conceptId = hint.conceptId ?? normaliseConceptId(hint.message);
            const order = hint.order ?? feedbackOrder.get(answer) ?? Number.MAX_SAFE_INTEGER;
            const existing = concepts.get(conceptId);
            if (!existing || order < existing.order) {
                concepts.set(conceptId, { ...hint, order });
            }
        }
    }
    if (hasUnexplainedMismatch && statusMessage) {
        concepts.set('__general', {
            conceptId: '__general',
            message: statusMessage,
            order: -1
        });
    }

    const orderedConcepts = [...concepts.entries()]
        .sort(([, left], [, right]) => left.order - right.order);
    if (orderedConcepts.length === 0) {
        return [summary, statusMessage].filter(Boolean).join('<br><br>');
    }

    const conceptKey = orderedConcepts.map(([id]) => id).sort().join('+');
    const combined = orderedConcepts
        .map(([, hint]) => hint.combinedFeedback?.[conceptKey])
        .find((message): message is string => Boolean(message));
    if (combined) {
        return `${summary}<br><br>${combined}`;
    }

    const hints = orderedConcepts.map(([, hint]) => hint);
    if (hints.length >= 2 && hints.length <= 3 && hints.every(hint => hint.independent)) {
        const steps = hints.map(hint => `<li>${hint.message}</li>`).join('');
        return `${summary}<br><br><ol>${steps}</ol>`;
    }

    // Related reasoning reads as prose. Transitions belong to the authored hint,
    // rather than being inferred from an option's position in the answer key.
    const paragraphs: string[][] = [];
    let previousParagraphId: string | undefined;
    for (const hint of hints) {
        const paragraphId = hint.paragraphId ?? '__connected';
        if (paragraphs.length === 0 || (paragraphId !== previousParagraphId && paragraphs.length < 3)) {
            paragraphs.push([]);
        }
        paragraphs[paragraphs.length - 1].push(hint.message);
        previousParagraphId = paragraphId;
    }
    return `${summary}<br><br>${paragraphs.map(messages => messages.join(' ')).join('<br><br>')}`;
}

function normaliseConceptId(message: string): string {
    return message.trim().toLocaleLowerCase('de-DE').replace(/\s+/g, ' ');
}
