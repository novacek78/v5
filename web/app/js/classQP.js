var QP = {

    /**
     * Naformatuje ciselny udaj na pozadovany format
     *
     * @param value
     * @param decimals
     * @param removeTrailing
     * @returns {string}
     */
    formatFloat: function(value, decimals, removeTrailing) {

        decimals = typeof decimals !== 'undefined' ? decimals : 2;
        removeTrailing = typeof removeTrailing !== 'undefined' ? removeTrailing : true;

        if (isNaN(value)) {
            return 'NaN'
        } else {
            value = Number(value).toFixed(decimals);
            if (removeTrailing) value = Number(value.toString()); // aby sa odstranili trailing zeroes
            return value;
        }
    },

    /**
     * Zaloguje / oznami / ukaze spravu.
     *
     * @param type String['e'|'w'|'i'] Typ spravy
     * @param message String|Object Telo spravy alebo objekt s dalsimi parametrami
     */
    showMessage: function(type, message){

        if (typeof message === 'string'){
            message = {text: message};
        }

        if (type == 'i'){

        } else if (type == 'w'){

        } else if (type == 'e'){

        }

        console.log('"' + type + '" message : ' + message.text);
    },

    /**
     * Z dodaneho objektu povytahuje jeho vlastnosti a vytvori z toho JSON objekt
     *
     * @param objData Object        Objekt, z ktoreho treba vytiahnut vlastnosti
     * @param arrProperties Array   Zoznam vlastnosti, ktore treba z objektu vytiahnut
     * @returns Object
     */
    buildJsonObject: function(objData, arrProperties){

        if (Array.isArray(arrProperties)){
            var result = {};

            arrProperties.forEach(function (propName){
                result[propName] = objData[propName];
            });

            return result;
        }
    }



} // end of QP object

