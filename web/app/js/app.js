
function freehandToggle(){
    TheCanvas.freeDrawingBrush.color = 'black';
    TheCanvas.isDrawingMode = !TheCanvas.isDrawingMode;
}

function propPanelValidateNumber(edText) {
    edText.value = edText.value.replace(',', '.');

    if (isNaN(edText.value) || (edText.value == '')) {
        edText.style.backgroundColor = COL_VALIDATE_ERROR_BGND;
        return false;
    } else
        edText.style.backgroundColor = 'white';

    // ak nie je nic vybrate, nastavujeme vlastnosti panela
    if (TheCanvas.getActiveObject()) {
        TheCanvas.getActiveObject().set(edText.name, edText.value);
        edText.value = TheCanvas.getActiveObject().get(edText.name);
        TheCanvas.getActiveObject().dirty = true;
    } else  if (!TheCanvas.getActiveObject() && !TheCanvas.getActiveGroup()) {
        ThePanel.set(edText.name, edText.value);
        edText.value = ThePanel.get(edText.name);
        ThePanel.dirty = true;
    }

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

            var value = jsonObject[propName];
            // zaokruhlime na pevny pocet miest a potom prevodom na string odstranim trailing zeroes
            if (! isNaN(value)) {
                value = parseFloat(value).toFixed(3);
                value = Number(value).toString();
            }

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
                propPanelValidateNumber(event.target);
            }
        },
        focusout: function(event){
            propPanelValidateNumber(event.target);
        },
        focusin: function(event){
            event.target.style.borderColor = '#555';
        }
    });
}

/**
 * Do properties-panela nahra vlastnosti daneho objektu / objektov
 * @param objectToInspect
 */
function showProperties(objectToInspect){

    if (Array.isArray(objectToInspect)){
        // viac objektov - treba najst ich spolocne vlastnosti a len tie zobrazit
        $( "#propPanel div.title").text("Group (" + objectToInspect.length + ")");
        var jsonObject = {};
        jsonObject['Nejake'] = '';
        jsonObject['spolocne'] = '';
        jsonObject['vlastnosti'] = '';
        populatePropertiesWindow(jsonObject);
    } else {
        // jeden objekt
        if (objectToInspect.descShort)
            $( "#propPanel div.title").text(objectToInspect.descShort.capitalizeFirstLetter());
        else
            $( "#propPanel div.title").text('?');

        if ((objectToInspect.type) && (objectToInspect.type == FT_PANEL)){
            // jedna sa o panel samotny
            var jsonObject = buildJsonObject(objectToInspect, ['qp_width', 'qp_height', 'qp_thickness', 'qp_r1']);
            populatePropertiesWindow(jsonObject);
        } else {
            // jedna sa o nejaku ficuru na paneli
            var jsonObject = buildJsonObject(objectToInspect, ['width', 'height', 'depth', 'r1', 'angle', 'left', 'top', 'scaleX']);
            populatePropertiesWindow(jsonObject);
        }
    }
}

/**
 * Z dodaneho objektu povytahuje jeho vlastnosti a vytvori z toho JSON objekt
 *
 * @param objData Object        Objekt, z ktoreho treba vytiahnut vlastnosti
 * @param arrProperties Array   Zoznam vlastnosti, ktore treba z objektu vytiahnut
 * @returns Object
 */
function buildJsonObject(objData, arrProperties){

    if (Array.isArray(arrProperties)){
        var result = {};

        arrProperties.forEach(function (propName){
            result[propName] = objData[propName];
        });

        return result;
    }
}