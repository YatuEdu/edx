// PTCC = prgramming-teaching command const
const sysConstants = { 
const PTCC_CLASSROOM_MODE_READ_ONLY		= 0;
const PTCC_CLASSROOM_MODE_WRITE_ONLY	= 1;

const PTCC_DISPLAY_BOARD_REFRESH 		= 100;
const PTCC_DISPLAY_BOARD_ERASE  		= 101;
const PTCC_DISPLAY_BOARD_HIGH_LIGHT  	= 102;
const PTCC_DISPLAY_BOARD_UPDATE  		= 103;

const PTCC_CODE_RUN  					= 200;
const PTCC_CODE_ERASE  					= 201;
const PTCC_CODE_COMPILATION_RESULT		= 202;
const PTCC_CODE_SYNC					= 203;

const PTCC_CLASSROOM_SWITCH_MODE		= 300;

const PCC_CLASSROOM_MODE				= 300;

class ProgrammingClassCommand {
	
	#cmdObject;
	
	constructor(cmdId, data) {
		this.#cmdObject = {};
		this.#cmdObject.id = cmdId;
		this.#cmdObject.data = data;
		this.#cmdObject.version = {major: 1, minor: 0};
	}
	
	/**
		Retrieve command string
	**/
	get cmdStr() {
		return  JSON.stringify(this.#cmdObject);
	}
}


export { ProgrammingClassCommand };