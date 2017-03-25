import { StaticRoutes } from './routage';
import { Injection } from './injection';
export class InjectionClient
{
    configurer(injection:Injection)
    {
        // ajouter les routes statiques
        StaticRoutes.routes.forEach(r => 
        {
            console.log('add binding for : ' + r.pageType.toString().split(' ')[1]);
            injection.bind(r.pageType).toSelf().inSingletonScope();
        });
    }
}