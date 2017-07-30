<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/29/2017
 * Time: 9:20 PM
 */

namespace Coins\Service;

class Asset extends Base
{

    public static $class = 'Asset';

    public function __construct(array $args = [])
    {
        parent::__construct($args);

    }

    public function get($symbol)
    {
        if (!$this->currentUser || empty($symbol)) {
            throw new \Exception('Request cannot be processed');
        }
        $coin = $this->getObjectByField($symbol, 'symbol', [
            'class' => 'Coin'
        ]);
        if (!$coin) {
            throw new \Exception('Request cannot be processed');
        }
        $object = $this->getAssetObject($this->currentUser, $coin->getId());
        if (!$object) {
            throw new \Exception('No Assets found');
        }
        return $object;
    }

    public function createAsset($symbol, $quantity)
    {
        
        if (!$this->currentUser || empty($symbol) || empty($quantity)) {
            throw new \Exception('Request cannot be processed');
        }
        
        $coin = $this->getObjectByField($symbol, 'symbol', [
            'class' => 'Coin'
        ]);
        if (!$coin) {
            throw new \Exception('Request cannot be processed2');
        }

        $object = $this->getAssetObject($this->currentUser, $coin->getId());
        if ($object) {
            throw new \Exception('Asset already created');
        }

        $assetObject = new \Coins\Entities\Asset();
        $assetObject->setCoin($coin->getId());
        $assetObject->setUser($this->currentUser);
        $assetObject->setQuantity($quantity);


        $this->em->persist($assetObject);
        $this->em->flush();
        
        return true;
    }

    public function removeAsset($symbol)
    {

        $object = $this->get($symbol);
        $this->em->remove($object);
        $this->em->flush();
        return true;

    }

    public function updateAsset($symbol, $quantity)
    {
        if (!$this->currentUser || empty($symbol) || empty($quantity)) {
            throw new \Exception('Request cannot be processed');
        }
        $coin = $this->getObjectByField($symbol, 'symbol', [
            'class' => 'Coin'
        ]);
        if (!$coin) {
            throw new \Exception('Request cannot be processed2');
        }
        $assetObject = $this->getAssetObject($this->currentUser, $coin->getId());
        
        if (!$assetObject) {
            throw new \Exception('Asset not found');
        }

        $assetObject->setQuantity($quantity);
        
        $this->em->persist($assetObject);
        $this->em->flush();

        return true;
    }
    
    public function getAssetObject($user_id, $coin_id)
    {
        $object = $this->em->getRepository('\Coins\Entities\Asset')->findOneBy([
            'user' => $user_id,
            'coin' => $coin_id
        ]);
        return $object;
    }

    public function getList($args = [])
    {
       //TODO - implement this
        $collection = [
            'results' => [],
            'total' => 0
        ];

        return $collection;
    }
}