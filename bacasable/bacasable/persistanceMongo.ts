
import {IPersistance, ICollection} from './persistance'

import * as mongodb from "mongodb";

var db:mongodb.Db;

/*
var url = 'mongodb://localhost:27017/bacasable-blog'
mongodb.MongoClient.connect('').then(result => db=result);
console.log('connected to mongodb ' + url);
*/

// MongoClient.connect(url).then(result => { db = result; console.log('connected to mongodb ' + url);});

export class MongoPersistance implements IPersistance
{
    collection<T>(type:{new():T}) : ICollection<T>
    {
        var nom:string = '' + type.toString();
        return new MongoCollection<T>(type, db, nom);
    }
}


export class MongoCollection<T> implements ICollection<T>
{
    db:mongodb.Db;
    nom:string;
    type:{new():T};
    constructor(type:{new():T}, db:mongodb.Db, nom:string)
    {
        this.type = type;
        this.db = db;
        this.nom = nom;
    }

    async findOneById(id:string) : Promise<T>
    {
        return this.db[this.nom].findOne({_id:id});
    }

    async findOne(query:any) : Promise<T> 
    {
        return this.db[this.nom].findOne(query);
    }

    async find(query:any) : Promise<T[]>
    {
        return this.db[this.nom].findOne(query);
    }

    async insertOne(t:T) : Promise<string>
    {
        var ins = await this.db[this.nom].insertOne(t);
        return ins.insertedId;
    }

    async updateOne(t:T) : Promise<void>
    {
        this.db[this.nom].updateOne(t);
    }

    async deleteOne(t:T) : Promise<void>
    {
        this.db[this.nom].deleteOne(t);
    }
}

