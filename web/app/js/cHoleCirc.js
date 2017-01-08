var HoleCirc = fabric.util.createClass(fabric.Object, {

    type: FT_HOLE_CIRC,
    descShort: _('circ.hole'),
    originX: 'center',
    originY: 'center',
    isAnodised: true,
    hasRotatingPoint: false,
    perPixelTargetFind: true,

    initialize: function(options) {
        options || (options = { });

        if (options.depth == null) {
            options.depth = 999;
        }
        
        if (options.depth < 900)
            options.fill = ThePanel.getPocketColor(options.depth);

        if (options.width || options.height){
            console.log('HoleCirc.initialize(): Don\'t use width/height, use diameter instead.');
        }
        if (options.left || options.top){
            console.log('HoleCirc.initialize(): Don\'t use left/top, use x/y instead.');
        }

        options.width = options.diameter;
        options.height = options.diameter;

        options.left = options.x;
        options.top = options.y;

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

        if (key == 'diameter') {
            this.width = value;
            this.height = value;
        }

        if (key == 'depth') {
            value = Math.abs(value);
            if (value >= ThePanel.thickness) value = 999;
            if (value > 900) {
                this.fill = TheCanvas.backgroundColor;
                if (this.canvas) this.bringToFront();
            } else {
                this.fill = ThePanel.getPocketColor(value);
                if (this.canvas) { this.sendToBack(); ThePanel.sendToBack(); } // kapsy budu za dierami ale pred panelom
            }
        }

        if (key == 'x') {
            this.left = value;
        }
        if (key == 'y') {
            this.top = value;
        }
        if (key == 'left') {
            this.x = value;
        }
        if (key == 'top') {
            this.y = value;
        }

        this.callSuper('_set', key, value);
        return this;
    },

    _render: function(ctx) {

        ctx.fillStyle = this.fill;

        var PIx2 = 6.28319; // 2 * PI
        var r = this.diameter / 2;

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, PIx2, false);
        ctx.fill();
    },

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich hranice pre jednotlive hrubky plechov.
     *
     * @returns {{qp_width: {min: number, max: number}, qp_height: {min: number, max: number}, r1: {min: number, max: number}}}
     */
    getAttribsInfo: function(){
        var objAttribs;

        if (ThePanel.thickness <= 4)
            objAttribs = {
                diameter: {
                    min: 1
                }
            };
        else if (ThePanel.thickness <= 6)
            objAttribs = {
                diameter: {
                    min: 1.5
                }
            };
        else if (ThePanel.thickness <= 8)
            objAttribs = {
                diameter: {
                    min: 2
                }
            };
        else if (ThePanel.thickness <= 10)
            objAttribs = {
                diameter: {
                    min: 3
                }
            };
        else
            objAttribs = {
                diameter: {
                    min: 6
                }
            };

        objAttribs.qp_id = {
            type: 'number',
            desc: 'id',
            hidden: true,
            db_mapping: 'id'
        };

        objAttribs.clientId = {
            type: 'number',
            desc: 'clientId',
            hidden: true
        };

        objAttribs.type = {
            type: 'number',
            desc: 'type',
            hidden: true
        };

        objAttribs.isAnodised = {
            type: 'boolean',
            desc: _('Feature anodised'),
            db_mapping: 'is_anodised'
        };

        objAttribs.diameter.type = 'number';
        objAttribs.diameter.max = Math.min(ThePanel.qp_width, ThePanel.qp_height);
        objAttribs.diameter.desc = _('diameter');
        objAttribs.diameter.db_mapping = 'size1';

        objAttribs.depth = {type: 'number', desc: _('depth')};
        objAttribs.x = {type: 'number', desc: _('x')};
        objAttribs.y = {type: 'number', desc: _('y')};

        return objAttribs;
    }

});

