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
        const indx = y.indexOf(x);

        if (indx >= 0) {
			const middleResult = 'x' + i;
			let y1 = y.substring(0, indx);
			let y2 = y.substring(indx + x.length);
			let r1 = ""; 
			let r2 = "";
			if (y1) {
				r1 = compose(xArray, y1 );
			}
			if (!y1 || r1.indexOf(invalid) === -1 ) {
				// r1 is not invalid
				if (y2) {
					r2 = compose(xArray, y2 );
				}
			}
		
		
			const ret = r1 + middleResult + r2;
			resultsList.push( ret);
			return ret;
		}
	}
	return invalid;
}
compose(xArray, y);
print(resultsList);
