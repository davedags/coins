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
        
        $authorized = $auth->checkUserAuth(true);
        if ($authorized) {
            $token = $auth->genToken([
                'user_id' => $user->getId(),
                'username' => $username
            ]);
            return $this->prepareUserResponse($user, $token);
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
        $auth = new Auth([
            'username' => $username,
            'password' => $password,
            'entity' => $db_user
        ]);
     
        $token = $auth->genToken([
            'user_id' => $db_user->getId(),
            'username' => $username
        ]);
        $response = $this->prepareUserResponse($db_user, $token);
        return $response;
    }

    public function getAccount($user_id)
    {
        if (!$this->canUpdateAccount($user_id)) {
            throw new \Exception('Unauthorized');
        } else {
            $user = $this->getObject($user_id);
            return $this->prepareAccountResponse($user);
        }
    }

    public function updateAccount($user_id, $user_data)
    {
        if (!$this->canUpdateAccount($user_id)) {
            throw new \Exception('Unauthorized');
        } else {
            $user = $this->getObject($user_id);
            $user->setDefaultPage($user_data['default_page']);
            $user->setDefaultChartVisibility($user_data['default_chart_visibility']);
            $this->checkPasswordUpdate($user, $user_data);
            $this->em->persist($user);
            $this->em->flush();
            return $this->prepareAccountResponse($user);
        }
    }

    function prepareUserResponse($user, $token)
    {
        return [
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
            'default_page' => $user->getDefaultPage(),
            'default_chart_visibility' => $user->getDefaultChartVisibility() == '1' ? 'show' : 'hide',
            'token' => $token
        ];
    }

    function prepareAccountResponse($user)
    {
        $data = [
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
            'default_page' => $user->getDefaultPage(),
            'default_chart_visibility' => $user->getDefaultChartVisibility() == '1' ? 'show' : 'hide'
        ];
        return $data;
    }
    
    private function canUpdateAccount($user_id)
    {
        if (!empty($user_id) && $user_id == $this->getUser()) {
            return true;
        } 
        return false;
    }

    private function checkPasswordUpdate($user, $data) {
        if (!empty($data['existing_password']) && !empty($data['new_password']) && !empty($data['verify_password'])) {
            if (trim($data['new_password']) == trim($data['verify_password'])) {
                $existing_password = trim($data['existing_password']);
                $new_password = trim($data['new_password']);
                $auth = new Auth();
                if ($auth->verifyPassword($user->getPassword(), $existing_password)) {
                    $user->setPassword($auth->hashPassword($new_password));
                    return true;
                }
            }
        }
        return false;
    }
}