const xArray = ["abc", "de",  "xy", "f", "z"];
const y = "xyzfabcde";
let steps = 0;

const invalid = "*";
debugger ;
const resultsList = [];
function compose(xArray, y) {

    if (!y) {
		return "";
    }
	
    for (let i = 0; i < xArray.length; i++ ) {
       const x = xArray[i];
        if (x === y) {
             return 'x' + i;
        }
		}
		}
		
		
const invalid = "*";