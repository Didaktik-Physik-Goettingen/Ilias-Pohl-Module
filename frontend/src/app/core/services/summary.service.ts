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
        'e1-intro-experiment-module':           '[E-1] Einstieg Experimentalpfad',
        'e2-damped-oscillations-module':        '[E-2] Gedämpfte Schwingungen',
        'e3-driven-oscillations-module':        '[E-3] Getriebene Schwingungen',

        't1-intro-theory-module':               '[T-1] Einstieg Theoriepfad',
        't2-free-oscillations-module':          '[T-2] Freie Schwingungen',
        't3-damped-oscillations-module':        '[T-3] Gedämpfte Schwingungen',
        't4-driven-oscillations-module':        '[T-4] Getriebene Schwingungen',

        't-setup-module':                       '[T] Versuchsaufbau',
        't-simulation-module':                  '[T] Simulation',
        't-chaos-module':                       '[T] Chaos',

    };

    private readonly TEST_LABELS: Record<string, string> = {
        'e-damped-oscillations-test':    '[E] Test: Gedämpfte Schwingungen',
        'e-driven-oscillations-test':    '[E] Test: Getriebene Schwingungen',
        't-damped-oscillations-test':    '[T] Test: Gedämpfte Schwingungen',
        't-driven-oscillations-test':    '[T] Test: Getriebene Schwingungen',
    };

    private readonly PAGE_TOTALS: Record<string, number> = {
        '/learning/e1-intro-experiment':        4,
        '/learning/e2-damped-oscillations':     3,
        '/learning/e3-driven-oscillations':     7,
        '/learning/t1-intro-theory':            1,
        '/learning/t2-free-oscillations':       2,
        '/learning/t3-damped-oscillations':     5,
        '/learning/t4-driven-oscillations':     8,

        '/test/test-e-damped':                       6,
        '/test/test-e-driven':                       5,
        '/test/test-t-damped':                       6,
        '/test/test-t-driven':                       5,
    };

    private readonly PAGE_LABELS: Record<string, string> = {
        '/':                                                            'Startseite: Pohlsches Rad',
        '/learning/e1-intro-experiment':                                '[E-1] Einstieg Experimentalpfad',
        '/learning/e2-damped-oscillations':                             '[E-2] Gedämpfte Schwingungen',
        '/learning/e3-driven-oscillations':                             '[E-3] Getriebene Schwingungen',
        '/learning/t1-intro-theory':                                    '[T-1] Einstieg Theoriepfad',
        '/learning/t2-free-oscillations':                               '[T-2] Freie Schwingungen',
        '/learning/t3-damped-oscillations':                             '[T-3] Gedämpfte Schwingungen',
        '/learning/t4-driven-oscillations':                             '[T-4] Getriebene Schwingungen',
        '/learning/t-chaos':                                            '[T] Chaos',
        '/learning/t-simulation':                                       '[T] Simulation',
        '/learning/t-setup':                                            '[T] Versuchsaufbau',

        '/decision/dec-e-damped':                                       '[E] Entscheidung: Gedämpfte Schwingungen',
        '/decision/dec-e-driven':                                       '[E] Entscheidung: Getriebene Schwingungen',
        '/decision/dec-t-damped':                                       '[T] Entscheidung: Gedämpfte Schwingungen',
        '/decision/dec-t-driven':                                       '[T] Entscheidung: Getriebene Schwingungen',

        '/test/test-e-damped':                                          '[E] Test: Gedämpfte Schwingungen',
        '/test/test-e-driven':                                          '[E] Test: Getriebene Schwingungen',
        '/test/test-t-damped':                                          '[T] Test: Gedämpfte Schwingungen',
        '/test/test-t-driven':                                          '[T] Test: Getriebene Schwingungen',
        
        '/simulation/sim-e-damped':                                     '[E] Simulation: Gedämpfte Schwingungen',
        '/simulation/sim-e-driven':                                     '[E] Simulation: Getriebene Schwingungen',
        '/simulation/sim-t-undamped':                                   '[T] Simalation: Freie Schwingungen',
        '/simulation/sim-t-damped':                                     '[T] Simulation: Gedämpfte Schwingungen',
        '/simulation/sim-t-driven':                                     '[T] Simulation: Getriebene Schwingungen',
        '/simulation/sim-t-driven-advanced':                            '[T] Simulation: Getriebene Schwingungen (erweitert)',

        '/target/tar-experiment':                                       '[E] Anleitung Experimentalpfad',
        '/target/tar-theory':                                           '[T] Anleitung Theoriepfad',
        '/target/tar-chaos':                                            '[T] Anleitung Chaos',
        '/target/tar-simulation':                                       '[T] Anleitung Simulation',
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
