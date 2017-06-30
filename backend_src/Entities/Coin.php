<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 6/24/2017
 * Time: 10:53 PM
 */

namespace Coins\Entities;

/**
 * @Entity
 * @Table(name="coin")
 */
class Coin
{
    /**
     * @Id
     * @Column(name="coin_id", type="integer")
     * @GeneratedValue
     */
    protected $id;

    /**
     * @Column(type="string")
     */
    protected $symbol;

    /**
     * @Column(type="string")
     */
    protected $name;

    /**
     * @Column(type="integer")
     */
    protected $cryptocompare_id;

    /**
     * @Column(type="string")
     */
    protected $cryptocompare_image_url;

    /**
     * @Column(type="string")
     */
    protected $cryptocompare_detail_url;


    
}