<?php
// POST /api/report
// Accepts a JSON body matching the Angular SummaryData interface and returns a
// personalised PDF of the user's learning path as a file download.
//
// Strategy — "template + stamp + concatenate":
//   * Each page/module has a PRE-RENDERED PDF template in report_templates/,
//     produced once at authoring time with full content and the CORRECT answers
//     already shown (rendered in a real browser, so MathJax + figures are exact).
//   * At report time we import the templates for the pages this user actually
//     visited (each once, in first-visit order), STAMP the user's own answers
//     into a reserved answer-zone, and concatenate them into one document.
//   * Pages with no template yet fall back to a generated text summary, so the
//     report works incrementally as templates are added.
//
// This keeps report generation to pure PDF manipulation — no headless browser is
// needed on the server, so it runs anywhere PHP does.
//
// Dependencies: run `composer install` in this directory (installs FPDF + FPDI).

use setasign\Fpdi\Fpdi;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    exit(json_encode(['error' => 'Method not allowed']));
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    header('Content-Type: application/json');
    exit(json_encode(['error' => 'Invalid or missing JSON body']));
}

require_once __DIR__ . '/vendor/autoload.php';

// ── Configuration ─────────────────────────────────────────────────────────────

// Directory holding the pre-rendered per-page template PDFs.
const TEMPLATE_DIR = __DIR__ . '/report_templates';

// Visited-page route  →  template base name. Keyed by the normalized route (path
// only, query/fragment stripped — see normalizeRoute()). The actual files are
// resolved by resolveTemplateFiles(): a single '<base>.pdf', or one page per
// subpage '<base>-1.pdf', '<base>-2.pdf', … (as produced by the generator). Add
// entries as templates are authored; missing routes fall back to the summary.
const TEMPLATE_MAP = [
    '/'                                  => 'home',
    '/learning/e1-intro-experiment'      => 'e1-intro-experiment',
    '/learning/e2-damped-oscillations'   => 'e2-damped-oscillations',
    '/learning/e3-driven-oscillations'   => 'e3-driven-oscillations',
    '/learning/t1-intro-theory'          => 't1-intro-theory',
    '/learning/t2-free-oscillations'     => 't2-free-oscillations',
    '/learning/t3-damped-oscillations'   => 't3-damped-oscillations',
    '/learning/t4-driven-oscillations'   => 't4-driven-oscillations',
];

// Learning-module id (as tracked via startModule())  →  route, so a module's
// answers are stamped onto the right page template.
const MODULE_ROUTE_MAP = [
    'intro-experiment'      => '/learning/e1-intro-experiment',
    'damped_oscillations'   => '/learning/e2-damped-oscillations',
    'driven_oscillations'   => '/learning/e3-driven-oscillations',
    'free_oscillations'     => '/learning/t2-free-oscillations',
    't3-damped-oscillations' => '/learning/t3-damped-oscillations',
    't4-driven-oscillations' => '/learning/t4-driven-oscillations',
];

