var ThePanel;
var TheCanvas;
var TheStatusText;
var TheClipboard;



function initApplication() {

    TheCanvas = new fabric.Canvas('mainCanvas');
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.preserveObjectStacking = true;
    TheCanvas.setBackgroundColor(PANEL_SURFCOLOR_AVAILABLE_COLBGND[ PANEL_SURFCOLOR_AVAILABLE.indexOf('RAW') ], null);
    TheCanvas.setZoom( window.innerWidth / 600 );

    definePrototypes();

    ThePanel = new Panel({
        qp_width: 400,
        qp_height: 150,
        qp_thickness: 6,
        qp_r1: 5,
        qp_version: '0.1'
    });

    TheStatusText = new fabric.Text('',{
        originX: 'left',
        originY: 'bottom',
        left: 20,
        top: window.innerHeight - TOOLBAR_HEIGHT - 10,
        fontSize: STATUSBAR_FONT_SIZE,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fill: '#bbb',
        hasRotatingPoint: false
    });

    TheCanvas.add(ThePanel, TheStatusText);

    initEventHandlers();

    showProperties(ThePanel);

    $( "#propPanel" ).draggable({ cancel: "div.items" });
    $.notify.defaults({ className: "error", position: "left top" });

    $( "#menu_new_circhole" ).text(_('Circular hole'));
    $( "#menu_new_recthole" ).text(_('Rectangular hole'));
    $( "#menu_tools_marker" ).text(_('Marker tool'));
}

