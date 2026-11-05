import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { STORAGE_PREFIX } from './storage-prefix';



// One submitted answer, as question_attempts stores it.
export interface AttemptRow {
    kind: 'learning' | 'test';
    unitId: string;
    questionId: string;
    attemptNo: number;
    isCorrect: boolean;
    pointsAwarded?: number;
    maxPoints?: number;
    answer: any;
    correctAnswer: any;
    texts: {
        questionText?: string;
        questionInstruction?: string;
        answerTexts?: string[];
        correctAnswerTexts?: string[];
    };
    answeredAt: number;
}



// Every submitted answer waits here until the server has confirmed it, also across reloads.
// Saving is idempotent, so a row sent twice (a response lost at page unload) does no harm.
@Injectable({
    providedIn: 'root'
})
export class AttemptOutbox {
    private isBrowser: boolean;
    private rows: AttemptRow[] = [];


    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private sessionService: Session
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.load();
    }


    private get storageKey(): string {
        return STORAGE_PREFIX + 'attemptOutbox_' + (this.sessionService.sessionId() ?? 'unknown');
    }


    add(row: AttemptRow) {
        if (this.sessionService.isRogueUser()) return;      // nothing of theirs is ever sent
        this.rows.push(row);
        this.save();
    }


    getAll(): AttemptRow[] {
        return [...this.rows];
    }


    remove(sent: AttemptRow[]) {
        this.rows = this.rows.filter(row => !sent.includes(row));
        this.save();
    }


    private load() {
        if (!this.isBrowser) return;
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) this.rows = JSON.parse(stored);
        } catch { /* ignore corrupt data */ }
    }


    private save() {
        if (!this.isBrowser) return;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.rows));
        } catch { /* storage full or blocked: the rows still go out while the page stays open */ }
    }
}
