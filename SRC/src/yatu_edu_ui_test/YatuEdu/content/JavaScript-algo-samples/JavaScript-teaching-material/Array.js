/////////////////////////////////////////////////////////////////////////
///
// An array is an object of instance Array
//
//  - array instance methods: map, forEach, filter,
//    includes
//
/////////////////////////////////////////////////////////////////////////

const obj = [1, 2, 3];
print(typeof obj);                		// object
print(obj instanceof Array);      		// true, CHECK IF OBJ PROTOTYPE NAME IS ARRAY
print(Object.prototype.toString.call(obj) == '[object Array]'); 
										// true: works ES5 or Older
print(Array.isArray(obj));          	// true, ES5

const x = [
       {name: 'lian', age: 34},
       {name: 'anton', age: 16},
       {name: 'mark', age: 15}
  ];

const older = x.filter( p =>  p.age > 18);
print(older);							// [{"name":"lian","age":34}]

const names = x.map( p=>
     p.name );
print (names);							// ["lian","anton","mark"]

const addedAges = x.map( p=>
     p.age + 10 );
print (addedAges);						// [44, 26, 25]


// test includes:
// for object type, we compares references, for
// primitive types, we convert them to string and then compares
//
const obj1 = {x: 1, y: 2};
const obj2 = {x: 1, y: 2};
const arr = [1, 2, "2", obj1, "obj1"];
print(arr.includes(1) ); 				// true
print(arr.includes("1") ); 				// false
print(arr.includes(obj1) ); 			// true
print(arr.includes("1") ); 				// false
print(arr.includes(obj2) ); 			// false
const x = 2, y = "obj1";
print(arr.includes(x) ); 			    // true
print(arr.includes(y) ); 			    // true