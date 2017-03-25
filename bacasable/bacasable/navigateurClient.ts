import { INavigateur } from './navigateur';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class NavigateurReel extends INavigateur
{
    location():string
    {
        return window.location.pathname;
    }
    setlocation(_url:string)
    {
        window.location.pathname = _url;
    }

    appelerWebService(url:string, parameters:any) : Promise<any>
    {
        console.log('appelerWebServiceAsync');
        return new Promise((_resolve,_reject) => {  
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.onreadystatechange = function (aEvt) {
                if (req.readyState == 4) {
                    if(req.status == 200)
                    {
                        console.log('resolve');
                        _resolve(req.responseText);
                    }   
                    else
                    {
                        console.log('reject');
                        _reject("Erreur pendant le chargement de la page.\n");
                    }
                }
            };
            req.send(null);
        });
    }   
}