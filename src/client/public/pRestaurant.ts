import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PRestaurant
{
    static route = ajouterRoute('/restaurant/:nom', PRestaurant);
    
    app = inject(ApplicationClient);
      
}

