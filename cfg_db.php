<?php

include_once 'cfg__init.php';


if (APP_ENV == 'dev') {

    // development
    define('CFG_DB_host', 'localhost');
    define('CFG_DB_user', 'root');
    define('CFG_DB_pwd', '');
    define('CFG_DB_dbname', 'quickpanel');

} else if (APP_ENV == 'prod') {

    // production
}
