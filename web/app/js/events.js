function initEventHandlers() {

    // klavesove skratky
    document.onkeyup = function(e){

        if (document.activeElement != document.body) return false; // chytame len stlacenia na ploche/canvase

        // DEL
        if ((e.keyCode == 46) && (TheCanvas.getActiveObject()))
            TheCanvas.getActiveObject().remove();

        // H
        if ((e.keyCode == 72) && (TheCanvas.getActiveObject()))
            TheCanvas.getActiveObject().set('lockMovementY', !TheCanvas.getActiveObject().lockMovementY);

        // V
        if ((e.keyCode == 86) && (TheCanvas.getActiveObject()))
            TheCanvas.getActiveObject().set('lockMovementX', !TheCanvas.getActiveObject().lockMovementX);

        // X
        if ((e.keyCode == 88) && (TheCanvas.getActiveObject()))
            TheCanvas.getActiveObject().set('depth', 1);

        TheCanvas.renderAll();
        console.log('keyCode = '+e.keyCode);
    };

    // zoomovanie kolieskom mysi
    document.getElementById('canvasDiv').addEventListener('wheel', function(e){

        var p = new fabric.Point(
            e.clientX,
            e.clientY - TOOLBAR_HEIGHT
        );
        var direction = (e.deltaY > 0) ? 1.1 : 0.9;
        var newZoom = TheCanvas.getZoom() * direction;

        if ((newZoom > 15) || (newZoom < 0.5)) return false;

        // aby nebolo vela desatinnych miest
        newZoom = (Math.round(newZoom * 1000))/1000;

        TheCanvas.zoomToPoint( p, newZoom );
    });

    // update suradnic mysi v statusbare
    TheCanvas.on('mouse:move', function (options) {
        status_text.text = (options.e.clientX - ThePanel.left) + ', ' + (options.e.clientY - TOOLBAR_HEIGHT - ThePanel.top);
        TheCanvas.renderAll();
    });

    // ked user vyberie objekt / objekty
    TheCanvas.on('object:selected', function(options) {
        if (TheCanvas.getActiveGroup())
            showProperties(options.target._objects);
        else
            showProperties(options.target);
    });

    // ked sa zrusi vyber objektu/objektov
    TheCanvas.on('selection:cleared', function(options) {
        showProperties(ThePanel);
    });
}

