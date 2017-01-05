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

    ThePanel.loadPanel(0);
}

function resizeApplication() {
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.renderAll();
}

function freehandToggle(){ // OBFUSCATE:rename=frhtgl
    TheCanvas.freeDrawingBrush.color = 'rgba(221,255,0,0.55)';
    TheCanvas.freeDrawingBrush.width = 5;
    TheCanvas.isDrawingMode = !TheCanvas.isDrawingMode;
}

function saveNumberValue(edText) {
    var newValue = edText.value;
    var key = edText.name;
    var targetObj;

    if (TheCanvas.getActiveObject()) {
        // pre prave jeden vybraty objekt
        targetObj = TheCanvas.getActiveObject();
    } else if (TheCanvas.getActiveGroup()) {
        // pre viac objektov naraz
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    newValue = newValue.replace(',', '.');

    if (isNaN(newValue) || (newValue == '')) {
        edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
        edText.focus();
        return;
    } else {
        edText.style.backgroundColor = 'white';
        newValue = Number(newValue);
    }

    targetObj.set(key, newValue);
    edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu

    targetObj.dirty = true;  // force redraw
    TheCanvas.renderAll();
}

function saveTextValue(edText) {
    var newValue = edText.value;
    var key = edText.name;
    var targetObj;

    if (TheCanvas.getActiveObject()) {
        // pre prave jeden vybraty objekt
        targetObj = TheCanvas.getActiveObject();
    } else if (TheCanvas.getActiveGroup()) {
        // pre viac objektov naraz
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    if (newValue == '') {
        edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
        return false;
    } else {
        edText.style.backgroundColor = 'white';
    }

    targetObj.set(key, newValue);
    edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu

    targetObj.dirty = true;  // force redraw
    TheCanvas.renderAll();
}

function saveSelectValue(edSelect) {
    var newValue = edSelect.value;
    var key = edSelect.name;
    var targetObj;

    if (TheCanvas.getActiveObject()) {
        // pre prave jeden vybraty objekt
        targetObj = TheCanvas.getActiveObject();
    } else if (TheCanvas.getActiveGroup()) {
        // pre viac objektov naraz
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    targetObj.set(key, newValue);
    edSelect.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu

    targetObj.dirty = true;  // force redraw
    TheCanvas.renderAll();
}

/**
 * Do properties-panela nahra vlastnosti daneho objektu / objektov
 *
 * @param objectToInspect fabric.Object
 */
function showProperties(objectToInspect){
    var attribs;

    if (Array.isArray(objectToInspect) || objectToInspect._objects){
        // viac objektov - treba najst ich spolocne vlastnosti a len tie zobrazit
        objectToInspect = (Array.isArray(objectToInspect)) ? objectToInspect : objectToInspect._objects
        $( "#propPanel div.title").text(_("%1 objects", objectToInspect.length));
        // prejdeme vsetkymi objektami a urobime prienik ich vlastnosti aby sme ziskali len tie, co maju spolocne
        attribs = {};
        /*
        *
        * Naplnit options panel vlastnostami spolocnymi pre vsetky objekty v skupine
        *
        * */
    } else {
        // jeden objekt
        $("#propPanel div.title").text(objectToInspect.descShort.capitalizeFirstLetter());
        attribs = objectToInspect.getAttribsInfo();
    }

    var value;
    var cssClass;
    var readonly = false;
    var tableData = '<tbody>';
    var selected;

    try {
        // prejdeme zoznamom vlastnosti 'attribs', ktory sme vytiahli z objektu a tieto naplnime do properties panela
        for (var key in attribs) {

            if (attribs[key].hidden) continue;

            tableData += '<tr>';
            tableData += '<th>' + attribs[key].desc + '</th>';
            tableData += '<td>';

            value = objectToInspect[key];
            readonly = attribs[key].readonly;

            if (attribs[key].type == 'number'){
                value = QP.formatFloat(value);
            }

            if (readonly) cssClass = 'labelValue';
            else if (attribs[key].type == 'number') cssClass = 'numberValue';
            else if (attribs[key].type == 'select') cssClass = 'selectValue';
            else cssClass = 'textValue';

            if ((cssClass == 'numberValue') || (cssClass == 'textValue') || (cssClass == 'labelValue')) {
                tableData += '<input type="text" name="' + key + '" value="' + value + '" class="propPanelEdit ' + cssClass;
                tableData += readonly ? ' readonly" readonly' : '"';
                tableData += '>';
            } else if (cssClass == 'selectValue') {
                tableData += '<select name="' + key + '" class="propPanelEdit ' + cssClass;
                tableData += readonly ? ' readonly" readonly' : '"';
                tableData += '>';
                for (var i = 0; i < attribs[key].select_values.length; i++){
                    selected = (value == attribs[key].select_values[i]) ? ' selected' : '';
                    tableData += '<option value="' + attribs[key].select_values[i] + '"' + selected + '>' + attribs[key].select_labels[i] + '</option>';
                }
                tableData += '</select>';
            }

            tableData += '</td></tr>';
        }
    } catch (e) {
        console.log(e)
    }

    tableData += '</tbody>';

    $( "#propGrid").html(tableData);
    setPropertiesPanelEvents();
}

function addRectHole() {
    var obj = new HoleRect({
        x: 50,
        y: 50,
        qp_width: 40,
        qp_height: 30
    });

    ThePanel.add(obj);
    ThePanel.selectObject(obj);
}

function addCircHole() {
    var obj = new HoleCirc({
        x: 50,
        y: 50,
        diameter: 20
    });

    ThePanel.add(obj);
    ThePanel.selectObject(obj);
}
