<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/30/2017
 * Time: 2:05 PM
 */

namespace Coins\Hydrators;
use Doctrine\ORM\Internal\Hydration\AbstractHydrator, PDO;

class AssocArrayHydrator extends AbstractHydrator
{
    protected function hydrateAllData()
    {

        return $this->_stmt->fetchALL(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
    }
}