// Question id  →  subpage number (1-based), so each subpage's template is
// stamped with only the answers to questions shown on that subpage. Derived from
// the learning components' templates. Questions not listed here are stamped on
// subpage 1 as a fallback (see groupAnswersBySubpage()).
const QUESTION_SUBPAGE_MAP = [
    // e1-intro-experiment (4 subpages)
    'intro-exp-1-schwungrad'                => 2,
    'intro-exp-2-feder'                     => 2,
    'intro-exp-3-wirbelstrombremse'         => 2,
    'intro-exp-4-direktionsmoment'          => 3,
    'intro-exp-5-winkel-drehmoment'         => 3,
    'intro-exp-6-winkel-zeit'               => 4,
    // e2-damped-oscillations (3 subpages)
    'damped_osc-1-schwungrad'               => 2,
    // e3-driven-oscillations (7 subpages)
    'driven_osc-1-dgl-loesen'               => 1,
    'driven_osc-2-inhom-dgl'                => 2,
    'driven_osc-3-swinging-process'         => 3,
    'driven_osc-4-max-amp'                  => 4,
    'driven_osc-5-damping-resonance-freq'   => 5,
    'driven_osc-6-damping-resonance-freq-exp' => 5,
    'driven_osc-7-exciting-frequency'       => 7,
    'driven_osc-8-measure-time-delta'       => 7,
    // t2-free-oscillations (2 subpages)
    't2-q1-oscillator'                      => 1,
    't2-q2-reality'                         => 1,
    't2-q3-dgl-matching'                    => 1,
    't2-q4-phase'                           => 2,
    't2-q5-phase-matching'                  => 2,
    't2-q6-pohl'                            => 2,
    // t3-damped-oscillations (5 subpages)
    't3-q1-exp-ansatz'                      => 1,
    't3-q2-gen-solution'                    => 1,
    't3-q3-schwingfall-condition'           => 2,
    't3-q4-schwingfall-matching'            => 2,
    't3-q5-exp-factor'                      => 2,
    't3-q6-amplitude-ratio'                 => 2,
    't3-q7-log-dekrement'                   => 2,
    't3-q8-aper-grenzfall'                  => 4,
    't3-q9-summary-matching'                => 5,
    't3-q10-gebaude'                        => 5,
    // t4-driven-oscillations (8 subpages)
    't4-q1-driven-oscillator'               => 1,
    't4-q2-pohl-term'                       => 2,
    't4-q3-gesamtloesung'                   => 2,
    't4-q4-partikular-ansatz'               => 4,
    't4-q5-partikular-loesung'              => 4,
    't4-q6-einschwing'                      => 6,
    't4-q7-amplitude-params'                => 7,
    't4-q8-damping-amplitude'               => 7,
    't4-q9-versuch'                         => 7,
    't4-q10-resonanz-phase'                 => 8,
    't4-q11-messung'                        => 8,
];

// Reserved answer-zone on a template page, in millimetres: [x, y, width]. The
// template author must leave this area blank. Per-route overrides may be added.
const ANSWER_ZONE_DEFAULT = [15, 245, 180];
const ANSWER_ZONE_OVERRIDES = [
    // '/learning/e1-intro-experiment' => [15, 230, 180],
];

// ── Helpers ─────────────────────────────────────────────────────────────────

// FPDF core fonts use ISO-8859-1; strip HTML and normalise glyphs it can't show.
function u(string $s): string {
    $s = strip_tags($s);
    $s = str_replace(
        ['✓', '✗', '→', '←', '↓', '↑', '–', '—', '…'],
        ['+', '-', '->', '<-', 'v', '^', '-', '-', '...'],
        $s
    );
    return mb_convert_encoding($s, 'ISO-8859-1', 'UTF-8');
}

function formatDuration(int $s): string {
    if ($s < 60) return "{$s} s";
    $m = (int) floor($s / 60);
    $r = $s % 60;
    return $r > 0 ? "{$m} min {$r} s" : "{$m} min";
}

// Reduce a recorded URL to its route: drop the query string and fragment so all
// subpage visits (?page=N) of the same page collapse onto one template.
function normalizeRoute(string $page): string {
    $page = explode('#', $page, 2)[0];
    $page = explode('?', $page, 2)[0];
    return $page !== '' ? $page : '/';
}

function answerZoneFor(string $route): array {
    return ANSWER_ZONE_OVERRIDES[$route] ?? ANSWER_ZONE_DEFAULT;
}

// Resolves a template base name to its ordered list of files, each tagged with
// its subpage number: a single ['file' => '<base>.pdf', 'subpage' => null], or
// the numbered subpages ['file' => '<base>-1.pdf', 'subpage' => 1], … sorted.
function resolveTemplateFiles(string $base): array {
    if (is_file(TEMPLATE_DIR . '/' . $base . '.pdf')) {
        return [['file' => $base . '.pdf', 'subpage' => null]];
    }
    $matches = glob(TEMPLATE_DIR . '/' . $base . '-*.pdf') ?: [];
    $files = array_map(function ($p) {
        $n = (int) preg_replace('/^.*-(\d+)\.pdf$/', '$1', basename($p));
        return ['file' => basename($p), 'subpage' => $n];
    }, $matches);
    usort($files, fn ($a, $b) => $a['subpage'] <=> $b['subpage']);
    return $files;
}

