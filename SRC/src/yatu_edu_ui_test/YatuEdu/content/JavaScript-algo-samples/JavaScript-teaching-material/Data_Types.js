//==========================================
//	Concept of Type
//  JS is flexible but it knows typeof a variable
//  when using object programming style, such as 
//  methods pertaining to strings, arrays, and etc.
/
//==========================================
const y = 1;
let x = ["abc", 222, {name: "lian", age: 2}];
//print(typeof (x[0]));
//print (typeof (x[1]));
//print (typeof (x[2]));
x.forEach(x=> {
	if (typeof(x) === 'string') {
		print(x.length);
	}
	else if (typeof(x) === 'object') {
		print(x.name);
	} 
	else if (typeof(x) === 'number') {
		print(x);
	} 
});
   
// primitive type is different from object type
const x = 100;
print(typeof x);					// number (small case n)
print (x instanceof Number);		// false
print (x instanceof Object);		// false

const y = new Number(100);
print(typeof y);					// object (note not Number)
print (y instanceof Number);		// true
print (y instanceof Object);		// true

const z = {x: 1, y: 2};
print(typeof z);					// object 
print (z instanceof Object);		// true

// function is an object and a Function
// function also has a constructor   
function f() {
	this.x = 0;
	this.foo =  () => {print(this.x) }
 }
 const fobj = new f;
 print(typeof f);					// function
 print(typeof fobj);				// object
 print (f instanceof Object);	    // true
 print (f instanceof Function);		// true
 print (f instanceof f);			// false
 print (fobj instanceof Object);	// true
 print (fobj instanceof f);			// true
   
   