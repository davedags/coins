<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/7/2017
 * Time: 8:53 PM
 */

namespace Coins\Controller;


class Base
{

    public static $service_namespace = 'Coins\Service\\';
    protected $container;
    protected $service;

    public function __construct($container)
    {
        $this->container = $container;
        $service_name = self::$service_namespace . $this->getServiceClass();
        $this->service = new $service_name([
                'container' => $this->container
            ]
        );
    }

    public function getServiceClass()
    {
        return static::$service_class;
    }

    public function getUser()
    {
        if ($this->container && !empty($this->container['user'])) {
            return $this->container['user'];
        }
        return null;
    }
}