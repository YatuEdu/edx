/////////////////////////////////////////////////////////////////////////
///
// arguments for a function is special object.  See how to use it to 
// extend function parameters
//
//
/////////////////////////////////////////////////////////////////////////

foo(1, 2, 3, 4, 5);			// passing 5 arguments while only the first is declared
function foo(x) {
    print(arguments);       // {"0":1,"1":2,"2":3,"3":4,"4":5} => armguments is not an array, but an object
    print(arguments[0]);    // 1
    print(arguments[2]);    // 3
     
	let accum = x;
    const args = Array.prototype.slice.call(arguments, 1);  
							// convert arguments into an array
	args.forEach(y => x += y);
	print(x);               // 15
}

/*
 * Callback scenario where function parameters are unknown
 *
 */
 function myCallback() {
	const args = Array.prototype.slice.call(arguments, 0);  
							// convert arguments into an array
	let accm = 0;
	args.forEach(x => accm += x);
	print(accm);
 }
 
 function timedCall() {
	 setTimeout(() =>
	 {
		 const args = Array.prototype.slice.call(arguments, 0);
		  myCallback.apply(this, args);      // this will work since myCallback EXPECTS multiple arguments
          //myCallback.call(this, args);     // this will not work since myCallback does not expect an array
	 }, 
	 1000);
 }
 
 timedCall(0, 2, 3, 4); // 9
 
 /*
  *	Use ES6's new "rest parameters" fearture
  */
  function foo (y,  ...args) {				// args is a JS "standard" array
   let accm = y;
   args.forEach(e => accm += e );
   return accm;
}
print (foo(1, 2, 3, 4)) ;					// 10
