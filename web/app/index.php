<?php

    include_once "../../cfg__init.php";



    spl_autoload_register(function ($class_name) {
        include 'php/c' . $class_name . '.php';
    });

    if (isset($_GET['ajax'])){
        include "php/ajax.php";
        exit;
    }

    if (isset($_GET['share'])){
        define('READONLY_MODE', true);
    } else {
        define('READONLY_MODE', false);
    }



    $User = new User();

    // ak to je neznamy user alebo sa nepodarilo ho prihlasit, vytvorime noveho anonyma
    if( ! isset($_COOKIE['uid']) || ( ! $User->loginAnonymousUser($_COOKIE['uid'], $_COOKIE['secure']))) {

        $User->createAnonymousUser();
        $expiry = time()+60*60*24*28;
        setcookie('uid', $User->getId(), $expiry); // expiracia po 28 dnoch
        setcookie('secure', $User->getSecureKey(), $expiry); // expiracia po 28 dnoch
        $showLanguageDialog = true;
    }

?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <!-- jQuery (ext) -->
    <!--<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">-->
    <!--<script src="https://code.jquery.com/jquery-1.12.4.js" crossorigin="anonymous"></script>-->
    <!--<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>-->

    <!-- jQuery (local) -->
    <link rel="stylesheet" href="ext/jquery-ui.css">
    <script src="ext/jquery-1.12.4.js"></script>
    <script src="ext/jquery-ui.js"></script>

    <!--<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/themes/smoothness/jquery-ui.css" />-->

    <!-- Bootstrap (ext) -->
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">-->
    <!--<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">-->
    <!--<script src="http://cdnjs.cloudflare.com/ajax/libs/tether/1.3.1/js/tether.min.js"></script>-->
    <!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/js/bootstrap.min.js" integrity="sha384-BLiI7JTZm+JWlgKa0M0kGRpJbF2J8q+qreVrKBC47e3K6BW78kGLrCkeRX6I9RoK" crossorigin="anonymous"></script>-->

    <!-- Bootstrap (local) -->
    <link rel="stylesheet" href="ext/bootstrap.min.css">
    <link rel="stylesheet" href="ext/font-awesome.min.css">
    <script src="ext/tether.min.js"></script>
    <script src="ext/bootstrap.min.js"></script>

    <!--3rd party-->
    <script type="text/javascript" src="ext/fabric.js"></script>
    <script type="text/javascript" src="ext/notify.js"></script>
<!--    <script type="text/javascript" src="ext/is.min.js"></script>-->

    <!-- Application -->
    <link rel="stylesheet" href="css/my-bootstrap.css"/>
    <link rel="stylesheet" href="css/my-jquery-ui.css"/>
    <link rel="stylesheet" href="css/app.css"/>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/trans<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/trans_<?php echo $User->getConfigValue('lang', 'en') . CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/app_constants<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/cQP<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/cPanel<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/cHoleRect<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/cHoleCirc<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/prototypes<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/app_exit<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/app<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/events<?php echo CFG_FILE_JS_EXT ?>"></script>
    <script type="text/javascript">

        const READONLY_MODE = <?php echo (READONLY_MODE) ? "true" : "false"; ?>;

        var TheUser = {
            id: <?php echo $User->getId()?>,
            secure: <?php echo $User->getSecureKey()?>
        }

        $( function() {
            initApplication();
        } );

        $(window).resize(function() {
            resizeApplication();
        });

        $(window).unload(function() {
            exitApplication();
        });
    </script>

</head>
<body>
    <!-- ------------------ -->
    <!--      top menu      -->
    <!-- ------------------ -->
    <nav class="navbar navbar-light bg-faded">
        <button class="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
        <a class="navbar-brand" href="http://www.quickpanel.sk/app"><img src="./img/qp-logo-80px.png" height="40px" style="vertical-align: top"></a>
        <div class="collapse navbar-toggleable-md" id="navbarResponsive">
            <ul class="nav navbar-nav">
<?php
// niektore ovladacie prvky zobrazime len ak sa nejedna o readonly pohlad na panel
if ( ! READONLY_MODE ):
?>
                <li class="nav-item">
                    <a class="nav-link" id="menu_new_recthole" href="javascript:addRectHole();">xxxxxxxxx</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="menu_new_circhole" href="javascript:addCircHole();">xxxxxxx</a>
                </li>
<?php
endif;
?>
                <li class="nav-item">
                    <a class="nav-link" id="menu_tools_marker" href="javascript:freehandToggle()">xxxxxxx</a>
                </li>

                <!--<li class="nav-item active dropdown">-->
                    <!--<a class="nav-link dropdown-toggle" href="http://example.com" id="responsiveNavbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select your bla</a>-->
                    <!--<div class="dropdown-menu" aria-labelledby="responsiveNavbarDropdown">-->
                        <!--<a class="dropdown-item" href="#">bla</a>-->
                        <!--<a class="dropdown-item" href="#">blaa</a>-->
                        <!--<a class="dropdown-item" href="#">blaaa</a>-->
                    <!--</div>-->
                <!--</li>-->

            </ul>
            <form class="form-inline float-lg-right">
                <input class="form-control" type="text" placeholder="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    </nav>

    <div id="canvasDiv">
	    <canvas id="mainCanvas"></canvas>
    </div>


     <!-- ------------------ -->
     <!--  properties panel  -->
     <!-- ------------------ -->
     <div id="propPanel" class="ui-widget-content">
        <div class="title"></div>
        <div class="items">
            <table id="propGrid"></table>
        </div>
    </div>


     <script type="text/javascript">
         // customization per user
         $("#propPanel").css("width", "<?php echo $User->getConfigValue('prop_panel_width', '300') ?>px");
     </script>

<?php
if (isset($showLanguageDialog) && ($showLanguageDialog === true)):
?>
    <!-- ------------------------ -->
    <!--  select language dialog  -->
    <!-- ------------------------ -->
    <div id="dialogChooseLang" title="xxxxxxxx">
        <p>xxxxxxxxxxxxxx</p>
        <div id="flags">
            <a href="#" name="en"><img class="flag ui-corner-all" src="https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg" alt="English"></a>
            <a href="#" name="cs"><img class="flag ui-corner-all" src="https://lipis.github.io/flag-icon-css/flags/4x3/cz.svg" alt="Czech"></a>
            <a href="#" name="sk"><img class="flag ui-corner-all" src="https://lipis.github.io/flag-icon-css/flags/4x3/sk.svg" alt="Slovak"></a>
        </div>
    </div>

    <script type="text/javascript" src="<?php echo CFG_FILE_JS_DIR ?>/welcome_dialog<?php echo CFG_FILE_JS_EXT ?>"></script>
<?php
endif; // if (isset($showLanguageDialog) && ($showLanguageDialog === true)):
?>


<!-- ------------------- -->
<!--  loading animation  -->
<!-- ------------------- -->
<div id="inProgressWaiting">
    <img id="animationRotating" src="img/loading.png" height="125px" />
</div>

</body>
</html>
