import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';



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
    private readonly STORAGE_KEY = 'module-results';



    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.loadFromStorage();
        }
    }



    // Module tracking
    startModule(moduleId: string) {
        const sessionId = this.sessionService.getSessionId();
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

        const sessionId = this.sessionService.getSessionId();
        if (!sessionId) {
            console.warn('No session ID available');
            return;
        }

        const moduleProgress = this.results.get(this.currentModuleId);
        if (!moduleProgress) return;

        // check if question was already answered
        const existingResult = moduleProgress.results.find(r => r.questionId === questionId);
        
        if (existingResult) {
            // re-attempt
            existingResult.attemptCount++;
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
        const currentSessionId = this.sessionService.getSessionId();
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
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        }
    }


    private loadFromStorage() {
        if (this.isBrowser) {
            const stored = localStorage.getItem(this.STORAGE_KEY);
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
                    sessionId: this.sessionService.getSessionId(),
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

	
    // Populate the in-memory map from flat backend rows (grouped by module_id).
    restoreFromBackend(rows: any[]): void {
        const grouped = new Map<string, any[]>();
        for (const row of rows) {
            if (!grouped.has(row.module_id)) grouped.set(row.module_id, []);
            grouped.get(row.module_id)!.push(row);
        }

        for (const [moduleId, moduleRows] of grouped) {
            const results: QuestionResult[] = moduleRows.map(r => ({
                questionId:      r.question_id,
                moduleId:        r.module_id,
                isCorrect:       Boolean(r.is_correct),
                selectedAnswers: r.selected_answers ?? [],
                correctAnswers:  r.correct_answers  ?? [],
                timestamp:       new Date(r.answered_at).getTime(),
                timestampISO:    r.answered_at,
                attemptCount:    r.attempt_count,
                sessionId:       r.session_id
            }));

            this.results.set(moduleId, {
                moduleId,
                sessionId:         moduleRows[0].session_id,
                startTime:         new Date(moduleRows[0].answered_at).getTime(),
                questionsAnswered: results.length,
                questionsCorrect:  results.filter(r => r.isCorrect).length,
                results
            });
        }

        this.saveToStorage();
        console.log('Module results restored from backend.');
    }


    // Cleanup
    clearResults() {
        this.results.clear();
        if (this.isBrowser) {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        console.log('All results cleared');
    }
}