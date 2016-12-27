
function freehandToggle(){
    TheCanvas.freeDrawingBrush.color = 'rgba(221,255,0,0.55)';
    TheCanvas.freeDrawingBrush.width = 5;
    TheCanvas.isDrawingMode = !TheCanvas.isDrawingMode;
}

function saveNewValue(edText) {
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
        $( "#propPanel div.title").text(objectToInspect.length + " objects");
        /*
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

            tableData += '<input type="text" name="'+key+'" value="' + value + '" class="propPanelEdit ' + cssClass + '"';
            tableData += readonly ? ' readonly' : '';

            tableData += '></td></tr>';
        }
    } catch (e) {
        console.log(e)
    }

    tableData += '</tbody>';

    $( "#propGrid").html(tableData);
    $( ".numberValue").on({
        keypress: function(event){
            // ENTER
            if (event.keyCode == 13){
                saveNewValue(event.target);
            }
        },
        focusout: function(event){
            saveNewValue(event.target);
        }
    })
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
