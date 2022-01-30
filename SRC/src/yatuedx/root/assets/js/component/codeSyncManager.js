import {PTCC_COMMANDS}  from '../command/programmingClassCommand.js'
import {StringUtil}		from '../core/util.js'

class CodeSyncManager {
	#lastCodeSaved;
	#lastCodeLines;
	
	constructor() {
		this.#lastCodeSaved = null;
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
		while (true) {
			// New CODE PIECE?
			if (!this.#lastCodeSaved) {
				console.log('code init');
				retObj = this.prv_setNewCode(newCode);
				break;
			}
		
			// No code changes
			if (this.#lastCodeSaved.localeCompare(newCode) == 0 ) {
				console.log('code no change ');
				retObj = {
					flag: PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE,
				}
				break;
			}		
		
			// appended ?
			let indx = newCode.indexOf(this.#lastCodeSaved);
			if (indx === 0) {
				console.log('code appending ');
				retObj = this.prv_appendNewCode(newCode);
				break;
			}
		
			// delete at the end?
			indx = this.#lastCodeSaved.indexOf(newCode);
			if (indx === 0) {
				console.log('code deleting ');
				retObj =  this.prv_deletedOldCodeAtEnd(newCode);
				break;
			}
		
			// treat the entire thing as new code
			console.log('code unknown changes, refreshing ... ');
			retObj =   this.prv_setNewCode(newCode);
			break;
		}
		
		if ( PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE != retObj.flag &&
			 this.#lastCodeSaved ) {
			// add message digest to the Object
			retObj.md = StringUtil.getMessageDigest(this.#lastCodeSaved);
		}
		return retObj;
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
	 
	 /**
		New code is the old code that deletes something at the end.  
		We only needs to send deleted location to the client
	 **/
	 prv_deletedOldCodeAtEnd(newCode) {
		 const delLen =this.#lastCodeSaved.length - newCode.length;
		 this.#lastCodeSaved = newCode;
		 if (delLen > 0) {
			  const retObj =  {
				flag: 		PTCC_COMMANDS.PTC_CONTENT_CHANGED_TALI_DELETED,
				content: 	delLen
			 }
			 return retObj;
		 }
		 throw new Erro('wrong function called');
	 }
}

export { CodeSyncManager };