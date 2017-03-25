
import path = require("path");
import express = require("express");
import http = require("http");
import bodyParser = require("body-parser");

var tests:{new():any}[] = []
export function ajouterTest(type:{new():any}):void
{
    tests.push(type);
}

function trouverTest(nom:string):{new():any}
{
    for (var i=0; i<tests.length; ++i)
    {
        if (tests[i].toString().split(' ')[1] == nom)
        {
            return tests[i];
        }
    }
    return null;
}

function listeDesTests():string[]
{
    return tests.map(t => t.toString().split(' ')[1]);
}


async function lancerTest1(type:{new():any})
{
    console.log('lancerTest');
    var test = new type();
    await test.initialiser();
    console.log('fin initialiser');
}

async function lancerTest(type:{new():any})
{
    var test = new type();
    await test.initialiser();

    var bac = test.bacasable;
    bac.logSuivre = (url:string) => 
    {
        console.log('navigateur vers : ' + url);
        io.emit('message', JSON.stringify({type:'suivre', url:url}));
    };

    bac.logSuivi = (anciennePage:string, url:string, nouvellePage:any) => 
    {
        console.log('navigateur a suivi : ' + url);
        var ancienne:any = anciennePage == undefined ? undefined : anciennePage.constructor.name;
        io.emit('message', JSON.stringify({type:'suivi', url:url, anciennePage:ancienne, nouvellePage:nouvellePage.constructor.name}));
    };

    bac.logPage = (page:any) => 
    {
        console.log('navigateur a changé de page : ' + page.constructor.name);
        io.emit('message', JSON.stringify({type:'page', page:page.constructor.name}));
    }

    bac.logAppel = (url, parameters) => 
    {
        console.log('appel vers : ' + url + ' , post : ' + JSON.stringify(parameters));
        io.emit('message',  JSON.stringify({type:'api-appel', url:url , parameters:parameters}));
    }

    bac.logReponse = (reponse, url, parameters) => 
    {
        console.log('reponse : ' + JSON.stringify(reponse));
        io.emit('message', JSON.stringify({type:'api-reponse', url:url , parameters:parameters, reponse:reponse}));
    }
    
    await test.test();
}


import * as fs from 'fs';
function dynLoad(dir)
{
    //console.log(dir);
    var list = fs.readdirSync(dir);
    list.forEach(file => 
    {
        var stat = fs.statSync(dir + '/' + file);
        if (stat && stat.isDirectory()) {
            dynLoad(dir + '/' + file)
        }
        else
        {
            if (file.endsWith('.js'))
            {
                console.log(dir + '/' + file);
                //DynamicLoader.files.push(dir + '/' + file);
                require(dir + '/' + file);
            }
        }
    });
}
dynLoad(path.join(__dirname, '..', '..', 'src', 'serveur'));
dynLoad(path.join(__dirname, '..', '..', 'src', 'test'));


// Configuration du serveur

let app = express();
let server = http.createServer(app);
var io = require('socket.io')(server);

// parse application/json
app.use(bodyParser.json())

// Fichiers


app.get('/', function(req, res){
    var file = path.join(__dirname, "..", "..", "..", "bacasable", "testrunner", "public", "index.html")
    res.sendFile(file);
});

app.get('/schema.svg', function(req, res){
    var file = path.join(__dirname, "..", "..", "..", "src", "test", "schema.svg")
    res.sendFile(file);
});

app.post('/schema.svg', function(req, res){
    var file = path.join(__dirname, "..", "..", "..", "src", "test", "schema.svg");
    console.log(req.body);
    //fs.writeFileSync(file, req.body);
    res.end();
});

// Lancer un test
app.post('/api/lancer', async function(req, res) {
    console.log(req.body);
    await lancerTest(trouverTest(req.body.nom));
    res.end();
});

// Liste des tests
app.get('/api/tests', function(req, res) {
    res.write(JSON.stringify(listeDesTests()));
    res.end();
});

app.use(express.static(path.join(__dirname, "..", "..", "..", "bacasable", "testrunner", "public")));

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

server.listen(4000, function(){
  console.log('listening on *:4000');
});