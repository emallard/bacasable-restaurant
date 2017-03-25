import { LokiPersistance } from '../../bacasable/bacasable/persistanceLoki';
import { IPersistance } from '../../bacasable/bacasable/persistance';
import { AuthentificationEmailMotDePasseBacasable } from '../../bacasable/bacasable/authentificationBacasable';
import { IAuthentificationEmailMotDePasse } from '../../bacasable/bacasable/authentification';
import { RouteurClient, RouteurServeur } from '../../bacasable/bacasable/routage';
import { Injection } from '../../bacasable/bacasable/injection';
import { ExecutionRequeteServeur } from '../../bacasable/bacasable/executionRequeteServeur';
import { ApplicationClient } from '../../bacasable/bacasable/applicationClient';
import { NavigateurBacASable } from '../../bacasable/bacasable/navigateurBacasable';
import { INavigateur } from '../../bacasable/bacasable/navigateur';
import { ServeurBacASable } from '../../bacasable/bacasable/serveurBacasable';
import { InternetBacASable } from '../../bacasable/bacasable/internetBacasable';
import { BacASable } from '../../bacasable/bacasable/bacasable';
import { ApplicationServeur } from '../../bacasable/bacasable/applicationServeur';
import { InjectionServeur } from '../../bacasable/bacasable/injectionServeur';
import { InjectionClient } from '../../bacasable/bacasable/injectionClient';
import {ajouterTest} from '../../bacasable/testrunner/runner';

export class TestBase
{
    applicationServeur:ApplicationServeur;
    applicationClient:ApplicationClient;
    navigateur:NavigateurBacASable;
    bacasable:BacASable;
    
    async initialiser()
    {
        var injection = new Injection();

        //injection.bind(ApplicationServeur).toSelf().inSingletonScope();

        //var scope = injection.addScope(new BindingScope(ApplicationServeur));
        injection.bind(ApplicationServeur).toSelf().inSingletonScope();
        injection.bind(ExecutionRequeteServeur).toSelf().inTypeScope(ApplicationServeur);

        injection.bind(ApplicationClient).toSelf().inSingletonScope();
        injection.bind(NavigateurBacASable).toSelf().inSingletonScope();
        injection.bind(INavigateur).to(NavigateurBacASable).inSingletonScope();
        injection.bind(ServeurBacASable).toSelf().inSingletonScope();
        injection.bind(InternetBacASable).toSelf().inSingletonScope();
        injection.bind(BacASable).toSelf().inSingletonScope();
        injection.bind(RouteurClient).toSelf().inSingletonScope();
        injection.bind(RouteurServeur).toSelf().inSingletonScope();

        // suite configuration injection
        injection.bind(InjectionClient).toSelf().inSingletonScope();
        injection.bind(InjectionServeur).toSelf().inSingletonScope();
        injection.get(InjectionClient).configurer(injection);
        injection.get(InjectionServeur).configurer(injection);

        // persistance et authentification
        injection.bind(IAuthentificationEmailMotDePasse).to(AuthentificationEmailMotDePasseBacasable).inSingletonScope();//.inTypeScope(ExecutionRequeteServeur);
        injection.bind(IPersistance).to(LokiPersistance).inSingletonScope();//.inTypeScope(ExecutionRequeteServeur);

        this.bacasable = injection.get(BacASable);
        await this.bacasable.initialiser();

        this.applicationServeur = this.bacasable.applicationServeur;
        this.applicationClient = this.bacasable.applicationClient;
        this.navigateur = this.bacasable.navigateur;      
    }
}

