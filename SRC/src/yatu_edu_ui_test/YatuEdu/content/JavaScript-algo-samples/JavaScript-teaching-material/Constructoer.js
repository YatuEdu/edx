/////////////////////////////////////////////////////////////////////////
///
/// Constreucting a new object: constructor not returning anything
///
/////////////////////////////////////////////////////////////////////////
function MyTest(caseNo) {
    this.case = caseNo;
    this.test = function () {
        print('testing ' + this.case);
    }
}

const t1 = new MyTest(1);
t1.test();
const t2 = new MyTest(2);
t2.test();
print(t1 === t2);			// false

const oldTester = {
    tc: 100,
    test: function() {
       print('old tester ' + this.tc);
    } 
};

/////////////////////////////////////////////////////////////////////////
///
/// Returning an old object: constructor returning an existing object.
///  	can serve as a singleton pattern
///
/////////////////////////////////////////////////////////////////////////

function MyTest2() {
    return oldTester;		// constructor returning an old object
}

const t3 = new MyTest2();
t3.test();
const t4 = new MyTest2();
t4.test();
print(t2 === t4);			// false
print(t3 === t4);			// true