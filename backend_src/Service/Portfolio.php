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

    public static $class = 'Favorite';

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
        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        if (!$object) {
            throw new \Exception('Coin not in portfolio');
        }
        return $object;
    }

    public function addToPortfolio($symbol)
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
        
        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        if ($object) {
            throw new \Exception('Coin already in portfolio');
        }
        
        $portfolioObject = new \Coins\Entities\Favorite();
        $portfolioObject->setCoin($coin->getId());
        $portfolioObject->setUser($this->currentUser);

      
        $this->em->persist($portfolioObject);
        $this->em->flush();

        $object = $this->getPortfolioObject($this->currentUser, $coin->getId());
        return true;
    }

    public function removeFromPortfolio($symbol)
    {
        
        $object = $this->get($symbol);
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
        $coin_service = new Coin([
                'container' => $this->container
            ]
        );
        $list_data = $coin_service->getMarketCapList();
        $list = $list_data['results'];

        $collection = [
            'results' => [],
            'total' => 0
        ];

        $portfolio = $this->mungePortfolio($list);
        $collection['results'] = $portfolio;
        $collection['total'] = count($portfolio);

        return $collection;
    }

    public function mungePortfolio($list)
    {
        $output = [];
        $portfolio = $this->getPortfolio();
        if (!empty($portfolio)) {
            foreach ($list as $row) {
                if (in_array($row['short'], $portfolio)) {
                    $output[] = $row;
                }
            }
        }
        return $output;
    }

    public function getPortfolio()
    {
        $sql = 'SELECT c.symbol FROM \Coins\Entities\Favorite f
               INNER JOIN \Coins\Entities\Coin c
               WHERE f.coin=c.id AND f.user = :value';
        $portfolio = $this->em->createQuery($sql)
            ->setParameter('value', $this->currentUser)
            ->getResult('COLUMN_HYDRATOR');

        return $portfolio;
    }
}