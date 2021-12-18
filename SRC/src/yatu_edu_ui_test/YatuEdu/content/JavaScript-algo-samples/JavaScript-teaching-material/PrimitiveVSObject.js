// String vs primitive string literal
const sobj 	= new String("abc");  	// String object
const str 	= "abc";				// String literal
const mp 	= new Map();
mp.set(sobj, 100);					// add entry 100
mp.set(str, 100);					// intention is not to add the second 100
for (e of mp) {
   console.log(e);					// Two different map entry
}

console.log (mp.get(s));			// 100
console.log (mp.get(b));			// 100

// Another example: number value vs number object
const mp2 	= new Map();
const iObj 	= new Number(100);
const i    	= 100;
mp2.set(iObj, true);				// add entry 100
mp2.set(i, false);					// intention is not to add the second 100
for (e of mp2) {
   print(e);						// Two different map entry
}

print (mp2.get(iObj));				// true
print (mp2.get(i));					// false