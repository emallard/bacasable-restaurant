
export class IAuthentificationEmailMotDePasse
{

    async sInscrire(email:string, motDePasse:string) : Promise<string>
    {
        throw "Non implémenté";
    }

    async sAuthentifier(email:string, motDePasse:string)
    {
        throw "Non implémenté";
    }

    async seDeconnecter()
    {
        throw "Non implémenté";
    }

    async estAuthentifié() : Promise<boolean>
    {
        throw "Non implémenté";
    }

    async idAuthentifié() : Promise<string> 
    {
        throw "Non implémenté";
    }
}

// NodeJs implementation
/*
if (req.user) {
    // logged in
} else {
    // not logged in
}
*/


/*
export class Authentification1
{
    requete = inject(Requete);

    IdAuthentifié() : string {
        return this.requete.cookies['_authent'];
    }
}*/