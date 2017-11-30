#!/usr/bin/php
<?php
chdir(__DIR__);
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/30/2017
 * Time: 4:56 PM
 */

use GuzzleHttp\Client;

require_once './bootstrap.php';
$em = $app->db->em;

$coin_market_cap_api = 'https://api.coinmarketcap.com/v1/ticker/?limit=0';

$http = new Client([
    'base_uri' => $api_endpoint,
    'timeout' => 3
]);

//$jsoutput = "module.exports = {\n";
$seen = [];
$data = [];
$response = $http->get($coin_market_cap_api);
if ($response->getStatusCode() == 200) {
    $body = $response->getBody()->getContents();
    if (($decoded = json_decode($body, true)) !== null) {
        foreach ($decoded as $idx => $c) {
            $symbol = strtoupper($c['symbol']);
            $name = ucwords(strtolower($c['name']));
        
            $s2 = strtolower($c['symbol']);
            $n2 = strtolower($c['name']);
            if (empty($seen[$symbol])) {
                //$jsoutput .= "\t\"{$symbol}\": \"{$symbol}\"\n";
                //$data[] = "\t\"{$symbol}\": \"{$symbol}\"";

                $data[] = $symbol;
                $seen[$symbol] = 1;
            }
            //if (empty($seen[$name])) {
            if ($s2 != $n2) {
                //$jsoutput .= "\t\"{$name}\": \"{$symbol}\"";
                $data[] = $name;
                $seen[$name] = 1;
            }

            if ($idx == 100) {
                break;
            } else {
                //$jsoutput .= ",\n";
            }
        }
    }
}

echo join("\n", $data);

//$jsoutput = "module.exports = {\n" . join(",\n", $data) . "\n};";

//$jsoutput .= "\n};";


//echo $jsoutput;