var ThePanel;
var TheCanvas;
var TheStatusText;
var TheClipboard;



function initApplication() {

    TheCanvas = new fabric.Canvas('mainCanvas');
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.preserveObjectStacking = true;
    TheCanvas.setBackgroundColor(COL_BACKGROUND, null);
    TheCanvas.setZoom( window.innerWidth / 600 );

    definePrototypes();

    ThePanel = new Panel({
        qp_width: 400,
        qp_height: 150,
        qp_thickness: 6,
        qp_r1: 5
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
}

