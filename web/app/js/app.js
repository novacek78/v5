
function freehandToggle(){
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
        //edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt nejak upravil hodnotu
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
        newValue = Number(newValue);
    }

    targetObj.set(key, newValue);
    edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt

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
    edSelect.value = targetObj.get(key); // spatne updatnem ak by dany objekt

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

        /*
        *
        * Naplnit options panel vlastnostami spolocnymi pre vsetky objekty v skupine
        *
        * */
    } else {
        // jeden objekt
        $("#propPanel div.title").text(objectToInspect.descShort.capitalizeFirstLetter());
        attribs = objectToInspect.getSizeRules();
    }

if ( ! attribs) return;

    var value;
    var cssClass;
    var readonly = false;
    var tableData = '<tbody>';
    var selected;

    try {
        // prejdeme zoznamom vlastnosti 'attribs', ktory sme vytiahli z objektu a tieto naplnime do properties panela
        for (var key in attribs) {

            tableData += '<tr>';
            tableData += '<th>' + key + '</th>';
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
    $( ".numberValue").on({
        keypress: function(event){
            if (event.keyCode == 13) saveNumberValue(event.target); // ENTER
        },
        focusout: function(event){
            saveNumberValue(event.target);
        }});
    $( ".textValue").on({
        keypress: function(event){
            if (event.keyCode == 13) saveTextValue(event.target); // ENTER
        },
        focusout: function(event){
            saveTextValue(event.target);
        }});
    $( ".selectValue").on({
        change: function(event){
            saveSelectValue(event.target);
        }});
}

function addRectHole() {
    var x = new HoleRect({
        qp_posx: 50,
        qp_posy: 50,
        qp_width: 40,
        qp_height: 30
    });

    TheCanvas.add(x);
    TheCanvas.setActiveObject(x, null);
}

function addCircHole() {
    var x = new HoleCirc({
        qp_posx: 50,
        qp_posy: 50,
        qp_diameter: 20
    });

    TheCanvas.add(x);
    TheCanvas.setActiveObject(x, null);
}
