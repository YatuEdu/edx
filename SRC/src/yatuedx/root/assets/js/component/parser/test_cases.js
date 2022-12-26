// test cases

const x = -1;
print(x)  // -1

const x = +1;
print(x) // 1

const x = *1;
print(x) // invalid token "*"

// c1: test variable declaration, assignment, and function calling sytext
let x = 1;
let y = 2;
x = 10;
print(x+y)  
print (x + t) // error: t is not defined

let x = 1;
let y = 2;
x = 10;
print(x+ (y * (x + y) * 2))   // = 58

let x = 1;
let y = 2;
x = 10;
print(x+ (y * * (x + y) * 2))   // Invalid expression element found: *

// known property 'length'
const a = [1, 2, 3];
const b = a.length + 10;
print (b)


let x = 1;
let y = 2;
x = 10;
print(x+ (z ** (x + y) * 2))   // z not defined


let x = 1;
let y = 2;
x = 10;
print(x+ (y ** (x + y) * 2))   // 8202


const x = 1;
let y = 2;
x = 10;			// error for const assignment
print(x+y)

const x;   // error for const no-assignment
let y;
x = 10;			
print(x+y)

// Case: II
// defining a function foo and then call it
function foo(x, y) {
	let z = x * y ;
	return z;
}
print(foo(2, 3)) // 6

// undefined var in function body
function foo(x, y) {
	let z = x * y  + w;
	return z;
}
print(foo(2, 3)) // w is undefined

