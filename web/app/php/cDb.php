<?php

require "../../cfg_db.php";



class Db {

    /**
     * @var string
     */
    private static $_lastSql = 'nothing yet';

    /**
     * @var bool
     */
    private static $_debugMode = false;

    /**
     * @var int
     */
    private static $_debugQueryCounter = 0;

    /**
     * @var mysqli
     */
    public static $Db;



    public static function __init() {

        if (is_null(self::$Db)) {
            self::$Db = new mysqli(CFG_DB_host, CFG_DB_user, CFG_DB_pwd);

            // Check connection
            if (self::$Db->connect_error) {
                Log::w("DB SQL connection failed: " . self::$Db->connect_error);
                return false;
            }

            // Select database
            self::$Db->select_db(CFG_DB_dbname);

            self::$Db->set_charset('utf8');
            if (self::$_debugMode) Log::w('----- DB connected -----');
        }
    }

    public static function query($sql) {

        self::$_lastSql = $sql;
        $result = self::$Db->query($sql);

        if ( ! $result) {
            Log::w($sql);
            Log::w(self::$Db->error);
        } else {
            if (self::$_debugMode) {
                self::$_debugQueryCounter++;
                Log::w('#' . self::$_debugQueryCounter . " : $sql");
                if (isset($result->num_rows))
                    Log::w("      " . $result->num_rows . " rows returned");
            }
        }

        return $result;
    }

    public static function escape($value) {
        return self::$Db->real_escape_string($value);
    }

    public static function getLastSql() {

        return self::$_lastSql;
    }
}

Db::__init();
