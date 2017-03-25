import { inject } from './injection';
import { IPersistance } from './persistance';
import { IAuthentificationEmailMotDePasse } from './authentification';


export class EmailMotDePasse
{
    email:string = null;
    motDePasse:string = null;
}

export class AuthentificationEmailMotDePasseBacasable extends IAuthentificationEmailMotDePasse
{

    authentifié = false;
    id:string = null;
    email:string = null;
    motDePasse:string = null;
/*
    persistance = inject(IPersistance);

    async sInscrire(email:string, motDePasse:string) 
    {
        var collection = this.persistance.collection(EmailMotDePasse);
        return await collection.insertOne({email : email, motDePasse : motDePasse});
    }

    async sAuthentifier(email:string, motDePasse:string)
    {
        var collection = this.persistance.collection(EmailMotDePasse);
        this.authentifié = null != await collection.findOne({email : email, motDePasse : motDePasse});
    }
*/
    async sInscrire(email:string, motDePasse:string) : Promise<string>
    {
        this.email = email;
        this.motDePasse = motDePasse;
        this.id = '12345';
        return this.id;
    }

    async sAuthentifier(email:string, motDePasse:string)
    {
        if (this.email == email && this.motDePasse == motDePasse)
        {
            this.authentifié = true;
        }
    }

    async seDeconnecter()
    {
        this.authentifié = false;
        this.id = null;
    }

    async estAuthentifié() : Promise<boolean>
    {
        return this.authentifié;
    }

    async idAuthentifié() : Promise<string> 
    {
        if (!this.authentifié)
            throw "Pas d'authentification";
        return this.id;
    }
}