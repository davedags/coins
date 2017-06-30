<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 2/20/2017
 * Time: 4:16 PM
 */

namespace Coins\Service;

use GuzzleHttp\Client;

class Coin
{

    private $http = null;
    public $cache;
    const API_MARKETCAP_BASE_URL = 'http://www.coincap.io/';
    const API_COMPARE_BASE_URL = 'https://www.cryptocompare.com/api/data/';

    public function __construct(array $args = []) 
    {
        $this->http = new Client([
            'base_uri' => self::API_MARKETCAP_BASE_URL,
            'timeout' => 3
        ]);
        $this->cache = \Coins\Cache::Instance();
    }

    public function getMarketCapList(array $args = []) 
    {
     
        $cache_key = 'coins.mk.list';
        if (0&&$data = $this->cache->get($cache_key)) {
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
                $this->cache->set($cache_key, $collection, 300);
            }
        }

        return $collection;
        
    }

    public function mungeMarketCapResults(&$data)
    {
        $symbol_map = $this->getCryptoCompareSymbolMap();
        foreach ($data as $idx => $row) {

            if (!empty($symbol_map[$row['short']])) {
                $map = $symbol_map[$row['short']];
                if (!empty($map['ImageUrl'])) {
                    $data[$idx]['cc_image'] = $map['ImageUrl'];
                }
                if (!empty($map['ImageUrl'])) {
                    $data[$idx]['cc_overview'] = $map['Url'];
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
        }
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

    public function getCryptoCompareList()
    {
        $cache_key = 'coins.cc.list';
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }

        $collection = [
            'results' => [],
            'total' => 0
        ];

        $response = $this->http->get(self::API_COMPARE_BASE_URL . "coinlist/");
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                $results = $decoded['Data'];
                usort($results, ["\Coins\Service\Coin", "sortCryptoCompareList"]);
                $collection['results'] = $results;

                $collection['total'] = count($results);
                $this->cache->set($cache_key, $collection, 60 * 60 * 24);
            }
        }

        return $collection;
    }

    public function getCryptoCompareSymbolMap($list = null)
    {
        $cache_key = 'coins.cc.symbolmap';
        if ($data = $this->cache->get($cache_key)) {
            return $data;
        }

        $map = $data = [];
        if (is_null($list)) {
            $list = $this->getCryptoCompareList();
        }
        if ($list['total'] > 0) {
            foreach ($list['results'] as $row) {
                $map[$row['Name']] = $row;
            }
            $this->cache->set($cache_key, $map, 60 * 60 * 24);
        }
        return $map;
    }

    public static function sortCryptoCompareList($a, $b)
    {

        if ($a['Name'] > $b['Name']) {
            return 1;
        } elseif ($a['Name'] < $b['Name']) {
            return -1;
        } else {
            return 0;
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


}