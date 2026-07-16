# Learning-path report templates

Pre-rendered PDF templates used by [`../report.php`](../report.php) to build a
user's personalised learning-path report ("template + stamp + concatenate").

## How it works

At **report time**, `report.php` takes the pages a user actually visited (each
once, in first-visit order), imports the matching template from this folder via
FPDI, **stamps that user's answers into a reserved zone at the bottom of each
subpage — only the answers to questions shown on that subpage** — and
concatenates the results into one PDF. No headless browser runs on the server —
report generation is pure PHP.

Pages without a template here fall back to a plain text summary, so the report
works incrementally as templates are added.

## Generating the templates (automated)

Templates are produced by the Puppeteer script
[`frontend/tools/generate-report-templates.mjs`](../../frontend/tools/generate-report-templates.mjs),
which renders each learning route in headless Chromium (so MathJax + canvas are
exact) and prints it to a PDF here. This runs **only at authoring time in dev** —
Chromium/Puppeteer never ship to production.

```bash
cd frontend
ng serve                                  # 1. app must be running
npm install                               # 2. installs puppeteer (devDependency)
npx puppeteer browsers install chrome     #    once, to fetch Chromium
node tools/generate-report-templates.mjs  # 3. writes *.pdf into this folder
```

The script reserves the bottom **~52 mm** of every page (a print margin) so the
answer-zone stays blank — this matches `ANSWER_ZONE_DEFAULT` (`y = 245 mm`) in
`report.php`. Adjust both together if you change the zone.

### Subpages

Multi-subpage learning features are driven via `?page=N`. The generator prints
each subpage separately (`pages` in its `TARGETS`), producing numbered files:

- single-subpage route → `<base>.pdf`
- multi-subpage route  → `<base>-1.pdf`, `<base>-2.pdf`, …

`report.php` (`resolveTemplateFiles()`) auto-discovers whichever form exists and
concatenates the numbered files in order — so it adapts to whatever the generator
produced without needing the subpage count itself. Current counts: e1 = 4,
e2 = 3, e3 = 7, t2 = 2, t3 = 5, t4 = 8; all others = 1.

## Mapping

- Route → template file: `TEMPLATE_MAP` in `report.php` (mirrored by `TARGETS`
  in the generator script — keep them in sync).
- Answers → route: grouped by learning-module id via `MODULE_ROUTE_MAP`.
- Answers → subpage: `QUESTION_SUBPAGE_MAP` (question id → subpage number), so
  each subpage template is stamped only with its own questions' answers.

| Route                                | Template base name      | Subpages |
|--------------------------------------|-------------------------|----------|
| `/`                                  | `home`                  | 1        |
| `/learning/e1-intro-experiment`      | `e1-intro-experiment`   | 4        |
| `/learning/e2-damped-oscillations`   | `e2-damped-oscillations`| 3        |
| `/learning/e3-driven-oscillations`   | `e3-driven-oscillations`| 7        |
| `/learning/t1-intro-theory`          | `t1-intro-theory`       | 1        |
| `/learning/t2-free-oscillations`     | `t2-free-oscillations`  | 2        |
| `/learning/t3-damped-oscillations`   | `t3-damped-oscillations`| 5        |
| `/learning/t4-driven-oscillations`   | `t4-driven-oscillations`| 8        |

> **Correct answers:** templates show the *correct* answers via solutions-reveal
> mode. The generator appends `solutions=1` to each route; the evaluation
> components then render as answered-correctly with explanations shown (see
> `frontend/src/app/core/services/report-mode.ts`). This flag is **dev-only** —
> it is ignored in production builds, so students cannot use it to reveal answers.
