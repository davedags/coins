<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/3/2017
 * Time: 4:54 PM
 */

namespace Coins\Service;


class Portfolio extends Base 
{

    public static $class = 'favorite';

    public function __construct(array $args = [])
    {
        parent::__construct($args);

    }

    public function getList()
    {
        $list = [
            'results' => [],
            'total' => 0
        ];
        return $list;
    }
}