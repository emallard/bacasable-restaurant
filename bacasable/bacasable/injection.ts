
class PairTypeInstance
{
    constructor(public type:{new ():any}, public instance:any) { }
}

class InstancesParScope
{
    public typeScope:{new ():any};
    public instanceScope:any;
    public instances:PairTypeInstance[] = [];
}

class RuntimeScope
{
    constructor(public typeScope:{new ():any})
    {}

    public instances:PairTypeInstance[] = [];
}


class Binding
{
    scoping = new Scoping();
    boundToConstant:any = null;
    
    typeInstance:{new ():any};
    typeInterface:{new ():any}

    constructor(typeInterface:{new ():any})
    {
        this.typeInterface = typeInterface;
    }

    to(typeInstance:{new ():any}) : Scoping
    {
        this.typeInstance = typeInstance;
        return this.scoping;
    }

    toSelf()
    {
        return this.to(this.typeInterface);
    }

    toConstant(obj:any)
    {
        this.boundToConstant = obj;
        this.to(this.typeInterface).inSingletonScope();
        //this.injection['__injectScopes'][0].instances.push(new PairTypeInstance(this.typeInstance, obj));
    }
}

class Scoping
{
    public bindingScope:BindingScope = null;

    constructor()
    {}
    
    in(scope:BindingScope)
    {
        this.bindingScope = scope;
    }

    inTypeScope(type:{new():any})
    {
        this.bindingScope = new BindingScope(type);
    }

    inSingletonScope()
    {
        this.bindingScope = new BindingScope(Injection);
    }
}

export class BindingScope
{
    constructor(public typeScope:{new ():any})
    {}
}

export class Injection
{
    doLog = true;

    listeEnSingleton:PairTypeInstance[] = [];
    bindings:Binding[] = [];

    scopes:InstancesParScope[];
    //configurationScopes : BindingScope[] = [];
    
    singletonScope : BindingScope;

    constructor()
    {
        this.singletonScope = new BindingScope(Injection);
        //this.configurationScopes.push(this.singletonScope);
        this['__injectScopes'] = [new RuntimeScope(Injection)];
        this.bind(Injection).toConstant(this);
    }
/*
    addScope(bindingScope:BindingScope):BindingScope
    {
        this.configurationScopes.push(bindingScope);
        return bindingScope;
    }
*/

/*
    getScope(type:{new ():any}) : BindingScope
    {
        var found = this.configurationScopes.find(s => s.typeScope == type);
        if (found == null)
        {
            found = new BindingScope(type);
            this.addScope(found);
        }
        return found;
    }
*/
    bind(typeInterface:{new ():any}) : Binding
    {
        var binding = new Binding(typeInterface);
        this.bindings.push(binding);
        return binding;
    }

    addBinding(binding:Binding)
    {
        this.bindings.push(binding);
    }
    
    get<T>(typeInterface:{new():T}):T
    {
        return this.inject(typeInterface, this['__injectScopes'], 0)
    }

    instantiate(typeInterface:{new():any}, scopedObject:any):any
    {
        return this.injectNew(typeInterface, scopedObject['__injectScopes'], 0)
    }

    private injectNew(typeInterface:{new():any}, runtimeScopes:RuntimeScope[], recursionLevel:number):any
    {
        this.log('creating new ' + this.typeToString(typeInterface), recursionLevel);

        var binding = this.bindings.find(e => e.typeInterface == typeInterface);
        if (binding == null)
            throw "Binding not found for type " + this.typeToString(typeInterface);
        
        
        // check binding to constant
        if (binding.boundToConstant != null)
            return binding.boundToConstant;
        
        // create new instance
        var newInstance = new binding.typeInstance();
        
        return this.injectCommon(newInstance, typeInterface, runtimeScopes, recursionLevel);;
    }

    private injectNewGeneric(newInstance:any, runtimeScopes:RuntimeScope[], recursionLevel:number):any
    {
        this.copyRuntimeScopes(newInstance, runtimeScopes);
        this.injectProperties(newInstance, recursionLevel);
        // afterInject
        if (newInstance.afterInject != undefined)
            newInstance.afterInject();
        return newInstance;
    }

