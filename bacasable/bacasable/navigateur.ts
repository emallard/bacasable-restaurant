export class INavigateur
{
    location():string
    {
        throw "Non implémenté";
    }
    setlocation(_url:string)
    {
        throw "Non implémenté";
    }

    appelerWebService(url:string, parameters:any) : Promise<any>
    {
        throw "Non implémenté";
    }
}