<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/30/2017
 * Time: 4:56 PM
 */

use GuzzleHttp\Client;

require_once './bootstrap.php';
$em = $app->db->em;

$api_endpoint = 'https://www.cryptocompare.com/api/data/';
$remote_url_base = 'https://www.cryptocompare.com';

$http = new Client([
    'base_uri' => $api_endpoint,
    'timeout' => 3
]);

$imported = $counter = 0;
$response = $http->get($api_endpoint . "coinlist/");
if ($response->getStatusCode() == 200) {
    $body = $response->getBody()->getContents();
    if (($decoded = json_decode($body, true)) !== null) {
        $results = $decoded['Data'];
        echo 'Fetched ' . count($results) . " Coins for import ... \n\n";
        sleep(1);

        foreach ($results as $id => $row) {
            echo $counter++ . "\r";

            $coin = $em->getRepository('Coins\Entities\Coin')->findOneBy(['symbol' => $row['Name']]);
            if (!$coin) {
                
                $coin = new \Coins\Entities\Coin();
                $coin->setSymbol($row['Name']);
                $coin->setName($row['CoinName']);
                $coin->setCryptocompareId($row['Id']);

                if (!empty($row['ImageUrl'])) {
                    $url_parts = explode("/", $row['ImageUrl']);
                    $local_file_name = $row['Id'] . "_" . array_pop($url_parts);
                    $local_file_full_path = ASSET_DIR . "/icons/" . $local_file_name;
                    $ret = copyRemoteFile($http, $remote_url_base . $row['ImageUrl'], $local_file_full_path);
                    $coin->setImageFileName($local_file_name);
                }

                $em->persist($coin);
                $em->flush();
                $imported++;
            }
        }
    }
}

echo "Imported $imported coins\n\n";
exit;

function copyRemoteFile($http, $remote, $local) {
   if (file_exists($local)) {
       return true;
   }
    try {
        $response = $http->get($remote, ['sink' => $local]);
        if ($response->getStatusCode() != 200) {
          return false;
        }
        return true;
    } catch (Exception $e) {
        echo 'copyRemoteFile Error: ' . $e->getMessage();
        return false;
    }
}
