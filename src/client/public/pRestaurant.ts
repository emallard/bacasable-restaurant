import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PRestaurants
{
    static route = ajouterRoute('/restaurant/:nom', PRestaurants);
    
    app = inject(ApplicationClient);
      
}

