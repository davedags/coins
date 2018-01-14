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
    const API_COMPARE_BASE_URL = 'https://www.cryptocompare.com/api/data/';
    const API_SIMPLE_PRICE_URL = 'https://min-api.cryptocompare.com/data/price?';
    const API_COINMARKETCAP_BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/';
    const API_CACHE_TIME = 660;

    public function __construct(array $args = [])
    {
        parent::__construct($args);
        $this->http = new Client([
            'timeout' => 10
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

        if ($api_results = $this->getCoinMarketCapAPIData()) {
            $this->mungeMarketCapResults($api_results);
            usort($api_results, ["\Coins\Service\Coin", "sortMarketCapList"]);
            $collection['results'] = $api_results;
            $collection['total'] = count($api_results);
            $collection['marketCap'] = $this->getTotalMarketCap($collection['results']);
            $this->cache->set($cache_key, $collection, self::API_CACHE_TIME);
        }

        return $collection;
    }

    public function getCoinMarketCapAPIData()
    {
        $list_cache_key = 'coins.mkcap.api';
        if ($data = $this->cache->get($list_cache_key)) {
            return $data;
        }
        $api_results = [];
        try {
            $response = $this->http->get(self::API_COINMARKETCAP_BASE_URL . "?limit=0");
            if ($response->getStatusCode() == 200) {
                $body = $response->getBody()->getContents();
                if (($decoded = json_decode($body, true)) !== null) {
                    $api_results = $decoded;
                    foreach ($api_results as $idx => $data) {
                        if ($data['price_usd']) {
                            $this->cache->set(self::getPriceCacheKey($data['symbol']), $data['price_usd'], self::API_CACHE_TIME);
                        }
                    }
                    $this->cache->set($list_cache_key, $api_results, self::API_CACHE_TIME);
                }
            }
        } catch (\GuzzleHttp\Exception\ConnectException $e) {

        }
        return $api_results;
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
            $row['symbol'] = strtoupper($row['symbol']);
            if (!empty($symbol_map[$row['symbol']])) {
                $coin = $symbol_map[$row['symbol']];
                if (!empty($coin['image_file_name'])) {
                    $data[$idx]['image_url'] = COIN_IMAGE_PATH . '/' . $coin['image_file_name'];
                }
            }
            $fields = [
                'price_usd',
                'market_cap_usd'
            ];
            foreach ($fields as $field) {
                if ($row[$field] === "NaN") {
                    $data[$idx][$field] = 0;
                }
            }
            if (!empty($portfolio_map[$row['symbol']])) {
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
            $total += $row['market_cap_usd'];
        }
        return $total;
    }


    public static function sortMarketCapList($a, $b)
    {

        if ((float)$a['market_cap_usd'] < (float)$b['market_cap_usd']) {
            return 1;
        } elseif ((float)$a['market_cap_usd'] > (float)$b['market_cap_usd']) {
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


    public static function getPriceCacheKey($symbol)
    {
        return 'coins.cc.price.' . strtoupper($symbol);
    }

    public function getPriceBySymbol($symbol)
    {

        $cache_key = self::getPriceCacheKey($symbol);
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }
        $data = [];
        $coin = $this->getObjectByField($symbol, 'symbol');

        /**
         API LIMITS KILL ABILITY TO LOOK UP PRICES IN REAL TIME.   MOVED TO CRON JOB
        if ($mkt_cap_id = $coin->getCmcapId()) {

            $response = $this->http->get(self::API_COINMARKETCAP_BASE_URL . $mkt_cap_id);
            if ($response->getStatusCode() == 200) {
                $body = $response->getBody()->getContents();
                if (($decoded = json_decode($body, true)) !== null) {
                    $data = $decoded[0]['price_usd'];
                }
            }
         **/
        $query_params = [
            'fsym' => strtoupper($symbol),
            'tsyms' => 'USD'
        ];
        $response = $this->http->get(self::API_SIMPLE_PRICE_URL . http_build_query($query_params));
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                if (!empty($decoded['USD'])) {
                    $data = $decoded['USD'];
                }
            }
        }


        if ($data) {
            $this->cache->set($cache_key, $data, self::API_CACHE_TIME);
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

        $storedData = $coin->getCryptocompareDetail();
        if ($storedData) {
            $storedDataText = stream_get_contents($storedData);
            if ($storedDataText) {
                $data = json_decode($storedDataText, true);
            }
        }

        if (empty($data) && $coin) { 
            $query_params = [
                'id' => $coin->getCryptocompareId()
            ];
            $response = $this->http->get(self::API_COMPARE_BASE_URL . "coinsnapshotfullbyid?" . http_build_query($query_params));
            if ($response->getStatusCode() == 200) {
                $body = $response->getBody()->getContents();
                if (($decoded = json_decode($body, true)) !== null) {
                    $data = $decoded['Data']['General'];
                    $data['image_url'] = $coin->getImageWebPath();
                }
            }
        }
     
        if (!empty($data)) {
            $this->cache->set($cache_key, $data, 3600 * 24);
        }
        return $data;
    }





}