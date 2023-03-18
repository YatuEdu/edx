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
z = x+ (y * (x + y) * 2) // z = 58

let x = 1;
let y = 2;
x = 10;
z = x+ (y * (x + y) * 2) + w;  // w not defined error

let x = 1;
let y = 2;
print(x+ (y * (x + y) * 2))   // 13

let x = 1;
let y = 2;
x = 10;
print(x+ (y * * (x + y) * 2))   // Invalid expression element found: *

// known property 'length'
const a = [1, 2, 3];
const b = a.length + 10;
print (b) // 13


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

function foo(x, y) {
	let z = x * y ;
	return z;
}
x = 10;
y = 2;
print(foo(x * (y + 1), 3)) // 90

function foo(x, y) {
	let z = x * y ;
	return z;
}
x = 10;
y = 2;
print(foo(x * (y + 1), x + (y +x * y))) // 960


///////////// error case
function foo(x, y) {
	let z = x * y ;
	return z;
}
x = foo(1, 3) + y; // y is not defined

function foo(x, y) {
	let z = x * y ;
	return z;
}
x = foo(1, 3) + y // y is not defined

function foo(x, y) {
	let z = x * y ;
	return z;
}
x = foo(1, 3) + 4 * // * invalid operator

let x = 1;
let y = 2;
x = 10;
z = u + x+ y		// undefined variable "u"

/* Error: Bracket is not closed at line: 1, position: 8, found token <<< ( >>> */
/* this ( */
const x = 1;
y = x ** 2 * 5 * (10)  -> 50, ignoring the comments




