
function addLi(txt)
{
    var li = document.createElement('li');
    li.innerText = txt;
    document.getElementById('messages').appendChild(li);
}
function graphClearMessages()
{

}

var accum = [];
function graphPushMessage(msgStr)
{
    var msg = JSON.parse(msgStr);
    /*
    var li = document.createElement('li');
    li.innerText = msg;
    document.getElementById('messages').appendChild(li);    
    */
    //console.log(msg);
    if (msg.type == 'suivi')
    {
        msg.accum = accum;
        testPageSuivi(msg);
        flecheSuivi(msg);
        //var url = msg.url;
        //addLi(msg.url + ':' + msg.anciennePage + ' -> ' + msg.nouvellePage);
        // reset accum
        accum = [];
    }
    if (msg.type == 'api-reponse')
    {
        accum.push(msg);
        console.log(msg);
        /*
        addLi(msg.url);
        addLi(JSON.stringify(msg.parameters));
        addLi(JSON.stringify(msg.reponse));
    */}
}

function testPageSuivi(msg)
{
    var tspan = trouverText(msg.nouvellePage);
    console.log(msg.nouvellePage);
    if (tspan != undefined)
        return;
    var svg = document.getElementsByTagName('svg')[0];
    var g = svg.querySelectorAll("g")[0];

    var allTexts = svg.querySelectorAll("text")
    var maxY = 10;
    for (var i=0; i<allTexts.length; ++i)
    {
        var x = parseFloat(allTexts[i].getAttribute('x'));
        var y = parseFloat(allTexts[i].getAttribute('y'));
        if (x<10)
            maxY = Math.max(maxY, y);
    }

    var text = SVG.createText(1, maxY+40, msg.nouvellePage );//+ '  ' + msg.url);
    text.style.cursor = 'pointer';
    g.appendChild(text);
    addDragListeners(text);
}

function flecheSuivi(msg)
{
    var svg = document.getElementsByTagName('svg')[0];
    var a = trouverText(msg.nouvellePage);

    a.style.fill = 'red';

    if (msg.anciennePage == undefined)
        return;

    var de = trouverText(msg.anciennePage);
    
    //console.log(a.getCTM());
    //ajouterLigne(de, a);

    // add box
    /*
    var b1 = getTSpanBBox(de);
    var b2 = getTSpanBBox(a);
    */
    var b1 = de.getBBox();
    var b2 = a.getBBox();
    getGroupeLignes().appendChild(
        SVG.createLine(b1.x+b1.width/2, b1.y + b1.height, b2.x + b2.width/2, b2.y, 'red', '1px')
    );

    /*   
    var contenuText = accum.map(function (x) { return x.url }).join(', ');
    var texte = SVG.createText((b1.x + b2.x)/2, (b1.y + b2.y)/2, contenuText + ', ' + msg.url);
    getGroupeLignes().appendChild(
        texte
    );

    var texteBB = texte.getBBox();
    getGroupeLignes().insertBefore(
                SVG.createRect(texteBB.x, texteBB.y, texteBB.width, texteBB.height, 'white', 'black', '1px'),
                texte
    );
    */
    //msg.url
}

function trouverTSpan(nom)
{
    var liste = document.getElementsByTagName('tspan');
    for (var i=0; i<liste.length; ++i)
    {
        if (liste[i].textContent == nom || 
            ('Page'+liste[i].textContent == nom))
            {
                return liste[i];
            }
    }
}

function trouverText(nom)
{
    var liste = document.getElementsByTagName('text');
    for (var i=0; i<liste.length; ++i)
    {
        if (liste[i].textContent == nom || 
            ('Page'+liste[i].textContent == nom))
            {
                return liste[i];
            }
    }
}

function getTSpanBBox(tspan)
{
    return tspan.parentNode.getBBox();
}



function getGroupeLignes()
{
    var groupe = document.getElementById('groupeLignes');
    if (groupe == undefined)
    {
        groupe = SVG.createGroup();
        groupe.id = 'groupeLignes';
        var svg = document.getElementsByTagName('svg')[0];
        svg.appendChild(groupe)
    }
    return groupe;
}


SVG = {
/*
  createCanvas : function( width, height, containerId ){
    var container = document.getElementById( containerId );
    var canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    container.appendChild( canvas );    
    return canvas;
},*/
  createLine : function (x1, y1, x2, y2, color, w) {
    var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', color);
    aLine.setAttribute('stroke-width', w);
    return aLine;
  },
  createGroup : function (x1, y1, x2, y2, color, w) {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  },
  createRect : function (x, y, width, height, fill, stroke,  w) {
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', w);
    return rect;
  },
  createTSpan : function(x, y, text)
  { 
    var t = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = text;
    return t;
  },
  createText : function(x, y, text)
  { 
    var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = text;
    return t;
  }
}