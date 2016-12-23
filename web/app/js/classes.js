var Panel = fabric.util.createClass(fabric.Object, {

    type: FT_PANEL,
    descShort: 'panel',
    fill: COL_SURFACE_RAW,
    originX: 'left',
    originY: 'top',
    left: 50,
    top: 50,
    selectable: false,
    hoverCursor: 'default',
    evented: false,

    initialize: function(options) {
        options || (options = { });

        if (options.width || options.height)
            alert('class Panel : Pouzi qp_width a qp_height. Width a height su LEN pre interne pouzitie!');

        this.set('qp_thickness', options.qp_thickness || 3);
        this.set('qp_edgeStyle', options.qp_edgeStyle || '');
        this.set('qp_edgeSize', options.qp_edgeSize || 0);
        this.set('qp_r1', options.qp_r1 || 0);
        this.set('width', options.qp_width);
        this.set('height', options.qp_height);

        this.callSuper('initialize', options);
    },
    _set: function(key, value){

        if (key == 'qp_width') {
            if (value > PANEL_WIDTH_MAX) {
                console.log('Width too large! Max = '+PANEL_WIDTH_MAX+' ('+value+' provided)');
                value = PANEL_WIDTH_MAX;
            }
            this.set('width', value);
        }
        if (key == 'qp_height') {
            if (value > PANEL_HEIGHT_MAX) {
                console.log('Height too large! Max = '+PANEL_HEIGHT_MAX+' ('+value+' provided)');
                value = PANEL_HEIGHT_MAX;
            }
            this.set('height', value);
        }
        if (key == 'qp_thickness') {
            if (value > PANEL_THICKNESS_MAX) {
                console.log('Thickness too large! Max = '+PANEL_THICKNESS_MAX+' ('+value+' provided)');
                value = PANEL_THICKNESS_MAX;
            }
        }

        this.callSuper('_set', key, value);
        return this;
    },
    _render: function(ctx) {

        this.roundRect(ctx, this.left, this.top, this.qp_width, this.qp_height, this.qp_r1);

        ctx.fillStyle = this.fill;
        ctx.fill();
    }
});



var HoleRect = fabric.util.createClass(fabric.Object, {

    type: 'holeRect',
    descShort: 'rect.hole',

    initialize: function(options) {
        options || (options = { });

        if (options.depth == null) {
            options.depth = 999;
        }

        if (options.r1 == null) {
            options.r1 = Math.min(options.width, options.height) / 3;
            if (options.r1 < 0.5) options.r1 = 0.5;
            if (options.r1 > 3) options.r1 = 3;
        }
        if ((options.r1 < 0.5) && (options.r1 > 0)) {
            options.r1 = 0.5;
            console.log('Corner radius too small, changing to R0.5');
        }
        if (options.r1 == 0){
            options.width += ZAPICHY_PRIDAVOK;
            options.height += ZAPICHY_PRIDAVOK;
        }

        this.callSuper('initialize', options);
    },
    _set: function(key, value){

        if ((key == 'r1') || (key == 'r2') || (key == 'r3') || (key == 'r4')) {
            if ((value > 0) && (value < 0.5)) {
                console.log('Corner radius too small, changing to R0.5');
                value = 0.5;
            }
        }

        if (key == 'depth') {
            if (value > 900) {
                this.set('fill', COL_BACKGROUND);
                if (this.canvas) this.bringToFront();
            } else {
                this.set('fill', COL_FEATURE_POCKET);
                if (this.canvas) { this.sendToBack(); ThePanel.sendToBack(); } // kapsy budu za dierami ale pred panelom
            }
        }

        this.callSuper('_set', key, value);
        return this;
    },
    _render: function(ctx) {

        ctx.fillStyle = this.fill;

        if (this.r1 == 0) {
            var PIx2 = 6.28319; // 2 * PI
            var w_half = (this.width - ZAPICHY_PRIDAVOK) / 2;
            var h_half = (this.height - ZAPICHY_PRIDAVOK) / 2;

            this.roundRect(ctx, this.left, this.top, this.width - ZAPICHY_PRIDAVOK, this.height - ZAPICHY_PRIDAVOK, this.r1);
            ctx.fill();
            // zapichy
            ctx.beginPath();
            ctx.arc(-w_half + 2, -h_half + 2, 3, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - 2, -h_half + 2, 3, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-w_half + 2, h_half - 2, 3, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half - 2, h_half - 2, 3, 0, PIx2, false);
            ctx.fill();
        } else {
            this.roundRect(ctx, this.left, this.top, this.width, this.height, this.r1);
            ctx.fill();
        }
    }
});

