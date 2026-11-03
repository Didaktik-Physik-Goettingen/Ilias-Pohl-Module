<?php
require_once __DIR__ . '/../lib.php';

requireMethod('GET');

$username = validUsername($_GET['username'] ?? null);
if ($username === null) {
    respond(400, ['error' => 'invalid username']);
}

$userId = findUserId($username);

if ($userId === null) {
    respond(404, ['error' => 'User not found']);
}

// DATETIME(3) in UTC → an ISO string the browser can't mistake for local time.
function toIso(string $datetime): string {
    return str_replace(' ', 'T', $datetime) . 'Z';
}

$pdo = getDb();

$s = $pdo->prepare(
    'SELECT route, query, duration_s, started_at FROM page_visits WHERE user_id = ? ORDER BY started_at, id'
);
$s->execute([$userId]);
$pageVisits = array_map(fn ($v) => [
    'page'       => $v['route'] . ($v['query'] !== '' ? '?' . $v['query'] : ''),
    'duration_s' => $v['duration_s'] === null ? null : (float) $v['duration_s'],
    'startedAt'  => toIso($v['started_at']),
], $s->fetchAll());

// The app resumes from the latest attempt per question. The earlier ones stay in the table for analysis.
$s = $pdo->prepare(
    'SELECT kind, unit_id, question_id, attempt_no, is_correct, points_awarded, max_points,
            answer, correct_answer, texts, answered_at
     FROM question_attempts WHERE user_id = ? ORDER BY attempt_no'
);
$s->execute([$userId]);
$latest = [];
foreach ($s->fetchAll() as $a) {
    $latest["{$a['unit_id']}|{$a['question_id']}"] = [
        'kind'          => $a['kind'],
        'unitId'        => $a['unit_id'],
        'questionId'    => $a['question_id'],
        'attemptNo'     => (int) $a['attempt_no'],
        'isCorrect'     => (bool) $a['is_correct'],
        'pointsAwarded' => $a['points_awarded'] === null ? null : (int) $a['points_awarded'],
        'maxPoints'     => $a['max_points'] === null ? null : (int) $a['max_points'],
        'answer'        => json_decode($a['answer'], true),
        'correctAnswer' => json_decode($a['correct_answer'], true),
        'texts'         => json_decode($a['texts'], true),
        'answeredAt'    => toIso($a['answered_at']),
    ];
}

respond(200, ['pageVisits' => $pageVisits, 'attempts' => array_values($latest)]);
