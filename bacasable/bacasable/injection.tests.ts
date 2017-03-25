import {inject, injectNew, injectFunc, Injection, BindingScope} from './injection'


var g_id = 0;


class C
{
    id = -1; 
    constructor()
    {
        this.id = g_id++;
    }
}

class RequeteServeur extends C {
    createWebService1 = injectFunc(WebService1);    
    createWebService2 = injectFunc(WebService2);
    recevoir1()
    {
        this.createWebService1();
    }
    recevoir2()
    {
        this.createWebService2();
    }
}

class WebService1 extends C {
    persistance = inject(Persistance);
    authentification = inject(Authentification);
}

class WebService2 extends C {
    persistance = inject(Persistance);
    logger = inject(Logger);
    session = inject(Session);
    cookies = inject(Cookies);
}

class Authentification extends C {
    persistance = inject(Persistance);
    session = inject(Session);
}

class Session extends C {
}

class Cookies extends C {
}

class Persistance extends C {
}

class Logger extends C {
}

export class TestInjection
{
    test()
    {
        var injection = new Injection();

        injection.bind(RequeteServeur).toSelf().inTypeScope(RequeteServeur);
        injection.bind(WebService1).toSelf().inTypeScope(RequeteServeur);
        injection.bind(WebService2).toSelf().inTypeScope(RequeteServeur);
        injection.bind(Authentification).toSelf().inTypeScope(RequeteServeur);
        injection.bind(Session).toSelf().inTypeScope(RequeteServeur);
        injection.bind(Cookies).toSelf().inTypeScope(RequeteServeur);

        injection.bind(Persistance).toSelf().inSingletonScope();
        injection.bind(Logger).toSelf().inSingletonScope();

        var r1 = <RequeteServeur> injection.instantiate(RequeteServeur, injection);
        r1.recevoir1();

        var r2 = <RequeteServeur> injection.instantiate(RequeteServeur, injection);
        r2.recevoir2();

/*
        console.log('comparaison des a en singleton (les memes)' , b1.a.id, b2.a.id);
        console.log('comparaison des c en nouvelles instances (tous differents)' , b1.c1.id, b1.c2.id, b2.c1.id, b2.c2.id);
        console.log('comparaison des d par scope (les memes par deux)' , b1.c1.d.id, b1.c2.d.id, b2.c1.d.id, b2.c2.d.id);
        console.log('comparaison des e.parent par scope (les memes par deux)' , b1.e1.parent.id, b1.e2.parent.id, b2.e1.parent.id, b2.e2.parent.id);
*/
    }
}