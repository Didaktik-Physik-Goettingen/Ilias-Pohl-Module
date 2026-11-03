import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { AttemptOutbox, AttemptRow } from './attempt-outbox';



export interface QuestionResult {
    questionId: string;
    moduleId: string;
    isCorrect: boolean;
    selectedAnswers: string[];
    correctAnswers: string[];
    questionText?: string;
    selectedAnswerTexts?: string[];
    correctAnswerTexts?: string[];
    timestamp: number;
    timestampISO: string;
    attemptCount: number;
    sessionId: string;
}



export interface ModuleProgress {
    moduleId: string;
    sessionId: string;
    startTime: number;
    endTime?: number;
    totalTimeSpent?: number;
    totalTimeSpent_s?: number;
    questionsAnswered: number;
    questionsCorrect: number;
    results: QuestionResult[];
}



@Injectable({
    providedIn: 'root'
})
export class ResultsTracking {
    private isBrowser: boolean;
    private currentModuleId: string = '';
    private moduleStartTime: number = 0;
    private results: Map<string, ModuleProgress> = new Map();



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
        return 'module-results_' + (this.sessionService.sessionId() ?? 'unknown');
    }



    // Module tracking
    startModule(moduleId: string) {
        const sessionId = this.sessionService.sessionId();
        if (!sessionId) {
            console.warn('No session ID available for results tracking');
            return;
        }

        this.currentModuleId = moduleId;
        this.moduleStartTime = Date.now();

        if (!this.results.has(moduleId)) {
            this.results.set(moduleId, {
                moduleId,
                sessionId,
                startTime: this.moduleStartTime,
                questionsAnswered: 0,
                questionsCorrect: 0,
                results: []
            });
        }

        console.log(`Started tracking module: ${moduleId} in session: ${sessionId}`);
    }



    endModule() {
        if (!this.currentModuleId) return;

        const moduleProgress = this.results.get(this.currentModuleId);
        if (moduleProgress) {
            moduleProgress.endTime = Date.now();
            moduleProgress.totalTimeSpent = moduleProgress.endTime - moduleProgress.startTime;
            moduleProgress.totalTimeSpent_s = moduleProgress.totalTimeSpent / 1000;
            
            this.saveToStorage();
            
            console.log(`Module ${this.currentModuleId} completed`);
            console.log(`Time: ${moduleProgress.totalTimeSpent_s}s | Correct: ${moduleProgress.questionsCorrect}/${moduleProgress.questionsAnswered}`);
        }
    }



    // question tracking
    trackQuestionResult(
        questionId: string,
        isCorrect: boolean,
        selectedAnswers: string[],
        correctAnswers: string[],
        meta?: { questionText?: string; selectedAnswerTexts?: string[]; correctAnswerTexts?: string[] }
    ) {
        if (!this.currentModuleId) {
            console.warn('No module started. Call startModule() first.');
            return;
        }

        const sessionId = this.sessionService.sessionId();
        if (!sessionId) {
            console.warn('No session ID available');
            return;
        }

        const moduleProgress = this.results.get(this.currentModuleId);
        if (!moduleProgress) return;

        // check if question was already answered
        const existingResult = moduleProgress.results.find(r => r.questionId === questionId);
        let attemptNo = 1;
        
        if (existingResult) {
            // re-attempt
            existingResult.attemptCount++;
            attemptNo = existingResult.attemptCount;
            existingResult.isCorrect = isCorrect;
            existingResult.selectedAnswers = selectedAnswers;
            existingResult.timestamp = Date.now();
            existingResult.timestampISO = new Date().toISOString();
            if (meta?.questionText !== undefined) existingResult.questionText = meta.questionText;
            if (meta?.selectedAnswerTexts !== undefined) existingResult.selectedAnswerTexts = meta.selectedAnswerTexts;
            if (meta?.correctAnswerTexts !== undefined) existingResult.correctAnswerTexts = meta.correctAnswerTexts;
            
            console.log(`${sessionId} tried ${questionId} on attempt ${existingResult.attemptCount}, result: ${isCorrect}`);
            console.log('RESLOG:', existingResult);
        } else {
            // first attempt
            const result: QuestionResult = {
                questionId,
                moduleId: this.currentModuleId,
                isCorrect,
                selectedAnswers,
                correctAnswers,
                questionText: meta?.questionText,
                selectedAnswerTexts: meta?.selectedAnswerTexts,
                correctAnswerTexts: meta?.correctAnswerTexts,
                timestamp: Date.now(),
                timestampISO: new Date().toISOString(),
                attemptCount: 1,
                sessionId
            };
            
            moduleProgress.results.push(result);
            moduleProgress.questionsAnswered++;
            
            console.log(`${sessionId} tried ${questionId}, result: ${isCorrect}`);
            console.log('RESLOG:', result);
        }

        if (isCorrect) {
            moduleProgress.questionsCorrect++;
        }

        this.outbox.add({
            kind: 'learning',
            unitId: this.currentModuleId,
            questionId,
            attemptNo,
            isCorrect,
            answer: selectedAnswers,
            correctAnswer: correctAnswers,
            texts: {
                questionText: meta?.questionText,
                answerTexts: meta?.selectedAnswerTexts,
                correctAnswerTexts: meta?.correctAnswerTexts
            },
            answeredAt: Date.now()
        });

        this.saveToStorage();
    }


    // query methods
    isQuestionCompleted(questionId: string): boolean {
        if (!this.currentModuleId) return false;

        const moduleProgress = this.results.get(this.currentModuleId);
        if (!moduleProgress) return false;

        const result = moduleProgress.results.find(r => r.questionId === questionId);
        return result ? result.isCorrect : false;
    }


    getQuestionResult(questionId: string): QuestionResult | undefined {
        if (!this.currentModuleId) return undefined;

        const moduleProgress = this.results.get(this.currentModuleId);
        if (!moduleProgress) return undefined;

        return moduleProgress.results.find(r => r.questionId === questionId);
    }


    getModuleResults(moduleId: string): ModuleProgress | undefined {
        return this.results.get(moduleId);
    }


    getAllResults(): ModuleProgress[] {
        return Array.from(this.results.values());
    }


    getSessionResults(): ModuleProgress[] {
        const currentSessionId = this.sessionService.sessionId();
        if (!currentSessionId) return [];

        return Array.from(this.results.values())
            .filter(module => module.sessionId === currentSessionId);
    }


    // Export methods
    exportResults(): string {
        return JSON.stringify(this.getAllResults(), null, 2);
    }


    // Storage methods
    private saveToStorage() {
        if (this.isBrowser) {
            const data = Array.from(this.results.entries());
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
    }


    private loadFromStorage() {
        if (this.isBrowser) {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.results = new Map(data);
                } catch (e) {
                    console.error('Failed to load results from storage', e);
                }
            }
        }
    }


    // Backend communication
    async sendToBackend(endpoint: string = 'http://localhost:3000/api/results') {
        if (!this.isBrowser) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionService.sessionId(),
                    results: this.getAllResults(),
                    timestamp: new Date().toISOString()
                })
            });

            const result = await response.json();
            console.log('Results sent to backend:', result);
        } catch (error) {
            console.error('Failed to send results:', error);
        }
    }

	
    // Merges the latest attempt per question from the backend; a newer local attempt not yet saved stays.
    restoreFromBackend(rows: AttemptRow[]): void {
        const sessionId = this.sessionService.sessionId() ?? 'unknown';

        for (const row of rows) {
            const module = this.results.get(row.unitId) ?? {
                moduleId:          row.unitId,
                sessionId,
                startTime:         row.answeredAt,
                questionsAnswered: 0,
                questionsCorrect:  0,
                results:           []
            };
            this.results.set(row.unitId, module);

            const index = module.results.findIndex(r => r.questionId === row.questionId);
            if (index >= 0 && module.results[index].attemptCount >= row.attemptNo) continue;

            const result: QuestionResult = {
                questionId:          row.questionId,
                moduleId:            row.unitId,
                isCorrect:           row.isCorrect,
                selectedAnswers:     row.answer ?? [],
                correctAnswers:      row.correctAnswer ?? [],
                questionText:        row.texts?.questionText,
                selectedAnswerTexts: row.texts?.answerTexts,
                correctAnswerTexts:  row.texts?.correctAnswerTexts,
                timestamp:           row.answeredAt,
                timestampISO:        new Date(row.answeredAt).toISOString(),
                attemptCount:        row.attemptNo,
                sessionId
            };
            if (index >= 0) module.results[index] = result;
            else module.results.push(result);

            module.questionsAnswered = module.results.length;
            module.questionsCorrect  = module.results.filter(r => r.isCorrect).length;
        }

        this.saveToStorage();
        console.log('Module results restored from backend.');
    }


    // Cleanup
    clearResults() {
        this.results.clear();
        if (this.isBrowser) {
            localStorage.removeItem(this.storageKey);
        }
        console.log('All results cleared');
    }
}