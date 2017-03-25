import { ApplicationClient } from './applicationClient';
import { NavigateurReel } from './navigateurClient';
import { INavigateur } from './navigateur';
import { Injection } from './injection';

export class Lanceur 
{

    injection: Injection;
    
    constructor(moduleInjection:any)
    {
        this.injection = new Injection();
        this.injection.bind(INavigateur).to(NavigateurReel).inSingletonScope();

        moduleInjection.configurer(this.injection);
    }

    lancer()
    {
        var applicationClient = this.injection.get(ApplicationClient);
        applicationClient.onload();
    }
}