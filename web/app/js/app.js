
function freehandToggle(){
    canvas.freeDrawingBrush.color = 'black';
    canvas.isDrawingMode = !canvas.isDrawingMode;
}

/**
 * Z json dat naplni tabulku vlastnosti objektu
 *
 * @param jsonObject Object JSON objekt
 */
function populatePropertiesWindow(jsonObject){

    var tableData = '<tbody>';

    try {
        for (var propName in jsonObject) {

            var value = jsonObject[propName];
            // zaokruhlime na pevny pocet miest a potom prevodom na string odstranim trailing zeroes
            if (! isNaN(value)) {
                value = parseFloat(value).toFixed(3);
                value = Number(value).toString();
            }

            tableData += '<tr id="">';
            tableData += '<th>' + propName + '</th>';
            tableData += '<td>' + value + '</td>';
            tableData += '</tr>';
        }
    } catch (e) {
        console.log(e)
    }

    tableData += '</tbody>';

    $( "#propGrid").html(tableData);
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
            var jsonObject = buildJsonObject(objectToInspect, ['qp_width', 'qp_height', 'qp_depth', 'qp_r1', 'angle', 'left', 'top', 'scaleX']);
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