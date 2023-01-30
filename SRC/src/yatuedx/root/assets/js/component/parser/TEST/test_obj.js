x = {x: 10, y: 12};
print(x.x + x.y)  // 22

print({x: 10, y: 12})  // {object}

function foo(s) {
	print(s.x * s.y);  // need to make x.y work
}
foo({x: 10, y: 12}); // 120

const s = "abc"'
let x = s.subString(0, 1);
print(x)	// a

const s = "abc"
let x = s.substring(0, 1) + 'hello';
print(x)				// ahello

const s = "abc"
let x = s.substring(0, 1) + y;
print(x)				// should be "y"  is not defined

const s ={txt:  "abc", txt2: 'def'}
let x = s.txt+ s.txt2;
print(x)				// abcdef

