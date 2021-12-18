let x = -23;						// if x > 0, then the positive value 
									//  is going to be printed

/* 
  Declare a function that returns a promise
*/
const later = () => {
    const later =  new Promise( (resolve, reject)  => {
        setTimeout(() => {
            if (x > 0 )  {
               resolve(x);          // completed with result
            } else {
                reject(x * 100);	// failed with result (explicitly rejected)
            }
        },  100);
    });
    return later ;
}

/* 
  Declare aN 'AYNC' function that waits for a promise in
  a sync manner (as a syntax suger). Notice that the sync 
  effect is only limited inside the function.
*/
const awaitFun = async () => {
	try {
		let res = await later();
		/*
			The following steps are syncronous.  This 
			makes writing async code easy.
			Code below would be "suspended" until "later"
			results come back from async calls.
		*/
		print(`Step Two: res =  ${res} `);
		print('Step Three: moving on');
	}
	catch (e) {
        print(`Step Two: res =  ${e} `);
        print('Step Three: moving on');
	}
}

awaitFun();

/*
	Outside of 'awaitFun', JavaScript is still executing the
	single thread synchronous code.
*/
print("Step One: sync continue...");