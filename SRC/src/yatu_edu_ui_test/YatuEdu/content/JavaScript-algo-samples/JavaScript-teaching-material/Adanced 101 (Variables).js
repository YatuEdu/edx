/////////////////////////////////////////////////////////////////////////
///
// Variables, global, window, and local
///
/////////////////////////////////////////////////////////////////////////

//+++++++++++++++ Section 1 ++++++++++++++++++
// Test DEAD ZONE 
//++++++++++++++++++++++++++++++++++++++++++++
print("Section1: variable declareation and initialization: compare var, let, and, const", 3);
const i = 11;
if (i >= 10 ) {
	//print(temp);      // access before initialization: error
	let temp = 10;
	print(temp);
}
print(temp);

// compare to var's hoisting behavior
if (i >= 10 ) {
	print(temp);	// access before initialization: ok
	var temp = 10;
	print(temp);
}
print(temp);
print(window.temp);  // added to windiw object

let temp2 = 'hi';
print(temp2);
print(window.temp2);  // did not add to windiw object


//+++++++++++++++ Section 1 ++++++++++++++++++
// Test: global variable vs local variable in
//       depth, using closure 
//++++++++++++++++++++++++++++++++++++++++++++
print("Section2: different consequence when using global or local variables in closure", 3);
let funcs = [];

// test var in a loop
for(var i = 0; i < 10; ++i) {
	funcs[i] = () => print(i, true);
}

// var reference has not changed but its value changes every time
// so closure value reflects the last "i", which is 9
funcs.forEach(f => f() );
print('');

// test let in a loop
for(let i = 0; i < 10; ++i) {
	funcs[i] = () => print(i, true);
}


// let re-declare i every time so closure value 
// captures a unique i everytime
funcs.forEach(f => f() );
print('');

// test IIFE (IMMEDIATELY INVOKED FUNCTION EXORESSION)
for(let i = 0; i < 10; ++i) {
	funcs[i] = (function(x) {
	return () => print(x, true)}(i));
}

// IIFE re-declare X every time so closure value 
// captures a unique i everytime
funcs.forEach(f => f() );
print('');

