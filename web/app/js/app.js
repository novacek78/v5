var TheCanvas;
var ThePanel;
var TheStatusText;
var TheClipboard;

var loadingAnimationAngle = 0;
var loadingAnimationInterval;



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
    $( "#search_field" ).attr('placeholder', _('Search placeholder'));
    $( "#search_button" ).text(_('Search button'));

    ThePanel.loadPanel(0);

}

function resizeApplication() {
    TheCanvas.setWidth(window.innerWidth);
    TheCanvas.setHeight(window.innerHeight);
    TheCanvas.renderAll();
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
        targetObj = TheCanvas.getActiveGroup().getObjects();
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    newValue = newValue.replace(',', '.');

    // validacie
    if (isNaN(newValue)) {
        // ak neplatne cislo
        edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
        edText.focus();
        return false;
    } else if (newValue == '') {
        // ak prazdne policko
        // pri vybere viacerych je to ale OK - nemusia mat vsetky rovnaku hodnotu parametra
        if  ( ! Array.isArray(targetObj)) {
            edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
            edText.focus();
        }
        return false;
    } else {
        edText.style.backgroundColor = 'white';
        newValue = Number(newValue);
    }

    if (Array.isArray(targetObj)){
        for (var i=0; i < targetObj.length; i++){
            // ked su objekty vybrate v skupine, tak ich left a top vlastnosti su relativne k stredu skupiny
            var newTransformedValue;

            if (key == 'x')
                newTransformedValue = targetObj[i].left + (newValue - targetObj[i].originalLeft);
            else if (key == 'y')
                newTransformedValue = targetObj[i].top + (newValue - targetObj[i].originalTop);
            else
                newTransformedValue = newValue;

            targetObj[i].set(key, newTransformedValue);
            targetObj[i].dirty = true;  // force redraw
            targetObj[i].setCoords(false);
            edText.value = targetObj[i].get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
        }
    } else {
        targetObj.set(key, newValue);
        targetObj.dirty = true;  // force redraw
        edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
    }

    ThePanel.sortFeatures();
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
        targetObj = TheCanvas.getActiveGroup().getObjects();
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    // validacie
    if (newValue == '') {
        // ak prazdne policko
        // pri vybere viacerych je to ale OK - nemusia mat vsetky rovnaku hodnotu parametra
        if ( ! Array.isArray(targetObj))
            edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
        return false;
    } else {
        edText.style.backgroundColor = 'white';
    }

    if (Array.isArray(targetObj)){
        for (var i=0; i < targetObj.length; i++){
            // ked su objekty vybrate v skupine, tak ich left a top vlastnosti su relativne k stredu skupiny
            targetObj[i].set(key, newValue);
            targetObj[i].dirty = true;  // force redraw
            targetObj[i].setCoords(false);
            edText.value = targetObj[i].get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
        }
    } else {
        targetObj.set(key, newValue);
        targetObj.dirty = true;  // force redraw
        edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
    }

    TheCanvas.renderAll();
}

function saveBooleanValue(edCheckbox) {
    var newValue = edCheckbox.checked;
    var key = edCheckbox.name;
    var targetObj;

    if (TheCanvas.getActiveObject()) {
        // pre prave jeden vybraty objekt
        targetObj = TheCanvas.getActiveObject();
    } else if (TheCanvas.getActiveGroup()) {
        // pre viac objektov naraz
        targetObj = TheCanvas.getActiveGroup().getObjects();
    } else if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        // pre panel samotny - ziadny vybraty objekt
        targetObj = ThePanel;
    }

    if (Array.isArray(targetObj)){
        for (var i=0; i < targetObj.length; i++){
            // ked su objekty vybrate v skupine, tak ich left a top vlastnosti su relativne k stredu skupiny
            targetObj[i].set(key, newValue);
            targetObj[i].dirty = true;  // force redraw
            targetObj[i].setCoords(false);
            edCheckbox.value = targetObj[i].get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
        }
    } else {
        targetObj.set(key, newValue);
        targetObj.dirty = true;  // force redraw
        edCheckbox.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
    }

    ThePanel.sortFeatures();
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
    ThePanel.sortFeatures();
}

