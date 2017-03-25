import { inject, injectFunc } from '../../../bacasable/bacasable/injection';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';

import { ajouterRoute, Lien, Redirection } from '../../../bacasable/bacasable/routage';


export class RAjouterPlat
{
    static route = ajouterRoute('/admin-restaurant/ajouter-plat', RAjouterPlat);
    app = inject(ApplicationClient);
}


