import { Admin } from 'mongodb';
import { TestInjection } from '../bacasable/injection.tests';

//var test = new TestInjection();
//test.test();


class A{
    id = 1;
}

var f:{new():A} = A;
var a = new A();
