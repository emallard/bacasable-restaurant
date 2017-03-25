
import {IPersistance, ICollection} from './persistance'
import * as loki from 'lokijs';

var db = new loki('loki.json');

export class LokiPersistance extends IPersistance
{
    collection<T>(type:{new():T}) : ICollection<T>
    {
        var nom:string = '' + type.toString().split(' ')[1];
        if (db.getCollection<T>(nom) == undefined)
        {
            console.log('LokiPersistance create collection ' + nom);
            db.addCollection(nom);
        }
        return new LokiCollection_<T>(type, db.getCollection<T>(nom));
    }
}


export class LokiCollection_<T> implements ICollection<T>
{
    col:LokiCollection<T>;
    type:{new():T};
    constructor(type:{new():T}, col:LokiCollection<T>)
    {
        this.type = type;
        this.col = col;
    }

    async findOneById(id:string) : Promise<T>
    {
        var found = await this.col.get(id);
        found["id"] = found['$loki'];
        return found;
    }

    async findOne(query:any) : Promise<T> 
    {
        return this.col.findOne(query);
    }

    async find(query:any) : Promise<T[]>
    {
        return this.col.chain().find(query).data();
    }

    async insertOne(t:T) : Promise<string>
    {
        var ins = await this.col.insertOne(t);
        var id = ins['$loki'];
        return '' + id;
    }

    async updateOne(t:T) : Promise<void>
    {
        await this.col.update(t);
    }

    async deleteOne(t:T) : Promise<void>
    {
        await this.col.remove(t);
    }
}