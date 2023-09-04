import {JSCodeExecutioner}		from '../component/jsCodeExecutioner.js'
import {sysConstants} 			from '../core/sysConst.js'
import {CodeSyncManager} 		from '../component/codeSyncManager.js'	

const CSS_VIDEO_MIN 						= 'yt-video';
const CSS_VIDEO_MAX 						= 'yt-video-max';
const CSS_VIDEO_ANY 						= 'yt-video-any';

class ProgrammingClassCommandUI {
	#jsCodeExecutioner;
	#codeInputId;
	#resultConsolId;
	#timer;
	#codeSyncManager;
	#groupId;
	#classMode
	
	constructor(codeInputId, resultConsolId) {
		this.#codeInputId = codeInputId;
		this.#resultConsolId = resultConsolId;
		this.#classMode = 0;

		// create js code executioner
		this.#jsCodeExecutioner =  new JSCodeExecutioner(this.#resultConsolId);
		
		// create code synchonization mamager to synchrize code between student and teacher
		this.#codeSyncManager = new CodeSyncManager();
	}
	
	/**
		Use a timer to periodically sync teacher's code with student's code.
		We start it when in teaching mode and stop it when in exercise mode.
	**/
	startOrStopCodeRefreshTimer(start) {
		if (start) {
			if (!this.#timer) {
				// do not set interval when one is already working
				this.#timer = setInterval(this.handleTimter.bind(this), sysConstants.YATU_CODE_BUFFER_REFRESH_FREQUENCY);
			}
		}
		else {
			console.log(this.#timer + ' clearled');
			clearInterval(this.#timer);
			this.#timer = undefined;
			
		}
	}

	
	/**
		Child class object calls this function to update the code cache.  Upon updating code in the cache,
		#codeSyncManager also advices what kind of changes the code has: appending, deletion, or what not so that
		the child classd objects know what to do.
	 **/
	updateCode(codeStr) {
		return this.#codeSyncManager.update(codeStr);
	}
	
	/**
		Copy the entire code to all the student
	 **/
	syncCode(codeSrc) {
		return this.#codeSyncManager.syncCode(codeSrc);
	}
	
	/**
		Hnandle running JS code from UI text area
	**/
	runCodeFromTextInput() {
		//obtain coding from local "exercise board"
		// if there is a selection, run selected text as code
		let codeStr = window.getSelection().toString();
		if (!codeStr) {
			codeStr = $(this.codeInputTextArea).val();
		}
		else {
			// de-select the selected text so that it does not confuse the
			// user with a hidden selection
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			}
			else if (document.selection) {
				document.selection.empty();
			}
		}
		return this.executeCode(codeStr);
	}
	
	/**
		Formatting JS code from UI text area
	**/
	formatCode() {
		const codeStr = $(this.codeInputTextArea).val();
		if (codeStr) {
			return this.#jsCodeExecutioner.formatCode(codeStr);	
		}
	}
	
	executeCode(codeText) {
		return this.#jsCodeExecutioner.executeCode(codeText);
	}
	
	set classMode(cm) {
		this.#classMode = cm;
	}
	
	get groupId() {
		return this.#groupId;
	}
	
	set groupId(gid) {
		this.#groupId = gid;
	}
	
	get codeInputTextArea() {
		return `#${this.#codeInputId}`;
	}
	
}


export { ProgrammingClassCommandUI };
