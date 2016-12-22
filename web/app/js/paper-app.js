var currPath;
var toolHoleRect = new paper.Tool();
var toolHoleCirc = new paper.Tool();

paper.tool = null;



function MakeRectangle(){

    if (toolHoleRect.isActive())
        paper.tool = null;
    else
        toolHoleRect.activate();
}
function MakeCircle(){

    if (toolHoleCirc.isActive())
        paper.tool = null;
    else
        toolHoleCirc.activate();
}