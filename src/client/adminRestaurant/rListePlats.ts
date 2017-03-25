import { inject, injectFunc } from '../../../bacasable/bacasable/injection';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';

import { ajouterRoute, Lien, Redirection } from '../../../bacasable/bacasable/routage';


export class RListePlats
{
    static route = ajouterRoute('/admin-restaurant/liste-plats', RListePlats);
    app = inject(ApplicationClient);
}


