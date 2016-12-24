var ThePanel;
var TheCanvas;

var status_text;



function initApplication() {

    TheCanvas = new fabric.Canvas('mainCanvas');
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.preserveObjectStacking = true;
    TheCanvas.setBackgroundColor(COL_BACKGROUND, null);
    //TheCanvas.calcOffset();

    definePrototypes();

    ThePanel = new Panel({
        qp_width: 1000,
        qp_height: 400,
        qp_thickness: 6,
        qp_r1: 0
    });
    TheCanvas.add(ThePanel);

    status_text = new fabric.Text('',{
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
    TheCanvas.add(status_text);




    // demo custom class
    TheCanvas.add(new HoleRect({
        left: 500,
        top: 200,
        qp_width: 100,
        qp_height: 100,
        r1: 10
    }));




    initEventHandlers();

    showProperties(ThePanel);

    $( "#propPanel" ).draggable({ cancel: "div.items" });
}



