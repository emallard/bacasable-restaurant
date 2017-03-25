import { inject, injectFunc } from '../../../bacasable/bacasable/injection';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';

import { ajouterRoute, Lien, Redirection } from '../../../bacasable/bacasable/routage';


export class RListeCommandes
{
    static route = ajouterRoute('/admin-restaurant/liste-commandes', RListeCommandes);
    app = inject(ApplicationClient);
}


