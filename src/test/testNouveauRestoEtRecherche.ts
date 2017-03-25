import { PAccueil } from '../client/public/pAccueil';
import { Redirection } from '../../bacasable/bacasable/routage';
import { ajouterTest } from '../../bacasable/testrunner/runner';
import {TestBase} from './testBase';

export class TestNouveauRestoEtRecherche extends TestBase
{
    static onInit = ajouterTest(TestNouveauRestoEtRecherche);

    async test()
    {
        var lien = this.applicationClient.LienVers(PAccueil);
        var pageAccueil = await this.navigateur.suivreLien(lien);

        pageAccueil.ville = 'Bordeaux';
        var pageListeRestaurants = 
            await this.navigateur.suivre(await pageAccueil.rechercher());

        pageListeRestaurants.liste; // liste affichée
    }
}

