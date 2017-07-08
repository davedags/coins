<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/7/2017
 * Time: 8:44 PM
 */

namespace Coins\Hydrators;
use Doctrine\ORM\Internal\Hydration\AbstractHydrator, PDO;

class ColumnHydrator extends AbstractHydrator
{
    protected function hydrateAllData()
    {
        return $this->_stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}