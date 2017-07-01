<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 5:30 AM
 */

namespace Coins\Service;


class User
{
    protected $em = null;
    public function __construct(array $args = [])
    {
        $this->em = $args['em'];
    }

    public function login($credentials = [])
    {
        $username = $credentials['username'];
        $password = $credentials['password'];
        //implement login
        return [
            'username' => $username,
            'token' => '123'
        ];
    }
    
    public function create()
    {
        //Fake User Object - TODO, implement creation
        $user = [
            'id' => 3,
            'username'=> 'dags'
        ];

        return $user;
    }
}