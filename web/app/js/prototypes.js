/**
 * Definicia default vlastnosti objektov + dodefinovanie custom vlastnosti
 */
function definePrototypes(){

    // ----------- default properties ----------------------
    fabric.Object.prototype.descShort = 'object';
    fabric.Object.prototype.borderColor = 'red';
    fabric.Object.prototype.borderDashArray = [5,8];
    fabric.Object.prototype.cornerColor = 'red';
    fabric.Object.prototype.cornerSize = 10;
    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.lockScalingFlip = true;
    fabric.Circle.prototype.hasRotatingPoint = false;
    fabric.Circle.prototype.perPixelTargetFind = true;

    // ----------- custom properties -----------------------
    fabric.Object.prototype.qp_basePoint = BP_CENTER; // poloha base pointu
    fabric.Object.prototype.qp_depth = -1; // hlbka

    // --------- custom methods ----------------------------
    fabric.Object.prototype.on('modified', function(){
        if (TheCanvas.getActiveGroup())
            showProperties(TheCanvas.getActiveGroup());
        else {
            if ((this.scaleX != 1) && (this.scaleX != 1)) {
                if (this.qp_width)
                    this.set('qp_width', this.qp_width * this.scaleX);
                if (this.qp_height)
                    this.set('qp_height', this.qp_height * this.scaleY);
                if (this.qp_diameter)
                    this.set('qp_diameter', this.qp_diameter * this.scaleX);
                this.scaleX = 1;
                this.scaleY = 1;
                this.dirty = true;
                TheCanvas.renderAll();
            } else if (this.scaleX != 1){
                if (this.qp_width)
                    this.set('qp_width', this.qp_width * this.scaleX);
                this.scaleX = 1;
            } else if (this.scaleY != 1){
                if (this.qp_height)
                    this.set('qp_height', this.qp_height * this.scaleY);
                this.scaleY = 1;
            }
            showProperties(this);
        }
    });

    /**
     * Vykresli na canvas obdlznik so zaoblenymi rohmi
     *
     * @param ctx
     * @param width
     * @param height
     * @param r1
     * @returns {fabric.Object}
     */
    fabric.Object.prototype.roundRect = function (ctx, width, height, r1) {
        var w_half = width/2;
        var h_half = height/2;

        if (width < 2 * r1)  r1 = w_half;
        if (height < 2 * r1) r1 = h_half;

        ctx.beginPath();
        ctx.moveTo(-w_half + r1, -h_half);
        ctx.arcTo(w_half, -h_half,   w_half, h_half, r1);
        ctx.arcTo(w_half, h_half, -w_half, h_half, r1);
        ctx.arcTo(-w_half, h_half, -w_half, -h_half, r1);
        ctx.arcTo(-w_half, -h_half, w_half, -h_half, r1);
        ctx.closePath();

        return this;
    };

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich pravidla a okrajove hodnoty.
     *
     * @returns Object
     */
    fabric.Object.prototype.getSizeRules = function(){
        return {};
    }; // abstract

    /**
     * Skontroluje, ci hodnota nie je mimo povoleny rozsah.
     * Ak je vsetko OK, vrati povodnu hodnotu, ak nie, vrati limitnu hodnotu.
     *
     * @param dimensionName
     * @param value
     * @returns {*}
     * @private
     */
    fabric.Object.prototype.checkRange = function(dimensionName, value){
        var limits = this.getSizeRules();
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

            if (correctedValue !== null) {
                // ak to nepreslo nejakym predoslym pravidlom, este to moze prejst ak sa hodnota najde v poli dovolenych
                if (eval('limits.' + dimensionName + '.allowed')) {
                    if (eval('limits.' + dimensionName + '.allowed.contains(value)'))
                        correctedValue = null;
                }
            }

            if (eval('limits.' + dimensionName + '.select_values')) {
                if (eval('limits.' + dimensionName + '.select_values.contains(value)'))
                    correctedValue = null;
                else
                    correctedValue = false;
            }
        }

        if (correctedValue === null) {
            return value; // hodnota vyhovuje
        } else {
//TODO vyriesit preklad tohto textu, kde vstupuje dynamicky text - nazov vlastnosti
            QP.showMessage('error', {text: _('Value %1=%2 is out of range.', dimensionName, QP.formatFloat(value)) , target: '#propPanel'});
            return correctedValue; // hodnota nevyhovuje, vratime hranicnu hodnotu, ktora je este OK
        }
    };

    /**
     * Zisti, ci sa v poli nachadza dana hodnota.
     * Nie je urcene pre hladanie objektov.
     *
     * @param needle
     * @returns {boolean}
     */
    Array.prototype.contains = function(needle) {
        return (this.indexOf(needle) > -1);
    };

    /**
     * Prve pismeno v texte skonvertuje na velke
     *
     * @returns {string}
     */
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };



}
