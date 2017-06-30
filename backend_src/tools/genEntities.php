<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/24/2017
 * Time: 11:51 PM
 */


require_once './bootstrap.php';
$em = $app->db->em;
$tool = new \Doctrine\ORM\Tools\SchemaTool($em);

$classes = array(
    $em->getClassMetadata('\Coins\Entities\Coin'),
);

$tool->createSchema($classes);