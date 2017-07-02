<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 7:30 PM
 */

namespace Coins\Service;


class Base
{
    protected $em;
    protected $cache;
    protected static $entity_namespace = 'Coins\Entities\\';

    public function __construct($args = [])
    {
        $this->em = $args['em'];
        $this->cache = \Coins\Cache::Instance();
    }


    public function getObject($id, $args = [])
    {
        $class = !empty($args['class']) ? $args['class'] : null;
        $entity = $this->getClassPath($class);
        $obj = $this->em->find($entity, $id);
        return $obj;
    }

    public function getObjectByField($value, $field, $args = [])
    {
        $class = !empty($args['class']) ? $args['class'] : null;
        $entity = $this->getClassPath($class);
        $obj = $this->em->getRepository($entity)->findOneBy([$field => $value]);
        return $obj;
    }

    public function getClassPath($class = null)
    {
        $class = empty($args['class']) ? $this->getClass() : $args['class'];
        return self::$entity_namespace . $class;
    }

    public function getClass()
    {
        return static::$class;
    }
}