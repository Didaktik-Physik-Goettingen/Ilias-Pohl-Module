# Design notes — Lernmodul „Pohlscher Resonator“

What was built and why: the decisions behind the module, for anyone (or any Claude session) who extends this module or builds the next one. **How to** set up, run, deploy and extend it is in `README.md` and the developer guide `.learning_module_readme.md` (gitignored, kept locally); this file doesn't repeat them.

Built by Carlo (physics education group, Göttingen) with Claude, 2026-02-13 to 2026-11-10. Test questions and formats and the chaos pages by Josefine Neuhaus (2026-06), the revision of the test selection and of the learning questions and feedback by Melissa Atik (2026-08 to 2026-10).

Related: the sister module [Ilias-Precession-Module](https://github.com/CVC97/Ilias-Precession-Module) (`../ilias-precession-module/`) took its infrastructure from here and has its own `design_notes.md`; the design of both modules was redone there first (section 2). The landing page at the server root, `../index.html`, links to both modules and is uploaded by hand.


## 1 Status (2026-11-10)

Live at `https://interapt.uni-goettingen.de/pohl/`, not yet used in a course. Two strands (experiment: 3 segments, theory: 4) on seven learning routes with 30 sub-pages, three optional pages, four decision pages, four scored tests, six canvas simulations and four target pages with guides, summary and HTML report. 43 retryable learning questions, 18 test questions, 14 glossary terms. Open items: section 10.


## 2 Concept

### What the students prepare for

Versuch 3 *Der Pohlsche Resonator* (Grundpraktikum Experimentalphysik I, script chapter 3). In the lab they record, computer-controlled, the free oscillation at four positions of the eddy current brake (0, 4, 6, 8 mm, released by hand from 120°) and the forced oscillation at three dampings (4, 6, 8 mm) for 10 excitation frequencies between 150 and 600 mHz, plus five near the resonance. The Auswertung determines ω_e, the logarithmic decrement Λ and β from the decay curves, then ω₀, plots resonance and phase curves over ω/ω₀ and compares the measured ω_r with the expected one.

### Decisions

| Decision | Why |
|---|---|
| **Two strands with the same physics**: Experiment (from the real setup to the formula) and Theorie (from the equation to the setup) | Students differ in prior knowledge and interests; the module lets them choose their way in (project aim: individual learning paths). The start page shows both side by side with the shared core (DGL, ω₀, damping, resonance, phase). |
| **Decision pages before each topic**: learning module, simulation or test | Students decide how they learn: the learning pages then the simulation, the simulation then the learning pages, or straight to the test. The two learning orders cover the same pages (`flow` in the URL), the test is the shortcut for students who already know it. |
| **Scored, single-submission tests**, pass mark 80 % | A test checks whether the shortcut was justified. Passed: on to the next topic (after the driven test, to the guide). Failed: back to the decision page, where the test is then greyed out (`testDisabled`), so the way leads through the learning pages. In the precession module tests were dropped for that reason: without decision pages they'd only be a shortcut. |
| **Yellow means test** | `--physik-gelb` marks tests everywhere: headings, test buttons, the test card on decision pages, the box borders in tests. It is a meaning, not decoration. |
| **Optional deep dives**: chaos, numerical simulation, Versuchsaufbau | Offered after a passed driven test (links in the end page's message), and Versuchsaufbau is the theory strand's last station before its guide. Chaos and simulation lead to guides of their own (A, P). |
| **A guide tailored to the way taken** | Target pages offer guides by focus and openness: experiment strand E1 (setup, more concrete), E2 (setup, more open), E3 (analysis); theory strand T1 (concrete), T2 (free design); A (chaos) and P (simulation); each with the analysis notebook. Below: the student's Lernpfad and the HTML report. |
| **Infrastructure shared with the precession module** | Bridge, PHP API, MySQL tracking, summary and report are identical there; the database `interapt` is shared (section 6). |
| **The nav is a line of stations, but only visited sub-pages of the current segment open** (Carlo, 2026-11-01) | Taken over from the precession design. Unlike there, segments, Startseite and Anleitung never open outside dev mode, so students can't jump between chapters past the decision pages. A row is *reached* (filled navy marker) when visited, a segment also when its decision page was, the Anleitung when any target page was. |
| **Tests lock the nav** | A test can be reopened and has no route guard. While it is unfinished, no row opens, since the learning rows of the same chapter hold the answers; a test row only opens once that test is finished (`isTestFinished()`, not `percentageScore`, which `endTest()` also writes for a test left half-way). |
| **Only the chosen strand on the line** (2026-11-01) | The old strand switcher looked like tabs but couldn't be clicked outside dev mode. The strand's name is plain text above segment 1; dev mode offers the other strand as a small link. On the theory strand Versuchsaufbau (`opt-setup`) is a station with a wrench instead of a number, since every way to its guide leads through it; on the experiment strand it is an optional page. |
| **No nav on the Startseite** (Carlo) | Consistent between both modules; the page grid drops the column and the content centres. |
| **The precession design, taken over** (Carlo, 2026-11-01) | Three surfaces (nav < main < boxes), no floating card, the centred 62 rem column, 15 px base font, justified and hyphenated text, boxes following the theme. Reasons: precession `design_notes.md`, section 2. Only figures and simulation canvases keep their white plates. |
| **Gated "Weiter" greyed out, never hidden** (Carlo, PR #22, 2026-10-30) | The same rule as in the precession module: the button shows that there is a way on and what blocks it. Dev mode releases it. |
| **The Lehrportal's video on Einstieg: Versuchsaufbau (1/4) and on Versuchsaufbau** (Carlo, 2026-11-09) | The German video „Praktikum zu Experimentalphysik I: 3 - Pohlscher Resonator“ replaces the photo-and-sketch figure there; (2/4) Komponenten keeps the labelled figure as reference for its questions. The HTML report can't embed a video: it shows the labelled figure with the video link as caption. Same pattern as in the precession module. |
| **Segment names like the precession module**: „Einstieg: Versuchsaufbau“, „Einstieg: Theorie“ (Carlo, 2026-11-09) | Consistency between the modules; the summary and the HTML report use the same names („[E-1] Einstieg: Versuchsaufbau“, „[T-1] Einstieg: Theorie“). |
| **Start page cards and decision cards: hover changes background and border, nothing moves** (Carlo, 2026-11-10) | Calm, and the same on both modules and the landing page. The buttons stay for now: on decision pages a click has consequences (a test locks the nav), so a deliberate button beats a card-wide click. |

### Learning paths

| Strand | Segment | Learning route (sub-pages) | Decision | Simulation | Test |
|---|---|---|---|---|---|
| E | 1 Einstieg: Versuchsaufbau | `e1-intro-experiment` (4) | — | — | — |
| E | 2 Gedämpfte Schwingungen | `e2-damped-oscillations` (3) | `dec-e-damped` | `sim-e-damped` | `test-e-damped` (5 questions) |
| E | 3 Getriebene Schwingungen | `e3-driven-oscillations` (7) | `dec-e-driven` | `sim-e-driven` | `test-e-driven` (4) → `tar-experiment` |
| T | 1 Einstieg: Theorie | `t1-intro-theory` (1) | — | — | — |
| T | 2 Freie Schwingungen | `t2-free-oscillations` (2), links to `sim-t-free` | — | `sim-t-free` | — |
| T | 3 Gedämpfte Schwingungen | `t3-damped-oscillations` (5) | `dec-t-damped` | `sim-t-damped` | `test-t-damped` (5) |
| T | 4 Getriebene Schwingungen | `t4-driven-oscillations` (8) | `dec-t-driven` | `sim-t-driven` | `test-t-driven` (4) → `opt-setup` → `tar-theory` |
| — | optional | `opt-chaos` (2 + guide pages), `opt-simulation` (1, Jupyter notebook), `opt-setup` (1) | — | — | — |

Routes are below `/learning/`, `/decision/`, `/simulation/`, `/test/` and `/target/`. Flow parameters in the URL: `flow=learning-first` (learning pages first, then back to the decision page and on to the simulation), `path=learn|sim|test` on nav rows, `next=chaos|simulation` on `opt-setup` (picks the guide).

### Notation and figures

- The Pohl wheel as in the script: angle φ, moment of inertia Θ, restoring torque Dφ (the script writes D*, „Winkelrichtgröße“; the module says Richtmoment / Direktionsmoment), damping torque ρφ̇, driving torque A cos ωt (script: M cos ωt). Normal form with 2β = ρ/Θ, ω₀² = D/Θ, N = A/Θ (section 11).
- The theory strand starts with the generic oscillator in x with damping γ (t2, t3) and switches to the wheel's φ and β in t4, where both forms appear side by side. The experiment strand uses φ and β throughout.
- Figures keep a white plate in dark mode, as do the simulation canvases (their drawing code uses fixed colours).


## 3 Flows and gates

- **Decision page:** three cards (learning module, simulation, test), each colour-coded on hover and on its button. The learning card is greyed out once the learning pages were done in this browser session (`learning-done-<strand>-<topic>` in `sessionStorage`); the test card after a failed test.
- **Learning pages:** the last sub-page leads back to the decision page in the `learning-first` flow (then the simulation), otherwise on to the next decision page or the target.
- **Simulation pages:** "Weiter" waits for 9 interactions (`interactionThresholdReached`: start/stop, Neustart, view switches and redraws in static mode count); dev mode releases it. After the simulation the student continues with the learning pages (simulation-first) or to the next decision page (`learning-first`).
- **Tests:** single submission per question; the end page scores, shows a message by level (below 80 % / from 80 %) and saves progress. The nav lock (section 2) keeps the learning rows closed meanwhile; the browser's back button still leaves a test.
- **The nav reflects the flow:** the sub-pages listed depend on how the segment was entered (learn, sim or test), and visited rows stay listed (`getVisibleSubpages()` in `nav-bar.ts`).


## 4 Simulations

Six Angular components drawing on `<canvas>`, each with a „statisch“ / „dynamisch“ switch (the whole curve at once, or animated with Start/Stop and Neustart), sliders for the parameters and switches for the views. The switch's off state is grey, not red: off is no error.

| Route | Entered from | Shows | Parameters |
|---|---|---|---|
| `sim-t-free` | link on t2 | undamped oscillator in x: pendulum, x(t), phase space | spring constant, x₀, v₀ |
| `sim-e-damped` | `dec-e-damped` | damped Pohl wheel: pendulum, wheel, φ(t) | spring constant, damping, φ₀, initial velocity |
| `sim-t-damped` | `dec-t-damped` | damped oscillator in x with phase space | spring constant, damping, x₀, v₀ |
| `sim-e-driven` | `dec-e-driven` | driven damped Pohl wheel: pendulum, wheel with motor, φ(t), phase space | spring constant, damping, φ₀, initial velocity, motor amplitude and frequency |
| `sim-t-driven` | `dec-t-driven` | driven damped oscillator in x | spring constant, damping, x₀, motor amplitude and frequency |
| `sim-t-driven-advanced` | no link, on purpose | driven damped rotational oscillator in φ, like `sim-e-driven` | as `sim-e-driven` |

`sim-formulas.spec.ts` checks that every simulation page typesets its formulas.

`sim-t-driven-advanced` is deliberately not linked from any page (Carlo, 2026-11-10): it is reachable only by its URL and in dev mode. Route, nav and summary know it, so a visit is still labelled and drawn on the line.


## 5 Target pages, summary and report

- Four target pages (`tar-experiment`, `tar-theory`, `tar-chaos`, `tar-simulation`) with the guide cards (section 2) in a purple-tinted surface, `--target-h1-color` for headings.
- Below the guides the **Lernpfad**: visited pages with time spent, learning questions with the student's answers, test results. `summary.service.ts` turns IDs into labels (`MODULE_LABELS`, `TEST_LABELS`, `PAGE_LABELS`); unknown keys show the raw ID, so new pages need an entry.
- **HTML report** (`html-report.service.ts`, replaced the earlier PDF service, 2026-08): a self-contained file generated in the browser, images embedded, page content in `learning-report-registry.ts` order with the answers at the question blocks. Simulations and target pages are left out of the report.


## 6 Data and backend (decided 2026-11-03 to 2026-11-05)

The PHP and the schema are **identical in both modules** and the database `interapt` is shared: change them together.

- **Events, not snapshots.** `question_attempts` holds one row per submitted answer, every retry included, for learning questions and tests; `page_visits` one row per visit (route, sub-page, query, duration). The data is used for research, so the first attempt must survive; the app resumes from the latest attempt per question.
- **Saving is idempotent.** Unique keys plus `ON DUPLICATE KEY UPDATE id = id`: a row sent twice is stored once, the first version counts. With `attempt_no` 1 for tests the same key enforces single submission. Not `INSERT IGNORE`, which also turns real errors into warnings.
- **The app sends only unconfirmed rows** (`attempt-outbox.ts`), on `pagehide`, when the tab is hidden and on the test end page, at most 60 kB per request (browsers refuse `keepalive` requests above 64 KiB).
- **Times in UTC with milliseconds** (`DATETIME(3)`), the session in UTC, ISO strings ending in `Z` to the browser.
- **Every `localStorage` key carries the module prefix** (`storage-prefix.ts`, `'pohl:'`). Both modules run on one origin and so share one `localStorage`; without the prefix each read, showed and saved the other's data (found 2026-11-05). Only the theme is shared on purpose.
- **Resume only through the start page.** Coming in via the bridge, the app goes to the last saved page; a reload or a direct link stays put.
- **The API is called as `api/…`, relative** to `<base href>`. A leading `/` went to the domain root, where no API exists: until 2026-11-03 the deployed app never saved anything.
- **The deploy must not wipe `api/`**: the first upload mirrors with `--delete` and therefore excludes `api/` and the bridge; development files (`schema.sql`, `router.php`, `config.example.php`) are not uploaded.
- **Course key on `check` and `create`**, usernames limited to letters, digits and `. _ - @`.

Known weaknesses of the login model and data protection are documented in *Open Issues* of the developer guide, deliberately not here.


## 7 Pitfalls and lessons

- **Stale components in `ng serve`:** after template or CSS edits it can show the new version in the server-rendered HTML and the old one after hydration. Restart it before debugging a missing change.
- **SSR is built but not deployed:** code that touches `window`, `document` or storage still runs during the build's prerender. Guard it, also in `.then()` callbacks: a `window` access there only shows up as `unhandledRejection` in the build log, with exit code 0.
- **Component styles beat global ones:** an override for a component goes into its own CSS. And a fixture's root component doesn't refresh host bindings, so `NavBar` is tested inside a small parent component.
- **Tests:** jsdom has no `<base>` and no canvas: add a `<base>` in specs that compare against `document.baseURI`, and call `stubCanvasContext()` for canvas components.
- **`percentageScore` is not "finished":** `endTest()` writes it for a test left half-way; use `isTestFinished()`.
- **Dark mode controls:** navy „Auswerten“ on a dark card is 1.18:1, so `--control-fill` is inverted in dark mode; check new buttons for the same problem.
- **Local DB:** `db_host` must be `127.0.0.1`; with `localhost` PHP looks for a Unix socket instead of the Docker port.
- **Screenshots** from a fresh load of a real build in headless Chrome (Puppeteer is a devDependency); wait for MathJax; theme via `localStorage.theme`, dev mode via `sessionStorage.devMode` before load.


## 8 Relation to the precession module

- **Shared and to be kept in sync:** `api/` and `schema.sql` (byte-identical), the tracking services, `attempt-outbox.ts`, the bridge's script, the footer, the global styles and the design rules. A design change in one module goes to the other.
- **Module-specific:** `STORAGE_PREFIX` (must be unique per module), `module_name` and `module_key` in the server's `api/config.php`, the deploy path, the nav structure, the summary labels and the report registry.
- **Different by design:** Pohl has strands, decision pages, tests and canvas simulations; precession is one linear path with retryable questions and an embedded Unity simulation. Its nav opens every visited page; Pohl's only the visited sub-pages of the current segment.


## 9 Conventions for extending the module

Registering pages, glossary terms and test question types: developer guide, *Common Maintenance Tasks*. Beyond that:

- Content lives outside the components: `<page>-content.ts` and `<page>-questions.ts`; the report registry imports the same strings. LaTeX with double backslashes (`$\\omega_0$`).
- Question IDs: `{module}-{n}-{description}` for learning questions, `test-{strand}-{topic}-{n}-{description}` for tests. They and the tracking IDs are stored in the database: choose once, never change. A renamed route keeps its old key as an alias in the summary's label maps.
- Retryable types: single-choice, multiple-choice, multiple-choice-image, image-choice (the learning drag-and-drop is an empty stub). Test types: single-choice, multiple-choice, image-choice, order-images, drag-and-drop, true-false.
- Feedback in tests: the student's own choices green ✓ or red ✗; options not chosen get a „Richtige Antwort“ / „Falsche Antwort“ badge.
- Colours only via the CSS variables; breakpoints 600 / 900 / 1200 px.
- Student-facing text: German, formal "Sie".


## 10 Open items

- **Test button contrast:** white text on `--physik-gelb` (`.test-btn`) is about 2:1.
- **Untested in production:** the `[B]` flag of the load rewrite on the real Apache (usernames with `+`, `&` or umlauts).
- **Landing page** `../index.html` is not uploaded yet (the server root answers 403) and is not under version control.
- **Backend:** login model, data protection, repeating students, scores computed in the browser, durations including idle time: *Open Issues* in the developer guide.
- **Inherited:** a cold load straight onto a learning page can log `MathJax.typesetPromise is not a function` (later renders work).


## 11 Physics reference (for consistent wording)

- Equation of motion: Θφ̈ + ρφ̇ + Dφ = A cos ωt; normal form φ̈ + 2βφ̇ + ω₀²φ = N cos ωt with 2β = ρ/Θ, ω₀² = D/Θ, N = A/Θ.
- Free damped oscillation, Schwingfall (β < ω₀): φ(t) = φ₀ e^(−βt) cos(ω_e t + Φ), ω_e = √(ω₀² − β²). Aperiodischer Grenzfall β = ω₀, Kriechfall β > ω₀.
- Logarithmic decrement: Λ = ln(φ(t)/φ(t + T)) = βT.
- Stationary forced oscillation: amplitude φ₀(ω) = N / √((ω₀² − ω²)² + 4β²ω²), phase φ = arctan(2βω / (ω₀² − ω²)) between 0 and π.
- Resonance: ω_r = √(ω₀² − 2β²) for 0 < β < ω₀/√2; the stronger the damping, the lower and flatter the maximum.
- General solution: homogeneous (Einschwingvorgang, decays with e^(−βt)) plus particular solution (stationary).
- Lab safety from the script: near resonance at weak damping the amplitude must stay below 120° (Resonanzkatastrophe).
