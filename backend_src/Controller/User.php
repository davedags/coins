<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 5:29 AM
 */

namespace Coins\Controller;

use Coins\Service;

class User
{

    protected $container;
    protected $service;

    public function __construct($container)
    {
        $this->container = $container;
        $this->service = new Service\User([
                'em' => $this->container['em']
            ]
        );
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