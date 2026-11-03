<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/module.php';

header('Content-Type: application/json');

// Anything unexpected ends as a JSON 500; the details only go to the server's error log.
set_exception_handler(function (Throwable $e) {
    error_log('API error: ' . $e->getMessage());
    respond(500, ['error' => 'Server error']);
});

function respond(int $status, array $data): void {
    http_response_code($status);
    exit(json_encode($data));
}

function requireMethod(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        respond(405, ['error' => 'Method not allowed']);
    }
}

function jsonBody(): array {
    $body = json_decode(file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

// Letters, digits and . _ - @ only, as usernames travel in URLs.
// 'save' would hit the route of /api/progress/save, and the app treats rogue_user_ as unregistered.
function validUsername($username): ?string {
    if (!is_string($username)) return null;
    $username = trim($username);
    if (!preg_match('/^[\p{L}\p{N}._@-]{1,100}$/u', $username)) return null;
    if (strtolower($username) === 'save' || str_starts_with($username, 'rogue_user_')) return null;
    return $username;
}

function requireCourseKey($key): void {
    $cfg = require __DIR__ . '/config.php';
    $expected = (string) ($cfg['module_key'] ?? '');
    if ($expected === '' || !is_string($key) || !hash_equals($expected, $key)) {
        respond(401, ['error' => 'invalid key']);
    }
}

function findUserId(string $username): ?int {
    $stmt = getDb()->prepare('SELECT id FROM users WHERE module_id = ? AND username = ?');
    $stmt->execute([getModuleId(), $username]);
    $id = $stmt->fetchColumn();
    return $id === false ? null : (int) $id;
}
