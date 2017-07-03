<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 5:30 AM
 */

namespace Coins\Service;

use Coins\Auth;

class User extends Base
{
    public static $class = 'User';
    
    public function __construct(array $args = [])
    {
        parent::__construct($args);

    }

    public function login($credentials = [])
    {
        $username = trim($credentials['username']);
        $password = trim($credentials['password']);

        $user = $this->getObjectByField($username, 'username');
        $auth = new Auth([
            'username' => $username,
            'password' => $password,
            'entity' => $user
        ]);
        
        $authorized = $auth->checkUserAuth();
        if ($authorized) {
            return [
                'user_id' => $user->getId(),
                'username' => $username,
                'token' => $auth->getToken()
            ];
        }
        
        return false;
    }
    
    public function create($data)
    {
        $username = trim($data['username']);
        $password = trim($data['password']);
        if (!$username || !$password) {
            throw new \Exception('Username and password are required');
        }
        $user = $this->getObjectByField($username, 'username');
        if ($user) {
            throw new \Exception('An account with this username already exists');
        }

        $user = new \Coins\Entities\User();
        $user->setUsername($username);
        $user->setPassword(Auth::hashPassword($password));
        $this->em->persist($user);
        $this->em->flush();

        $db_user = $this->getObjectByField($username, 'username');
        
        $response = [
            'user_id' => $db_user->getId(),
            'username'=> $db_user->getUsername(),
            'token' => '123'
        ];
        return $response;
    }
}