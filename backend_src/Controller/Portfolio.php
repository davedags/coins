<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/3/2017
 * Time: 4:51 PM
 */

namespace Coins\Controller;

use Coins\Service;

class Portfolio extends Base
{

    public static $service_class = 'Portfolio';

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function get($request, $response, $args)
    {
        $coin = $args['id'];
        try {
            $this->service->get($coin);
            return $response->withJson(true);
        } catch (\Exception $e) {
            return $response->withJson(false);
        }
    }
    
    public function getList($request, $response, $args)
    {
        $list = $this->service->getList();
        return $response->withJson($list);
    }

    public function create($request, $response, $args)
    {
        $payload = $request->getParsedBody();
        $coin = $payload['symbol'];
        try {
            $id = $this->service->addToPortfolio($coin);
            return $response->withJson([
                'id' => $id,
            ]);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }

    public function delete($request, $response, $args)
    {
        $coin = $args['id'];
        try {
            $this->service->removeFromPortfolio($coin);
            return $response->withJson(true);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }
}