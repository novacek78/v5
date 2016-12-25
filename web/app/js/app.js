
function freehandToggle(){
    TheCanvas.freeDrawingBrush.color = 'rgba(221,255,0,0.55)';
    TheCanvas.freeDrawingBrush.width = 5;
    TheCanvas.isDrawingMode = !TheCanvas.isDrawingMode;
}

function saveNewValue(edText, limits) {
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

    if (limits && (typeof limits === 'object')){

        if ((limits.min) && (newValue < limits.min)) {
            showMessage('e', 'Value ' + key + '=' + newValue + ' out of range. Minimum: ' + limits.min);
            return false;
        }
        if ((limits.max) && (newValue > limits.max)) {
            showMessage('e', 'Value ' + key + '=' + newValue + ' out of range. Maximum: ' + limits.max);
            return false;
        }
    }

    targetObj.set(key, newValue);
    edText.value = targetObj.get(key); // spatne updatnem ak by dany objekt

    targetObj.dirty = true;  // force redraw
    TheCanvas.renderAll();
}

/**
 * Z json dat naplni tabulku vlastnosti objektu
 *
 * @param jsonObject Object JSON objekt
 */
function populatePropertiesWindow(jsonObject){

    var tableData = '<tbody>';
    var readonly = false;

    try {
        for (var propName in jsonObject) {

            // zaokruhlime na pevny pocet des.miest
            var value = formatFloat(jsonObject[propName]);

            tableData += '<tr>';
            tableData += '<th>' + propName + '</th>';
            tableData += '<td><input type="text" name="'+propName+'" value="' + value + '" class="propPanelEdit propPanelText"';
            tableData += readonly ? ' readonly' : '';
            tableData += '></td></tr>';
        }
    } catch (e) {
        console.log(e)
    }

    tableData += '</tbody>';

    $( "#propGrid").html(tableData);
    $( ".propPanelText").on({
        keypress: function(event){
            // ENTER
            if (event.keyCode == 13){
                saveNewValue(event.target, getLimits(event.target));
            }
        },
        focusout: function(event){
            saveNewValue(event.target, getLimits(event.target));
        }
    })
}

/**
 * Do properties-panela nahra vlastnosti daneho objektu / objektov
 * @param objectToInspect
 */
function showProperties(objectToInspect){

    if (Array.isArray(objectToInspect) || objectToInspect._objects){
        // viac objektov - treba najst ich spolocne vlastnosti a len tie zobrazit
        var poleObjektov = (Array.isArray(objectToInspect)) ? objectToInspect : objectToInspect._objects;
        $( "#propPanel div.title").text(poleObjektov.length + " objects");
        var jsonObject = {};
        jsonObject['Nejake'] = '';
        jsonObject['spolocne'] = '';
        jsonObject['vlastnosti'] = '';
        populatePropertiesWindow(jsonObject);
    } else {
        // jeden objekt
        if (objectToInspect.descShort)
            $( "#propPanel div.title").text(capitalizeFirstLetter(objectToInspect.descShort));
        else {
            $("#propPanel div.title").text('?');
        }

        if ((objectToInspect.type) && (objectToInspect.type == FT_PANEL)){
            // jedna sa o panel samotny
            var jsonObject = buildJsonObject(objectToInspect, ['qp_width', 'qp_height', 'qp_thickness', 'qp_r1']);
            populatePropertiesWindow(jsonObject);
        } else {
            // jedna sa o nejaku ficuru na paneli
            var jsonObject = buildJsonObject(objectToInspect, ['qp_width', 'qp_height', 'qp_depth', 'qp_r1', 'angle', 'left', 'top']);
            populatePropertiesWindow(jsonObject);
        }
    }
}

function getLimits(element){

    return {};

    //var items = element.getAttribute('limits').split(",");
    //var newItems = [];
    //
    //items.forEach(function(item){
    //    var keyValue = item.split(":");
    //    newItems.push('"' + keyValue[0] + '":"' + keyValue[1] + '"')
    //});
    //
    //return JSON.parse('{' + newItems.join(',') + '}');
}

function addRectHole() {
    var x = new HoleRect({
        left: 50,
        top: 50,
        qp_width: 40,
        qp_height: 30
    });

    TheCanvas.add(x);
    TheCanvas.setActiveObject(x, null);
}
