/////////////////////////////////////////////////////////////////////////
///
// Object literals has keys (string) and values (object)
//  - access values using [] notation
//  - access values using . notation
//
/////////////////////////////////////////////////////////////////////////
const obj2 = {1: 100, 2: 200, 3: 300 };
print(Object.keys(obj2) );             // "1", "2", "3"
print(Object.entries(obj2));           // [["1",100],["2",200],["3",300]]
for (const [key, value] of Object.entries(obj2) ) {
  print(`${key}: ${value}`);           /* 1: 100
                                          2: 200
                                          3: 300 */
}
print (1 in obj2);              		// true
print ("1" in obj2);           			// true
//print (obj2.1);                		// error
print(obj2.name);            			// ly
print(obj2[1]);                  		// 100
print(obj2[2]);                  		// 200
print(obj2["1"]);                		// 100
print(obj2["name"]);         			// ly
print(obj2[name]);           			// undefined
//print(obj2[x]);                		// error: x is not defined
const x= "name";
print(obj2[x]);                   		// ly, [] can use variable index
const y = 1;
print(obj2.y);                    		// undefined: . notation cannot use variable