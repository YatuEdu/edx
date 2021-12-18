/////////////////////////////////////////////////////////////////////////
///
/// Prototype: every function has a prototype
///	Object literal does not have a prototype
///
/////////////////////////////////////////////////////////////////////////
function foo() {print('hello world')}
print(foo.prototype);		// {}
const obj = {};
print(obj.prototype);		// undefined

/////////////////////////////////////////////////////////////////////////
///
/// module pattern: revealing module
///
/////////////////////////////////////////////////////////////////////////
var myModule = (function (init) {
	var count = init;
	
	function addPriv(inc) {
		count += inc;
	}
	
	function resetPriv(v) {
		count = v;
	}
	
	function getPriv() {
		return count;
	}
	
	return {
		get: getPriv,
		add: addPriv,
		reset: resetPriv
	}
	
})(10);

// EXCEPTION
try {
myModule.addPriv(1); 
}
catch (e) {
	print(e);
}
// EXCEPTION
try {
myModule.getPriv();
}
catch (e) {
	print(e);
}
// EXCEPTION
try {
myModule.resetPriv(1); 
}
catch (e) {
	print(e);
}

myModule.add(1);
print(myModule.get()); // 11
myModule.reset(0);
print(myModule.get());  // 0

/////////////////////////////////////////////////////////////////////////
///
/// class pattern: function as constructor
///
/////////////////////////////////////////////////////////////////////////

// class constructor
function foo () {
	this.p1 = 122;
	this.p2 = 222;
	
	// instance function
	this.bar = () => print(this.p1);
}

// class function
foo.prototype.barbar = () => print('barbar');

// testing
var fo1 = new foo();
print(fo1.p1);   // 122
fo1.p1 = 123;
print(fo1.p1);   // 123
var fo2 = new foo();
print(fo2.p1);   // 122
fo2.bar();       // 122
fo1.bar();       // 123
fo1.barbar();    // barbar
fo2.barbar();    // barbar

if (fo1.constructor === foo) print('cool');    // cool
if (fo2.constructor === foo) print('cool');    // cool

// instance function
if (fo1.bar !== fo2.bar) print('cool');        // cool

// class function
if (fo1.barbar === fo2.barbar) print('cool');  // cool

/////////////////////////////////////////////////////////////////////////
///
/// Class inheritance pattern: prototypical inheritance (v-table)
///
/////////////////////////////////////////////////////////////////////////

function Base(x, y) {
    this.x = x;
    this.y = y;
}
Base.prototype.move = function (a, b) 
{ 
	this.x += a; 
	this.y += b; 
}

function Child() {
    Base.call(this, 0, 0);		// construct a Base sub-part
	Child.prototype.count++;	// static property for the class
}

Child.prototype = new Base();	// inherit methodes and properties from Base
Child.prototype.count = 0;		// define a static property for the class
const b = new Base(1, 2);
const c = new Child();			
const c2 = new Child();
print(b);						// x: 1, y: 2
print(c);						// x: 0, y: 0
c.move(2, 20);					
print(c);						// x: 2, y: 20
print(c.count);					// 2
print(c2.count);				// 2
const c3 = new Child();
print(c.count);					// 3
print(c2.count);				// 3
print(c3.count);				// 3
print(b.count);					// undefine
print(c3 instanceof Child);		// true
print(c3 instanceof Base);		// true
print(b  instanceof Base);		// true
print(b  instanceof Child);		// false
print(b.__proto__.constructor instanceof Function);		
								// true
print(b instanceof Child);		// false
print(b instanceof Function);	// false
print(Base.prototype.move instanceof Function) 
								// true
print(b instanceof Child);		// false
print(b instanceof Function);	// false
print(typeof b);                // object
print(typeof Child.prototype.count)  
								// number
print(typeof Base.prototype.move); 
								// function
/////////////////////////////////////////////////////////////////////////
///
/// object literal pattern: defineProperty to make a property private
///
/////////////////////////////////////////////////////////////////////////
const object1 = {name: 'Lian Yang', age: 45};
Object.defineProperty(object1, 'name', {
  writable: false
});
object1.name = 'Liam Young';
object1.age = 45;
print(object1);				//Lian Yang, 45

Object.defineProperty(object1, 'name', {
  writable: true
});
object1.name = 'Liam Young';  
print(object1);				//Liam Young, 45