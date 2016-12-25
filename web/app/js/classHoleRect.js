var HoleRect = fabric.util.createClass(fabric.Object, {

    type: 'holeRect',
    descShort: 'rect.hole',
    originX: 'center',
    originY: 'center',

    initialize: function(options) {
        options || (options = { });

        if (options.qp_depth == null) {
            options.qp_depth = 999;
        }

        if (options.width || options.height){
            alert('HoleRect.initialize(): Don\'t use width/height, use qp_width/qp_height instead.');
        }

        if (options.qp_r1 == null) {
            options.qp_r1 = Math.min(options.qp_width, options.qp_height) / 3;
            if (options.qp_r1 < 0.5) options.qp_r1 = 0.5;
            if (options.qp_r1 > 3) options.qp_r1 = 3;
        }
        if ((options.qp_r1 < 0.5) && (options.qp_r1 > 0)) {
            options.qp_r1 = 0.5;
            console.log('Corner radius too small, changing to R0.5');
        }
        if (options.qp_r1 == 0){
            options.width = options.qp_width + ZAPICHY_PRIDAVOK;
            options.height = options.qp_height + ZAPICHY_PRIDAVOK;
        } else {
            options.width = options.qp_width;
            options.height = options.qp_height;
        }

        this.callSuper('initialize', options);
    },
    _set: function(key, value){

        value = checkRange(this, key, value);

        if (key == 'qp_r1') {
            value = Math.abs(value);
            if ((value > 0) && (value < 0.5)) {
                showMessage('e', 'Corner radius too small, changing to R0.5');
                value = 0.5;
            }

            // obmedzenie maxima radiusu
            value = Math.min( value , Math.min(this.qp_width, this.qp_height) / 2);

            if (value == 0){
                this.width = this.qp_width + ZAPICHY_PRIDAVOK;
                this.height = this.qp_height + ZAPICHY_PRIDAVOK;
            } else {
                this.width = this.qp_width;
                this.height = this.qp_height;
            }
        }

        if (key == 'width') {
            if (this.qp_r1 == 0){
                this.qp_width = value - ZAPICHY_PRIDAVOK;
            } else {
                this.qp_width = value;
            }
        }
        if (key == 'height') {
            if (this.qp_r1 == 0){
                this.qp_height = value - ZAPICHY_PRIDAVOK;
            } else {
                this.qp_height = value;
            }
        }
        if (key == 'qp_width') {
            value = checkRange(this, key, value);
            if (this.qp_r1 == 0){
                this.width = value + ZAPICHY_PRIDAVOK;
            } else {
                this.width = value;
            }
        }
        if (key == 'qp_height') {
            if (this.qp_r1 == 0){
                this.height = value + ZAPICHY_PRIDAVOK;
            } else {
                this.height = value;
            }
        }

        if (key == 'qp_depth') {
            value = Math.abs(value);
            if (value >= ThePanel.qp_thickness) value = 999;
            if (value > 900) {
                this.fill = COL_BACKGROUND;
                if (this.canvas) this.bringToFront();
            } else {
                this.fill = COL_FEATURE_POCKET;
                if (this.canvas) { this.sendToBack(); ThePanel.sendToBack(); } // kapsy budu za dierami ale pred panelom
            }
        }

        this.callSuper('_set', key, value);
        return this;
    },
    _render: function(ctx) {

        ctx.fillStyle = this.fill;

        if (this.qp_r1 == 0) {
            var PIx2 = 6.28319; // 2 * PI
            var w_half = this.qp_width / 2;
            var h_half = this.qp_height / 2;

            ctx.beginPath();
            ctx.rect(-w_half, -h_half, this.qp_width, this.qp_height);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(-w_half + ZAPICHY_OFFSET, -h_half + ZAPICHY_OFFSET, ZAPICHY_PRIEMER, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - ZAPICHY_OFFSET, -h_half + ZAPICHY_OFFSET, ZAPICHY_PRIEMER, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-w_half + ZAPICHY_OFFSET, h_half - ZAPICHY_OFFSET, ZAPICHY_PRIEMER, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - ZAPICHY_OFFSET, h_half - ZAPICHY_OFFSET, ZAPICHY_PRIEMER, 0, PIx2, false);
            ctx.fill();
        } else {
            this.roundRect(ctx, this.left, this.top, this.width, this.height, this.qp_r1);
            ctx.fill();
        }
    },

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich hranice pre jednotlive hrubky plechov.
     *
     * @returns {{qp_width: {min: number, max: number}, qp_height: {min: number, max: number}, qp_r1: {min: number, max: number}}}
     */
    getAttributes: function(){
        if (ThePanel.qp_thickness <= 4)
            return {
                qp_width: {
                    min: 1.5,
                    max: ThePanel.qp_width+6
                },
                qp_height: {
                    min: 1.5,
                    max: ThePanel.qp_height+6
                },
                qp_r1: {
                    min: 0.5,
                    max: 250,
                    allowed: [0]
                }
            }
        else if (ThePanel.qp_thickness <= 6)
            return {
                qp_width: {
                    min: 2.5,
                    max: ThePanel.qp_width+6
                },
                qp_height: {
                    min: 2.5,
                    max: ThePanel.qp_height+6
                },
                qp_r1: {
                    min: 0.75,
                    max: 250,
                    allowed: [0]
                }
            }
        else if (ThePanel.qp_thickness <= 8)
            return {
                qp_width: {
                    min: 3,
                    max: ThePanel.qp_width+6
                },
                qp_height: {
                    min: 3,
                    max: ThePanel.qp_height+6
                },
                qp_r1: {
                    min: 1,
                    max: 250,
                    allowed: [0]
                }
            }
        else if (ThePanel.qp_thickness <= 10)
            return {
                qp_width: {
                    min: 4.5,
                    max: ThePanel.qp_width+6
                },
                qp_height: {
                    min: 4.5,
                    max: ThePanel.qp_height+6
                },
                qp_r1: {
                    min: 1.5,
                    max: 250,
                    allowed: [0]
                }
            }
        else
            showMessage('e', 'Unsupported panel thickness: ' + ThePanel.qp_thickness);
    }


});
