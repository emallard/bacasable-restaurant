
export class IPersistance
{
    collection<T>(type:{new():T}) : ICollection<T>
    {
        throw "Non implémenté";
    }
}

export interface ICollection<T>
{
    findOneById(id:string) : Promise<T> ;
    findOne(query:any) : Promise<T> ;
    find(query:any) : Promise<T[]>;
    insertOne(t:T) : Promise<string>;
    updateOne(t:T) : Promise<void>;
    deleteOne(t:T) : Promise<void>;
}