// Groups a route's answers by subpage number (via QUESTION_SUBPAGE_MAP). Answers
// with no mapping are collected under key 0 and stamped on subpage 1.
function groupAnswersBySubpage(array $questions): array {
    $out = [];
    foreach ($questions as $q) {
        $sp = QUESTION_SUBPAGE_MAP[$q['questionId'] ?? ''] ?? 0;
        $out[$sp][] = $q;
    }
    return $out;
}

// ── PDF document ──────────────────────────────────────────────────────────────
class LernpfadPDF extends Fpdi {
    public string $username = '';
    // Chrome (header/footer) is drawn only on generated pages, never over an
    // imported template — templates carry their own design.
    public bool $chrome = true;

    function Header(): void {
        if (!$this->chrome) return;
        $this->SetFont('Helvetica', 'B', 10);
        $this->SetTextColor(21, 50, 104);
        $this->Cell(0, 8, u('Lernpfad – Pohlscher Resonator'), 0, 0, 'L');
        if ($this->username) {
            $this->Cell(0, 8, u($this->username), 0, 0, 'R');
        }
        $this->Ln(8);
        $this->SetDrawColor(21, 50, 104);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + 190, $this->GetY());
        $this->Ln(4);
        $this->SetTextColor(0, 0, 0);
    }

    function Footer(): void {
        $this->SetY(-12);
        $this->SetFont('Helvetica', '', 8);
        $this->SetTextColor(120, 120, 120);
        $this->Cell(0, 6, u('Seite ') . $this->PageNo() . u(' / {nb}'), 0, 0, 'C');
        $this->SetTextColor(0, 0, 0);
    }

    // Imports every page of one template file (one file = one subpage) and stamps
    // the given answers into the reserved answer-zone at the bottom of EACH page.
    // Returns true if at least one page was imported. The print script reserves
    // this zone via a bottom page margin, so it is always blank in the template.
    function appendTemplateFile(string $file, array $questions, array $zone): bool {
        $path = TEMPLATE_DIR . '/' . $file;
        if (!is_file($path)) return false;

        $imported = false;
        $prevChrome = $this->chrome;
        $this->chrome = false;                 // don't draw our header over the template
        try {
            $pageCount = $this->setSourceFile($path);
            for ($n = 1; $n <= $pageCount; $n++) {
                $tpl  = $this->importPage($n);
                $size = $this->getTemplateSize($tpl);
                $this->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $this->useTemplate($tpl);
                $this->stampAnswers($questions, $zone);
                $imported = true;
            }
        } catch (\Throwable $e) {
            error_log('Report template import failed for ' . $file . ': ' . $e->getMessage());
        } finally {
            $this->chrome = $prevChrome;
        }
        return $imported;
    }

    // Stamps a user's answers into the reserved answer-zone of the CURRENT page.
    function stampAnswers(array $questions, array $zone): void {
        if (empty($questions)) return;
        [$x, $y, $w] = $zone;

        // Keep the stamp on this page — never let it spill onto an extra page.
        $this->SetAutoPageBreak(false);
        $this->SetXY($x, $y);
        $this->SetFont('Helvetica', 'B', 9);
        $this->SetTextColor(21, 50, 104);
        $this->MultiCell($w, 5, u('Ihre Antworten'), 0, 'L');

        foreach ($questions as $q) {
            $correct = (bool)($q['isCorrect'] ?? false);
            $mark    = $correct ? '[+]' : '[-]';
            $answer  = implode(', ', $q['selectedAnswerTexts'] ?? []);
            if ($answer === '') $answer = 'keine Antwort';

            $this->SetX($x);
            $this->SetFont('Helvetica', '', 8);
            $this->SetTextColor($correct ? 37 : 180, $correct ? 105 : 20, $correct ? 81 : 20);
            $this->MultiCell($w, 4.5, u($mark . ' ' . $answer), 0, 'L');
        }
        $this->SetTextColor(0, 0, 0);
        $this->SetAutoPageBreak(true, 18);   // restore for any generated pages
    }
}