/**
 * Do properties-panela nahra vlastnosti daneho objektu / objektov
 *
 * @param objectToInspect fabric.Object
 */
function showProperties(objectToInspect){

    var attribs;
    var isMultipleSelect = false;

    if (Array.isArray(objectToInspect) || objectToInspect._objects){
        // viac objektov - treba najst ich spolocne vlastnosti a len tie zobrazit
        isMultipleSelect = true;
        objectToInspect = (Array.isArray(objectToInspect)) ? objectToInspect : objectToInspect._objects
        $( "#propPanel div.title").text(_("%1 objects", objectToInspect.length));
        // prejdeme vsetkymi objektami a urobime prienik ich vlastnosti aby sme ziskali len tie, co maju spolocne

        for (var i=0; i < objectToInspect.length; i++){
            var currFeaAttribs = objectToInspect[i].getAttribsInfo();

            if (attribs == undefined){
                // spracuvame prvy objekt = nasypeme do mnoziny vsetky jeho vlastnosti...
                attribs = currFeaAttribs;

                // ...a aj hodnoty
                for (var attribName in attribs){
                    attribs[attribName].value = objectToInspect[i][attribName];
                }

            } else {
                // prechadzame po atributoch a tie, ktore nenajdeme v currFeaAttribs zlikvidujeme aj z attribs
                for (var attribName in attribs){
                    if ( ! currFeaAttribs.hasOwnProperty(attribName)){
                        delete attribs[attribName];
                    }
                }

                // este do attribs naplnime hodnoty - ak maju nejaku hodnotu vsetky objekty spolocnu, zostane tam, ak nie, bude prazdna
                for (var attribName in attribs){

                    if (attribs[attribName].value != objectToInspect[i][attribName]) {
                        delete attribs[attribName].value;
                    }
                }
            }
        }

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

            if (isMultipleSelect) value = (attribs[key].hasOwnProperty('value')) ? attribs[key].value : '';
            else value = objectToInspect[key];

            if (attribs[key].type == 'number'){
                if ( ! isMultipleSelect || (value != ''))
                    value = QP.formatFloat(value);
            }

            readonly = attribs[key].readonly;

            if (readonly) cssClass = 'labelValue';
            else if (attribs[key].type == 'number') cssClass = 'numberValue';
            else if (attribs[key].type == 'select') cssClass = 'selectValue';
            else if (attribs[key].type == 'boolean') cssClass = 'checkboxValue';
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
            } else if (cssClass == 'checkboxValue') {
                tableData += '<input type="checkbox" class="propPanelEdit ' + cssClass + '" name="' + key + '" value="' + ((value) ? '1':'0') + '" ' + ((value) ? 'checked':'');
                tableData += (readonly ? (' disabled="disabled"> <input type="hidden" name="'+key+'" value="' + (value) ? '1':'0' + '"') : '');
                tableData += '>';
                // ak maju roznu hodnotu, nastavim checkbox na 3.stav
                if (isMultipleSelect && value === ''){
                    tableData += '<script type="text/javascript"> $("[name='+key+']")[0].indeterminate = true;</script>';
                }
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

function showLoadingAnimation(showIt, hideDelay){

    // schovame, ale az po kratkom delay, aby to len tak neprebliklo
    if (hideDelay == undefined) hideDelay = 100;

    if (showIt){

        loadingAnimationInterval = setInterval(function() {
            loadingAnimationAngle += 10;
            if (loadingAnimationAngle >= 360) loadingAnimationAngle -= 360;
            $('#animationRotating').rotate(loadingAnimationAngle);
        }, 20);

        $('#animationRotating').css('visibility', 'visible');

    } else {

        setTimeout(function() {
            $('#animationRotating').css('visibility', 'hidden');
            clearInterval(loadingAnimationInterval);
        }, hideDelay);

    }
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

function freehandToggle(){ // OBFUSCATE:rename=frhtgl
    TheCanvas.freeDrawingBrush.color = 'rgba(221,255,0,0.55)';
    TheCanvas.freeDrawingBrush.width = 5;
    TheCanvas.isDrawingMode = !TheCanvas.isDrawingMode;
}

