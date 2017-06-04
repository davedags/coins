<?php

namespace Coins;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class App
{

    private $app;

    public function __construct($args = [])
    {

        $config = [];
        if ($this->debugMode()) {
            $config['displayErrorDetails'] = true;
        }

        $app = new \Slim\App([
            'settings' => $config
        ]);
        
        $app->options('/{routes:.+}', function ($request, $response, $args) {
            return $response;
        });
        
        $app->add(function ($req, $res, $next) {
            $response = $next($req, $res);
            return $response
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        });
        
        //Routes
        $app->get('/coins', 'Coins\Controller\Coin:getList');
                
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

}