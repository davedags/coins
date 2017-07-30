<?php
/**
 * Created by PhpStorm.
 * User: daved_000
 * Date: 7/29/2017
 * Time: 9:09 PM
 */

namespace Coins\Entities;

/**
 * @Entity
 * @Table(name="asset",
 *        indexes={@Index(name="coin_idx", columns={"coin_id"}),
 *                 @Index(name="user_idx", columns={"user_id"}),
 *                 @Index(name="coin_user_idx", columns={"coin_id", "user_id"})})
 *
 **/

class Asset
{
    /**
     * @Id
     * @Column(name="asset_id", type="integer")
     * @GeneratedValue
     */
    protected $id;
    /**
     * @Column(name="coin_id", type="integer")
     */
    protected $coin;
    /**
     * @Column(name="user_id", type="integer")
     */
    protected $user;

    /**
     * @Column(name="quantity", type="decimal", precision=20, scale=9)
     */
    protected $quantity;

    public function __construct() {}

    public function getId()
    {
        return $this->id;
    }

    public function getCoin()
    {
        return $this->coin;
    }

    public function setCoin($coin)
    {
        $this->coin = $coin;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getQuantity()
    {
        return $this->quantity;
    }

    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }
}