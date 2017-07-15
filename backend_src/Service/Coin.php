<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 2/20/2017
 * Time: 4:16 PM
 */

namespace Coins\Service;

use GuzzleHttp\Client;

class Coin extends Base
{

    
    private $http = null;
    public static $class = 'Coin';
    const API_MARKETCAP_BASE_URL = 'http://www.coincap.io/';
    const API_COMPARE_BASE_URL = 'https://www.cryptocompare.com/api/data/';
    const API_SIMPLE_PRICE_URL = 'https://min-api.cryptocompare.com/data/price?';

    public function __construct(array $args = []) 
    {
        parent::__construct($args);
        $this->http = new Client([
            'timeout' => 3
        ]);

    }

    public static function getMarketCapCacheKey($user = null)
    {
        return 'coins.mk.list.' . $user ?: 'public';
    }
    
    public static function clearMarketCapCache($user = null) 
    {
        $cache_key = self::getMarketCapCacheKey($user);
        $cache = \Coins\Cache::Instance();
        if ($cache) {
            $cache->set($cache_key, null);
        }
    }
    
    public function getMarketCapList(array $args = []) 
    {
        
        $cache_key = self::getMarketCapCacheKey($this->getUser());
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }

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
    
    public function mungeMarketCapResults(&$data)
    {
        $symbol_map = $this->getSymbolMap();
        $portfolio_map = [];
        if ($this->getUser()) {
            $portfolio_service = new Portfolio([
                    'container' => $this->container
                ]
            );
            $portfolio_map = $portfolio_service->getSymbolMap();
        }
        foreach ($data as $idx => $row) {
            $row['short'] = strtoupper($row['short']);
            if (!empty($symbol_map[$row['short']])) {
                $coin = $symbol_map[$row['short']];
                if (!empty($coin['image_file_name'])) {
                    $data[$idx]['image_url'] = COIN_IMAGE_PATH . '/' . $coin['image_file_name'];
                }
            }
            $fields = [
                'price',
                'mktcap'
            ];
            foreach ($fields as $field) {
                if ($row[$field] === "NaN") {
                    $data[$idx][$field] = 0;
                }
            }
            if (!empty($portfolio_map[$row['short']])) {
                $data[$idx]['in_portfolio'] = true;
            } else {
                $data[$idx]['in_portfolio'] = false;
            }
        }

    }
    
    public function getTotalMarketCap($data)
    {
        $total = 0;
        foreach ($data as $row) {
            $total += $row['mktcap'];
        }
        return $total;
    }

    
    public static function sortMarketCapList($a, $b)
    {

        if ((float) $a['mktcap'] < (float) $b['mktcap']) {
            return 1;
        } elseif ((float) $a['mktcap'] > (float) $b['mktcap']) {
            return -1;
        } else {
            return 0;
        }
    }

    public function getSymbolMap()
    {
    
        $cache_key = 'coins.cc.symbolmap';
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }

        $query = $this->em->createQuery('SELECT c from \Coins\Entities\Coin c');
        $coins = $query->getArrayResult();
        $map = [];
        if (is_array($coins) && count($coins) > 0) {
            foreach ($coins as $coin) {
                $map[$coin['symbol']] = $coin;
            }
            $this->cache->set($cache_key, $map, 3600 * 24);
        }
        return $map;
    }


    public function getPriceBySymbol($symbol)
    {
        $cache_key = 'coins.cc.price.' . $symbol;
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }
        $query_params = [
            'fsym' => strtoupper($symbol),
            'tsyms' => 'USD'
        ];
        $data = [];
        $response = $this->http->get(self::API_SIMPLE_PRICE_URL . http_build_query($query_params));
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                if (!empty($decoded['USD'])) {
                    $data = $decoded['USD'];
                    $this->cache->set($cache_key, $data, 180);
                }
            }
        }
        return $data;
    }


    public function getDetailBySymbol($symbol)
    {
        $cache_key = 'coins.cc.detail.' . $symbol;
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }
        $data = [];
        $coin = $this->getObjectByField($symbol, 'symbol');
        if ($coin) {
            $query_params = [
                'id' => $coin->getCryptocompareId()
            ];
            $response = $this->http->get(self::API_COMPARE_BASE_URL . "coinsnapshotfullbyid?" . http_build_query($query_params));
            if ($response->getStatusCode() == 200) {
                $body = $response->getBody()->getContents();
                if (($decoded = json_decode($body, true)) !== null) {
                    $data = $decoded['Data']['General'];
                    $data['image_url'] = $coin->getImageWebPath();
                    $this->cache->set($cache_key, $data, 3600 * 24);
                }
            }
        }
        return $data;
    }





}