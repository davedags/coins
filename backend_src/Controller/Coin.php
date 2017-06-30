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
    protected static $list_types = [
        'mk' => 'getMarketCapList',
        'cc' => 'getCryptoCompareList'
    ];

    public function __construct($container) 
    {
        $this->container = $container;
        $this->service = new \Coins\Service\Coin([
            'em' => $this->container['em']
            ]      
        );
    }

    public function getList($request, $response, $args)
    {
        $type = 'mk'; //market cap list
        if (isset($request->getQueryParams()['type'])) {
           $type = $request->getQueryParams()['type'];
            if (!isset(self::$list_types[$type])) {
                return $response->withJson(['error_message' => "List Type: {$type} is not a valid type"], 400);
            }
        }
        $function = self::$list_types[$type];
        $list = $this->service->$function();
        return $response->withJson($list);
    }


    public function getSymbolMap($request, $response, $args)
    {
        $list = $this->service->getCryptoCompareSymbolMap();
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

    public static function getListTypes()
    {
        return self::$list_types;
    }
}