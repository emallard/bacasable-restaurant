import { inject, Injection } from './injection';
import { RouteurServeur } from './routage';

export class ExecutionRequeteServeur
{
    routeurServeur = inject(RouteurServeur);
    injection = inject(Injection);

    executer(url:string, parameters:any):Promise<Object>
    {
        var typeService : any;
        var instanceConcrete : any;
        try 
        {
            typeService = this.routeurServeur.trouverType(url);
        }
        catch (e)
        {
            throw "Pas de webservice associé pour l'url : " + url;
        } 
        try 
        {
            instanceConcrete = this.injection.instantiate(typeService, this);
        }
        catch (e)
        {
            throw "Erreur lors de l'instanciation du type : " + typeService + " pour l'url " + url ;
        } 

        return instanceConcrete.executer(parameters);
    }
}