import { ListeRestaurants, Restaurant } from '../api/listeRestaurants';
import { IPersistance } from '../../bacasable/bacasable/persistance';
import { bind, inject } from '../../bacasable/bacasable/injection';
import { ExecutionRequeteServeur } from '../../bacasable/bacasable/executionRequeteServeur';

export class ListeRestaurantsImpl extends ListeRestaurants
{
    static binding = bind(ListeRestaurants).to(ListeRestaurantsImpl)
                                           .inTypeScope(ExecutionRequeteServeur);

    persistance = inject(IPersistance);

    async executer(ville:string) : Promise<Restaurant[]>
    {
        return await this.persistance.collection(Restaurant).find({$eq: {ville:ville}});
    }
}

