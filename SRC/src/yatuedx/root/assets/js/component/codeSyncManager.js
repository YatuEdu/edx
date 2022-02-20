import {PTCC_COMMANDS}  		from '../command/programmingClassCommand.js'
import {StringUtil, UtilConst}	from '../core/util.js'

class CodeSyncManager {
	#lastCodeSaved;
	#lastCodeLines;
	
	constructor() {
		this.#lastCodeSaved = "";
		this.#lastCodeLines = [];
	}
	
	/**
		Copy the entire code to all the student
	 **/
	syncCode(codeSrc) {
		if (!codeSrc ) {
			return null;
		}
		this.#lastCodeSaved = codeSrc;
		const retObj = {
			flag: 		PTCC_COMMANDS.PTC_CONTENT_CHANGED_ALL,
			content: 	codeSrc,
			md: 		StringUtil.getMessageDigest(codeSrc)
		};
		return retObj;
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
		let retObj;
		
		// Nothing changed
		if (!this.#lastCodeSaved && !newCode) {
			return;
		}
		
		// DEEP COMPARISON of the two strings and know the
		// detailed change states
		const chaneObj = StringUtil.findChangeBetweenText(this.#lastCodeSaved,newCode);
		if (chaneObj.flag != UtilConst.STR_CHANGE_NON ) {
			// update the code storage
			this.#lastCodeSaved = newCode;
			if (this.#lastCodeSaved) {
				chaneObj.digest = StringUtil.getMessageDigest(this.#lastCodeSaved);
			}
		}
		return chaneObj;
	}
}				

export { CodeSyncManager };