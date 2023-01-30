x = [1, 2, 3, 4]
print (x); // 1, 2, 3, 4

// array in function call
x = foo([0, 2, 3])

// complicated function definition and array
function foo(a) {
   	for(let i = 0; i < a.length; i++) {
		print(i);
	}
}
x = foo([0, 2, 3])

// array subscription
x = [1, 2, 3];
print(x[2])       // 3

// array length and array subscription
function foo(a) {
   	for(let i = 0; i < a.length; i++) {
		print(a[i]); 
	}
}
x = foo([10, 12, 3])  // 10, 12, 3

// function def, array, for loop, expression, combined
function foo(a) {
	let r = 0;
   	for(let i = 0; i < a.length; i++) {
		(r += a[i]) 
	}
	return r;
}
x = foo([10, 12, 3])  + [1, 2, 3, 4].length;
print (x * (x +y))				// 29

// combination
function foo(a) {
	let r = 0;
   	for(let i = 0; i < a.length; i++) {
		(r += a[i]) 
	}
	return r;
}
x = foo([10, 12, 3])  + [1, 2, 3, 4].length; // 29
y = 0;
print (x * (x +y))					// 841

// array subscription inside an expresion
x= [10, 11];
y = 10 + x[0] * 2;
print(y)				// 30

// subscription with calculation
c = 1;
x= [10, 11, 20];
y = 10 + x[c + 1] * 2;
print(y)				// 50

const c = 1;
const x= [10, 11, 20];
const y = 10 + x[c + 1] * 2;
print(y)				// 50

let c = 0;
const x= [10, 11, 20];
const y = 10 + x[++c  + 1] * 2;
print(y)				// 50

let c = 0;
const x= [10, 11, 20];
const y = 10 + x[c++  + 1] * 2;
print(y)				//32

// array not defined
x= [10, 11];
y = 10 + z[0] * 2;		// "z" is not defined
print(y)

// invalid syntax at "*"
let c = 0;
const x= [10, 11, 20];
const y = 10 + x[ * 2;
print(y)

// out of range
let c = 0;
const x= [10, 11, 20];
const y = 10 + x[2 * 2];
print(y)				// NaN, todo: set attributes for array, such as size and type