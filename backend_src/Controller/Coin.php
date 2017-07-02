<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 2/20/2017
 * Time: 4:15 PM
 */

namespace Coins\Controller;

use Coins\Service;

class Coin
{
    protected $container;
    protected $service;

    public function __construct($container) 
    {
        $this->container = $container;
        $this->service = new Service\Coin([
            'em' => $this->container['em']
            ]      
        );
    }

    public function getList($request, $response, $args)
    {
        $list = $this->service->getMarketCapList();
        return $response->withJson($list);
    }

    
    public function getDetail($request, $response, $args)
    {
        $symbol = $args['id'];
        $data = $this->service->getDetailBySymbol($symbol);
        return $response->withJson($data);
    }

    public function getPrice($request, $response, $args)
    {
        $symbol = $args['id'];
        $data = $this->service->getPriceBySymbol($symbol);
        return $response->withJson($data);
    }

}