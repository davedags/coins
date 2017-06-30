<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/24/2017
 * Time: 11:18 PM
 */

namespace Coins;


class DB
{

    public $em = null;
    
    public function __construct()
    {
        $this->em = $this->getDoctrineEntityManager();    
    }

    public function getDoctrineEntityManager()
    {
        if (is_null($this->em)) {
            $this->em = false;
            if ($db_config = self::getDBConfig()) {
                $config = \Doctrine\ORM\Tools\Setup::createAnnotationMetadataConfiguration([__DIR__ . "/Entities"]);
                $conn = array_merge(['driver' => 'pdo_mysql'], $db_config);
                $this->em = \Doctrine\ORM\EntityManager::create($conn, $config);
            }
        }
        return $this->em;
    }

    public static function getDBConfig()
    {
        $config = [];
        if (file_exists(__DIR__ . '/../config/.env')) {
            $dotenv = new \Dotenv\Dotenv(__DIR__ . '/../config');
            $dotenv->load();

            $config['host'] = $_ENV['COINS_DB_HOST'];
            $config['dbname'] = $_ENV['COINS_DB'];
            $config['user'] = $_ENV['COINS_DB_USER'];
            $config['password'] = $_ENV['COINS_DB_PASSWORD'];
            if (!empty($_ENV['driver'])) {
                $config['driver'] = $_ENV['driver'];
            }
        }
        return $config;
    }
}