import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarkQuote, toneOf } from '../../../shared/marks-overlay/mark-quote';
import { UnclearReview } from '../../../shared/unclear-review/unclear-review';
import { DevModeService } from '../../../core/services/dev-mode';
import { SummaryService, SummaryData, SummaryQuestion } from '../../../core/services/summary.service';
import { HtmlReportService } from '../../../core/services/html-report.service';

declare global {
    interface Window { MathJax: any; }
}

export interface ModuleGroup {
    moduleId: string;
    moduleLabel: string;
    questions: SummaryQuestion[];
}

@Component({
    selector: 'app-tar-chaos',
    imports: [MarkQuote, UnclearReview],
    templateUrl: './tar-chaos.html',
    styleUrl: './tar-chaos.css',
})
// Two sub-pages (Carlo, 2026-11-27): ?page=1 (also without the parameter, as every link here has it)
// „Offene Stellen“, the marks the student found unclear; ?page=2 the Anleitung with the Lernpfad.
export class TarChaos implements OnInit, OnDestroy {
    readonly toneOf = toneOf;
    isReview = true;
    private querySub: Subscription | null = null;

    summary: SummaryData = {
        sessionId:         '',
        generatedAt:       new Date().toISOString(),
        pageVisits:        [],
        learningQuestions: [],
        tests:             [],
        marks:             [],
    };

    moduleGroups: ModuleGroup[] = [];
    generatedAtLabel = '';

    openSections: Record<'pages' | 'questions' | 'marks' | 'tests', boolean> = {
        pages:     false,
        questions: false,
        marks:     false,
        tests:     false,
    };

    toggleSection(section: 'pages' | 'questions' | 'marks' | 'tests') {
        this.openSections[section] = !this.openSections[section];
        if (this.openSections[section]) {
            setTimeout(() => this.renderMath(), 150);
        }
    }

    isImagePath(s: string): boolean {
        return /^assets\//.test(s) || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(s);
    }

    constructor(
        public devMode: DevModeService,
        private router: Router,
        private route: ActivatedRoute,
        private summaryService: SummaryService,
        private htmlReportService: HtmlReportService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    async downloadHtmlReport(): Promise<void> {
        await this.htmlReportService.download(this.summary);
    }

    ngOnInit() {
        this.querySub = this.route.queryParamMap.subscribe(params => {
            this.isReview = params.get('page') !== '2';
            // the Lernpfad is read when it is shown, with the marks as they were left on the Offene Stellen
            if (!this.isReview && isPlatformBrowser(this.platformId)) {
                this.summary = this.summaryService.getSummaryData();
                this.generatedAtLabel = new Date(this.summary.generatedAt).toLocaleString('de-DE');
                this.buildModuleGroups();
                setTimeout(() => this.renderMath(), 400);
            }
        });
    }

    ngOnDestroy() {
        this.querySub?.unsubscribe();
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
            || this.summary.marks.length > 0
            || this.summary.tests.length > 0;
    }

    formatDuration(seconds: number): string {
        if (seconds < 60) return `${seconds} s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins} min ${secs} s` : `${mins} min`;
    }

    // from the Offene Stellen: back to where the guide was reached from
    goBack(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/learning/opt-setup'], { queryParams: { next: 'chaos' } });
    }

    goReview(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: '1' }, queryParamsHandling: 'merge' });
    }

    goGuide(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: '2' }, queryParamsHandling: 'merge' });
    }
}
