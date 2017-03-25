// http://www.codedread.com/blog/archives/2005/12/21/how-to-enable-dragging-in-svg/

var bMouseDragging = false;
var nMouseOffsetX = 0;
var nMouseOffsetY = 0;
var background = document.getElementById("background");

function dragSvg_mouseDown(evt) { 
    bMouseDragging = true;
    //console.log('dragSvg_mouseDown');
    draggedElt = evt.target;

    var p = draggedElt.ownerSVGElement.createSVGPoint();
    p.x = evt.clientX;
    p.y = evt.clientY;

    var m = draggedElt.getScreenCTM();
    p = p.matrixTransform(m.inverse());
    nMouseOffsetX = p.x - parseInt(draggedElt.getAttribute("x"));
    nMouseOffsetY = p.y - parseInt(draggedElt.getAttribute("y"));
    //console.log('dragSvg_mouseDown ' + nMouseOffsetX + ' ' + nMouseOffsetY);
}

function dragSvg_mouseUp(evt) { 
    bMouseDragging = false;
    draggedElt = null;
}

function dragSvg_mouseMove(evt) {
    if(bMouseDragging && draggedElt != null) {
        var p = draggedElt.ownerSVGElement.createSVGPoint();
        p.x = evt.clientX;
        p.y = evt.clientY;

        
        var m = draggedElt.getScreenCTM();
        p = p.matrixTransform(m.inverse());

        draggedElt.setAttribute("x", p.x - nMouseOffsetX);
        draggedElt.setAttribute("y", p.y - nMouseOffsetY);
    }
}

function displayCoords(x,y,extra) {
    var xNode = document.getElementById("xpos");
    var yNode = document.getElementById("ypos");
    if(xNode && yNode) {
        xNode.firstChild.nodeValue = parseInt(x) + extra;
        yNode.firstChild.nodeValue = parseInt(y) + extra;
    }
}

function displayRawText(text) {
    var textNode = document.getElementById("raw");
    if(textNode) {
        textNode.firstChild.nodeValue = text;
    }
}

function addDragListeners(elt) {
    elt.addEventListener("mousedown", dragSvg_mouseDown, false);
    elt.addEventListener("mouseup", dragSvg_mouseUp, false);
    elt.addEventListener("mousemove", dragSvg_mouseMove, false);
    //displayRawText("Drag the ball around");
}