import { inject, injectFunc } from '../../../bacasable/bacasable/injection';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { ajouterRoute, Lien, Redirection } from '../../../bacasable/bacasable/routage';


export class AAccueil
{
    static route = ajouterRoute('/admin', AAccueil);

    app = inject(ApplicationClient);

    async construire()
    {

    }

}


