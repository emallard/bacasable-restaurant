import { Lanceur } from '../../bacasable/bacasable/lanceur';

export var lanceur:Lanceur;

export function lancer(succes:(page:any)=>void) 
{
    lanceur = new Lanceur();
    lanceur.lancer(succes);
}
    
