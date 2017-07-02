<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/1/2017
 * Time: 6:13 PM
 */

namespace Coins;

use PHPUnit\Framework\Exception;

class Auth
{

    private $username;
    private $password;
    private $entity;
    private $token;
    private $em;
    public $table = 'user';

    public function __construct($args = [])
    {
        if (!empty($args['username'])) {
            $this->setUsername(trim($args['username']));
        }
        if (!empty($args['password'])) {
            $this->setPassword(trim($args['password']));
        }
        if (!empty($args['entity'])) {
            $this->setEntity($args['entity']);
        }
        if (!empty($args['em'])) {
            $this->em = $args['em'];
        } else {
            if ($db = DB::Instance()) {
                $this->em = $db->getDoctrineEntityManager();
            }
        }
    }

    public function checkUserAuth()
    {
        if (empty($this->entity)) {
            throw new \Exception('User does not exist');
        } elseif (empty($this->username) || empty($this->password)) {
            throw new \Exception('Username or password is empty');
        } elseif ($this->entity->getUsername() != $this->username) {
            throw new \Exception('Username or password is incorrect');
        } elseif (!$this->verifyPassword($this->entity->getPassword())) {
            throw new \Exception('Username or password is incorrect');
        }
        return true;
    }

    public function verifyPassword($hash, $password = null)
    {
        $verified = false;
        $plain_text_password = is_null($password) ? $this->getPassword() : $password;
        if ($plain_text_password) {
            $verified = password_verify($plain_text_password, $hash);
        }
        return $verified;
    }

    public static function hashPassword($password)
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setEntity($entity)
    {
        $this->entity = $entity;
    }

    public function getEntity()
    {
        return $this->entity;
    }

    public function setToken($token)
    {
        $this->token = $token;
    }

    public function getToken()
    {
        return $this->token;
    }
}