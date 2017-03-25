
import { IRoutable, Lien, Redirection, RouteurClient, RouteurServeur } from './routage';
import { WebService } from './webservice';
import { inject } from './injection';
import { INavigateur } from './navigateur';


export class ApplicationClient
{
    routeurClient = inject(RouteurClient);
    routeurServeur = inject(RouteurServeur);
    navigateur = inject(INavigateur);
    
    page:any;
    
    async onload()
    {
        console.log('ApplicationClient.onload');
        var location = this.navigateur.location();
        console.log('location ' + location);
        if (location != undefined)
            this.page = await this.routeurClient.instancier(location);
    }
    
    LienVers<T>(c: {new(): T; }) : Lien<T>
    {
        return this.routeurClient.obtenirLien(c);
    }

    LienVers2<T extends IRoutable<U>, U>(type: {new(): T; }, parametres:U) : Redirection<T>
    {
        return this.routeurClient.obtenirLien2(type, parametres);
    }

    RedirigerVers<T>(c: {new(): T; }) : Redirection<T>
    {
        var lien = this.routeurClient.obtenirRedirection(c);
        this.navigateur.setlocation(lien.url)
        return lien;
    }

    RedirigerVers2<T extends IRoutable<U>, U>(type: {new(): T; }, parametres:U) : Redirection<T>
    {
        var redir = this.routeurClient.obtenirRedirection2<T, U>(type, parametres);
        this.navigateur.setlocation(redir.url)
        return redir;
    }

    
    AppelerWebService<T, U>(w:{new():WebService<T,U>}, t:T) : Promise<U>
    {
        var lien = this.routeurServeur.obtenirLien(w);
        return this.navigateur.appelerWebService(lien.url, t);
    }
    
}