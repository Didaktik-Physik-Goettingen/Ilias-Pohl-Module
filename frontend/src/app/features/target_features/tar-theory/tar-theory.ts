import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { SummaryService, SummaryData, SummaryQuestion } from '../../../core/services/summary.service';
import { Session } from '../../../core/services/session';



declare global {
    interface Window { MathJax: any; }
}

export interface ModuleGroup {
    moduleId: string;
    moduleLabel: string;
    questions: SummaryQuestion[];
}



@Component({
    selector: 'app-tar-theory',
    imports: [],
    templateUrl: './tar-theory.html',
    styleUrl: './tar-theory.css',
})
export class TarTheory implements OnInit {
    summary: SummaryData = {
        sessionId:         '',
        generatedAt:       new Date().toISOString(),
        pageVisits:        [],
        learningQuestions: [],
        tests:             [],
    };

    moduleGroups: ModuleGroup[] = [];
    generatedAtLabel = '';

    openSections: Record<'pages' | 'questions' | 'tests', boolean> = {
        pages:     false,
        questions: false,
        tests:     false,
    };

    toggleSection(section: 'pages' | 'questions' | 'tests') {
        this.openSections[section] = !this.openSections[section];
        if (this.openSections[section]) {
            setTimeout(() => this.renderMath(), 150);
        }
    }

    isImagePath(s: string): boolean {
        return /^assets\//.test(s) || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(s);
    }

    isGeneratingReport = false;
    reportError = false;

    constructor(
        public devMode: DevModeService,
        private router: Router,
        private summaryService: SummaryService,
        private sessionService: Session,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    get canDownloadReport(): boolean {
        return this.sessionService.hasValidSession() && !this.sessionService.isRogueUser();
    }

    async downloadReport(): Promise<void> {
        if (this.isGeneratingReport) return;
        this.isGeneratingReport = true;
        this.reportError = false;
        try {
            const url = new URL('api/report', document.baseURI).href;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.summary),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `lernpfad-${this.summary.sessionId || 'export'}.pdf`;
            link.click();
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            console.error('Lernpfad-Download fehlgeschlagen:', err);
            this.reportError = true;
        } finally {
            this.isGeneratingReport = false;
        }
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.summary = this.summaryService.getSummaryData();
            this.generatedAtLabel = new Date(this.summary.generatedAt).toLocaleString('de-DE');
            this.buildModuleGroups();
            setTimeout(() => this.renderMath(), 400);
        }
    }

    private buildModuleGroups() {
        const map = new Map<string, ModuleGroup>();
        for (const q of this.summary.learningQuestions) {
            if (!map.has(q.moduleId)) {
                map.set(q.moduleId, { moduleId: q.moduleId, moduleLabel: q.moduleLabel, questions: [] });
            }
            map.get(q.moduleId)!.questions.push(q);
        }
        this.moduleGroups = Array.from(map.values());
    }

    renderMath() {
        if (isPlatformBrowser(this.platformId) && window.MathJax) {
            window.MathJax.typesetPromise().catch((err: any) => console.error('MathJax error:', err));
        }
    }

    get hasData(): boolean {
        return this.summary.pageVisits.length > 0
            || this.moduleGroups.length > 0
            || this.summary.tests.length > 0;
    }

    formatDuration(seconds: number): string {
        if (seconds < 60) return `${seconds} s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins} min ${secs} s` : `${mins} min`;
    }

    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/learning/t-setup']);
    }
}