// ── Assemble the report ─────────────────────────────────────────────────────
$pdf = new LernpfadPDF();
$pdf->username = $data['sessionId'] ?? '';
$pdf->AliasNbPages();
$pdf->SetAutoPageBreak(true, 18);

// Group the user's learning answers by route (via module id) so each page
// template can be stamped with the answers that belong to it.
$answersByRoute = [];
foreach ($data['learningQuestions'] ?? [] as $q) {
    $route = MODULE_ROUTE_MAP[$q['moduleId'] ?? ''] ?? null;
    if ($route === null) continue;
    $answersByRoute[$route][] = $q;
}

// Ordered, de-duplicated list of visited routes (first visit wins). Routes that
// have answers but weren't in the visit list are appended so nothing is lost.
$orderedRoutes = [];
$seen = [];
foreach ($data['pageVisits'] ?? [] as $visit) {
    $route = normalizeRoute($visit['page'] ?? '');
    if ($route === '' || isset($seen[$route])) continue;
    $seen[$route] = true;
    $orderedRoutes[] = $route;
}
foreach (array_keys($answersByRoute) as $route) {
    if (!isset($seen[$route])) { $seen[$route] = true; $orderedRoutes[] = $route; }
}

// Title page.
$pdf->AddPage();
$pdf->SetFont('Helvetica', 'B', 20);
$pdf->SetTextColor(21, 50, 104);
$pdf->Cell(0, 12, u('Ihr Lernpfad'), 0, 1);
$pdf->SetFont('Helvetica', '', 11);
$pdf->SetTextColor(80, 80, 80);
if (!empty($data['generatedAt'])) {
    try {
        $dt = new DateTime($data['generatedAt']);
        $pdf->Cell(0, 8, u('Erstellt am: ' . $dt->format('d.m.Y H:i') . ' Uhr'), 0, 1);
    } catch (Exception $e) {}
}
$pdf->SetTextColor(0, 0, 0);

// Per-route: import the template and stamp answers, or fall back to a summary.
foreach ($orderedRoutes as $route) {
    $base    = TEMPLATE_MAP[$route] ?? null;
    $answers = $answersByRoute[$route] ?? [];

    if ($base !== null) {
        $files = resolveTemplateFiles($base);
        if (!empty($files)) {
            $bySubpage = groupAnswersBySubpage($answers);
            $zone = answerZoneFor($route);
            $importedAny = false;
            foreach ($files as $entry) {
                if ($entry['subpage'] === null) {
                    $q = $answers;                          // single-file template: all answers
                } else {
                    $q = $bySubpage[$entry['subpage']] ?? [];
                    if ($entry['subpage'] === 1 && !empty($bySubpage[0])) {
                        $q = array_merge($q, $bySubpage[0]); // unmapped answers land on subpage 1
                    }
                }
                if ($pdf->appendTemplateFile($entry['file'], $q, $zone)) {
                    $importedAny = true;
                }
            }
            if ($importedAny) continue;
        }
    }

    // ── Fallback: generated summary block for an un-templated route ──────────
    $pdf->chrome = true;
    $pdf->AddPage();
    $pdf->SetFont('Helvetica', 'B', 13);
    $pdf->SetFillColor(230, 236, 245);
    $pdf->SetTextColor(21, 50, 104);
    $pdf->Cell(0, 9, u('Besuchte Seite: ' . $route), 0, 1, 'L', true);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->Ln(2);

    if (!empty($answers)) {
        $pdf->SetFont('Helvetica', 'B', 11);
        $pdf->Cell(0, 8, u('Ihre Antworten'), 0, 1);
        foreach ($answers as $q) {
            $correct = (bool)($q['isCorrect'] ?? false);
            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->SetTextColor($correct ? 37 : 180, $correct ? 105 : 20, $correct ? 81 : 20);
            $pdf->MultiCell(0, 7, u(($correct ? '[+] ' : '[-] ') . ($q['questionText'] ?? '')), 0, 'L');
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetFont('Helvetica', '', 10);
            $answer = implode(', ', $q['selectedAnswerTexts'] ?? []);
            $pdf->Cell(6, 6, '', 0, 0);
            $pdf->MultiCell(0, 6, u('Ihre Antwort: ' . ($answer !== '' ? $answer : 'keine Antwort')), 0, 'L');
            if (!$correct && !empty($q['correctAnswerTexts'])) {
                $pdf->SetTextColor(37, 105, 81);
                $pdf->Cell(6, 6, '', 0, 0);
                $pdf->MultiCell(0, 6, u('Richtige Antwort: ' . implode(', ', $q['correctAnswerTexts'])), 0, 'L');
                $pdf->SetTextColor(0, 0, 0);
            }
            $pdf->Ln(2);
        }
    }
}

