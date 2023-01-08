for x = 0 // missing "("

for (let i = 0; i < 10; i+=2) {
	print(i);
} 			// print 0, 2, 4, 6, 8

for (i = 0; i < 10; i+=2) {
	print(i);
}			// print 0, 2, 4, 6, 8


let j = 0;
for (; j < 10; j+=2) {
	print(j);
} 			// print 0, 2, 4, 6, 8

// ++ unary operator
for(let i = 0; i < 10; i++) {
	print(i);
}			// 1 2 3 4 5 6 7 8 9 10

// -- unary operator
for(let i = 10; i > 0; i--) {
	printx(i);
} 			// 10 9 8 7 6 5 4 3 2 1

for(let i = 10; (2 + i) > 0; i--) {
	printx(i);
}			// 10  9  8  7  6  5  4  3  2  1  0  -1 

//--------------------------------erro case --------------------------
for (; i < 10; i+=2) {
	print(i);
}			// error: i not defined
