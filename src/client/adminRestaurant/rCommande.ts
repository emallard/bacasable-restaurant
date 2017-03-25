import { inject, injectFunc } from '../../../bacasable/bacasable/injection';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';

import { ajouterRoute, Lien, Redirection } from '../../../bacasable/bacasable/routage';


export class RCommande
{
    static route = ajouterRoute('/admin-restaurant/commande/:id', RCommande);
    app = inject(ApplicationClient);
}


