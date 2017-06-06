<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/5/2017
 * Time: 7:50 PM
 */

namespace Coins;

class Cache
{

    private $conn;

    public static function Instance()
    {
        static $inst = null;
        if ($inst === null) {
           $inst = new Cache();
        }
        return $inst;
    }

    private function __construct()
    {
        try {
            if (class_exists('RedisArray', false) && defined('REDIS_SERVERS')) {
                $servers = json_decode(REDIS_SERVERS);
                $this->conn = new RedisArray(
                    $servers,
                    [
                        'connect_timeout' => 2,
                        'retry_interval' => 500,
                        'lazy_connect' => true,
                        'persistent' => true
                    ]
                );
            }
        } catch (Exception $e) {
            $this->conn = null;
        }
    }

    public function set($key, $val, $expiry = 0)
    {
        if ($this->conn) {
            $val = gzcompress(serialize($val));
            $this->conn->set($key, $val, $expiry);
        }
    }
    
    public function get($key)
    {
        $val = null;
        if ($this->conn) {
            $val = $this->conn->get($key);
            if ($val) {
                $val = unserialize(gzuncompress($val));
            }
        }
        return $val;
    }
}