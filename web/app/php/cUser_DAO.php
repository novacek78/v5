<?php

class User_DAO {

    /**
     * @var mysqli
     */
    private $_Db;

    public function __construct(){

        $this->_Db = Db::getConnection();
    }

    /**
     * @return array|bool
     */
    public function doCreateAnonymousUser(){

        $return = false;

        $secure = mt_rand(1000, 1000000000);
        $this->_Db->query("INSERT INTO qp2_user SET security_code = $secure");

        if ($this->_Db->error){
            //TODO log error
            echo $this->_Db->error;
            return $return;
        }

        $result = $this->_Db->query("SELECT LAST_INSERT_ID() AS newid FROM qp2_user");

        $row = $result->fetch_assoc();
        $return = array(
            'id' => $row['newid'],
            'secure' => $secure
        );

        $this->_Db->query("INSERT INTO qp2_config SET user_id = ".$return['id']);

        return $return;
    }

    /**
     * @param $uid
     * @param $secureKey
     * @return array|bool
     */
    public function doLoginAnonymousUser($uid, $secureKey){

        $return = false;

        $uid = $this->_Db->real_escape_string($uid);
        $secureKey = $this->_Db->real_escape_string($secureKey);

        try {
            $result = $this->_Db->query("SELECT * FROM qp2_user WHERE id=$uid AND security_code=$secureKey");
            $row = $result->fetch_assoc();

            if (($row) && ($uid == $row['id'])){
                $return = array(
                    'id' => $uid,
                    'secure' => $secureKey
                );

                $result = $this->_Db->query("UPDATE qp2_user SET last_login=NOW() WHERE id=$uid");
                if ( ! $result)
                    throw new Exception();

            } else
                throw new Exception('No such user!');

        } catch (Exception $e)  {
            return $return;
        }
        return $return;
    }

    /**
     * @param $uid
     * @param $key
     * @param $default
     * @return string
     */
    public function doGetConfigValue($uid, $key, $default){

        $return = $default;

        $uid = $this->_Db->real_escape_string($uid);

        try {
            $result = $this->_Db->query("SELECT * FROM qp2_config WHERE user_id=$uid");

            if ($result) {
                $row = $result->fetch_assoc();
                $return = $row[$key];
            }
        } catch (Exception $e)  {}

        return $return;
    }

    /**
     * @param $uid
     * @param $key
     * @param $value
     * @return bool
     */
    public function doSetConfigValue($uid, $key, $value){

        $uid = $this->_Db->real_escape_string($uid);
        $key = $this->_Db->real_escape_string($key);
        $value = $this->_Db->real_escape_string($value);

        $result = $this->_Db->query("UPDATE qp2_config SET $key='$value' WHERE user_id=$uid");

        if ($result) return true;
        else return false;
    }




}