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

        Coin::clearMarketCapCache($this->currentUser);

        return true;
    }

    public function removeFromPortfolio($symbol)
    {
        
        $object = $this->get($symbol);
        $this->em->remove($object);
        $this->em->flush();

        Coin::clearMarketCapCache($this->currentUser);
        
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

        list($portfolio, $totalValue) = $this->mungePortfolio($list);
        $collection['results'] = $portfolio;
        $collection['total'] = count($portfolio);
        $collection['totalValue'] = $totalValue;
        return $collection;
    }
    
    public function getSymbolMap()
    {
        $map = [];
        $res = $this->getPortfolio();
        if (!empty($res)) {
            foreach ($res as $symbol => $quantity) {
                $map[$symbol] = true;
            }
        }
        return $map;
    }

    public function mungePortfolio($list)
    {
        $output = [];
        $totalValue = 0;
        $portfolio = $this->getPortfolio();
        if (!empty($portfolio)) {
            foreach ($list as $row) {
                if (isset($portfolio[$row['short']])) {
                    $quantity = $portfolio[$row['short']][0];
                    $value = 0;
                    if ($quantity) {
                        $value = $row['price'] * $quantity;
                        $totalValue += $value;
                    }
                    $output[] = [
                        'long' => $row['long'],
                        'short' => $row['short'],
                        'price' => $row['price'],
                        'value' => $value,
                        'quantity' => $quantity,
                        'image_url' => !empty($row['image_url']) ? $row['image_url'] : ''
                    ];
                }
            }
        }
        return [$output, $totalValue];
    }

    public function getPortfolio()
    {
        static $portfolio = false;
        if ($portfolio !== false) {
            return $portfolio;
        }
        $qb = $this->em->createQueryBuilder();
        $qb->select('c.symbol', 'a.quantity')
            ->from('\Coins\Entities\Favorite', 'f')
            ->innerJoin('\Coins\Entities\Coin', 'c', \Doctrine\ORM\Query\Expr\Join::WITH, 'f.coin=c.id')
            ->leftJoin('\Coins\Entities\Asset', 'a', \Doctrine\ORM\Query\Expr\Join::WITH, '(a.coin=c.id AND a.user=:value)')
            ->where('f.user = :value')
            ->setParameter('value', $this->currentUser);
        $portfolio = $qb->getQuery()->getResult('ASSOC_HYDRATOR');
        return $portfolio;
    }
}