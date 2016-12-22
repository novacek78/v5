var Panel = fabric.util.createClass(fabric.Object, {

    type: FT_PANEL,
    descShort: 'panel',
    descLong: 'panel',
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

        this.callSuper('initialize', options);
        this.set('qp_thickness', options.qp_thickness || 3);
        this.set('qp_edgeStyle', options.qp_edgeStyle || '');
        this.set('qp_edgeSize', options.qp_edgeSize || 0);
        this.set('qp_r1', options.qp_r1 || 0);
        this.set('width', options.qp_width);
        this.set('height', options.qp_height);
    },
    set: function(key, value){

        if (key == 'qp_thickness') {
            if (value > 10) {
                console.log('Thickness too large! Max = 10 ('+value+' provided)');
                value = 10;
            }
        }

        this.callSuper('set', key, value);
    },
    _render: function(ctx) {

        this.roundRect(ctx, this.left, this.top, this.qp_width, this.qp_height, this.qp_r1);

        ctx.fillStyle = this.fill;
        ctx.fill();
    }
});







var HoleRect = fabric.util.createClass(fabric.Object, {

    type: FT_HOLE_RECT,
    descShort: 'rect.hole',
    descLong:  'rectangular hole',

    initialize: function(options) {
        options || (options = { });

        if (options.width || options.height)
            alert('class HoleRect : Pouzi qp_width a qp_height. Width a height su LEN pre interne pouzitie!');

        this.callSuper('initialize', options);
        this.set('qp_depth', options.qp_depth || 999);
        this.set('qp_edgeStyle', options.qp_edgeStyle || '');
        this.set('qp_edgeSize', options.qp_edgeSize || 0);

        if (options.qp_r1 == 0) {
            // zvacsime priestor pre vykreslenie zapichov
            this.set('qp_r1', 0);
            this.set('width', options.qp_width + 1);
            this.set('height', options.qp_height + 1);
        } else {
            this.set('qp_r1', options.qp_r1 || 'auto');
            this.set('width', options.qp_width);
            this.set('height', options.qp_height);
        }
    },

    set: function(key, value){

        if ((key == 'qp_r1') || (key == 'qp_r2') || (key == 'qp_r3') || (key == 'qp_r4')) {
            if ((value > 0) && (value < 0.5)) {
                console.log('Error. Minimal radius = 0.5 (' + value + ' provided)');
                value = 0;
            }
        }

        if (key == 'qp_depth') {
            if (value > 900) {
                this.set('fill', COL_BACKGROUND);
                if (this.canvas) this.bringToFront();
            } else {
                this.set('fill', COL_FEATURE_POCKET);
                if (this.canvas) { this.sendToBack(); panel.sendToBack(); } // kapsy budu za dierami ale pred panelom
            }
        }

        this.callSuper('set', key, value);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            descShort: this.get('descShort'),
            descLong: this.get('descLong'),
            qp_depth: this.get('qp_depth'),
            qp_r1: this.get('qp_r1'),
            qp_edgeStyle: this.get('qp_edgeStyle'),
            qp_edgeSize: this.get('qp_edgeSize')
        });
    },

    _render: function(ctx) {

        var PIx2 = 6.28319; // 2 * PI
        var w_half = this.qp_width/2;
        var h_half = this.qp_height/2;

        this.roundRect(ctx, this.left, this.top, this.qp_width, this.qp_height, this.qp_r1);

        ctx.fillStyle = this.fill;
        ctx.fill();

        if (this.qp_r1 == 0) {
            // zapichy
            ctx.beginPath();
            ctx.arc(-w_half+0.5, -h_half+0.5, 1.5, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half-0.5, -h_half+0.5, 1.5, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-w_half+0.5, h_half-0.5, 1.5, 0, PIx2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w_half-0.5, h_half-0.5, 1.5, 0, PIx2, false);
            ctx.fill();
        }
    }
});
