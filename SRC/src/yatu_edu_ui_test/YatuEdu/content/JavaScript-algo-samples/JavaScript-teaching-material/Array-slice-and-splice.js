/////////////////////////////////////////////////////////////////////////
///
// Array manipulation with slice and splice
//
//  - Slice returns partial portion of an array w/o side effects
//  - Splice modifies the array by deleting and inserting objects 
//	  (with side effects)
//	- Both functions are very forgiving and use best efforts delivery
//	  when it comes to argument validation
//
/////////////////////////////////////////////////////////////////////////

/* 
 *	Slice demo 
 */
const arr = [0, 1, 2, 3, 4, 5,  6];
const sub1 = arr.slice(0, 1);
print(sub1) ; 		// [0]

const sub2= arr.slice(5, 100);
print(sub2) ; 		// [5, 6], end index can be ignored if exeding the max

const sub3 = arr.slice(6);
print(sub3); 		// [6], no end index needed

const sub4 = arr.slice(7);
print(sub4); 		// [ ], out of range index returns empty array

print(arr);   		// [0, 1, 2, 3, 4, 5,  6], slice does not cause side effects

/* 
 *	Splice demo 
 */

arr.splice(3, 0, 3, 3, 3);
print(arr);  		// [0, 1, 2, 3, 3, 3, 3, 4, 5,  6] => splice inserted 3 elelemnts, changed array

arr.splice(3, 3); 
print(arr);  		// [0, 1, 2, 3, 4, 5,  6], deleted 3 elelemnts, added 0 elements

arr.splice(5, 100);
print(arr);    		//  [0, 1, 2, 3, 4] removed 2 elelemnts, ignoring indexes exeeded max index

arr.splice(5, 1);  
print(arr);   		// [0, 1, 2, 3, 4] removed 0 elelemnts, ignoring start index exeeded range

arr.splice(6, 1, 6, 7, 8);
print(arr);     	// [0,1,2,3,4,6,7,8] -> deleted 0 elelemnts and appended 3 elelemnts, surprise!

/********************************
* String slicing demo
*********************************/

/********************************************************
 *	Camel case string
 *	Camel case is widely used in Java, C++, c# as variable 
 *	names. Here we use this function to turn any string into
 *  camel case. Assume a word is given.
 ********************************************************/
function convertToCamelCase(singWord) {
	return singWord.charAt(0).toUpperCase() + singWord.slice(1).toLowerCase();
}

