<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 5:29 AM
 */

namespace Coins\Controller;


class User
{

    protected $container;
    protected $service;

    public function __construct($container)
    {
        $this->container = $container;
        $this->service = new \Coins\Service\User([
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

        $user = $this->service->create($userData);
        return $response->withJson($user);
    }

    public function login($request, $response, $args)
    {
        $payload = $request->getParsedBody();
        $userData = [
            'username' => $payload['username'],
            'password' => $payload['password']
        ];

        $user = $this->service->login($userData);
        return $response->withJson($user);
    }
}