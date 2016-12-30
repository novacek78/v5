<?php

require "../../cfg_db.php";



class Db {

    /**
     * @var mysqli
     */
    private static $_connection;

    /**
     * @return mysqli
     */
    public static function getConnection() {

        if (isset(self::$_connection))
            return self::$_connection;

        // Create connection
        self::$_connection = new mysqli(CFG_DB_host, CFG_DB_user, CFG_DB_pwd);

        // Check connection
        if (self::$_connection->connect_error) {
            die("Connection failed: " . self::$_connection->connect_error);
        }

        // Select database
        self::$_connection->select_db(CFG_DB_dbname);

        self::$_connection->set_charset('utf8');

        return self::$_connection;
    }


}