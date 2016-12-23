var ThePanel;
var TheCanvas;

var status_text;



function initApplication() {

    TheCanvas = new fabric.Canvas('mainCanvas');
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.preserveObjectStacking = true;
    TheCanvas.setBackgroundColor(COL_BACKGROUND, null);
    TheCanvas.calcOffset();

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




    // demo diera obdlznikova
    TheCanvas.add(new fabric.Rect({
        width: 120,
        height: 85,
        left: 150,
        top: 150,
        fill: COL_BACKGROUND,
        qp_depth: 999,
        qp_type: FT_HOLE_RECT
    }));

    // demo kapsa obdlznikova
    TheCanvas.add(new fabric.Rect({
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
    TheCanvas.add(new fabric.Circle({
        radius: 60,
        left: 400,
        top: 330,
        fill: COL_BACKGROUND,
        qp_depth: 999,
        qp_type: FT_HOLE_CIRC
    }));

    // demo custom class
    TheCanvas.add(new HoleRect({
        left: 515,
        top: 330,
        width: 100,
        height: 100,
        r1: 10
    }));
    TheCanvas.add(new HoleRect({
        left: 600,
        top: 200,
        width: 50,
        height: 50,
        r1: 0
    }));
    TheCanvas.add(new HoleRect({
        left: 600,
        top: 100,
        width: 90,
        height: 90,
        r1: 0
    }));
    TheCanvas.add(new HoleRect({
        left: 700,
        top: 100,
        width: 90,
        height: 90,
        r1: 15
    }));




    initEventHandlers();

    showProperties(ThePanel);

    $( "#propPanel" ).draggable({ cancel: "div.items" });
}



