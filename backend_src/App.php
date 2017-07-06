<?php

namespace Coins;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

define('APP_BASE', dirname(dirname(getcwd()))); 
define('CONFIG_DIR', APP_BASE . "/config");
define('ASSET_DIR' , APP_BASE . "/src/assets");
define('ASSET_WEB_PATH', '/assets');
define('COIN_IMAGE_PATH', ASSET_WEB_PATH . '/icons');

class App
{

    private $app;
    public $mode = 'web';
    public $db;

    public function __construct($args = [])
    {

        $config = [];
        if ($this->debugMode()) {
            $config['displayErrorDetails'] = true;
        }

        $this->initEnvironment();
        
        $this->db = DB::Instance();

        if (!empty($args['mode']) && $args['mode'] == 'tools') {
            $this->mode = 'tools';
            return;
        }

        $app = new \Slim\App([
            'settings' => $config
        ]);

        $container = $app->getContainer();

        $container['em'] = function () {

            return $this->db->em;
        };
        $app->options('/{routes:.+}', function ($request, $response, $args) {
            return $response;
        });
        
        $app->add(function ($req, $res, $next) {
            $response = $next($req, $res);
            return $response
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        });

        /**
        $app->add(new \Slim\Middleware\JwtAuthentication([
            "path" => ["/portfolio"],
            "secret" => Auth::getSecret(),
            "callback" => function ($request, $response, $arguments) use ($container) {
                $container["jwt"] = $arguments["decoded"];
            }
        ]));**/

        //Routes
        $app->get('/coins', 'Coins\Controller\Coin:getList');
        $app->get('/coins/{id}', 'Coins\Controller\Coin:getDetail');
        $app->get('/price/{id}', 'Coins\Controller\Coin:getPrice');
        $app->post('/login', 'Coins\Controller\User:login');
        $app->post('/users', 'Coins\Controller\User:create');
        
        $app->get('/portfolio', 'Coins\Controller\Portfolio:getList');
        $app->post('/portfolio', 'Coins\Controller\Portfolio:create');
        $app->delete('/portfolio/{id}', 'Coins\Controller\Portfolio:delete');
        
        $this->app = $app;
    }



    
    public function debugMode()
    {
        if (!empty($_GET['debug'])) {
            return true;
        }
    }

    public function getApp()
    {
        return $this->app;
    }
    
    public function run()
    {
        $this->getApp()->run();
    }
    
    private function initEnvironment()
    {
        if (file_exists($config_file = CONFIG_DIR . "/config.inc")) {
            include_once($config_file);
        }
        if (file_exists(CONFIG_DIR . "/.env")) {
            $dotenv = new \Dotenv\Dotenv(CONFIG_DIR);
            $dotenv->load();
        }
    }

}