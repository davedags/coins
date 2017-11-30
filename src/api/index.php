<?php

require '../../vendor/autoload.php';

if (empty($_SERVER['HTTP_USER_AGENT'])) {
    exit;
}

$appInstance = new Coins\App();
$appInstance->run();