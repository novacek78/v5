<?php

define('ENV', 'dev');

if (ENV == 'dev') {
    // development
    define('CFG_DB_host', 'localhost');
    define('CFG_DB_user', 'root');
    define('CFG_DB_pwd', '');
    define('CFG_DB_dbname', 'quickpanel');
}
else if (ENV == 'prod') {
    // production
}

