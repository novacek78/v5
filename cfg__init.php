<?php

define ('APP_ENV', getenv('APP_ENV')); // nacita nastavenie z .htaccess

// cesty k minifikovanym JS a CSS suborom + ich pripony
if (APP_ENV == 'prod'){

    define('CFG_FILE_JS_EXT', '.min.js');
    define('CFG_FILE_JS_DIR', 'js-min');
    define('CFG_FILE_CSS_EXT', '.min.css');
    define('CFG_FILE_CSS_DIR', 'css-min');

} else {

    define('CFG_FILE_JS_EXT', '.js');
    define('CFG_FILE_JS_DIR', 'js');
    define('CFG_FILE_CSS_EXT', '.css');
    define('CFG_FILE_CSS_DIR', 'css');

}




