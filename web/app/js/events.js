function initEventHandlers() {

    // klavesove skratky
    document.onkeyup = function(e){

        if (document.activeElement != document.body) return false; // chytame len stlacenia na ploche/canvase

        // DEL
        if ((e.keyCode == 46) && (canvas.getActiveObject()))
            canvas.getActiveObject().remove();

        // H
        if ((e.keyCode == 72) && (canvas.getActiveObject()))
            canvas.getActiveObject().set('lockMovementY', !canvas.getActiveObject().lockMovementY);

        // V
        if ((e.keyCode == 86) && (canvas.getActiveObject()))
            canvas.getActiveObject().set('lockMovementX', !canvas.getActiveObject().lockMovementX);

        // X
        if ((e.keyCode == 88) && (canvas.getActiveObject()))
            canvas.getActiveObject().set('depth', 1);

        canvas.renderAll();
        console.log('keyCode = '+e.keyCode);
    };

    // zoomovanie kolieskom mysi
    document.getElementById('canvasDiv').addEventListener('wheel', function(e){

        var p = new fabric.Point(
            e.clientX,
            e.clientY - TOOLBAR_HEIGHT
        );
        var direction = (e.deltaY > 0) ? 1.1 : 0.9;
        var newZoom = canvas.getZoom() * direction;
        // aby nebolo vela desatinnych miest
        newZoom = (Math.round(newZoom * 1000))/1000;

        canvas.zoomToPoint( p, newZoom );
        console.log('new zoom: '+canvas.getZoom());
    });

    // update suradnic mysi v statusbare
    canvas.on('mouse:move', function (options) {
        status_text.text = (options.e.clientX - ThePanel.left) + ', ' + (options.e.clientY - TOOLBAR_HEIGHT - ThePanel.top);
        canvas.renderAll();
    });

    // ked user vyberie objekt / objekty
    canvas.on('object:selected', function(options) {
        if (canvas.getActiveGroup())
            showProperties(options.target._objects);
        else
            showProperties(options.target);
    });

    // ked sa zrusi vyber objektu/objektov
    canvas.on('selection:cleared', function(options) {
        showProperties(ThePanel);
    });
}

