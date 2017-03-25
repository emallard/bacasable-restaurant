import { inject } from './injection';
import { InternetBacASable } from './internetBacasable';
import { NavigateurBacASable } from './navigateurBacasable';
import { ServeurBacASable } from './serveurBacasable';
import { ApplicationServeur } from './applicationServeur';
import { ApplicationClient } from './applicationClient';

export class BacASable
{
    internet = inject(InternetBacASable);
    navigateur = inject(NavigateurBacASable);
    serveur = inject(ServeurBacASable);
    applicationServeur = inject(ApplicationServeur);
    applicationClient = inject(ApplicationClient);
    
    async initialiser()
    {
        await this.navigateur.charger(this.applicationClient);
    }

    logSuivre : (url:string)=>void = (url)=>{};
    logSuivi : (url:string, anciennePage:any, nouvellePage:any)=>void = (anciennePage, nouvellePage)=>{};
    logPage : (page:any)=>void = (page)=>{};
    logAppel : (url:any, parameters:any)=>void = (url:any, parameters:any)=>{};
    logReponse : (reponse:any, url:any, parameters:any)=>void = (reponse:any, url:any, parameters:any)=>{};
}







