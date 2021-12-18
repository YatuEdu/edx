// advanced object programming topic 102:
// object destroying 
const obj = {a: 100, b: 200};

// level 1 named object initializatiojn
const {a: a1, b: b1} = obj;    	

let c = 300;
print(c)

// level 1 named object assigning
print({b: c} = obj);		  	

const obj2 = 
			{sub: 				
                {
					subx: 10,
					suby: 20,
                    subsub: { x: 0, y: 1}
                }
			};
			
// level 2~3 default object assigning
const {sub: {subx, suby, subsub: {x, y}}} = obj2; 

// level 2~3 named object assigning
const {sub: {subx: x1, suby: y1, subsub: {x: x2, y: y2}}} = obj2; 

// print: 100, 200; 200, 10, 20, 0, 1, 10, 20, 0, 1
print( [ a1, b1, c, subx, suby, x, y, x1, y1, x2, y2]);  

// array destroying
let arr =  [ a1, b1, c, subx, suby, x, y, x1, y1, x2, y2];
let [arr1, , ,arr4] = arr ;

// print 100, 10
print([arr1,  arr4])