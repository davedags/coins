<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 2/20/2017
 * Time: 4:15 PM
 */

namespace Coins\Controller;

class Coin
{
    protected $container;
    protected $service;

    public function __construct($container) 
    {
        $this->container = $container;
        $this->service = new \Coins\Service\Coin();
         
        
    }
    
    public function getList($request, $response, $args)
    {

        $list = $this->service->fetchCollection();
        return $response->withJson($list);
    }


}