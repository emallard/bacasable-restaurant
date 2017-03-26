import { ListeRestaurants, Restaurant } from '../../api/listeRestaurants';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, IRoutable, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PListeRestaurantsRoute
{
    ville: string
}

export class PListeRestaurants implements IRoutable<PListeRestaurantsRoute>
{
    static route = ajouterRoute('/restaurants/:ville', PListeRestaurants);
    
    app = inject(ApplicationClient);
    
    liste:Restaurant[];

    async construire(route:PListeRestaurantsRoute)
    {
        var listeDto = await this.app.AppelerWebService(ListeRestaurants, route.ville);
        this.liste = listeDto;
    }
}


export class ListeRestaurantsItem
{
    nom:string; 
    duree:string;
    prix:string;
}

