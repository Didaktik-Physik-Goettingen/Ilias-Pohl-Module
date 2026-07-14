<?php
// POST /api/report
// Accepts a JSON body matching the Angular SummaryData interface and returns a
// formatted PDF of the user's learning path as a file download.
//
// Dependency: run `composer install` once in this directory (installs FPDF).

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

// FPDF uses ISO-8859-1; this helper strips HTML tags and converts encoding.
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

// ── PDF class with header / footer ────────────────────────────────────────────
class LernpfadPDF extends FPDF {
    public string $username = '';

    function Header(): void {
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
}

// ── Build PDF ─────────────────────────────────────────────────────────────────
$pdf = new LernpfadPDF();
$pdf->username = $data['sessionId'] ?? '';
$pdf->AliasNbPages();
$pdf->SetAutoPageBreak(true, 18);
$pdf->AddPage();

// Title
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
$pdf->Ln(4);

// ── Section helper ─────────────────────────────────────────────────────────
function sectionHeading(LernpfadPDF $pdf, string $title): void {
    $pdf->SetFont('Helvetica', 'B', 13);
    $pdf->SetFillColor(230, 236, 245);
    $pdf->SetTextColor(21, 50, 104);
    $pdf->Cell(0, 9, u($title), 0, 1, 'L', true);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->Ln(2);
}

// ── Visited pages ──────────────────────────────────────────────────────────
$pageVisits = $data['pageVisits'] ?? [];
if (!empty($pageVisits)) {
    sectionHeading($pdf, 'Besuchte Seiten');
    $pdf->SetFont('Helvetica', '', 10);

    foreach ($pageVisits as $visit) {
        $label = u($visit['label'] ?? $visit['page'] ?? '');
        $dur   = u(formatDuration((int)($visit['durationSeconds'] ?? 0)));
        $pdf->Cell(160, 7, $label, 0, 0);
        $pdf->Cell(0,   7, $dur,   0, 1, 'R');
    }
    $pdf->Ln(6);
}

// ── Learning questions ─────────────────────────────────────────────────────
$questions = $data['learningQuestions'] ?? [];
if (!empty($questions)) {
    sectionHeading($pdf, 'Lernaufgaben');

    $groups = [];
    foreach ($questions as $q) {
        $mid = $q['moduleId'];
        if (!isset($groups[$mid])) {
            $groups[$mid] = ['label' => $q['moduleLabel'] ?? $mid, 'questions' => []];
        }
        $groups[$mid]['questions'][] = $q;
    }

    foreach ($groups as $group) {
        $pdf->SetFont('Helvetica', 'B', 11);
        $pdf->SetTextColor(21, 50, 104);
        $pdf->Cell(0, 8, u($group['label']), 0, 1);
        $pdf->SetTextColor(0, 0, 0);

        foreach ($group['questions'] as $q) {
            $correct   = (bool)($q['isCorrect'] ?? false);
            $indicator = $correct ? '[+]' : '[-]';

            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->SetTextColor($correct ? 37 : 180, $correct ? 105 : 20, $correct ? 81 : 20);
            $pdf->MultiCell(0, 7, u($indicator . ' ' . ($q['questionText'] ?? '')), 0, 'L');
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetFont('Helvetica', '', 10);

            $answers = $q['selectedAnswerTexts'] ?? [];
            if (!empty($answers)) {
                $pdf->Cell(6, 6, '', 0, 0);
                $pdf->MultiCell(0, 6, u('Ihre Antwort: ' . implode(', ', $answers)), 0, 'L');
            }
            if (!$correct && !empty($q['correctAnswerTexts'])) {
                $pdf->SetTextColor(37, 105, 81);
                $pdf->Cell(6, 6, '', 0, 0);
                $pdf->MultiCell(0, 6, u('Richtige Antwort: ' . implode(', ', $q['correctAnswerTexts'])), 0, 'L');
                $pdf->SetTextColor(0, 0, 0);
            }
            $pdf->Ln(2);
        }
        $pdf->Ln(4);
    }
}

// ── Test results ───────────────────────────────────────────────────────────
$tests = $data['tests'] ?? [];
if (!empty($tests)) {
    sectionHeading($pdf, 'Testergebnisse');

    foreach ($tests as $test) {
        $score = number_format((float)($test['percentageScore'] ?? 0), 0);
        $pdf->SetFont('Helvetica', 'B', 11);
        $pdf->SetTextColor(21, 50, 104);
        $pdf->Cell(0, 8, u("{$test['testLabel']} – {$test['pointsEarned']}/{$test['maxPoints']} Punkte ({$score} %)"), 0, 1);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('Helvetica', '', 10);

        foreach ($test['questions'] ?? [] as $tq) {
            $correct   = (bool)($tq['isCorrect'] ?? false);
            $indicator = $correct ? '[+]' : '[-]';
            $pts       = u("{$tq['pointsAwarded']}/{$tq['maxPoints']} Pkt.");

            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->SetTextColor($correct ? 37 : 180, $correct ? 105 : 20, $correct ? 81 : 20);
            $pdf->MultiCell(0, 7, u($indicator . ' ' . ($tq['questionText'] ?? $tq['questionInstruction'] ?? '')), 0, 'L');
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
