import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PageConfirmation
{
    static route = ajouterRoute('/confirmation', PageConfirmation);
    
    app = inject(ApplicationClient);
      
}

