//=======================
// Teaching logic
//=======================
if (2 < 1) {} => false
if (2 == 2) {} => true


/////////////////////////////////////////////////////////////////////////
///
// Testest if a number is a prime
///   2  3  5  7  11 13 17 19 23 29
///   31 37 41 43 47 53 59 61 67 71  
///   73 79  83 89 97 101 107 109 113
///   127 131 137 139 149 151 163 167 173 
///   179 181 191 197 199 211  223 227 229
///   233 239 241 251 257 263 269 271 277 281
/////////////////////////////////////////////////////////////////////////
const isPrime = (n) => {
	let rt = Math.sqrt (n)
	for(let i = 2;  i <= rt; i++) {
		if (n% i == 0) {
			print(n + ' is not a prime');
			return;
		}
	}
	print(n + ' is a prime');
}

// test:
isPrime(1716111111) // not a prime

//================================================
// test, a simpler progam but less effeicent
//================================================
let x = 1237;
let divider = 0;
const t1 =performance.now();
for (let i = 2; i < x - 1; ++i) {
    if (x % 2 == 0) {
       x = 0;
	   divider = i;
   }
};
const t2 = performance.now();
print(t2 - t1);

if (x != 0) {
    print(`${x}  is a prime`);
} else {
       print(`${x} can be devided by ${divider} so it is not a prime`);
}


/////////////////////////////////////////////////////////////////////////
// finonacci (first 30)
// 0,      1,     1,     2,    3,    5,    8,     13,    21,     34,     
// 55,    89,    144,   233,   377,  610,  987,   1597,  2584,   4181,  
// 6765,  10946, 17711, 28657, 46368,75025,121393,196418,317811, 514229
/////////////////////////////////////////////////////////////////////////
const fibonacci = x => {
    if (x == 1) {
		return 0;
    }

    if (x == 2) {
        return 1;
    }

	// calculate after 3rd fibonacci
    let fib = 0;
    let fib2 = 1;

    for (let i = 3; i <= x; ++i) {
       let tmp = fib;
       fib= fib2;
       fib2 = tmp + fib;
    }
    return fib2;
};

// test the function
print(fibonachi(30))

let a = 12223990011;
let sum = 0;while (a > 0) {
  let b = a % 10;
  sum += b;
  a = Math.floor(a / 10);
}
print(sum);

//================================================
// test, the sum of digits of an integer
//================================================
let a = 1222399001177;
let sum = 0;while (a > 0) {
  let b = a % 10;
  sum += b;
  a = Math.floor(a / 10);
}
print(sum); // 44


/////////////////////////////////////////////////////////////////////////
// test and learn array
/////////////////////////////////////////////////////////////////////////
let arr = [1, 2, 3, 4, 5,6, 7]
print(arr[0]) // change ro 1 -> 8

Sorting an array

//===========================================================================
//		Lesson 1
//
// Integer calculation and array manipulation
// 
//
//============================================================================

//===========================================================================
//		Lesson 3
//
// Find LCM = Least Common Multiple: SMALLEST NUMBER THAT DIVIDES BOTH NUMBER
//
//============================================================================
FOR EXAMPLE: 21 AND 14 LCM = 42
similar question: all factors of a given number: for example: 21 = 3x7. 90 = 2 x 5 x 3 x 3 

//============================================================
// An array of integer pructs
//============================================================
function products(arr) {
	let p = 1;
	arr.forEach(e=> p *= e);
	return p;
}

//============================================================
// test two arrays equality
//============================================================
function areArraysEqual(a1, a2) {
	if (a1.length != a2.length) {
	    return false;
	}
	
	// sort and then compare
	a1.sort();
	a2.sort();
	for(let i = 0; i < a1.length; ++i) {
		if (a1[i] != a2[i]) {
			return false;
		}
	}
	
	return true;
}

//============================================================
// Integer factorization
//============================================================
function GetFactors(n){
	let res = [];
    let divisor = n;
    if (divisor <= 3)
	{
		res.push(divisor);
		return res;
	}
	
	// keep devide untill we reach the end
	while (divisor > 0)
	{
		const sqrN = Math.floor(Math.sqrt(divisor));
		let found = false;
		for (let i = 2; i <= sqrN; ++i) {
			if (divisor % i == 0)
			{
				divisor /= i;
				res.push(i);
				found = true;
				break;
			}
		}

		// if no divisor, it is a primce
		if (!found)
		{
			res.push(divisor);
			divisor = 0;
			break;
		}
	}
         
    return res;
}

// test factorization of an integer
const ia = [2, 2, 7, 11, 37];
const p = products(ia);
const facts = GetFactors(p);
if (areArraysEqual(ia, facts)) {
	print('test1 passed!');
}
else {
	print('test1 failed!');
}

// by now, get LCM is made very easy:
function getLCM(n1, n2) {

	let factors1 = GetFactors(n1);
	let factors2 = GetFactors(n2);
	let lcm = [];
	factors1.forEach(e=> {
		lcm.push(e);
		
		// remove from factors2 if exsts
		const inx = factors2.indexOf(e);
		if (inx >= 0) {
			factors2.splice(inx, 1);
		}
	}
	// now add factors from factors2 if any
	factors2.forEach(e=> {
		lcm.push(e);
	}
	// we now got the LCM by products of the array
	return products(lcm);
}

// test LCM
const n1 = products([2, 2, 3]);
const n2 = products([2, 2, 7]);
print( getLCM(n1, n2) );



//===========================================================================
//		Lesson 4
//
// string manipulation
// 
//
//============================================================================



