// test cases

// c1: test variable declaration, assignment, and function calling sytext
let x = 1;
let y = 2;
x = 10;
print(x+y)

let x = 1;
let y = 2;
x = 10;
print(x+ (y * (x + y) * 2))   // = 58

let x = 1;
let y = 2;
x = 10;
print(x+ (y * * (x + y) * 2))   // Invalid expression element found: *


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
function foo() {
return 12;
}
print(foo())

