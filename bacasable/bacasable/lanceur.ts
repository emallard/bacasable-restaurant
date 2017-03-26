import { InjectionClient } from './injectionClient';
import { RouteurClient, RouteurServeur } from './routage';
import { ApplicationClient } from './applicationClient';
import { NavigateurReel } from './navigateurClient';
import { INavigateur } from './navigateur';
import { Injection } from './injection';

export class Lanceur 
{
    injection: Injection;
    applicationClient: ApplicationClient;

    constructor()
    {
        this.injection = new Injection();
        this.injection.bind(ApplicationClient).toSelf().inSingletonScope();
        this.injection.bind(INavigateur).to(NavigateurReel).inSingletonScope();
        this.injection.bind(RouteurClient).toSelf().inSingletonScope();
        this.injection.bind(RouteurServeur).toSelf().inSingletonScope();
        this.injection.bind(InjectionClient).toSelf().inSingletonScope();
        this.injection.get(InjectionClient).configurer(this.injection);
    }

    async lancer(succes:(page:any)=>void)
    {
        this.applicationClient = this.injection.get(ApplicationClient);
        await this.applicationClient.onload();
        succes(this.applicationClient.page);
    }

    page():any
    {
        return this.applicationClient.page;
    }
}