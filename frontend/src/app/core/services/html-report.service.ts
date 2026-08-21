import { Injectable } from '@angular/core';
import { SummaryData, SummaryQuestion, SummaryTestResult } from './summary.service';
import { PAGE_LOOKUP, PageDefinition, ReportBlock } from './learning-report-registry';

@Injectable({ providedIn: 'root' })
export class HtmlReportService {

    async download(data: SummaryData): Promise<void> {
        const questionMap = this.buildQuestionMap(data);
        const imagePaths = this.collectImagePaths(data, questionMap);
        const imageCache = await this.fetchImages(imagePaths);
        const html = this.generate(data, questionMap, imageCache);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `lernpfad-${data.sessionId || 'export'}.html`;
        link.click();
        URL.revokeObjectURL(url);
    }

    private generate(
        data: SummaryData,
        questionMap: Map<string, SummaryQuestion>,
        imageCache: Map<string, string>,
    ): string {
        const date = new Date(data.generatedAt).toLocaleString('de-DE');
        const pageSections = data.pageVisits
            .filter(v => !v.page.startsWith('/test/'))
            .map(v => this.renderPageVisit(v.page, v.label, v.durationSeconds, questionMap, imageCache))
            .join('\n');

        const testSection = data.tests.length > 0
            ? `<section class="report-section"><h2 class="section-title">Testergebnisse</h2>${data.tests.map(t => this.renderTest(t, imageCache)).join('\n')}</section>`
            : '';

        return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lernpfad-Export</title>
<script>
MathJax = {
    tex: {
        inlineMath:  [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
    },
    options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] }
};
</script>
<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
<style>${CSS}</style>
</head>
<body>
<header class="report-header">
    <h1 class="report-title">Persönlicher Lernpfad</h1>
    <p class="report-meta">Erstellt am ${this.esc(date)}</p>
</header>
<main>
${pageSections}
${testSection}
</main>
</body>
</html>`;
    }

    private renderPageVisit(
        pageUrl: string,
        label: string,
        durationSeconds: number,
        questionMap: Map<string, SummaryQuestion>,
        imageCache: Map<string, string>,
    ): string {
        const { basePath, pageNum } = this.parsePage(pageUrl);
        const key = `${basePath}:${pageNum}`;
        const def = PAGE_LOOKUP.get(key);

        const durationStr = this.formatDuration(durationSeconds);
        if (!def) {
            return `<section class="report-section page-section">
<div class="page-header"><span class="page-title">${this.esc(label)}</span><span class="page-duration">${this.esc(durationStr)}</span></div>
</section>`;
        }
        const subtitle = def.subtitle ? ` – ${this.esc(def.subtitle)}` : '';
        const blocksHtml = def.blocks.map(b => this.renderBlock(b, questionMap, imageCache)).join('\n');
        return `<section class="report-section page-section">
<div class="page-header">
    <span class="page-title">${this.esc(def.title)}${subtitle}</span>
    <span class="page-duration">${this.esc(durationStr)}</span>
</div>
<div class="page-content">
${blocksHtml}
</div>
</section>`;
    }

    private renderBlock(
        block: ReportBlock,
        questionMap: Map<string, SummaryQuestion>,
        imageCache: Map<string, string>,
    ): string {
        switch (block.type) {
            case 'text': {
                const cls = block.style === 'lamp' ? 'block-lamp' : block.style === 'glossary' ? 'block-glossary' : 'block-text';
                return `<div class="${cls}">${block.html}</div>`;
            }
            case 'image': {
                const src = imageCache.get(block.src) ?? block.src;
                const captionHtml = block.caption ? `<figcaption class="img-caption">${block.caption}</figcaption>` : '';
                return `<figure class="block-image"><img src="${src}" alt="${this.esc(block.alt)}">${captionHtml}</figure>`;
            }
            case 'spoiler': {
                return `<div class="block-spoiler"><div class="spoiler-label">Exkurs: ${this.esc(block.label.replace(/^EXKURS:\s*/i, ''))}</div><div class="spoiler-body">${block.html}</div></div>`;
            }
            case 'question': {
                const q = questionMap.get(block.questionId);
                return this.renderQuestion(block.questionId, q, imageCache);
            }
        }
    }

    private renderQuestion(
        questionId: string,
        q: SummaryQuestion | undefined,
        imageCache: Map<string, string>,
    ): string {
        if (!q) {
            return `<div class="block-question question-unanswered"><div class="q-skipped">Aufgabe (${this.esc(questionId)}) – nicht beantwortet</div></div>`;
        }
        const cls = q.isCorrect ? 'question-correct' : 'question-incorrect';
        const indicator = q.isCorrect ? '✓' : '✗';
        const attemptsHtml = q.attemptCount > 1
            ? `<div class="q-attempts">${q.attemptCount} Versuche</div>` : '';

        const selectedHtml = q.selectedAnswerTexts.length === 0
            ? '<span class="q-empty">Keine Antwort</span>'
            : q.selectedAnswerTexts.map(a => this.renderAnswerItem(a, imageCache)).join('');

        const correctHtml = !q.isCorrect && q.correctAnswerTexts.length > 0
            ? `<div class="q-correct-answer"><span class="q-answer-label q-answer-label--correct">Richtige Antwort:</span>${q.correctAnswerTexts.map(a => this.renderAnswerItem(a, imageCache)).join('')}</div>`
            : '';

        return `<div class="block-question ${cls}">
<div class="q-indicator">${indicator}</div>
<div class="q-body">
<div class="q-text">${q.questionText}</div>
<div class="q-user-answer"><span class="q-answer-label">Ihre Antwort:</span>${selectedHtml}</div>
${correctHtml}${attemptsHtml}
</div>
</div>`;
    }

    private renderAnswerItem(ans: string, imageCache: Map<string, string>): string {
        if (this.isImagePath(ans)) {
            const src = imageCache.get(ans) ?? ans;
            return `<img class="q-answer-img" src="${src}" alt="Auswahlbild">`;
        }
        return `<span class="q-answer-item">${ans}</span>`;
    }

    private renderTest(test: SummaryTestResult, imageCache: Map<string, string>): string {
        const pct = test.percentageScore;
        const barClass = pct >= 80 ? 'score-high' : pct >= 50 ? 'score-mid' : 'score-low';
        const questionsHtml = test.questions.map(tq => {
            const cls = tq.isCorrect ? 'question-correct' : 'question-incorrect';
            const indicator = tq.isCorrect ? '✓' : '✗';
            const userHtml = tq.userAnswerTexts.map(a => this.renderAnswerItem(a, imageCache)).join('');
            const correctHtml = !tq.isCorrect && tq.correctAnswerTexts.length > 0
                ? `<div class="q-correct-answer"><span class="q-answer-label q-answer-label--correct">Richtige Antwort:</span>${tq.correctAnswerTexts.map(a => this.renderAnswerItem(a, imageCache)).join('')}</div>`
                : '';
            return `<div class="block-question ${cls}">
<div class="q-indicator">${indicator}</div>
<div class="q-body">
<div class="q-instruction">${this.esc(tq.questionInstruction)}</div>
<div class="q-text">${tq.questionText}</div>
<div class="q-meta">${tq.pointsAwarded}&thinsp;/&thinsp;${tq.maxPoints} Punkte</div>
${tq.userAnswerTexts.length > 0 ? `<div class="q-user-answer"><span class="q-answer-label">Ihre Antwort:</span>${userHtml}</div>` : ''}
${correctHtml}
</div>
</div>`;
        }).join('\n');

        return `<div class="test-block">
<h3 class="test-title">${this.esc(test.testLabel)}</h3>
<div class="score-row">
<div class="score-bar"><div class="score-fill ${barClass}" style="width:${pct.toFixed(1)}%"></div></div>
<span class="score-text">${test.pointsEarned}&thinsp;/&thinsp;${test.maxPoints} Punkte (${pct.toFixed(0)}&thinsp;%)</span>
</div>
${questionsHtml}
</div>`;
    }

    private buildQuestionMap(data: SummaryData): Map<string, SummaryQuestion> {
        const map = new Map<string, SummaryQuestion>();
        for (const q of data.learningQuestions) {
            map.set(q.questionId, q);
        }
        return map;
    }

    private collectImagePaths(data: SummaryData, questionMap: Map<string, SummaryQuestion>): string[] {
        const paths = new Set<string>();

        for (const visit of data.pageVisits) {
            const { basePath, pageNum } = this.parsePage(visit.page);
            const def = PAGE_LOOKUP.get(`${basePath}:${pageNum}`);
            if (!def) continue;
            for (const block of def.blocks) {
                if (block.type === 'image') paths.add(block.src);
            }
        }

        for (const q of questionMap.values()) {
            for (const ans of [...q.selectedAnswerTexts, ...q.correctAnswerTexts]) {
                if (this.isImagePath(ans)) paths.add(ans);
            }
        }

        for (const test of data.tests) {
            for (const tq of test.questions) {
                for (const ans of [...tq.userAnswerTexts, ...tq.correctAnswerTexts]) {
                    if (this.isImagePath(ans)) paths.add(ans);
                }
            }
        }

        return [...paths];
    }

    private async fetchImages(paths: string[]): Promise<Map<string, string>> {
        const cache = new Map<string, string>();
        await Promise.all(
            paths.map(async path => {
                try {
                    const resp = await fetch(path);
                    if (!resp.ok) return;
                    const blob = await resp.blob();
                    const dataUrl = await this.blobToDataUrl(blob);
                    cache.set(path, dataUrl);
                } catch {
                    /* silently skip images that can't be fetched */
                }
            })
        );
        return cache;
    }

    private blobToDataUrl(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    private parsePage(pageUrl: string): { basePath: string; pageNum: number } {
        const qIdx = pageUrl.indexOf('?');
        const basePath = qIdx >= 0 ? pageUrl.slice(0, qIdx) : pageUrl;
        const pageNum  = qIdx >= 0
            ? parseInt(new URLSearchParams(pageUrl.slice(qIdx + 1)).get('page') ?? '1', 10)
            : 1;
        return { basePath, pageNum: isNaN(pageNum) ? 1 : pageNum };
    }

    private isImagePath(s: string): boolean {
        return /^assets\//.test(s) || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(s);
    }

    private esc(s: string): string {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    private formatDuration(seconds: number): string {
        if (seconds < 60) return `${seconds} s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins} min ${secs} s` : `${mins} min`;
    }
}

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.65;
    color: #1a1a1a;
    background: #f5f5f5;
    padding: 1.5rem 1rem;
}
.report-header {
    max-width: 800px; margin: 0 auto 2rem;
    border-bottom: 3px solid #15326a; padding-bottom: 0.75rem;
}
.report-title { font-size: 1.6rem; color: #15326a; }
.report-meta  { color: #666; font-size: 0.85rem; margin-top: 0.25rem; }
main { max-width: 800px; margin: 0 auto; }

/* Page sections */
.report-section { margin-bottom: 2.5rem; }
.page-section {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dde4f0;
    overflow: hidden;
}
.page-header {
    background: #15326a; color: #fff;
    padding: 0.6rem 1rem;
    display: flex; justify-content: space-between; align-items: baseline;
    flex-wrap: wrap; gap: 0.25rem;
}
.page-title    { font-weight: 600; font-size: 0.95rem; }
.page-duration { font-size: 0.78rem; opacity: 0.8; white-space: nowrap; }
.page-content  { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.9rem; }

/* Text blocks */
.block-text    { }
.block-lamp    {
    border-left: 4px solid #15326a; background: #eef2fb;
    padding: 0.6rem 0.9rem; border-radius: 0 4px 4px 0;
}
.block-glossary {
    border: 1px solid #c5cde0; background: #f0f3fa;
    padding: 0.6rem 0.9rem; border-radius: 4px;
}

/* Images */
.block-image { text-align: center; }
.block-image img { max-width: 100%; height: auto; border-radius: 4px; }
.img-caption { font-size: 0.82rem; color: #555; margin-top: 0.4rem; font-style: italic; }

/* Spoiler / Exkurs */
.block-spoiler { border: 1px solid #b8c8e8; border-radius: 6px; overflow: hidden; }
.spoiler-label {
    background: #dce7f7; color: #1a3560; font-weight: 600; font-size: 0.82rem;
    padding: 0.45rem 0.9rem;
}
.spoiler-body  { padding: 0.7rem 0.9rem; font-size: 0.9rem; }

/* Questions */
.block-question {
    border-radius: 6px; padding: 0.8rem 1rem;
    display: flex; gap: 0.75rem;
    border: 1px solid transparent;
}
.question-correct   { background: #edfaf2; border-color: #82d4a4; }
.question-incorrect { background: #fdf0f0; border-color: #e8a3a3; }
.question-unanswered{ background: #f5f5f5; border-color: #ccc; }
.q-skipped { color: #888; font-style: italic; font-size: 0.88rem; }
.q-indicator {
    font-size: 1.1rem; font-weight: 700; flex-shrink: 0; width: 1.4rem; text-align: center;
}
.question-correct   .q-indicator { color: #1e7e4e; }
.question-incorrect .q-indicator { color: #b33030; }
.q-body { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.q-instruction { font-size: 0.78rem; color: #666; font-style: italic; }
.q-text  { font-size: 0.9rem; }
.q-meta  { font-size: 0.78rem; color: #555; }
.q-user-answer, .q-correct-answer {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem;
    font-size: 0.88rem;
}
.q-answer-label         { font-weight: 600; color: #333; }
.q-answer-label--correct{ color: #1e7e4e; }
.q-answer-item { background: #fff; border: 1px solid #ccc; border-radius: 3px; padding: 0.15rem 0.45rem; }
.question-correct   .q-answer-item { border-color: #82d4a4; }
.question-incorrect .q-answer-item { border-color: #e8a3a3; }
.q-correct-answer .q-answer-item   { border-color: #82d4a4; background: #edfaf2; }
.q-answer-img { max-width: 200px; max-height: 150px; object-fit: contain; border-radius: 4px; border: 1px solid #ddd; }
.q-attempts  { font-size: 0.78rem; color: #888; font-style: italic; }
.q-empty     { color: #999; font-style: italic; }

/* Test section */
.section-title { font-size: 1.25rem; color: #15326a; margin-bottom: 1rem; border-bottom: 2px solid #c5cde0; padding-bottom: 0.4rem; }
.test-block    { background: #fff; border: 1px solid #dde4f0; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
.test-title    { font-size: 1rem; color: #15326a; margin-bottom: 0.6rem; }
.score-row     { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.9rem; }
.score-bar     { flex: 1; height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden; }
.score-fill    { height: 100%; border-radius: 5px; }
.score-low  { background: #c83333; }
.score-mid  { background: #d4860a; }
.score-high { background: #2d7a55; }
.score-text { font-size: 0.88rem; font-weight: 600; white-space: nowrap; }

@media print {
    body { background: #fff; padding: 0; font-size: 12pt; }
    .page-header { background: #15326a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .block-lamp, .block-glossary, .block-spoiler, .block-question { break-inside: avoid; }
}
`;
