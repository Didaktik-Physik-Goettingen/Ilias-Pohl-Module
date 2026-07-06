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

    private readonly PAGE_LABELS: Record<string, string> = {
        '/':                                                       'Pohlsches Rad',
        '/learning/e1-intro-experiment':                           'Einstieg Versuchsaufbau',
        '/learning/e2-damped-oscillations':                        'Experiment: Gedämpfte Schwingungen',
        '/learning/e3-driven-oscillations':                        'Experiment: Getriebene Schwingungen',
        '/decision/e-damped-oscillations':                         'Entscheidung: Gedämpfte Schwingungen',
        '/decision/e-driven-oscillations':                         'Entscheidung: Getriebene Schwingungen',
        '/test/e-damped-osc':                                      'Test: Gedämpfte Schwingungen',
        '/test/e-driven-osc':                                      'Test: Getriebene Schwingungen',
        '/test/t-damped-osc':                                      'Test: Gedämpfte Schwingungen',
        '/test/t-driven-osc':                                      'Test: Getriebene Schwingungen',
        '/simulation/sim-e-damped-osc':                            'Simulation: Gedämpfte Schwingungen',
        '/simulation/sim-e-driven-osc':                            'Simulation: Getriebene Schwingungen',
        '/target/tar-experiment':                                  'Anleitung: Versuchsdurchführung',
        '/simulation/theory-undamped':                             'Simulation: Ungedämpfte Schwingung',
        '/simulation/theory-damped':                               'Simulation: Gedämpfte Schwingung',
        '/simulation/theory-damped-driven':                        'Simulation: Gedämpfte getriebene Schwingung',
        '/simulation/theory-damped-driven-davanced':               'Simulation: Gedämpfte getriebene Drehschwingung',
        '/simulation/experiment-damped-driven':                    'Simulation: Getriebene Drehschwingung (Einleitung)',
        '/simulation/experiment-damped-driven-advanced':           'Simulation: Getriebene Drehschwingung (Vertiefung)',
    };

    constructor(
        private resultsTracking: ResultsTracking,
        private testTracking: TestTracking,
        private analytics: Analytics,
    ) {}

    getSummaryData(): SummaryData {
        const sessionData = this.analytics.getSessionData();

        const pageVisits: SummaryPageVisit[] = sessionData.visits
            .filter(v => v.duration_s !== undefined && v.duration_s > 2)
            .map(v => ({
                page: v.page,
                label: this.PAGE_LABELS[v.page] ?? v.page,
                durationSeconds: Math.round(v.duration_s!)
            }));

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
