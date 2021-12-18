/////////////////////////////////////////////////////////////////////////
///
// Promise is a nice and tidy idiomm for asyncrounous programming.
// I prefer to use promise to async key word.
//
/////////////////////////////////////////////////////////////////////////

/*
 * Resolved
 *
 */
new Promise((res, rej)  => {
    setTimeout( () => res(1), 100);
})
.then(r => {
       r *= 2;
	   print(2);				// 2
       return r 
   })
.then(r => {
        r *= 4;
        print(r);				// 8
        xt++; 					// exception thrown: implicitly rejected
     })
.catch( e => print(e));			// exception caught:  xt is not defined

/*
 * Rejected
 *
 */
let x = -1;
new Promise((res, rej)  => {
    setTimeout(() => {
        if (x > 0 )  {
             res(1);
        } else {
            rej(1000);			// explicitly rejected
        }
    },  100);
})
.then( r => {					// By-passed
       r *= 2;
	   print(2);				
       return r 
   })
.then(r => {					// By-passed
        r *= 4;
        print(r);				
        x++; 					
     })
.catch( e => print(e));			// 1000 FROM rej (rejected)

/*
 * Multiple promises completion together
 *
 */
let t = 100 + Math.floor(Math.random() * 1000); // returns a random integer from 100 to 1000
const p1 = new Promise((res, rej)  => {
    setTimeout(() => res(1), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
const p2 = new Promise((res, rej)  => {
    setTimeout(() => res(2), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
const p3 = new Promise((res, rej)  => {
    setTimeout(() => res(3), t);
});

Promise.all([p1, p2, p3])						// get all three promise values together in calling order
												// if one fails, all fail
.then(results => print(results));				// [1, 2, 3] (regardless which promise completes first)

/*
 * Multiple promises race and the first one to complete win
 *
 */
let t = 100 + Math.floor(Math.random() * 1000); // returns a random integer from 100 to 1000
print (t); 
const p1 = new Promise((res, rej)  => {
    setTimeout(() => res(1), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
print (t); 
const p2 = new Promise((res, rej)  => {
    setTimeout(() => res(2), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
print (t); 
const p3 = new Promise((res, rej)  => {			
    setTimeout(() => res(3), t);
});

Promise.race([p1, p2, p3])						// get the promise which completes the first
.then(result => print(result)); 				// can be anything from 1 to 3

/*
 * Error handling for all and race
 *
 */
 
let t = 100 + Math.floor(Math.random() * 1000); // returns a random integer from 100 to 1000
print(t);
const p1 = new Promise((res, rej)  => {
    setTimeout(() => res(1), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
print(t);
const p2 = new Promise((res, rej)  => {
    setTimeout(() => res(2), t);
});

t = 100 + Math.floor(Math.random() * 1000);     // returns a random integer from 100 to 1000
print(t);
const p3 = new Promise((res, rej)  => {
    setTimeout(() => rej('erro'), t);
});

Promise.all([p1, p2, p3])
.then(results => print(results))	// [1, 2, 3], or error