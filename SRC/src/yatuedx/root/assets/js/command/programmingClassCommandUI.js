
class ProgrammingClassCommandUI {
	
	constructor() {
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		throw new Error('v_execute: sub-class-should-overload-this');
	}
}


export { ProgrammingClassCommandUI };
