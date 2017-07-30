<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/29/2017
 * Time: 9:18 PM
 */

namespace Coins\Controller;

use Coins\Service;

class Asset extends Base
{

    public static $service_class = 'Asset';

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function get($request, $response, $args)
    {
        $coin = $args['id'];
        try {
            $object = $this->service->get($coin);
            return $response->withJson($object->getQuantity());
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
        $quantity = $payload['quantity'];
        try {
            $id = $this->service->createAsset($coin, $quantity);
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

    public function update($request, $response, $args)
    {
        $payload = $request->getParsedBody();
        $asset_id = $args['id'];
        $quantity = $payload['quantity'];
        try {
            $id = $this->service->updateAsset($asset_id, $quantity);
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
        $asset_id = $args['id'];
        try {
            $this->service->removeAsset($asset_id);
            return $response->withJson(true);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }

}