// ── Test results (text summary; templates can be added later like pages) ─────
$tests = $data['tests'] ?? [];
if (!empty($tests)) {
    $pdf->chrome = true;
    $pdf->AddPage();
    $pdf->SetFont('Helvetica', 'B', 13);
    $pdf->SetFillColor(230, 236, 245);
    $pdf->SetTextColor(21, 50, 104);
    $pdf->Cell(0, 9, u('Testergebnisse'), 0, 1, 'L', true);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->Ln(2);

    foreach ($tests as $test) {
        $score = number_format((float)($test['percentageScore'] ?? 0), 0);
        $pdf->SetFont('Helvetica', 'B', 11);
        $pdf->SetTextColor(21, 50, 104);
        $pdf->Cell(0, 8, u("{$test['testLabel']} – {$test['pointsEarned']}/{$test['maxPoints']} Punkte ({$score} %)"), 0, 1);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('Helvetica', '', 10);

        foreach ($test['questions'] ?? [] as $tq) {
            $correct = (bool)($tq['isCorrect'] ?? false);
            $pts     = u("{$tq['pointsAwarded']}/{$tq['maxPoints']} Pkt.");

            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->SetTextColor($correct ? 37 : 180, $correct ? 105 : 20, $correct ? 81 : 20);
            $pdf->MultiCell(0, 7, u(($correct ? '[+] ' : '[-] ') . ($tq['questionText'] ?? $tq['questionInstruction'] ?? '')), 0, 'L');
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetFont('Helvetica', '', 10);

            $pdf->Cell(6, 6, '', 0, 0);
            $pdf->Cell(0, 6, $pts, 0, 1);

            if (!empty($tq['userAnswerTexts'])) {
                $pdf->Cell(6, 6, '', 0, 0);
                $pdf->MultiCell(0, 6, u('Ihre Antwort: ' . implode(', ', $tq['userAnswerTexts'])), 0, 'L');
            }
            if (!$correct && !empty($tq['correctAnswerTexts'])) {
                $pdf->SetTextColor(37, 105, 81);
                $pdf->Cell(6, 6, '', 0, 0);
                $pdf->MultiCell(0, 6, u('Richtige Antwort: ' . implode(', ', $tq['correctAnswerTexts'])), 0, 'L');
                $pdf->SetTextColor(0, 0, 0);
            }
            $pdf->Ln(2);
        }
        $pdf->Ln(4);
    }
}

// ── Output ─────────────────────────────────────────────────────────────────
$username = preg_replace('/[^a-zA-Z0-9._-]/', '_', $data['sessionId'] ?? 'lernpfad');
$pdf->Output('D', "lernpfad-{$username}.pdf");
