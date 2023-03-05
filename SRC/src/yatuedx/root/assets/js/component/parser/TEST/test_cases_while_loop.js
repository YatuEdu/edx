
---------------- case 1: err cases -------------------------------------------------------------------------------
while {
}
 => expecting "("

while() {}
=>  Error: Invalid token found, expecting 'logical expression' 

x = 3; 
while (x-- > 0) {
	print (y); 
}
=> Undefined variable 'y'

x = 3; 
while (x-- > 0) {
	for (let i = 0; i < x; i++) {
		let y = i * 10; 
		print (y); 
	}
	print (x); 
	print (y); => y is undefined
}

x = 3; 
while (x-- > 0) {
	let i = x; 
	while (i++ <= x) {
		let y = i * 5; 
		print ('y=' + y); 
	}
	print ('x=' + x); 
	print(y);			=> y is undefined
}

x = 3; 
while (x-- > 0) {
	let i = x; 
	while (i++ <= x) {
		const y = i * 5; 
		print ('y=' + y); 
	}
	print ('x=' + x); 
	print (y)			=> y is undefined
}

---------------- case 2: good cases -------------------------------------------------------------------------------
 
x = 3; 
while (x-- > 0) {
	print (x); 
}
=> x = -1, output: 2, 1, 0

x = 3; 
while (x-- > 0) {
	 {
		let y = x * 10;  // y defined in inner block
		print (y); 
	}
	print (x); 
}
=> output: 20 2 10 1 0 0

x = 3; 
while (x-- > 0) {
	let i = x; 
	while (i++ <= x) {
		y = i * 5; 			// y is global var
		print ('y=' + y); 
	}
	print ('x=' + x); 
	print (y)			// y is defined
}

---------------- case 3: endless detection -------------------------------------------------------------------------------
 
x = 1; 
while (x++ > 0) {
	 
}
=> endless loop detected: x=100003



 