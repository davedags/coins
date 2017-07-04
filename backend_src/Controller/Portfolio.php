<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/3/2017
 * Time: 4:51 PM
 */

namespace Coins\Controller;

use Coins\Service;

class Portfolio
{
    protected $container;
    protected $service;

    public function __construct($container)
    {
        $this->container = $container;
        $this->service = new Service\Portfolio([
                'em' => $this->container['em'],
                'jwt' => !empty($this->container['jwt']) ? $this->container['jwt'] : null
            ]
        );
    }

    public function getList($request, $response, $args)
    {

        $list = $this->service->getList();
        return $response->withJson($list);
    }
}