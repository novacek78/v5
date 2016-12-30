<?php

class User {

    /**
     * @var integer
     */
    private $_id;

    /**
     * @var integer
     */
    private $_secureKey;

    /**
     * @var User_DAO
     */
    private $DAO;

    public function __construct() {
        $this->DAO = new User_DAO();
    }

    /**
     * Vytvori noveho uzivatela, ktory sa zatial neregistroval - anonymny
     *
     * @return User
     */
    public function createAnonymousUser(){

        if ($newUser = $this->DAO->doCreateAnonymousUser()) {
            $this->_id = $newUser['id'];
            $this->_secureKey = $newUser['secure'];
        }
        return $this;
    }

    /**
     * Pri opakovanej navsteve stranky zaznamena do DB "prihlasenie" anonyma
     *
     * @param $uid int User ID
     * @param $secureKey int Secure key ("password" for anonymous)
     * @return bool
     */
    public function loginAnonymousUser($uid, $secureKey){

        if ($result = $this->DAO->doLoginAnonymousUser($uid, $secureKey)) {

            $this->_id = $result['id'];
            $this->_secureKey = $result['secure'];
            return true;

        } else {
            return false;
        }
    }

    /**
     * Vytiahne z DB konkretnu konfiguraciu pre daneho usera
     *
     * @param $key string Config name of value
     * @param $default mixed Default value
     * @return mixed
     */
    public function getConfigValue($key, $default){

        return $this->DAO->doGetConfigValue($this->_id, $key, $default);
    }

    /**
     * Zapise do DB konkretnu konfiguracnu hodnotu pre daneho usera
     *
     * @param $key string Nazov konfiguracneho parametra
     * @param $value mixed Hodnota
     * @return bool
     */
    public function setConfigValue($key, $value){

        return $this->DAO->doSetConfigValue($this->_id, $key, $value);
    }



    public function getId(){

        return $this->_id;
    }
    public function getSecureKey(){

        return $this->_secureKey;
    }
}