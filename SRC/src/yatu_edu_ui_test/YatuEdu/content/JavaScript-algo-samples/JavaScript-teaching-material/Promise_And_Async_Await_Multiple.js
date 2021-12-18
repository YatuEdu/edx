/////////////////////////////////////////////////////////////////////////
///
// Promise-Async-Await patern makes writing async code much easier!!
// The following clode prints: step one ~ step five in an order that can
// be predicted.
//
/////////////////////////////////////////////////////////////////////////

/* 
  Declare a function that returns a promise
*/
const later = (x) => {
    const later =  new Promise( (resolve, reject)  => {
        setTimeout(() => {
            if (x > 0 )  {
               resolve(x * 100);	// completed with result
            } else {
                reject(x * 50);		// failed with result (explicitly rejected)
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
		let res = await later(1);
		print(`Step Two: res =  ${res} `);     	// 100
		
		res = await later(2);
		print(`Step Three: res =  ${res} `);   	// 200
		
		res = await later(-1);
		res = await later(-2);                	// skipped due to exception
		
		print('Step Five: moving on');			// skipped as well due to exception
	}
	catch (e) {
        print(`Step Four: res =  ${e} `);		// -50
		print(`Step Five: finale `);			// printed
       
	}
}

/*
	Calling async function and see the effect of async behavior within
	the function boundary.
*/
awaitFun();

/*
	Outside of 'awaitFun', JavaScript is still executing the
	single thread in a synchronous manner.
*/
print("Step One: sync continue...");