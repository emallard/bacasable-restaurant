import { chargementDynamique } from '../bacasable/bacasable/chargementDynamique';
import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import exphbs = require('express-handlebars');
import session = require('express-session');
import fs = require('fs');

import { LokiPersistance } from '../bacasable/bacasable/persistanceLoki';
import { IPersistance } from '../bacasable/bacasable/persistance';
import { AuthentificationEmailMotDePasseBacasable } from '../bacasable/bacasable/authentificationBacasable';
import { IAuthentificationEmailMotDePasse } from '../bacasable/bacasable/authentification';
import { RouteParamétrée, RouteurClient, RouteurServeur } from '../bacasable/bacasable/routage';
import { Injection } from '../bacasable/bacasable/injection';
import { ExecutionRequeteServeur } from '../bacasable/bacasable/executionRequeteServeur';
import { ApplicationClient } from '../bacasable/bacasable/applicationClient';
import { ApplicationServeur } from '../bacasable/bacasable/applicationServeur';
import { InjectionServeur } from '../bacasable/bacasable/injectionServeur';
import { InjectionClient } from '../bacasable/bacasable/injectionClient';

let app = express();


var dyn = new chargementDynamique();
dyn.charger(path.join(__dirname, '..', 'src', 'client'));
dyn.charger(path.join(__dirname, '..', 'src', 'serveur'));


var injection = new Injection();

injection.bind(ApplicationServeur).toSelf().inSingletonScope();
injection.bind(ExecutionRequeteServeur).toSelf().inTypeScope(ApplicationServeur);
injection.bind(ApplicationClient).toSelf().inSingletonScope();
injection.bind(RouteurClient).toSelf().inSingletonScope();
injection.bind(RouteurServeur).toSelf().inSingletonScope();

// suite configuration injection
injection.bind(InjectionClient).toSelf().inSingletonScope();
injection.bind(InjectionServeur).toSelf().inSingletonScope();
injection.get(InjectionClient).configurer(injection);
injection.get(InjectionServeur).configurer(injection);

// persistance et authentification
// injection.bind(IAuthentificationEmailMotDePasse).to(AuthentificationEmailMotDePasseBacasable).inSingletonScope();//.inTypeScope(ExecutionRequeteServeur);
injection.bind(IPersistance).to(LokiPersistance).inSingletonScope();//.inTypeScope(ExecutionRequeteServeur);



function trouverHbs(typeName:string, dir:string):string
{
    var list = fs.readdirSync(dir);
    for (var i=0; i<list.length; ++i)
    {
        var file = list[i];
        var stat = fs.statSync(dir + '/' + file);
        if (stat && stat.isDirectory()) {
            var trouve = trouverHbs(typeName, dir + '/' + file);
            if (trouve != null)
                return trouve;
        }
        else
        {
            if (file.toLowerCase() == typeName.toLowerCase() + '.hbs')
            {
                return dir + '/' + file;
            }
        }
    }
    return null;
}



let routeurClient = injection.get(RouteurClient);
/*
function associerVue(type, fichier)
{
    var url = routeurClient.trouverRoutePourLeType(type).url;
    app.get(url, function (req, res) {
        res.render(fichier);
    });
}*/


// association views : pages
// enregistrement des routes client

function getRenderFunc(fichier:string)
{
    return function (req, res) { res.render(fichier); };
}



routeurClient.routes.forEach(r => {
    var fichier = trouverHbs(r.pageType.name, path.join(__dirname, '..', '..', 'node', 'views'));
    if (fichier != null)
    {
        console.log('[node routeur view] ' + r.url + ' ' + r.pageType.name + ' : ' + path.basename(fichier));
        app.get(r.url, getRenderFunc(fichier));
    }
})


let appServeur = injection.get(ApplicationServeur);

function getPostFunc(r:RouteParamétrée)
{
    console.log('[node routeur post] ' + r.url + ' ' + r.pageType.name);
    return function (req, res, next) {
        var promesse = appServeur.recevoir(req.path, req.body);
        promesse.then( (o) => 
        {
            console.log(o);
            res.send(JSON.stringify(o));
            //next();
        });
    }
}

// enregistrement des routes serveur
appServeur.routeurServeur.routes.forEach(r => {
    app.post(r.url, getPostFunc(r));
})

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'layout'})); //defaultLayout: 'main'
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "..", "..", "node", "views"));

/*
app.set("view engine", "hbs");
*/
if (app.get("env") === "development") {
    app.use(logger("dev"));
}

app.use(session({
  secret: 'lkdsnkvjdnsbkjbsvdqkvbkjbkjbpo',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, "..", "..", "node", "public")));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//
// --------------------------------
//
// error handlers

app.use(function(req, res, next) {
    let err = <any>new Error("Not Found");
    err["status"] = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        //console.log(err.stack);

        console.log(err.message);
        console.log(err);
        
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render("error.hbs", {
            message: err.message,
            error: err
        });
        
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.render("error.hbs", {
        message: err.message,
        error: {}
    });
});

export = app;