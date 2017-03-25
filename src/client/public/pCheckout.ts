import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PCheckout
{
    static route = ajouterRoute('/checkout', PCheckout);
    
    app = inject(ApplicationClient);
      
}

