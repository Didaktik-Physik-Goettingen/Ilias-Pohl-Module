<?php
require_once __DIR__ . '/../lib.php';

requireMethod('POST');

$body     = jsonBody();
$username = validUsername($body['username'] ?? null);

if ($username === null) {
    respond(400, ['error' => 'invalid username']);
}

requireCourseKey($body['key'] ?? null);

respond(200, ['exists' => findUserId($username) !== null]);
