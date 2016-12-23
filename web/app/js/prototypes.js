/**
 * Definicia default vlastnosti objektov + dodefinovanie custom vlastnosti
 */
function definePrototypes(){

    // ----------- default properties ----------------------
    fabric.Object.prototype.borderColor = 'red';
    fabric.Object.prototype.borderDashArray = [5,8];
    fabric.Object.prototype.cornerColor = 'red';
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';
    fabric.Circle.prototype.hasRotatingPoint = false;
    fabric.Circle.prototype.perPixelTargetFind = true;

    // ----------- custom properties -----------------------
    fabric.Object.prototype.qp_type = -1; // typ objektu v systeme QP
    fabric.Object.prototype.qp_basePoint = BP_CENTER; // poloha base pointu
    fabric.Object.prototype.qp_depth = -1; // hlbka

    // --------- custom methods ----------------------------
    // doplnenie metody do JS stringov - first letter uppercase
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    fabric.Object.prototype.setDepth = function(depth){

        if (depth > 900)
            this.setFill(COL_BACKGROUND); // otvor skrz
        else
            this.setFill(COL_FEATURE_POCKET);

        this.qp_depth = depth;
    };

    fabric.Object.prototype.on('modified', function(){

        if (TheCanvas.getActiveGroup())
            showProperties(TheCanvas.getActiveGroup());
        else {
            if (this.scaleX != 1){
                this.setWidth(this.width * this.scaleX);
                this.scaleX = 1;
            }
            if (this.scaleY != 1){
                this.setHeight(this.height * this.scaleY);
                this.scaleY = 1;
            }
            showProperties(this);
        }
    });

    fabric.Object.prototype.roundRect = function (ctx, posX, posY, width, height, r1) {
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
    }

}