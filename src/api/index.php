<?php

require '../../vendor/autoload.php';
ini_set("error_log", __DIR__ . "/error_log.txt");
$appInstance = new Coins\App();
$appInstance->run();