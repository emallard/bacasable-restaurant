import { ajouterRouteApi } from '../../bacasable/bacasable/routage';
import { WebService } from '../../bacasable/bacasable/webservice';


export class Restaurant
{
    nom:string;
    ville:string;
    prix:string;
    duree:string;
}


export class ListeRestaurants extends WebService<string, Restaurant[]>
{
    static route = ajouterRouteApi('/api/liste-restaurants', ListeRestaurants);
}

