import { PListeRestaurants } from './pListeRestaurants';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';


export class PAccueil
{
    static route = ajouterRoute('/', PAccueil);
    
    app = inject(ApplicationClient);

    ville:string;

    async rechercher() : Promise<Redirection<PListeRestaurants>>
    {
        var redirection = this.app.RedirigerVers2(PListeRestaurants, {ville: this.ville});
        return redirection;
    }
}

