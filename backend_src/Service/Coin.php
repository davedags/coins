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
        $collection = [
            'results' => [],
            'total' => 0
        ];
        $results = [];
        $response = $this->http->get(self::API_BASE_URL . "front");
        if ($response->getStatusCode() == 200) {
            $body = $response->getBody()->getContents();
            if (($decoded = json_decode($body, true)) !== null) {
                usort($decoded, ["\Coins\Service\Coin", "sortCoins"]);
                $collection['results'] = $decoded;
                $collection['total'] = count($decoded);
            }
        }

        return $collection;
        
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