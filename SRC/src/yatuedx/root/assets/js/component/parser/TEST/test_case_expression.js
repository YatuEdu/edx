
---------------- case 1 -------------------------------------------------------------------------------
/* Error: Ophan operator found at line: 1, position: 6, found token <<< ! >>> sys_inserted_comment  */
x = 1 ! 2

---------------- case 2: test unary and binary operator combined ------------------------------------------

x = 1 & ! 2
//case 1: 0

a = 1; 
b = 2; 
x = a & !b
//case 2: x = 0

a = 1; 
b = 2; 
x = a+ ++b
// case 3: x = 4

a = 1; 
b = 0; 
x = a + !b
// case 4: x = 2

a = 1; 
b = 0; 
x = a++  +  ++b
// case 5: x = 2

a = 1; 
b = 0; 
x = ++a + ++b
//case 6: x = 3

a = 1; 
b = 0; 
x = a++ // can also has CR)
//case 7: x = 2

a = 1; 
b = 0; 
x = a++; 
//case 8: x = 2

a = 1; 
b = 2; 
x = ++a * ++b 
// case 9: x = 6

---------------- case 3: test unary and binary operator combined(+ and -) ------------------------------------------
a = 1; 
b = 2; 
x = ++a *  - b 
// case 1: x = -4

a = 1; 
b = 2; 
x = ++a +  - b 
// case 2: 0

