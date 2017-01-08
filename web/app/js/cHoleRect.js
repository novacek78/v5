var HoleRect = fabric.util.createClass(fabric.Object, {

    type: FT_HOLE_RECT,
    descShort: _('rect.hole'),
    originX: 'center',
    originY: 'center',
    isAnodised: true,

    initialize: function(options) {
        options || (options = { });

        if (options.depth == null) {
            options.depth = 999;
        }
        
        if (options.depth < 900)
            options.fill = ThePanel.getPocketColor(options.depth);

        if (options.width || options.height){
            console.log('HoleRect.initialize(): Don\'t use width/height, use qp_width/qp_height instead.');
        }
        if (options.left || options.top){
            console.log('HoleRect.initialize(): Don\'t use left/top, use x/y instead.');
        }

        if ( ! QP.isSet(options.r1)) {

            if (QP.isSet(options.qp_width) && QP.isSet(options.qp_height)) {
                options.r1 = Math.min(options.qp_width, options.qp_height) / 3;
                if (options.r1 < 0.5) options.r1 = 0.5;
                if (options.r1 > 3) options.r1 = 3;
            } else {
                options.r1 = 2;
            }

        } else {

            if ((options.r1 < 0.5) && (options.r1 > 0)) {
                options.r1 = 0.5;
                console.log('Corner radius too small, changing to R0.5');
            } else if (options.r1 == 0){
                options.width = options.qp_width + ZAPICHY_PRIDAVOK;
                options.height = options.qp_height + ZAPICHY_PRIDAVOK;
            } else {
                options.width = options.qp_width;
                options.height = options.qp_height;
            }
        }

        options.left = options.x;
        options.top = options.y;

        this.callSuper('initialize', options);
    },

    _set: function(key, value){

        value = this.checkRange(key, value);

        if (key == 'r1') {
            value = Math.abs(value);
            value = this.checkRange(key, value);

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
            if (this.r1 == 0){
                this.qp_width = value - ZAPICHY_PRIDAVOK;
            } else {
                this.qp_width = value;
            }
        }
        if (key == 'height') {
            if (this.r1 == 0){
                this.qp_height = value - ZAPICHY_PRIDAVOK;
            } else {
                this.qp_height = value;
            }
        }
        if (key == 'qp_width') {
            value = this.checkRange(key, value);
            if (this.r1 == 0){
                this.width = value + ZAPICHY_PRIDAVOK;
            } else {
                this.width = value;
                // obmedzenie maxima radiusu
                if (QP.isSet(this.r1))
                    this.r1 = Math.min( this.r1 , Math.min(value, this.qp_height) / 2);
                else
                    this.r1 = Math.min(value, this.qp_height) / 2;
            }
        }
        if (key == 'qp_height') {
            if (this.r1 == 0){
                this.height = value + ZAPICHY_PRIDAVOK;
            } else {
                this.height = value;
                // obmedzenie maxima radiusu
                if (QP.isSet(this.r1))
                    this.r1 = Math.min( this.r1 , Math.min(this.qp_width, value) / 2);
                else
                    this.r1 = Math.min(value, this.qp_width) / 2;
            }
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

        var zapichPriemer = 1.5;
        var zapichOffset = 0.75;

        ctx.fillStyle = this.fill;

        if (this.r1 == 0) {
            var PIx2 = 6.28319; // 2 * PI
            var w_half = this.qp_width / 2;
            var h_half = this.qp_height / 2;

            ctx.beginPath();
            ctx.rect(-w_half, -h_half, this.qp_width, this.qp_height);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(-w_half + zapichOffset, -h_half + zapichOffset, zapichPriemer, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - zapichOffset, -h_half + zapichOffset, zapichPriemer, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-w_half + zapichOffset, h_half - zapichOffset, zapichPriemer, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - zapichOffset, h_half - zapichOffset, zapichPriemer, 0, PIx2, false);
            ctx.fill();
        } else {
            this.roundRect(ctx, this.width, this.height, this.r1);
            ctx.fill();
        }
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
                qp_width: { min: 2 },
                qp_height: { min: 2 },
                r1: {
                    min: 0.5,
                    allowed: [0]
                }
            };
        else if (ThePanel.thickness <= 6)
            objAttribs = {
                qp_width: { min: 3 },
                qp_height: { min: 3 },
                r1: {
                    min: 0.75,
                    allowed: [0]
                }
            };
        else if (ThePanel.thickness <= 8)
            objAttribs = {
                qp_width: { min: 4 },
                qp_height: { min: 4 },
                r1: {
                    min: 1,
                    allowed: [0]
                }
            };
        else if (ThePanel.thickness <= 10)
            objAttribs = {
                qp_width: { min: 6 },
                qp_height: { min: 6 },
                r1: {
                    min: 1.5,
                    allowed: [0]
                }
            };
        else
            objAttribs = {
                qp_width: { min: 10 },
                qp_height: { min: 10 },
                r1: {
                    min: 3
                }
            };

        objAttribs.clientId = {
            type: 'number',
            desc: 'clientId',
            hidden: true
        };

        objAttribs.qp_id = {
            type: 'number',
            desc: 'id',
            hidden: true,
            db_mapping: 'id'
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

        objAttribs.qp_width.type = 'number';
        objAttribs.qp_width.max = ThePanel.qp_width+6;
        objAttribs.qp_width.desc = _('qp_width');
        objAttribs.qp_width.db_mapping = 'size1';

        objAttribs.qp_height.type = 'number';
        objAttribs.qp_height.max = ThePanel.qp_height+6;
        objAttribs.qp_height.desc = _('qp_height');
        objAttribs.qp_height.db_mapping = 'size2';

        objAttribs.r1.type = 'number';
        objAttribs.r1.max = 250;
        objAttribs.r1.desc = _('r1');
        objAttribs.r1.db_mapping = 'size3';

        objAttribs.depth = {type: 'number', desc: _('depth')};
        objAttribs.angle = {type: 'number', desc: _('qp_angle')};
        objAttribs.x = {type: 'number', desc: _('x')};
        objAttribs.y = {type: 'number', desc: _('y')};

        return objAttribs;
    }

});
