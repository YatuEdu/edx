const xArray = ["abc", "de",  "xy", "f", "z"]; // to do: main take quote type
const y = "xyzfabcde";
let steps = 0;

const invalid = "*";
debugger ;
const resultsList = [];
function compose(xArray, y) {

    if (!y) {
		return "";
    }
	
    for (let i = 0; i < xArray.length; i++ ) { //todo: dont CR inside for loop
       const x = xArray[i];
        if (x === y) {
             return 'x' + i;
        }
		}
		}

---------------------------
y=1 +9; 
if(!y) {
	y = 1;
	return""; 
}
=>
y = 1 + 9; 
if (!y) {
	y = 1;
	return ""; 
}

---------------------------		
		
const invalid = "*";

/* Error: Invalid expression element found at line: 2, position: 15, found token <<< CRT >>> */
/* Error: Invalid object definition syntax at line: 7, position: 6, found token <<< CRT >>> */
for (let i = 0;
 i < 10; i ++ ) {
	print (i); 
	
}
i = 99; 
y = 100; 
y =  { // parsing: needs to skip the CR
	x:12,y:13
}

// ignore cr inside for, format object nicely
for (i = 0; i <= 10; 
i ++ ) {
	print (x)
}

x =  {
	x:1, y:2,
	z:3,
	w: {
		x:1, y:2}}  => 
x =  {
	x: 1,
	y: 2,
	z: 3,
	w:  {
		x: 1,
		y: 2
	}	
}

// test case:
x =  {
	x: 1,
	y: 'abc " ',
	z: 3, w:  { x: 1, y: 2
	}
	
}
print(x)

result:

x =  {
	x: 1,
	y: 'abc " ',
	z: 3,
	w:  {
		x: 1,
		y: 2
	}
	
}

test what? - formettesd correctly 
			- string quotes preserved
			
bug: = : needs only one space

/* comment needs to be preserverd */
x = 10
/* second comment also preservered */


/// do not format object inside a function call statement such as
foo({x: 9, y: 10})

bugs:
1) quote typwe not maintanied
2) cannot tell when an expression ends
3) object literals should not be formatted when it is in a fucntion call

x = "av'c'x"; =? preserver quote

