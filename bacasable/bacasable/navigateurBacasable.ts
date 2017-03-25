import { ApplicationClient } from './applicationClient';
import { Lien, Redirection } from './routage';
import { INavigateur } from './navigateur';
import { inject } from './injection';
import { BacASable } from './bacasable';
import { InternetBacASable } from './internetBacasable';

export class NavigateurBacASable extends INavigateur
{
    bacasable = inject(BacASable);
    internet = inject(InternetBacASable);
    applicationClient:ApplicationClient;

    _location:string;
    page:any;

    async charger(applicationClient:ApplicationClient)
    {
        this.applicationClient = applicationClient;
        await this.applicationClient.onload();
    }

    changerPage(page:any):any
    {
        this.bacasable.logPage(page);
        this.page = page;
        return page;
    }

    async suivreLien<T>(lien: Lien<T>) : Promise<T>
    {
        var anciennePage = this.applicationClient.page;
        this.bacasable.logSuivre(lien.url);
        this._location = lien.url;
        await this.applicationClient.onload();
        this.bacasable.logSuivi(anciennePage, lien.url, this.applicationClient.page);
        return this.changerPage(this.applicationClient.page);
    }

    async suivre<T>(redirection: Redirection<T>) : Promise<T>
    {
        var anciennePage = this.applicationClient.page;
        this.bacasable.logSuivre(redirection.url);
        this._location = redirection.url;
        await this.applicationClient.onload();
        this.bacasable.logSuivi(anciennePage, redirection.url, this.applicationClient.page);
        return this.changerPage(this.applicationClient.page);
    }

    /*
    suivre<T>(redirection: Redirection<T>) : T
    {
    }
    */
    /*
    executer<T>(f : () => Lien<T>) : T
    {
        var lien = f();
        var page = new lien.create();
        return page;
    }*/

    changerAdresse(_url:string)
    {
        this._location = _url; 
    }

    location() { return this._location; }
    setlocation(location:string) {this._location = location}

    appelerWebService(url:string, parameters:any) : Promise<any>
    {
        return this.internet.envoyerAsync(url, parameters);
    }
}