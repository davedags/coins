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
    protected $container;
    protected $em;
    protected $cache;
    protected $currentUser = null;
    protected static $entity_namespace = 'Coins\Entities\\';

    public function __construct($args = [])
    {

        $this->container = $args['container'];
        $this->em = $this->container['em'];
        $this->cache = \Coins\Cache::Instance();
        
        if (!empty($this->container['user'])) {
            $this->setUser($this->container['user']);
        }
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
        if (is_null($class)) {
            $class = $this->getClass();
        }
        return self::$entity_namespace . $class;
    }

    public function getClass()
    {
        return static::$class;
    }
    
    public function setUser($user)
    {
        $this->currentUser = $user;
    }
    
    public function getUser()
    {
        return $this->currentUser;
    }
}