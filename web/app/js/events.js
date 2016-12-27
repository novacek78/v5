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

        // C
        if ((e.key == 'c') && e.ctrlKey) {
            if (TheCanvas.getActiveGroup()){
                var oldObjArray = TheCanvas.getActiveGroup().getObjects();
                var newObjArray = [];
                for (var i = 0; i < oldObjArray.length; i++)
                    newObjArray.push(oldObjArray[i].toObject());
                TheClipboard = {
                    type: 'multi',
                    content: newObjArray
                }
            } else {
                TheClipboard = {
                    type: 'single',
                    content: TheCanvas.getActiveObject()
                };
                console.log(TheCanvas.getObjects());
            }
        }

        // V
        if ((e.key == 'v') && e.ctrlKey) {
            if (TheClipboard)
                if (TheClipboard.type == 'single'){
                    TheCanvas.add(fabric.util.object.clone(TheClipboard.content));
                    console.log(TheCanvas.getObjects());
                }
        }

        // X
        if ((e.keyCode == 88) && (true))
            console.log(ThePanel);

        TheCanvas.renderAll();
        console.log('keyCode = '+e.keyCode);
    };

    // zoomovanie kolieskom mysi
    document.getElementById('canvasDiv').addEventListener('wheel', function(e){

        var p = new fabric.Point(
            e.clientX,
            e.clientY - TOOLBAR_HEIGHT
        );
        var direction = (e.deltaY > 0) ? 0.9 : 1.1;
        var newZoom = TheCanvas.getZoom() * direction;

        if ((newZoom > 15) || (newZoom < 0.7)) return false;

        // aby nebolo vela desatinnych miest
        newZoom = (Math.round(newZoom * 1000))/1000;

        TheCanvas.zoomToPoint( p, newZoom );
    });

    // zakazanie pop-up menu
    //$(window).contextmenu(function(){
    //    return false;
    //});

    // update suradnic mysi v statusbare
    TheCanvas.on('mouse:move', function (options) {
        TheStatusText.text = (options.e.clientX - ThePanel.left) + ', ' + (options.e.clientY - TOOLBAR_HEIGHT - ThePanel.top);
        TheCanvas.renderAll();
    });

    // po nakresleni prveho prvku markera zrusime tento mod
    TheCanvas.on('mouse:up', function () {
        TheCanvas.isDrawingMode = false;
    });

    // po nakresleni prveho prvku markera zrusime tento mod
    TheCanvas.on('mouse:down', function (e) {
        //console.log(e);
    });

    // ked user vyberie objekt / objekty
    TheCanvas.on('object:selected', function(options) {
        if (TheCanvas.getActiveGroup())
            showProperties(options.target._objects);
        else
            showProperties(options.target);
    });

    // ked sa zrusi vyber objektu/objektov
    TheCanvas.on('selection:cleared', function() {
        showProperties(ThePanel);
    });
}

