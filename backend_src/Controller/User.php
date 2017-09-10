<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 5:29 AM
 */

namespace Coins\Controller;

use Coins\Service;

class User extends Base
{

    public static $service_class = 'User';

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function get($request, $response, $args)
    {
        $user = $args['id'];
        try {
            $user = $this->service->getAccount($user);
            return $response->withJson($user);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }
    
    public function updateAccount($request, $response, $args)
    {
        $user = $args['id'];
        $accountData = $request->getParsedBody();
        try {
            $user = $this->service->updateAccount($user, $accountData);
            return $response->withJson($user);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }
    
    public function create($request, $response, $args)
    {
        $payload = $request->getParsedBody();
        $userData = [
            'username' => $payload['username'],
            'password' => $payload['password']
        ];
        try {
            $user = $this->service->create($userData);
            return $response->withJson($user);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(400)->withJson($error);
        }
    }

    public function login($request, $response, $args)
    {
        $payload = $request->getParsedBody();
        $userData = [
            'username' => $payload['username'],
            'password' => $payload['password']
        ];
        try {
            $user = $this->service->login($userData);
            return $response->withJson($user);
        } catch (\Exception $e) {
            $error = [
                'error_message' => $e->getMessage()
            ];
            return $response->withStatus(401)->withJson($error);
        }
    }
}