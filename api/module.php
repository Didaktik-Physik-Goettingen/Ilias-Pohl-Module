<?php
require_once __DIR__ . '/db.php';

function getModuleId(): int {
    static $moduleId = null;
    if ($moduleId !== null) return $moduleId;

    $cfg = require __DIR__ . '/config.php';
    $pdo = getDb();
    $select = $pdo->prepare('SELECT id FROM modules WHERE name = ?');
    $select->execute([$cfg['module_name']]);
    $id = $select->fetchColumn();
    if ($id === false) {
        $pdo->prepare('INSERT IGNORE INTO modules (name) VALUES (?)')->execute([$cfg['module_name']]);
        $select->execute([$cfg['module_name']]);
        $id = $select->fetchColumn();
    }
    $moduleId = (int) $id;
    return $moduleId;
}
