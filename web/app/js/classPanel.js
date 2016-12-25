var Panel = fabric.util.createClass(fabric.Object, {

    type: FT_PANEL,
    descShort: 'panel',
    fill: COL_SURFACE_RAW,
    originX: 'left',
    originY: 'top',
    left: 20,
    top: 20,
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
                showMessage('e', 'Width too large! Max = '+PANEL_WIDTH_MAX+' ('+value+' provided)');
                value = PANEL_WIDTH_MAX;
            }
            this.width = value;
        }
        if (key == 'qp_height') {
            if (value > PANEL_HEIGHT_MAX) {
                showMessage('e', 'Height too large! Max = '+PANEL_HEIGHT_MAX+' ('+value+' provided)');
                value = PANEL_HEIGHT_MAX;
            }
            this.height = value;
        }
        if (key == 'qp_thickness') {
            if (value > PANEL_THICKNESS_MAX) {
                showMessage('e', 'Thickness too large! Max = '+PANEL_THICKNESS_MAX+' ('+value+' provided)');
                value = PANEL_THICKNESS_MAX;
            }
        }
        if (key == 'qp_r1') {
            // obmedzenie maxima radiusu
            value = Math.min( Math.abs(value) , Math.min(this.qp_width, this.qp_height) / 2);
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
