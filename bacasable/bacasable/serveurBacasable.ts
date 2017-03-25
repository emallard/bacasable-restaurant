import { ApplicationServeur } from './applicationServeur';
import { inject } from './injection';

export class ServeurBacASable
{
    applicationServeur = inject(ApplicationServeur);

    recevoir(url:string, parameters:any):any
    {
        return this.applicationServeur.recevoir(url, parameters);
    }

    async recevoirAsync(url:string, parameters:any):Promise<any>
    {
        return await this.applicationServeur.recevoir(url, parameters);
    }
}