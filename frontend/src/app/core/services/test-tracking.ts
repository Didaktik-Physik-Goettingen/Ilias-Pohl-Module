import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { AttemptOutbox, AttemptRow } from './attempt-outbox';



export interface TestQuestionResult {
    questionId: string;
    testId: string;
    isCorrect: boolean;
    userAnswer: any;
    correctAnswer: any;
    pointsAwarded: number;
    maxPoints: number;
    timestamp: number;
    timestampISO: string;
    sessionId: string;
    questionText?: string;
    questionInstruction?: string;
    userAnswerTexts?: string[];
    correctAnswerTexts?: string[];
}



export interface TestProgress {
    testId: string;
    sessionId: string;
    startTime: number;
    endTime?: number;
    totalTimeSpent?: number;
    totalTimeSpent_s?: number;
    questionsAnswered: number;
    totalQuestions: number;
    pointsEarned: number;
    maxPoints: number;
    percentageScore?: number;
    results: TestQuestionResult[];
}



@Injectable({
    providedIn: 'root'
})
export class TestTracking {
    private isBrowser: boolean;
    private currentTestId: string = '';
    private testStartTime: number = 0;
    private tests: Map<string, TestProgress> = new Map();


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session,
        private outbox: AttemptOutbox
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.loadFromStorage();
        }
    }


    // per student: on a shared computer the next student must not inherit (and save) these answers
    private get storageKey(): string {
        return 'test-results_' + (this.sessionService.sessionId() ?? 'unknown');
    }


    // Start tracking a test
    startTest(testId: string, totalQuestions: number, maxPoints: number) {
        const sessionId = this.sessionService.sessionId();
        if (!sessionId) {
            console.warn('No session ID available for test tracking');
            return;
        }

        this.currentTestId = testId;
        this.testStartTime = Date.now();

        if (!this.tests.has(testId)) {
            this.tests.set(testId, {
                testId,
                sessionId,
                startTime: this.testStartTime,
                questionsAnswered: 0,
                totalQuestions,
                pointsEarned: 0,
                maxPoints,
                results: []
            });
        } else {
            // the test page knows the real totals; an entry restored from the backend only knows the answered questions
            const existing = this.tests.get(testId)!;
            existing.totalQuestions = totalQuestions;
            existing.maxPoints = maxPoints;
        }

        console.log(`Started tracking test: ${testId} with ${totalQuestions} questions (${maxPoints} points)`);
    }


    // track a question result (can only be submitted once)
    trackQuestionResult(
        questionId: string,
        isCorrect: boolean,
        userAnswer: any,
        correctAnswer: any,
        pointsAwarded: number,
        maxPoints: number,
        meta?: { questionText?: string; questionInstruction?: string; userAnswerTexts?: string[]; correctAnswerTexts?: string[] }
    ) {
        if (!this.currentTestId) {
            console.warn('No test started. Call startTest() first.');
            return;
        }

        const sessionId = this.sessionService.sessionId();
        if (!sessionId) {
            console.warn('No session ID available');
            return;
        }

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return;

        // check if question was already answered (should not happen in tests)
        const existingResult = testProgress.results.find(r => r.questionId === questionId);
        
        if (existingResult) {
            console.warn(`Question ${questionId} already answered. Tests allow only one submission.`);
            return;
        }

        // add new result
        const result: TestQuestionResult = {
            questionId,
            testId: this.currentTestId,
            isCorrect,
            userAnswer,
            correctAnswer,
            pointsAwarded,
            maxPoints,
            timestamp: Date.now(),
            timestampISO: new Date().toISOString(),
            sessionId,
            questionText:       meta?.questionText,
            questionInstruction: meta?.questionInstruction,
            userAnswerTexts:    meta?.userAnswerTexts,
            correctAnswerTexts: meta?.correctAnswerTexts,
        };

        testProgress.results.push(result);
        testProgress.questionsAnswered++;
        testProgress.pointsEarned += pointsAwarded;

        console.log(`Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'} (${pointsAwarded}/${maxPoints} points)`);
        console.log('TESTLOG:', result);

        this.outbox.add({
            kind: 'test',
            unitId: this.currentTestId,
            questionId,
            attemptNo: 1,
            isCorrect,
            pointsAwarded,
            maxPoints,
            answer: userAnswer,
            correctAnswer,
            texts: {
                questionText: meta?.questionText,
                questionInstruction: meta?.questionInstruction,
                answerTexts: meta?.userAnswerTexts,
                correctAnswerTexts: meta?.correctAnswerTexts
            },
            answeredAt: result.timestamp
        });

        this.saveToStorage();
    }


    // End tracking for current test
    endTest() {
        if (!this.currentTestId) return;

        const testProgress = this.tests.get(this.currentTestId);
        if (testProgress) {
            testProgress.endTime = Date.now();
            testProgress.totalTimeSpent = testProgress.endTime - testProgress.startTime;
            testProgress.totalTimeSpent_s = testProgress.totalTimeSpent / 1000;
            testProgress.percentageScore = (testProgress.pointsEarned / testProgress.maxPoints) * 100;

            this.saveToStorage();

            console.log(`Test ${this.currentTestId} completed`);
            console.log(`Score: ${testProgress.pointsEarned}/${testProgress.maxPoints} (${testProgress.percentageScore.toFixed(1)}%)`);
            console.log(`Time: ${testProgress.totalTimeSpent_s}s`);
        }
    }


    // Query methods - NEW: Restoration support
    isQuestionAnswered(questionId: string): boolean {
        if (!this.currentTestId) return false;

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return false;

        return testProgress.results.some(r => r.questionId === questionId);
    }


    getQuestionResult(questionId: string): TestQuestionResult | undefined {
        if (!this.currentTestId) return undefined;

        const testProgress = this.tests.get(this.currentTestId);
        if (!testProgress) return undefined;

        return testProgress.results.find(r => r.questionId === questionId);
    }


    getTestResults(testId: string): TestProgress | undefined {
        return this.tests.get(testId);
    }


    // every question submitted; percentageScore can't tell, endTest() also writes it for a test left half-way
    isTestFinished(testId: string): boolean {
        const test = this.tests.get(testId);
        return !!test && test.questionsAnswered >= test.totalQuestions;
    }


    getAllTests(): TestProgress[] {
        return Array.from(this.tests.values());
    }


    getSessionTests(): TestProgress[] {
        const currentSessionId = this.sessionService.sessionId();
        if (!currentSessionId) return [];

        return Array.from(this.tests.values())
            .filter(test => test.sessionId === currentSessionId);
    }


    // Export methods
    exportTests(): string {
        return JSON.stringify(this.getAllTests(), null, 2);
    }

    // Storage methods
    private saveToStorage() {
        if (this.isBrowser) {
            const data = Array.from(this.tests.entries());
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
    }


    private loadFromStorage() {
        if (this.isBrowser) {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.tests = new Map(data);
                } catch (e) {
                    console.error('Failed to load test results from storage', e);
                }
            }
        }
    }


    // Backend communication
    async sendToBackend(endpoint: string = 'http://localhost:3000/api/tests') {
        if (!this.isBrowser) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionService.sessionId(),
                    tests: this.getAllTests(),
                    timestamp: new Date().toISOString()
                })
            });

            const result = await response.json();
            console.log('Test results sent to backend:', result);
        } catch (error) {
            console.error('Failed to send test results:', error);
        }
    }


    // Merges the answers from the backend; an answer only known locally, not yet saved, stays.
    restoreFromBackend(rows: AttemptRow[]): void {
        const sessionId = this.sessionService.sessionId() ?? 'unknown';
        const grouped = new Map<string, AttemptRow[]>();
        for (const row of rows) {
            if (!grouped.has(row.unitId)) grouped.set(row.unitId, []);
            grouped.get(row.unitId)!.push(row);
        }

        for (const [testId, testRows] of grouped) {
            // the page's startTest() may have run already (a cold load onto a test page): keep its real totals
            const existing = this.tests.get(testId);
            const results: TestQuestionResult[] = [...(existing?.results ?? [])];

            for (const r of testRows) {
                if (results.some(known => known.questionId === r.questionId)) continue;
                results.push({
                    questionId:          r.questionId,
                    testId,
                    isCorrect:           r.isCorrect,
                    userAnswer:          r.answer,
                    correctAnswer:       r.correctAnswer,
                    pointsAwarded:       r.pointsAwarded ?? 0,
                    maxPoints:           r.maxPoints ?? 0,
                    timestamp:           r.answeredAt,
                    timestampISO:        new Date(r.answeredAt).toISOString(),
                    sessionId,
                    questionText:        r.texts?.questionText,
                    questionInstruction: r.texts?.questionInstruction,
                    userAnswerTexts:     r.texts?.answerTexts,
                    correctAnswerTexts:  r.texts?.correctAnswerTexts
                });
            }

            const pointsEarned = results.reduce((sum, r) => sum + r.pointsAwarded, 0);
            const maxPoints    = existing?.maxPoints ?? results.reduce((sum, r) => sum + r.maxPoints, 0);

            this.tests.set(testId, {
                testId,
                sessionId,
                startTime:         existing?.startTime ?? testRows[0].answeredAt,
                questionsAnswered: results.length,
                totalQuestions:    existing?.totalQuestions ?? results.length,
                pointsEarned,
                maxPoints,
                percentageScore:   maxPoints > 0 ? (pointsEarned / maxPoints) * 100 : 0,
                results
            });
        }

        this.saveToStorage();
        console.log('Test results restored from backend.');
    }


    // Cleanup
    clearTests() {
        this.tests.clear();
        if (this.isBrowser) {
            localStorage.removeItem(this.storageKey);
        }
        console.log('All test results cleared');
    }
}