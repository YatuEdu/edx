/////////////////////////////////////////////////////////////////////////
///
// Generastors are a new kind of function, which maintains a state for 
//	each call.  Is it a syntax suger or a useful new idea?
//
/////////////////////////////////////////////////////////////////////////
function * foo() {
   yield 1;
   yield 2;
   yield 3;
}

/*
 * Note the "of" operastor below:
 */
for (let i of foo() ) {		// print 1, 2, 3
    print(i);
}

/*
 * Other ways to use the generator
 */
print(foo());         		// {}, it is an empty object
const it = foo();    		// created an iterator
print (it.next());          // {"value":1,"done":false}
const it2 = foo();
let nxt = it2.next();		// a new iterator object
do {
   print(nxt.value);
   nxt = it2.next();
} 
while (!nxt.done);

// better way
const it3 = foo();
let nxt;
while ( (nxt = it3.next()).done === false) { // a novel way to assign and test
    print (nxt.value);
  }
print(nxt.value);      		// undefined, this iterator is finished