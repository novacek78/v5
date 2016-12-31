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
        thickness: 6,
        r1: 5,
        version: '0.1'
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

    $( "#propPanel" ).draggable({ cancel: "div.items" }); // moznost tahat properties panel
    $.notify.defaults({ className: "error", position: "left top" }); // defaultny typ notify spravy

    // naplnenie textov do HTML kodu aplikacie
    $( "#menu_new_circhole" ).text(_('Circular hole'));
    $( "#menu_new_recthole" ).text(_('Rectangular hole'));
    $( "#menu_tools_marker" ).text(_('Marker tool'));
}

