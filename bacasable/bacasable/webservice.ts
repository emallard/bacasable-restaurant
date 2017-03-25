
export interface IWebService<T, U>
{
    executer(t:T):Promise<U>;
}

export class WebService<T, U> implements IWebService<T, U>
{
    executer(t:T):Promise<U>{
        throw '_';
    }
}