import { inject, Injection } from './injection';
import * as pathToRegexp from 'path-to-regexp';
import {ApplicationClient} from './applicationClient'
export interface IRoutable<U>
{
    construire(query:U);
}




export class Lien<T>
{
    url:string;
    type:{new():T};

    app = inject(ApplicationClient);
    afterInject()
    {
        this.url = this.app.LienVers(this.type).url;
    }
}

export function lien<T>(t:{new():T}) : Lien<T>
{
    var lien = new Lien<T>();
    lien.type = t;
    return lien;
}

export class Redirection<T>
{
    url:string;
    type:new()=>T;

    app = inject(ApplicationClient);
    afterInject()
    {
        this.url = this.app.LienVers(this.type).url;
    }
}

/*
export class ALienVers<T>
{
    constructor(type: {new(): T})
    {

    }
}
*/
class Routeur
{
    //ajouterRouteParamétrée<T extends IRoutable<U>, U>(route:string, c: new ()=>T, mapping:any)
    injection = inject(Injection);
    routes:RouteParamétrée[] = [];

    ajouterRouteParamétrée<T extends IRoutable<U>, U>(route:string, c: new ()=>T)
    {
        this.routes.push(new RouteParamétrée(route, c, null));
    }

    ajouterRoute(route:string, c: {new ():any})
    {
        this.routes.push(new RouteParamétrée(route, c, null));
    }

    ajouter(r:RouteParamétrée)
    {
        this.routes.push(r);
    }

    obtenirLien<T>(c: {new(): T}) : Lien<T>
    {
        var found =this.routes.find(r => {
            return (r.pageType == c);
        });

        if (found == null)
            throw "Exception Obtenir Lien : " + c + " non trouvé";

        var lien = new Lien<T>();
        lien.type = c;
        lien.url = found.url;
        return lien;
    }

    obtenirLien2<T extends IRoutable<U>, U>(type: {new(): T; }, parametres:U) : Redirection<T>
    {
        var found =this.routes.find(r => {
            return (r.pageType == type);
        });

        if (found == null)
            throw "Exception Obtenir Lien : " + type + " non trouvé";

        var lien = new Lien<T>();
        lien.type = type;
        var compiled = pathToRegexp.compile(found.url);
        lien.url = compiled(parametres);
        return lien;
    }

    obtenirRedirection<T>(c: {new(): T}) : Redirection<T>
    {
        var found =this.routes.find(r => {
            return (r.pageType == c);
        });

        if (found == null)
            throw "Exception Obtenir Redirection : " + c + " non trouvé";

        var lien = new Redirection<T>();
        lien.type = c;
        lien.url = found.url;
        return lien;
    }

    obtenirRedirection2<T extends IRoutable<U>, U>(type: {new(): T; }, parametres:U) : Redirection<T>
    {
        var found =this.routes.find(r => {
            return (r.pageType == type);
        });

        if (found == null)
            throw "Exception Obtenir Redirection : " + type + " non trouvé";

        var lien = new Redirection<T>();
        lien.type = type;
        var compiled = pathToRegexp.compile(found.url);
        lien.url = compiled(parametres);
        return lien;
    }

    async instancier(_url:string):Promise<any>
    {
        var found = this.identifierRoute(_url);
        
        if (found == null)
            throw "Exception Route non trouvée : " + _url;
        //var page = new found[0].pageType();
        var page = this.injection.instantiate(found[0].pageType, this)
        var params = found[1];
        if (params!= null && page.construire != undefined)
            await page.construire(params);
        
        return page;
                /*
                if (r.query != null)
                {
                    var mapped = {};
                    for (var parametre in r.query)
                    {
                        var paramName = r.query[parametre];
                        mapped[paramName] = match[paramName];
                    }
                    page.construire(r);
                }*/
    }

    trouverType(_url:string) : any
    {
        var found = this.routes.find(r => r.url == _url);
        return found.pageType;
    }

    private identifierRoute(_url:string) : [RouteParamétrée, any]
    {
        //console.log('identifierRoute ' +_url);
        
        for (var i=0; i<this.routes.length; ++i)
        {
            var keys=[];
            var r = this.routes[i];
            var regex = pathToRegexp(r.url, keys);
            if (regex.test(_url))
            {
                //console.log('match : ' + _url);
                var match = {};
                var execRes = regex.exec(_url);
                for (var ik=0; ik<keys.length; ++ik)
                {
                    var matchKey = keys[ik].name;
                    match[matchKey] = execRes[ik+1];
                    //console.log('match : ' + matchKey + '=' + match[matchKey]);
                }

                return [r, match];
            }
        }

        throw "route non trouvée";
        
    }
}


export class RouteParamétrée {
    
    constructor(
        public url:string, 
        public pageType:{new ():any}, 
        public query:any)
    {
    }
}

export class RouteurClient extends Routeur
{
    constructor()
    {
        super();
        StaticRoutes.routes.forEach(
            r => this.ajouter(r)
        )
    }
}

export class RouteurServeur extends Routeur
{
    constructor()
    {
        super();
        StaticRoutesApi.routes.forEach(
            r => this.ajouter(r)
        )
    }
}

export class StaticRoutes
{
    static routes:RouteParamétrée[] = [];
}

export function ajouterRoute(route:string, pageType:{new ():any})
{
    console.log('[static] ajouterRoute ' + route);
    StaticRoutes.routes.push(new RouteParamétrée(route, pageType, null));
}

export class StaticRoutesApi
{
    static routes:RouteParamétrée[] = [];
}

export function ajouterRouteApi(route:string, pageType:{new ():any})
{
    console.log('[static] ajouterRouteApi ' + route);
    StaticRoutesApi.routes.push(new RouteParamétrée(route, pageType, null));
} 