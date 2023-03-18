//--------------------------test case 1: output and variable values -------------------
xxx = 100;
yyy = "abc";
zzz = [1, 2, 3];
www = {x: 1, y: 2};
printx("www=", www)

=> 
------ output -------
www= {x: 1,y: 2} 
------ variable values -------
xxx: 100
yyy: abc
zzz: 1,2,3
www: {x: 1,y: 2}

//--------------------------test case 2: output and variable values -------------------
const xxx = 100;
let yyy = "abc";
const zzz = [1, 2, 3];
const www = {x: 1, y: 2};
global = 100000;
printx("www=", www)

=>
------ output -------
www= {x: 1,y: 2} 
------ variable values -------
xxx: 100
yyy: abc
zzz: 1,2,3
www: {x: 1,y: 2}
global: 100000

//--------------------------test case 3: output and variable values in different scope ----------
let x = 121; 
for (let x = 0; x < 3; x++) {
	const i = x + 1; 
	print ("i = ",i); 
}

=> 
------ output -------
i =  1
i =  2
i =  3

------ variable values -------
x: 121


//--------------------------test case 4: while scope and global scope ----------
let x = 4; 
const c = 2; 
while (x-- > 0) {
	let z = x * c; 
	printx ("for x:",x); 
	printx (z); 	
}

=>
------ output -------
for x: 3 6 for x: 2 4 for x: 1 2 for x: 0 0 
------ variable values -------
x: -1
c: 2

//--------------------------test case 5: if statement scope and global scope ----------

let x = 4; 
const c = 2; 
if (x-- > 0) {
	let z = x * c; 
	printx ("for x:",x); 
	printx (z); 
	
}
=>
------ output -------
for x: 3 6 
------ variable values -------
x: 3
c: 2