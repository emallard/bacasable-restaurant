import { ExecutionRequeteServeur } from './executionRequeteServeur';
import { RouteurServeur } from './routage';
import { inject, injectFunc } from './injection';

export class ApplicationServeur
{
    routeurServeur = inject(RouteurServeur);
    creerExecution = injectFunc(ExecutionRequeteServeur);
    
    recevoir(url:string, parameters:any):Promise<Object>
    {
        var execution = this.creerExecution();
        return execution.executer(url, parameters);
    }
}
