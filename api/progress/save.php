<?php
require_once __DIR__ . '/../lib.php';

requireMethod('POST');

$body     = jsonBody();
$username = validUsername($body['username'] ?? null);

if ($username === null) {
    respond(400, ['error' => 'invalid username']);
}

$userId = findUserId($username);

if ($userId === null) {
    respond(404, ['error' => 'User not found']);
}

// JS millisecond timestamp → UTC DATETIME(3); null if it is no plausible time.
function toDatetime($ms): ?string {
    if (!is_int($ms) && !is_float($ms)) return null;
    $ms = (int) $ms;
    if ($ms < 946684800000 || $ms > 4102444800000) return null;   // 2000 to 2100
    return gmdate('Y-m-d H:i:s', intdiv($ms, 1000)) . sprintf('.%03d', $ms % 1000);
}

function isId($value, int $maxLength): bool {
    return is_string($value) && $value !== '' && strlen($value) <= $maxLength;
}

// '/learning/e1?page=2&path=learn&session_id=max' → route, sub-page and query, without the session_id.
function splitPage($page): ?array {
    if (!is_string($page) || $page === '') return null;
    [$route, $query] = array_pad(explode('?', $page, 2), 2, '');
    parse_str($query, $params);
    unset($params['session_id']);
    $query   = http_build_query($params);
    $subpage = isset($params['page']) && is_string($params['page']) ? $params['page'] : null;
    if (strlen($route) > 100 || strlen($query) > 255 || strlen((string) $subpage) > 20) return null;
    return [$route, $subpage, $query];
}

$visits   = is_array($body['visits']   ?? null) ? $body['visits']   : [];
$attempts = is_array($body['attempts'] ?? null) ? $body['attempts'] : [];
$skipped  = 0;

$pdo = getDb();
$pdo->beginTransaction();

try {
    // A row that is already stored stays as it is: the first version counts.
    $s = $pdo->prepare(
        'INSERT INTO page_visits (user_id, route, subpage, query, duration_s, started_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id'
    );
    foreach ($visits as $v) {
        $page      = splitPage($v['page'] ?? null);
        $startedAt = toDatetime($v['startTime'] ?? null);
        $duration  = $v['duration_s'] ?? null;
        if ($page === null || $startedAt === null || ($duration !== null && !is_numeric($duration))) {
            $skipped++;
            continue;
        }
        $s->execute([$userId, $page[0], $page[1], $page[2], $duration, $startedAt]);
    }

    $s = $pdo->prepare(
        'INSERT INTO question_attempts
           (user_id, kind, unit_id, question_id, attempt_no, is_correct,
            points_awarded, max_points, answer, correct_answer, texts, answered_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id'
    );
    foreach ($attempts as $a) {
        $answeredAt = toDatetime($a['answeredAt'] ?? null);
        $attemptNo  = $a['attemptNo'] ?? null;
        $points     = $a['pointsAwarded'] ?? null;
        $maxPoints  = $a['maxPoints'] ?? null;
        if (
            $answeredAt === null
            || !in_array($a['kind'] ?? null, ['learning', 'test'], true)
            || !isId($a['unitId'] ?? null, 100)
            || !isId($a['questionId'] ?? null, 100)
            || !is_int($attemptNo) || $attemptNo < 1
            || !is_bool($a['isCorrect'] ?? null)
            || ($points !== null && !is_int($points))
            || ($maxPoints !== null && !is_int($maxPoints))
        ) {
            $skipped++;
            continue;
        }
        $s->execute([
            $userId, $a['kind'], $a['unitId'], $a['questionId'], $attemptNo,
            $a['isCorrect'] ? 1 : 0,
            $points,
            $maxPoints,
            json_encode($a['answer'] ?? null),
            json_encode($a['correctAnswer'] ?? null),
            json_encode($a['texts'] ?? null),
            $answeredAt,
        ]);
    }

    $pdo->prepare('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?')->execute([$userId]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}

if ($skipped > 0) {
    error_log("Progress save for user $userId: skipped $skipped malformed rows");
}

respond(200, ['ok' => true, 'skipped' => $skipped]);
