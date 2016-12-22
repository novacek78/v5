toolHoleCirc.onMouseDown = function(event) {

    currPath = new paper.Shape.Circle(event.point, 1);
    currPath.fillColor = '#dfd';
}

toolHoleCirc.onMouseDrag = function(event){

    var dx = event.point.x - event.downPoint.x;
    var dy = event.point.y - event.downPoint.y;

    currPath.radius = Math.sqrt(dx*dx + dy*dy);
}

