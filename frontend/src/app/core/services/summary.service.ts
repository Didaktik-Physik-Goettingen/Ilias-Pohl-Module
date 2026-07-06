import { Injectable } from '@angular/core';
import { ResultsTracking } from './results-tracking';
import { TestTracking } from './test-tracking';
import { Analytics } from './analytics';



export interface SummaryPageVisit {
    page: string;
    label: string;
    durationSeconds: number;
}

export interface SummaryQuestion {
    moduleId: string;
    moduleLabel: string;
    questionId: string;
    questionText: string;
    selectedAnswerTexts: string[];
    correctAnswerTexts: string[];
    isCorrect: boolean;
    attemptCount: number;
}

export interface SummaryTestQuestion {
    questionId: string;
    questionInstruction: string;
    questionText: string;
    userAnswerTexts: string[];
    correctAnswerTexts: string[];
    isCorrect: boolean;
    pointsAwarded: number;
    maxPoints: number;
}

export interface SummaryTestResult {
    testId: string;
    testLabel: string;
    pointsEarned: number;
    maxPoints: number;
    percentageScore: number;
    questions: SummaryTestQuestion[];
}

export interface SummaryData {
    sessionId: string;
    generatedAt: string;
    pageVisits: SummaryPageVisit[];
    learningQuestions: SummaryQuestion[];
    tests: SummaryTestResult[];
}



@Injectable({
    providedIn: 'root'
})
export class SummaryService {
    private readonly MODULE_LABELS: Record<string, string> = {
        'intro-experiment':   'E1: Einführung in den Versuchsaufbau',
        'damped_oscillations': 'E2: Gedämpfte Schwingungen',
        'driven_oscillations': 'E3: Getriebene Schwingungen',
    };

    private readonly TEST_LABELS: Record<string, string> = {
        'damped-oscillations':   'Test: Gedämpfte Schwingungen',
        'e-driven-oscillations': 'Test: Getriebene Schwingungen',
    };

    private readonly PAGE_TOTALS: Record<string, number> = {
        '/learning/e1-intro-experiment':  4,
        '/learning/e2-damped-oscillations': 3,
        '/learning/e3-driven-oscillations': 7,
        '/test/e-driven-osc':             5,
    };

    private readonly PAGE_LABELS: Record<string, string> = {
        '/':                                                       'Startseite: Pohlsches Rad',
        '/learning/e1-intro-experiment':                           '[E] Einstieg Experimentalpfad',
        '/learning/e2-damped-oscillations':                        '[E] Gedämpfte Schwingungen',
        '/learning/e3-driven-oscillations':                        '[E] Getriebene Schwingungen',
        '/decision/e-damped-oscillations':                         '[E] Entscheidung: Gedämpfte Schwingungen',
        '/decision/e-driven-oscillations':                         '[E] Entscheidung: Getriebene Schwingungen',
        '/test/e-damped-osc':                                      '[E] Test: Gedämpfte Schwingungen',
        '/test/e-driven-osc':                                      '[E] Test: Getriebene Schwingungen',
        '/test/t-damped-osc':                                      '[T] Test: Gedämpfte Schwingungen',
        '/test/t-driven-osc':                                      '[T] Test: Getriebene Schwingungen',
        '/simulation/sim-e-damped-osc':                            '[E] Simulation: Gedämpfte Schwingungen',
        '/simulation/sim-e-driven-osc':                            '[E] Simulation: Getriebene Schwingungen',
        '/target/tar-experiment':                                  '[E] Anleitung Experimentalpfad',
        // '/simulation/theory-undamped':                             'Simulation: Ungedämpfte Schwingung',
        // '/simulation/theory-damped':                               'Simulation: Gedämpfte Schwingung',
        // '/simulation/theory-damped-driven':                        'Simulation: Gedämpfte getriebene Schwingung',
        // '/simulation/theory-damped-driven-davanced':               'Simulation: Gedämpfte getriebene Drehschwingung',
        // '/simulation/experiment-damped-driven':                    'Simulation: Getriebene Drehschwingung (Einleitung)',
        // '/simulation/experiment-damped-driven-advanced':           'Simulation: Getriebene Drehschwingung (Vertiefung)',
    };

    constructor(
        private resultsTracking: ResultsTracking,
        private testTracking: TestTracking,
        private analytics: Analytics,
    ) {}

    getSummaryData(): SummaryData {
        const sessionData = this.analytics.getSessionData();

        const pageVisits: SummaryPageVisit[] = sessionData.visits
            .filter(v => v.duration_s !== undefined && v.duration_s > 2 && !v.page.startsWith('/target/'))
            .map(v => {
                const qIdx = v.page.indexOf('?');
                const basePath = qIdx >= 0 ? v.page.slice(0, qIdx) : v.page;
                const params = qIdx >= 0 ? new URLSearchParams(v.page.slice(qIdx + 1)) : null;
                const pageNum = params?.get('page') ?? (this.PAGE_TOTALS[basePath] !== undefined ? '1' : null);
                const baseLabel = this.PAGE_LABELS[basePath] ?? basePath;
                const total = pageNum ? (this.PAGE_TOTALS[basePath] ?? null) : null;
                const label = pageNum && total ? `${baseLabel} (${pageNum}/${total})` : baseLabel;
                return { page: v.page, label, durationSeconds: Math.round(v.duration_s!) };
            });

        const learningQuestions: SummaryQuestion[] = [];
        for (const module of this.resultsTracking.getSessionResults()) {
            const moduleLabel = this.MODULE_LABELS[module.moduleId] ?? module.moduleId;
            for (const q of module.results) {
                learningQuestions.push({
                    moduleId:            module.moduleId,
                    moduleLabel,
                    questionId:          q.questionId,
                    questionText:        q.questionText ?? q.questionId,
                    selectedAnswerTexts: q.selectedAnswerTexts ?? q.selectedAnswers,
                    correctAnswerTexts:  q.correctAnswerTexts ?? q.correctAnswers,
                    isCorrect:           q.isCorrect,
                    attemptCount:        q.attemptCount,
                });
            }
        }

        const tests: SummaryTestResult[] = this.testTracking.getSessionTests().map(t => ({
            testId:          t.testId,
            testLabel:       this.TEST_LABELS[t.testId] ?? t.testId,
            pointsEarned:    t.pointsEarned,
            maxPoints:       t.maxPoints,
            percentageScore: t.percentageScore ?? (t.maxPoints > 0 ? (t.pointsEarned / t.maxPoints) * 100 : 0),
            questions:       t.results.map(r => ({
                questionId:          r.questionId,
                questionInstruction: r.questionInstruction ?? r.questionId,
                questionText:        r.questionText ?? r.questionInstruction ?? r.questionId,
                userAnswerTexts:     r.userAnswerTexts ?? [],
                correctAnswerTexts:  r.correctAnswerTexts ?? [],
                isCorrect:           r.isCorrect,
                pointsAwarded:       r.pointsAwarded,
                maxPoints:           r.maxPoints,
            })),
        }));

        return {
            sessionId:         sessionData.sessionId,
            generatedAt:       new Date().toISOString(),
            pageVisits,
            learningQuestions,
            tests,
        };
    }
}
