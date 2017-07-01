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
 * @Table(name="coin",indexes={@Index(name="symbol_idx", columns={"symbol"}),@Index(name="cc_idx", columns={"cryptocompare_id"})})
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
     * @Column(type="string", nullable=true)
     */
    protected $cryptocompare_id;

    /**
     * @Column(type="string", nullable=true)
     */
    protected $image_file_name;

    public function __construct() {}

    public function getId()
    {
        return $this->id;
    }

    public function getSymbol()
    {
        return $this->symbol;
    }

    public function setSymbol($symbol)
    {
        $this->symbol = strtoupper($symbol);
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getCryptocompareId()
    {
        return $this->cryptocompare_id;
    }

    public function setCryptocompareId($id)
    {
        $this->cryptocompare_id = $id;
    }

    public function getImageFileName()
    {
        return $this->image_file_name;
    }

    public function setImageFileName($file)
    {
        $this->image_file_name = $file;
    }

    public function getImageWebPath() {
        return COIN_IMAGE_PATH . '/' . $this->getImageFileName();
    }
}