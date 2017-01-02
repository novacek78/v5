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

        // default values:
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
     * @param type String['error'|'warn'|'info'|'success'] Typ spravy
     * @param message String|Object Telo spravy alebo objekt s dalsimi parametrami
     */
    showMessage: function(type, message){

        if (typeof message === 'string'){
            message = {
                text: message,
                type: type,
                position: "top center"
            };
        }

        if ( ! message.target) {
            $.notify(message.text, {className: message.type, position: message.position});
        } else {
            $(message.target).notify(message.text, type);
        }

        console.log('"' + type + '" message : ' + message.text);
    }




} // end of QP object
