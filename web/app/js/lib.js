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

/**
 * Zaloguje / oznami / ukaze spravu.
 *
 * @param type String['e'|'w'|'i'] Typ spravy
 * @param message String|Object Telo spravy alebo objekt s dalsimi parametrami
 */
function showMessage(type, message){

    if (typeof message === 'string'){
        message = {text: message};
    }

    if (type == 'i'){

    } else if (type == 'w'){

    } else if (type == 'e'){

    }

    console.log('"' + type + '" message : ' + message.text);
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

/**
 * Skontroluje, ci hodnota nie je mimo povoleny rozsah.
 * Ak je vsetko OK, vrati povodnu hodnotu, ak nie, vrati limitnu hodnotu.
 *
 * @param obj Object Objekt na ktorom ma prebehnut kontrola
 * @param dimensionName
 * @param value
 * @returns {*}
 * @private
 */
function checkRange(obj, dimensionName, value){
    var limits = obj.getAttributes();
    var correctedValue = null;

    if ( eval('limits.'+dimensionName)) {

        if (eval('limits.' + dimensionName + '.min')) {
            if (value < eval('limits.' + dimensionName + '.min'))
                correctedValue = eval('limits.' + dimensionName + '.min');
        }

        if (eval('limits.' + dimensionName + '.max')) {
            if (value > eval('limits.' + dimensionName + '.max'))
                correctedValue = eval('limits.' + dimensionName + '.max');
        }

        if (eval('limits.' + dimensionName + '.allowed')) {
            if (eval('limits.' + dimensionName + '.allowed.contains(value)'))
                correctedValue = null;
        }
    }

    if (correctedValue === null) {
        return value; // hodnota vyhovuje
    } else {
        showMessage('e', 'Value '+dimensionName+'='+value+' out of range.');
        return correctedValue; // hodnota nevyhovuje, vratime hranicnu hodnotu, ktora je este OK
    }
}


