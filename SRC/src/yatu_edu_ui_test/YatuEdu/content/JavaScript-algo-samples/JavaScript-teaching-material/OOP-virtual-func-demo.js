/////////////////////////////////////////////////////////////////////////
///
/// 	class, inheritance, and virtual functions.
///
/// 	Note: all functions aer virtual in JS.  This example clearly
///				demonstrates that.  Therefore most of the OOB design
///				patterns which relies on virtual functions work fine.
///		The following example illustrates a good old a 'template-class' 
///		design patterns in ES6 class.
///
/////////////////////////////////////////////////////////////////////////

class Base {
    doIt ( ) {
        this.step1 ( );
        this.step2 ( );
     }
     
    step1 () {
        print('Base.step1');
     }

     step2 ( ) {
        print('Base.step2');
    }
}

class Child1 extends Base {
    step1 ( ) {
        print('Child1.step1');
     }
    step2 ( ) {
        print('Child1.step2');
    }
}

class Child2 extends Base {
   step1 ( ) {
        print('Child2 .step1');
    }
}


const c = new Base();
c.doIt();					// Base.step1 
							// Base.step2

const c1 = new Child1();
c1.doIt();					// Child1.step1 
							// Child1.step2

const c2 = new Child2();
c2.doIt();					// Child2.step1 
							// Base.step2
