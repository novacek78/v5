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
            value = this.checkRange(key, value);
            this.width = value;
        }
        if (key == 'qp_height') {
            value = this.checkRange(key, value);
            this.height = value;
        }
        if (key == 'qp_thickness') {
            value = this.checkRange(key, value);
            if (value === false) return false;
        }
        if (key == 'qp_r1') {
            // obmedzenie maxima radiusu
            value = Math.min( Math.abs(value) , Math.min(this.qp_width, this.qp_height) / 2);
        }

        this.callSuper('_set', key, value);
        return this;
    },

    _render: function(ctx) {

        this.roundRect(ctx, this.qp_width, this.qp_height, this.qp_r1);

        ctx.fillStyle = this.fill;
        ctx.fill();
    },

    /**
     *
     */
    getObjectAttributes: function(objectToInspect){
        var attribs = this.getSizeRules();
        var result = {};

        for (var propName in attribs) {
            console.log(propName);
            result[propName] = '';
        }
    },

/**
     * Podla hlbky kapsy nastavi jej farbu - cim hlbsia, tym tmavsia
     *
     * @param depth
     */
    getPocketColor: function(depth){
        var relativeDepth = depth / ThePanel.qp_thickness;
        var rozsah = COL_FEATURE_POCKET_MINDEPTH - COL_FEATURE_POCKET_MAXDEPTH;
        var odtien = COL_FEATURE_POCKET_MINDEPTH - Math.round(rozsah * relativeDepth);

        return "rgb("+odtien+","+odtien+","+odtien+")";
    },

    /**
     * Vrati zoznam atributov potrebnych pre definiciu objektu (aj pre ukladanie a exportovanie)
     * a ich pravidla a okrajove hodnoty.
     *
     * @returns {{qp_width: {min: number, max: number}, qp_height: {min: number, max: number}, qp_r1: {min: number, max: number}}}
     */
    getSizeRules: function(){
        var objAttribs;

        if (this.qp_thickness <= 4)
            objAttribs = {
                qp_width: {
                    type: 'number',
                    min: 20,
                    max: PANEL_WIDTH_MAX
                },
                qp_height: {
                    type: 'number',
                    min: 20,
                    max: PANEL_HEIGHT_MAX
                }
            };
        else if (this.qp_thickness <= 6)
            objAttribs = {
                qp_width: {
                    type: 'number',
                    min: 25,
                    max: PANEL_WIDTH_MAX
                },
                qp_height: {
                    type: 'number',
                    min: 25,
                    max: PANEL_HEIGHT_MAX
                }
            };
        else if (this.qp_thickness <= 10)
            objAttribs = {
                qp_width: {
                    type: 'number',
                    min: 30,
                    max: PANEL_WIDTH_MAX
                },
                qp_height: {
                    type: 'number',
                    min: 30,
                    max: PANEL_HEIGHT_MAX
                }
            };
        else
            objAttribs = {
                qp_width: {
                    type: 'number',
                    min: 50,
                    max: PANEL_WIDTH_MAX
                },
                qp_height: {
                    type: 'number',
                    min: 50,
                    max: PANEL_HEIGHT_MAX
                }
            };

        objAttribs['qp_thickness'] = {
            type: 'select',
            select_one: PANEL_THICKNESS_AVAILABLE
        };
        objAttribs['qp_r1'] = {
            type: 'number'
        };
        objAttribs['qp_version'] = {
            type: 'text',
            readonly: true
        };

        return objAttribs;
    }

});
