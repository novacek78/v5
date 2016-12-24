function formatFloat(value, decimals, removeTrailing) {

    decimals = typeof decimals !== 'undefined' ? decimals : 2;
    removeTrailing = typeof removeTrailing !== 'undefined' ? removeTrailing : true;

    if (isNaN(value)) {
        return 'NaN'
    } else {
        value = Number(value).toFixed(decimals);
        if (removeTrailing) value = Number(value.toString()); // aby sa odstranili trailing zeroes
        return value;
    }
}

function showMessage(data){

    if (typeof data === 'string'){
        data = {type: 'i', text: data};
    }

    if (data.type == 'i'){

    } else if (data.type == 'w'){

    } else if (data.type == 'e'){

    }

    console.log('"'+data.type+'" message : ' + data.text);
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

/**
 * Prve pismeno v texte da na velke
 *
 * @param text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

