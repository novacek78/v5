<?php
require_once realpath('.')."/php/db.php";


class QPUser {

    /**
     * @var mysqli
     */
    private $_db;

    /**
     * @var integer
     */
    private $_id;

    /**
     * @var integer
     */
    private $_secureKey;

    public function __construct() {
        $this->_db = dbConnect();
    }

    public function createAnonymousUser(){

        $secure = mt_rand(1000, 1000000000);
        $this->_db->query("INSERT INTO qp2_user SET security_code = $secure");

        if ($this->_db->error){
            echo $this->_db->error;
            exit;
        }

        $result = $this->_db->query("SELECT LAST_INSERT_ID() AS newid FROM qp2_user");

        $row = $result->fetch_assoc();
        $this->_id = $row['newid'];
        $this->_secureKey = $secure;

        $this->_db->query("INSERT INTO qp2_config SET user_id = ".$this->_id);

        return $this;
    }

    public function loginAnonymousUser($uid, $secureKey){

        $result = $this->_db->query("SELECT * FROM qp2_user WHERE id=$uid AND security_code=$secureKey");
        $row = $result->fetch_assoc();
        if ($row){
            $this->_id = $uid;
            $this->_secureKey = $secureKey;
            $this->_db->query("UPDATE qp2_user SET last_login=NOW() WHERE id=$uid");
            return true;
        } else {
            return false;
        }
    }

    public function getId(){

        return $this->_id;
    }
    public function getSecureKey(){

        return $this->_secureKey;
    }
    public function getConfigValue($key, $default){

        $result = $this->_db->query("SELECT * FROM qp2_config WHERE user_id={$this->_id}");

        if ($result) {
            $row = $result->fetch_assoc();
            return $row[$key];
        } else
            return $default;
    }
}