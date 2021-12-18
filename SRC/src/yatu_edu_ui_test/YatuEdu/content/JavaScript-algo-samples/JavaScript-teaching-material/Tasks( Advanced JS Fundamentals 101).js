// Macro-testsvsmicro-tasks
// Microtasks come solely from our code. They are usually created by promises: 
// an execution of .then/catch/finally handler becomes a microtask. 
// Microtasks are used “under the cover” of await as well, as it’s another form of promise handling.

/*
step1: Dequeue and run the oldest task from the macrotask queue (e.g. “script”).
step2: Execute all microtasks:
		While the microtask queue is not empty:
		Dequeue and run the oldest microtask.
step3: Render changes if any.
step4: If the macrotask queue is empty, wait till a macrotask appears.
	    Go to step 1.
*/

// 1. Split a big tast into smaller ones to increase performance and
//    responsiveness
// 2. Using promises to delay a task execution
// 3. read https://javascript.info/event-loop for details
// 4. There’s also a special function queueMicrotask(func) that queues func 
// for execution in the microtask queue.

// who runs first?
setTimeout(() => alert("timeout"));

Promise.resolve()
  .then(() => alert("resolved"));
  
Promise.reject("rejected")
  .catch((e) => alert(e));

alert("code");

// answer -> code -> resolved -> rejected -> timeout

//
//
// Use microtasks to split a big work into mini pieces
//
//

setTimeout(() => print("Timeout", 1));

// queue microtasks
let cnt= 0;
function count() {
    for(let i = 0;  i < 1000; ++i ) {
        ++cnt;
	}
	
	print(cnt, 1);

    if (cnt < 3000) {
         queueMicrotask(count);
    }
}

// queue a microsotask
queueMicrotask(count);
  
print("code", 1);

// result:   code   1000   2000   3000   Timeout

//
//
// Use macro-tasks to split a big work into mini pieces
//
//

setTimeout(() => print("Timeout", 1));

// queue microtasks
let cnt= 0;
function count() {
    for(let i = 0;  i < 1000; ++i ) {
        ++cnt;
	}
	
	print(cnt, 1);

    if (cnt < 3000) {
         setTimeout(count);
    }
}

// queue a microsotask
setTimeout(count);
  
print("code", 1);

// result:     code   Timeout   1000   2000   3000

//
