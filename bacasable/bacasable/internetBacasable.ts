import { BacASable } from './bacasable';
import { inject } from './injection';
import { ServeurBacASable } from './serveurBacasable';

export class InternetBacASable
{
    serveur = inject(ServeurBacASable);
    bacasable = inject(BacASable);

    envoyer(url:string, parameters:any, succes:(reponse:any)=>void) : any
    {
        var reponse = this.serveur.recevoir(url, parameters);
        if (succes != null)
            succes(reponse);
    }

    async envoyerAsync(url:string, parameters:any) : Promise<any>
    {
        this.bacasable.logAppel(url, parameters);
        var reponse = await this.serveur.recevoirAsync(url, parameters);
        this.bacasable.logReponse(reponse, url, parameters);
        return reponse;
    }
}