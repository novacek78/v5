<!DOCTYPE html>
<html>
<head>
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

    <!-- Application -->
    <link rel="stylesheet" href="css/my-bootstrap.css"/>
    <link rel="stylesheet" href="css/app.css"/>
    <script type="text/javascript" src="js/trans-init.js"></script>
    <script type="text/javascript" src="js/trans_<?php echo "sk" ?>.js"></script>
    <script type="text/javascript" src="js/app_constants.js"></script>
    <script type="text/javascript" src="js/cQP.js"></script>
    <script type="text/javascript" src="js/cPanel.js"></script>
    <script type="text/javascript" src="js/cHoleRect.js"></script>
    <script type="text/javascript" src="js/cHoleCirc.js"></script>
    <script type="text/javascript" src="js/prototypes.js"></script>
    <script type="text/javascript" src="js/app-init.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="js/events.js"></script>
    <script type="text/javascript">
        $( function() {
            initApplication();
        } );
    </script>

</head>
<body>
     <!--top menu-->
    <nav class="navbar navbar-light bg-faded">
        <button class="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
        <a class="navbar-brand" href="http://www.quickpanel.sk/app"><img src="./img/qp-logo-80px.png" height="40px" style="vertical-align: top"></a>
        <div class="collapse navbar-toggleable-md" id="navbarResponsive">
            <ul class="nav navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="javascript:addRectHole();">Rectangular</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="javascript:addCircHole();">Circular</a>
                </li>
                <!--<li class="nav-item">-->
                    <!--<a class="nav-link" href="javascript:;">Circular</a>-->
                <!--</li>-->
                <li class="nav-item">
                    <a class="nav-link" href="javascript:freehandToggle()">Marker</a>
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

    <!--<div id="propertiesDiv" class="panel panel-primary draggable-panel toolbar-panel ui-draggable panel-heading ui-resizable" style="width: 200px; height: 500px; border: 1px solid #ccc; z-index: 9">-->
        <!--<canvas id="propertiesCanvas"></canvas>-->
    <!--</div>-->


    <div id="propPanel" class="ui-widget-content" style="">
        <div class="title"></div>
        <div class="items">
            <table id="propGrid"></table>
        </div>
    </div>

    <!--<div id="dialog" title="Basic dialog">-->
        <!--<p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>-->
    <!--</div>-->




</body>
</html>