import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PConfirmation
{
    static route = ajouterRoute('/confirmation', PConfirmation);
    
    app = inject(ApplicationClient);
      
}