    private inject(typeInterface:{new():any}, runtimeScopes:RuntimeScope[], recursionLevel:number):any
    {
        var binding = this.bindings.find(e => e.typeInterface == typeInterface);
        if (binding == null)
            throw "Binding not found for type " + this.typeToString(typeInterface);

        // check binding to constant
        if (binding.boundToConstant != null)
            return binding.boundToConstant;

        var runtimeScope = runtimeScopes.find(s => s.typeScope == binding.scoping.bindingScope.typeScope);

        // find in scope, with its real type
        var instanceFoundInScope = runtimeScope.instances.find(i => i.type == binding.typeInstance);
        if (instanceFoundInScope != null)
        {
            var scopeType = this.typeToString(runtimeScope.typeScope);
            //if (scopeType == 'Injection') scopeType = 'Singleton';
            this.log('injecting ' + this.typeToString(typeInterface) + ' : found in scope ' + scopeType, recursionLevel);
            return instanceFoundInScope.instance;
        }
            

        this.log('injecting ' + this.typeToString(typeInterface) + ' : new instance registered in scope ' + this.typeToString(runtimeScope.typeScope), recursionLevel);
        
        // create new instance
        var newInstance = new binding.typeInstance();

        // register instance in scope, with its real type
        runtimeScope.instances.push(new PairTypeInstance(binding.typeInstance, newInstance));

        return this.injectCommon(newInstance, typeInterface, runtimeScopes, recursionLevel);
    }

    private injectCommon(newInstance:any, typeInterface:{new():any}, runtimeScopes:RuntimeScope[], recursionLevel:number):any
    {
        // copy scopes for nouvelleInstance
        this.copyRuntimeScopes(newInstance, runtimeScopes);

        // create new scope if needed
        var startANewScope = (null != this.bindings.find(b => b.scoping.bindingScope.typeScope == typeInterface));
        if (startANewScope)
        {
            this.log('starting a new scope', recursionLevel);
            var newScope = new RuntimeScope(typeInterface);
            newScope.instances.push(newInstance);
            newInstance['__injectScopes'].push(newScope);
        }
            
        // properties
        this.injectProperties(newInstance, recursionLevel);

        // afterInject
        if (newInstance.afterInject != undefined)
            newInstance.afterInject();

        return newInstance;
    }

    injectProperties(o:any, recursionLevel:number)
    {
        for(var propertyName in o)
        {
            if (o.hasOwnProperty(propertyName))
            {
                var propertyValue:any = o[propertyName];
                if (propertyValue != undefined)
                {
                    if (propertyValue != undefined
                        && propertyValue.__inject != undefined)
                    {
                        this.log('.'+propertyName, recursionLevel);
                        o[propertyName] = this.inject(propertyValue.__inject, o['__injectScopes'], recursionLevel+1);
                    }

                    if (propertyValue != undefined
                        && propertyValue.__injectFunc != undefined)
                    {
                        //this.log('.'+propertyName, recursionLevel);
                        o[propertyName] = this.injectFunc(propertyValue.__injectFunc, o['__injectScopes'], recursionLevel+1);
                    }

                    if (propertyValue != undefined
                        && propertyValue.__injectNew != undefined)
                    {
                        this.log('.'+propertyName, recursionLevel);
                        o[propertyName] = this.injectNew(propertyValue.__injectNew, o['__injectScopes'], recursionLevel+1);
                    }

                    if (propertyValue != undefined
                        && propertyValue.__injectNewGeneric != undefined)
                    {
                        this.log('.'+propertyName, recursionLevel);
                        o[propertyName] = this.injectNewGeneric(propertyValue.__injectNewGeneric, o['__injectScopes'], recursionLevel+1);
                    }
                }
            }
        }
    }

    private injectFunc(typeFunction:any, scopes:RuntimeScope[],recursionLevel:number)
    {
        return () => { return this.injectNew(typeFunction, scopes, 0) };
    }

    private typeToString(typeFunction):string
    {
        var s:string = "" + typeFunction;
        return s.split(' ')[1];
    }

    private copyRuntimeScopes(nouvelleInstance:any, scopes:RuntimeScope[])
    {
        nouvelleInstance['__injectScopes'] = [];
        scopes.forEach(s => nouvelleInstance['__injectScopes'].push(s));
    }

    private log(s:string, recursionLevel:number):void
    {
        if (!this.doLog)
            return;
        var indent = '';
        for (var i=0; i<recursionLevel; ++i) { indent = indent + '  ' }
        console.log('[injection] '+indent+s);
    }    
}

export function inject<T>(type:{new():T}) : T
{
    var fake:any = {};
    fake.__inject = type;
    return fake;
}

export function injectNew<T>(type:{new():T}) : T
{
    var fake:any = {};
    fake.__injectNew = type;
    return fake;
}

export function injectNewGeneric<T>(instance:T) : T
{
    var fake:any = {};
    fake.__injectNewGeneric = instance;
    return fake;
}

export function injectFunc<T>(type:{new():T}) : ()=>T
{
    var fake:any = {};
    fake.__injectFunc = type;
    return fake;
}


export class StaticBindings
{
    static bindings:Binding[] = [];
}

export function bind<T>(typeInterface:{new():T}) : Binding
{
    console.log('[static] binding ' + typeInterface.toString().split(' ')[1]);
    var binding = new Binding(typeInterface);
    StaticBindings.bindings.push(binding);
    return binding;
}
