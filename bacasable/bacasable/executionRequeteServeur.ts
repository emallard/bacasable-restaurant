import { inject, Injection } from './injection';
import { RouteurServeur } from './routage';

export class ExecutionRequeteServeur
{
    routeurServeur = inject(RouteurServeur);
    injection = inject(Injection);

    executer(url:string, parameters:any):any
    {
        var typeService = this.routeurServeur.trouverType(url);
        var instanceConcrete = this.injection.instantiate(typeService, this);
        return instanceConcrete.executer(parameters);
    }
}