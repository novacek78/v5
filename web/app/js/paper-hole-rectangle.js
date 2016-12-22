toolHoleRect.onMouseDown = function(event) {

    currPath = new paper.Shape.Rectangle(event.point, new paper.Size(1,1));
    currPath.fillColor = '#ddf';
}

toolHoleRect.onMouseDrag = function(event){
    var deltaX;

    if (event.point.x < event.downPoint.x)
        deltaX = -event.delta.x;
    else
        deltaX = event.delta.x;

    currPath.size.width = currPath.size.width + 2*deltaX;
    currPath.size.height = currPath.size.height + 2*event.delta.y;
}

