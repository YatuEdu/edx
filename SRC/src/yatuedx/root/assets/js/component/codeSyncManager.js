import {PTCC_COMMANDS}  from '../command/programmingClassCommand.js'

class CodeSyncManager {
	#lastCodeSaved;
	#lastCodeLines;
	
	constructor() {
		this.#lastCodeSaved = null;
		this.#lastCodeLines = [];
	}
	
	/**
		New code comes and analyze what got changed:
		  1. appended at the end
		  2. modifed one or more lines
		  3. no change
		  4. entirely changed
		  
		  returns: {changed: (0: no change, 1: appened, 2: lines, 3: tatally changed)
	**/
	update(newCode) {	
		// New CODE PIECE?
		if (!this.#lastCodeSaved) {
			return this.prv_setNewCode(newCode);
		}
		
		// No code changes
		if (this.#lastCodeSaved.localeCompare(newCode) == 0 ) {
			const retObj = {
			flag: PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE,
			};
			return retObj;
		}		
		
		// appended ?
		const indx = newCode.indexOf(this.#lastCodeSaved);
		if (indx === 0) {
			return this.prv_appendNewCode(newCode);
		}
		
		// treat the entire thing as new code
		return this.prv_setNewCode(newCode);
	}
	
	/**
		New code completely invalidated the buffer.  We reset the buffer.
	 **/
	prv_setNewCode(newCode) {
		this.#lastCodeSaved = newCode;
		const retObj = 
		{
			flag: PTCC_COMMANDS.PTC_CONTENT_CHANGED_ALL,
			content: newCode
		};
		return retObj;
	}
	
	/**
		New code appened in the buffer.  We only needs to send what appened to the wire,
		which is the majority of the cases
	 **/
	 prv_appendNewCode(newCode) {
		 const appenedText = newCode.substring(this.#lastCodeSaved.length);
		 this.#lastCodeSaved = newCode;
		 const retObj =  {
			flag: 		PTCC_COMMANDS.PTC_CONTENT_CHANGED_APPENDED,
			content: 	appenedText
		 };
		 return retObj;
	 }
}

export { CodeSyncManager };