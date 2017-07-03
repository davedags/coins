<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/24/2017
 * Time: 11:51 PM
 */

use \Coins\Entities;

require_once './bootstrap.php';
$em = $app->db->em;
$tool = new \Doctrine\ORM\Tools\SchemaTool($em);

$classes = [
    $em->getClassMetadata('\Coins\Entities\Coin'),
    $em->getClassMetaData('\Coins\Entities\User'),
    $em->getClassMetaData('\Coins\Entities\Favorite')

];

if ($argv[1] == 'update') {
    $tool->updateSchema($classes);
} else {
    $tool->createSchema($classes);
}