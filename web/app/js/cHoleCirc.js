var HoleCirc = fabric.util.createClass(fabric.Object, {

    type: FT_HOLE_CIRC,
    descShort: 'circ.hole',
    originX: 'center',
    originY: 'center',
    hasRotatingPoint: false,
    perPixelTargetFind: true,

    initialize: function(options) {
        options || (options = { });

        if (options.qp_depth == null) {
            options.qp_depth = 999;
        }
        
        if (options.qp_depth < 900)
            options.fill = ThePanel.getPocketColor(options.qp_depth);

        if (options.width || options.height){
            alert('HoleCirc.initialize(): Don\'t use width/height, use qp_diameter instead.');
        }
        if (options.left || options.top){
            alert('HoleCirc.initialize(): Don\'t use left/top, use qp_posx/qp_posy instead.');
        }

        options.width = options.qp_diameter;
        options.height = options.qp_diameter;

        options.left = options.qp_posx;
        options.top = options.qp_posy;

        this.callSuper('initialize', options);
        this.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false
        });
    },

    _set: function(key, value){

        value = this.checkRange(key, value);

        if (key == 'qp_diameter') {
            this.width = value;
            this.height = value;
        }

        if (key == 'qp_depth') {
            value = Math.abs(value);
            if (value >= ThePanel.qp_thickness) value = 999;
            if (value > 900) {
                this.fill = TheCanvas.backgroundColor;
                if (this.canvas) this.bringToFront();
            } else {
                this.fill = ThePanel.getPocketColor(value);
                if (this.canvas) { this.sendToBack(); ThePanel.sendToBack(); } // kapsy budu za dierami ale pred panelom
            }
        }

        if (key == 'qp_posx') {
            this.left = value;
        }
        if (key == 'qp_posy') {
            this.top = value;
        }
        if (key == 'left') {
            this.qp_posx = value;
        }
        if (key == 'top') {
            this.qp_posy = value;
        }

        this.callSuper('_set', key, value);
        return this;
    },

    _render: function(ctx) {

        ctx.fillStyle = this.fill;

        var PIx2 = 6.28319; // 2 * PI
        var r = this.qp_diameter / 2;

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, PIx2, false);
        ctx.fill();
    },

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich hranice pre jednotlive hrubky plechov.
     *
     * @returns {{qp_width: {min: number, max: number}, qp_height: {min: number, max: number}, qp_r1: {min: number, max: number}}}
     */
    getSizeRules: function(){
        var objAttribs;

        if (ThePanel.qp_thickness <= 4)
            objAttribs = {
                qp_diameter: {
                    min: 1
                }
            };
        else if (ThePanel.qp_thickness <= 6)
            objAttribs = {
                qp_diameter: {
                    min: 1.5
                }
            };
        else if (ThePanel.qp_thickness <= 8)
            objAttribs = {
                qp_diameter: {
                    min: 2
                }
            };
        else if (ThePanel.qp_thickness <= 10)
            objAttribs = {
                qp_diameter: {
                    min: 3
                }
            };
        else
            objAttribs = {
                qp_diameter: {
                    min: 6
                }
            };

        objAttribs.qp_diameter.type = 'number';
        objAttribs.qp_diameter.max = Math.min(ThePanel.qp_width, ThePanel.qp_height);

        objAttribs.qp_depth = {type: 'number'};
        objAttribs.qp_posx = {type: 'number'};
        objAttribs.qp_posy = {type: 'number'};

        return objAttribs;
    }


});

