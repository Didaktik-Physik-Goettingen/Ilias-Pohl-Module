<?php
require_once __DIR__ . '/../lib.php';

requireMethod('POST');

$body     = jsonBody();
$username = validUsername($body['username'] ?? null);

if ($username === null) {
    respond(400, ['error' => 'invalid username']);
}

requireCourseKey($body['key'] ?? null);

// A second click or a parallel tab finds the user already there, which is fine.
$stmt = getDb()->prepare(
    'INSERT INTO users (module_id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id'
);
$stmt->execute([getModuleId(), $username]);

respond(201, ['id' => findUserId($username), 'username' => $username]);
