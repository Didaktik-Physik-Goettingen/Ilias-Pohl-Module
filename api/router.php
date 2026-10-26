<?php
// Local development router — used only with:
//   php -S localhost:8000 api/router.php
// (run from the project root)

$path = ltrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$static = [
    'bridge'            => __DIR__ . '/../ilias_bridge.html',
    'api/users/check'   => __DIR__ . '/users/check.php',
    'api/users/create'  => __DIR__ . '/users/create.php',
    'api/progress/save' => __DIR__ . '/progress/save.php',
];

if (isset($static[$path])) {
    require $static[$path];
    return true;
}

// Dynamic: GET /api/progress/{username}
if (preg_match('#^api/progress/([^/]+)$#', $path, $m)) {
    $_GET['username'] = urldecode($m[1]);
    require __DIR__ . '/progress/load.php';
    return true;
}

// Serve real files (JS, CSS, assets) as-is.
return false;
