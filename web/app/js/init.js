var ThePanel;
var canvas;

var status_text;



function initApplication() {

    canvas = new fabric.Canvas('mainCanvas');
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.preserveObjectStacking = true;
    canvas.setBackgroundColor(COL_BACKGROUND, null);
    canvas.calcOffset();

    definePrototypes();

    ThePanel = new Panel({
        qp_width: 1000,
        qp_height: 400,
        qp_thickness: 6,
        qp_r1: 6
    });
    canvas.add(ThePanel);

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
    canvas.add(status_text);




    // demo diera obdlznikova
    canvas.add(new fabric.Rect({
        width: 120,
        height: 85,
        left: 150,
        top: 150,
        fill: COL_BACKGROUND,
        qp_depth: 999,
        qp_type: FT_HOLE_RECT
    }));

    // demo kapsa obdlznikova
    canvas.add(new fabric.Rect({
        width: 80,
        height: 100,
        left: 350,
        top: 270,
        fill: COL_FEATURE_POCKET,
        rx: 12,
        qp_depth: 1,
        qp_type: FT_HOLE_RECT
    }));

    // demo diera kruhova
    canvas.add(new fabric.Circle({
        radius: 60,
        left: 400,
        top: 330,
        fill: COL_BACKGROUND,
        qp_depth: 999,
        qp_type: FT_HOLE_CIRC
    }));

    // demo custom class
    var testHole = new HoleRect({
        left: 515,
        top: 330,
        qp_width: 100,
        qp_height: 100,
        qp_r1: 10
    });
    canvas.add(testHole);
    var testHole = new HoleRect({
        left: 600,
        top: 200,
        qp_width: 50,
        qp_height: 50,
        qp_r1: 0
    });
    canvas.add(testHole);





    initEventHandlers();

    showProperties(ThePanel);

    $( "#propPanel" ).draggable({ cancel: "div.items" });
};



