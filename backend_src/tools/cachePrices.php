#!/usr/bin/php
<?php

use Coins\Cache;
use Coins\Service\Coin;

chdir(__DIR__);

use GuzzleHttp\Client;

require_once './bootstrap.php';

$coin_market_cap_api = 'https://api.coinmarketcap.com/v1/ticker/?limit=0';

$cache = Cache::Instance();

$http = new Client([
    'base_uri' => $api_endpoint,
    'timeout' => 5
]);

$x = 0;
$response = $http->get($coin_market_cap_api);
if ($response->getStatusCode() == 200) {
    $body = $response->getBody()->getContents();
    if (($decoded = json_decode($body, true)) !== null) {
        foreach ($decoded as $idx => $c) {
            if ($c['price_usd']) {
                echo 'caching ' . $c['symbol'] . ' with price ' . $c['price_usd'] . ' for ' . Coin::API_CACHE_TIME . "\n";
                $cache->set(Coin::getPriceCacheKey($c['symbol']), $c['price_usd'], Coin::API_CACHE_TIME);
                $x++;
            }
        }
    }
}

echo 'Cached ' . $x . ' coin prices';
exit;