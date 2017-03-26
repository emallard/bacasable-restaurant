import { Lanceur } from '../../../bacasable/bacasable/lanceur';
import { PListeRestaurants } from './pListeRestaurants';
import { ApplicationClient } from '../../../bacasable/bacasable/applicationClient';
import { inject, injectNewGeneric } from '../../../bacasable/bacasable/injection';
import { ajouterRoute, Lien, lien, Redirection } from '../../../bacasable/bacasable/routage';



export class PAccueil
{
    static route = ajouterRoute('/', PAccueil);
    
    app = inject(ApplicationClient);

    ville:string = "Amenon";

    //ville = input<string>("votre ville");

    async rechercher() : Promise<Redirection<PListeRestaurants>>
    {
        var redirection = this.app.RedirigerVers2(PListeRestaurants, {ville: this.ville});
        return redirection;
    }
}

/*
export class PAccueilVue
{
    static vue = vue(PAccueil, x => 
        [x => x.ville , "Votre ville"]
    );
}*/