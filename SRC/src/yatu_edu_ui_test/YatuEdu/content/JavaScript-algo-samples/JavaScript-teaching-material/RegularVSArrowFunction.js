/////////////////////////////////////////////////////////////////////////
///
/// Test the difference in call context between regular function and
/// arrow function.
///
/////////////////////////////////////////////////////////////////////////

// using "arrow function" makes "this" pointing to the lexical 
// this
const obj = {
  count: 1,
  add:  function() {
            setTimeout(() => {
                           print(++this.count) 
                       }, 
                       1000 
		    );
        }
};

obj.add();    // will print 2

// using regular function makes "this" pointing to the calling
// context
window.count = 100;
const obj2 = {
  count: 1,
  add: function() {
           setTimeout(  function () {
                           print(++this.count);
                        }, 
                        1000)
           }
};
obj2.add()	 // will print 101