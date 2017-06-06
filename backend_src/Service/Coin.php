<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 2/20/2017
 * Time: 4:16 PM
 */

namespace Coins\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;

class Coin
{

    private $http = null;
    const API_BASE_URL = 'http://www.coincap.io/';

    public function __construct(array $args = []) 
    {
        $this->http = new Client([
           'base_uri' => self::API_BASE_URL,
            'timeout' => 2
        ]);
    }

    public function fetchCollection(array $args = []) 
    {
        $cache = \Coins\Cache::Instance();
        if ($data = $cache->get('coins.list')) {
            return $data;
        }

        $collection = [
            'results' => [],
            'total' => 0
        ];
        $results = [];
        $response = $this->http->get(self::API_BASE_URL . "front");
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                $this->cleanseAPIResults($decoded);
                usort($decoded, ["\Coins\Service\Coin", "sortCoins"]);
                $collection['results'] = $decoded;
                $collection['total'] = count($decoded);
                $cache->set('coins.list', $data, 300);
            }
        }

        return $collection;
        
    }

    public function cleanseAPIResults(&$data)
    {
        foreach ($data as $idx => $row) {
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
    public static function sortCoins($a, $b)
    {

        if ((float) $a['mktcap'] < (float) $b['mktcap']) {
            return 1;
        } elseif ((float) $a['mktcap'] > (float) $b['mktcap']) {
            return -1;
        } else {
            return 0;
        }
    }

}