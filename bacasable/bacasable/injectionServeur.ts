import { StaticRoutes } from './routage';
import { Injection, StaticBindings } from './injection';

export class InjectionServeur
{
    configurer(injection:Injection)
    {
        // run require on files
        console.log('InjectionServeur');

        StaticBindings.bindings.forEach(b => 
        {
            console.log('add server binding ' + b.typeInterface.toString().split(' ')[1]);
            injection.addBinding(b)
        });
    }
}