<?php

class User_DAO {

    /**
     * Ked sa raz nacita konfiguracia, ulozi sa sem aby sa pre 4 hodnoty nerobili 4 selecty
     *
     * @var array
     */
    private $_cfgCache;

    /**
     * @return array|bool
     */
    public function doCreateAnonymousUser(){

        $return = false;

        Db::query("BEGIN");

        $secure = mt_rand(1000, 1000000000);
        $result = Db::query("INSERT INTO qp2_user SET security_code = $secure");

        if ( ! $result){
            Db::query("ROLLBACK");
            return $return;
        }

        $result = Db::query("SELECT LAST_INSERT_ID() AS newid FROM qp2_user");

        $row = $result->fetch_assoc();
        $return = array(
            'id' => $row['newid'],
            'secure' => $secure
        );

        $result = Db::query("INSERT INTO qp2_config SET user_id = ".$return['id']);

        if ( ! $result){
            Db::query("ROLLBACK");
            return $return;
        }

        Db::query("COMMIT");
        return $return;
    }

    /**
     * @param $uid
     * @param $secureKey
     * @return array|bool
     */
    public function doLoginAnonymousUser($uid, $secureKey){

        $return = false;

        $uid = Db::$Db->real_escape_string($uid);
        $secureKey = Db::$Db->real_escape_string($secureKey);

        try {
            $result = Db::query("SELECT * FROM qp2_user WHERE id=$uid AND security_code=$secureKey");
            $row = $result->fetch_assoc();

            if (($row) && ($uid == $row['id'])){
                $return = array(
                    'id' => $uid,
                    'secure' => $secureKey
                );

                $result = Db::query("UPDATE qp2_user SET last_login=NOW() WHERE id=$uid");
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

        if ( ! isset($this->_cfgCache)) {
            // cache je prazdna, tak ju nacitame z DB
            $uid = Db::$Db->real_escape_string($uid);

            $result = Db::query("SELECT * FROM qp2_config WHERE user_id=$uid");

            if ($result) {
                $this->_cfgCache = $result->fetch_assoc();
            } else {
                return $default;
            }
        }

        return $this->_cfgCache[$key];
    }

    /**
     * @param $uid
     * @param $key
     * @param $value
     * @return bool
     */
    public function doSetConfigValue($uid, $key, $value){

        $uid = Db::$Db->real_escape_string($uid);
        $key = Db::$Db->real_escape_string($key);
        $value = Db::$Db->real_escape_string($value);

        $result = Db::query("UPDATE qp2_config SET $key='$value' WHERE user_id=$uid");

        $this->_cfgCache = null;

        if ($result) return true;
        else return false;
    }

}