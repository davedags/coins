<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/3/2017
 * Time: 4:54 PM
 */

namespace Coins\Service;
use GuzzleHttp\Client;


class Portfolio extends Base 
{

    public static $class = 'favorite';
    const API_MARKETCAP_BASE_URL = 'http://www.coincap.io/';

    public function __construct(array $args = [])
    {
        parent::__construct($args);
        $this->http = new Client([
            'timeout' => 3
        ]);

    }

    public function addToPortfolio($symbol)
    {
        if (empty($this->currentUser) || empty($symbol)) {
            throw new \Exception('Request cannot be processed');
        }
        $coin = $this->getObjectByField($symbol, 'symbol', [
            'class' => 'Coin'
        ]);
        if (!$coin) {
            throw new \Exception('Request cannot be processed');
        }
        
        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        if ($object) {
            throw new \Exception('Coin already in portfolio');
        }
        
        $portfolioObject new \Coins\Entities\Favorite();
        $portfolioObject->setCoin($coin->getId());
        $portfolioObject->setUser($this->currentUser);

      
        $this->em->persist($portfolioObject);
        $this->em->flush();

        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        return true;
    }

    public function removeFromPortfolio($symbol)
    {
        if (empty($this->currentUser) || empty($symbol)) {
            throw new \Exception('Request cannot be processed');
        }
        $coin = $this->getObjectByField($symbol, 'symbol', [
            'class' => 'Coin'
        ]);
        if (!$coin) {
            throw new \Exception('Request cannot be processed');
        }
        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        if (!$object) {
            throw new \Exception('Coin not in portfolio');
        }
        
        $this->em->remove($object);
        $this->em->flush();
        
        return true;
        
    }

    public function getPortfolioObject($user_id, $coin_id)
    {
        $object = $this->em->getRepository('\Coins\Entities\Favorite')->findOneBy([
            'user' => $user_id,
            'coin' => $coin_id
        ]);
        return $object;
    }
    public function getList($args = [])
    {

        $collection = [
            'results' => [],
            'total' => 0
        ];

        $response = $this->http->get(self::API_MARKETCAP_BASE_URL . "front");
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                $this->mungeMarketCapResults($decoded);
                usort($decoded, ["\Coins\Service\Coin", "sortMarketCapList"]);
                $collection['results'] = $decoded;
                $collection['total'] = count($decoded);
                $collection['marketCap'] = $this->getTotalMarketCap($collection['results']);
                $this->cache->set($cache_key, $collection, 300);
            }
        }

        return $collection;
    }

    public function mungeMarketCapResults($decoded)
    {
        $portfolio = $this->getPortfolio();
        if (!empty($portfolio)) {
            
        }

    }

    public function getPortfolio()
    {
        $this->currentUser = 1;
        //ay('name' => 'foo', 'price' => 19.99));
        $portfolio = $this->em->getRepository('\Coins\Entities\Favorite')->findBy([
            'user' => $this->currentUser]);
        print_r($portfolio);
        exit;
    }
}