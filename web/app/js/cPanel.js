var Panel = fabric.util.createClass(fabric.Object, {

    type: FT_PANEL,
    qp_id: null,
    descShort: _('panel'),
    name: 'Panel 1',
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
            console.log('class Panel : Pouzi qp_width a qp_height. Width a height su LEN pre interne pouzitie!');

        this.set('thickness', options.thickness || 3);
        this.set('edgestyle', options.edgestyle || '');
        this.set('edgesize', options.edgesize || 0);
        this.set('r1', options.r1 || 0);
        this.set('surfcolor', 'RAW');
        this.set('width', options.qp_width);
        this.set('height', options.qp_height);

        this.callSuper('initialize', options);
    },

    _set: function(key, value){

        if (key == 'qp_width') {
            value = this.checkRange(key, value);
            this.width = value;
        }
        if (key == 'qp_height') {
            value = this.checkRange(key, value);
            this.height = value;
        }
        if (key == 'thickness') {
            value = this.checkRange(key, value);
            if (value === false) return false;
        }
        if (key == 'r1') {
            // obmedzenie maxima radiusu velkostou panela
            value = Math.min( Math.abs(value) , Math.min(this.qp_width, this.qp_height) / 2);
        }
        if (key == 'surfcolor') {
            var sizeRules = this.getAttributes();
            this.fill = sizeRules.surfcolor.colors_surf[ sizeRules.surfcolor.select_values.indexOf(value) ];
            this.dirty = true;
            TheCanvas.setBackgroundColor(sizeRules.surfcolor.colors_bgnd[ sizeRules.surfcolor.select_values.indexOf(value) ], null);
        }

        this.callSuper('_set', key, value);
        return this;
    },

    _render: function(ctx) {

        this.roundRect(ctx, this.qp_width, this.qp_height, this.r1);

        ctx.fillStyle = this.fill;
        ctx.fill();
    },

/**
     * Podla hlbky kapsy nastavi jej farbu - cim hlbsia, tym tmavsia
     *
     * @param depth
     */
    getPocketColor: function(depth){
        var relativeDepth = depth / ThePanel.thickness;
        var rozsah = COL_FEATURE_POCKET_MINDEPTH - COL_FEATURE_POCKET_MAXDEPTH;
        var odtien = COL_FEATURE_POCKET_MINDEPTH - Math.round(rozsah * relativeDepth);

        return "rgb("+odtien+","+odtien+","+odtien+")";
    },

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich pravidla a okrajove hodnoty.
     *
     * @returns {{qp_width: {min: number, max: number}, qp_height: {min: number, max: number}, r1: {min: number, max: number}}}
     */
    getAttributes: function(){
        var objAttribs;

        if (this.thickness <= 4)
            objAttribs = {
                qp_width: { min: 20 },
                qp_height: { min: 20 }
            };
        else if (this.thickness <= 6)
            objAttribs = {
                qp_width: { min: 25 },
                qp_height: { min: 25 }
            };
        else if (this.thickness <= 10)
            objAttribs = {
                qp_width: { min: 30 },
                qp_height: { min: 30 }
            };
        else
            objAttribs = {
                qp_width: { min: 50 },
                qp_height: { min: 50 }
            };

        objAttribs.qp_id = {
            type: 'number',
            desc: 'id',
            hidden: true,
            db_mapping: 'id'
        };

        objAttribs.name = {
            type: 'text',
            desc: _('qp_name')
        }

        objAttribs.qp_width.type = 'number';
        objAttribs.qp_width.max = PANEL_WIDTH_MAX;
        objAttribs.qp_width.desc = _('qp_width');
        objAttribs.qp_width.db_mapping = 'width';

        objAttribs.qp_height.type = 'number';
        objAttribs.qp_height.max = PANEL_HEIGHT_MAX;
        objAttribs.qp_height.desc = _('qp_height');
        objAttribs.qp_height.db_mapping = 'height';

        objAttribs['thickness'] = {
            type: 'select',
            select_values: PANEL_THICKNESS_AVAILABLE,
            select_labels: PANEL_THICKNESS_AVAILABLE_DESC,
            desc: _('thickness')
        };
        objAttribs['r1'] = {
            type: 'number',
            desc: _('r1')
        };
        objAttribs['surfcolor'] = {
            type: 'select',
            select_values: PANEL_SURFCOLOR_AVAILABLE,
            select_labels: PANEL_SURFCOLOR_AVAILABLE_DESC,
            colors_surf: PANEL_SURFCOLOR_AVAILABLE_COL,
            colors_bgnd: PANEL_SURFCOLOR_AVAILABLE_COLBGND,
            desc: _('surfcolor')
        };

        return objAttribs;
    },

    savePanel: function () {

        var ajaxData;

        ajaxData = this.getTransportObject();
        ajaxData.user_id = TheUser.id;

        $.ajax({
            method: 'POST',
            data: ajaxData,
            url: "?ajax=savePanel&uid=" + TheUser.id + "&secure=" + TheUser.secure,
            success: function(data) {
                if (isNaN(data)) {
                    QP.showMessage('error', _('Error occured while saveing panel: %1, %2', data, ''));
                } else {
                    ThePanel.qp_id = Number(data);
                    QP.showMessage('success', _('Panel saved'));
                }
            },
            error: function(xhr,status,error){
                QP.showMessage('error', _('Error occured while saveing panel: %1, %2', error, status));
            }
        });
    }


});