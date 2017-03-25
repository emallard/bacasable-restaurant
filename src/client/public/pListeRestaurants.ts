import { ListeRestaurants } from '../../api/listeRestaurants';
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
    
    liste:ListeRestaurantsItem[];

    async construire(route:PListeRestaurantsRoute)
    {
        var liste = await this.app.AppelerWebService(ListeRestaurants, route.ville);
    }
}


export class ListeRestaurantsItem
{
    nom:string;
    duree:string;
    prix:string;
}

