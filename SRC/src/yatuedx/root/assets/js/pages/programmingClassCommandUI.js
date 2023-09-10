import {JSCodeExecutioner}		from '../component/jsCodeExecutioner.js'
import {sysConstants} 			from '../core/sysConst.js'
import {LocalStoreAccess}		from '../core/localStorage.js'
import {CodeSyncManager} 		from '../component/codeSyncManager.js'	
import { StringUtil } from '../core/util.js';

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
	#htmlCodeStore;
	
	constructor(codeInputId, resultConsolId) {
		this.#codeInputId = codeInputId;
		this.#resultConsolId = resultConsolId;

		// create js code executioner
		this.#jsCodeExecutioner =  new JSCodeExecutioner(this.#resultConsolId);
		
		// create code synchonization mamager to synchrize code between student and teacher
		this.#codeSyncManager = new CodeSyncManager();

		// store to keep encoded HTML code for WEB Page Preview
		this.#htmlCodeStore = new LocalStoreAccess(sysConstants.YATU_MY_CODE_STORE_KEY);
	}
	
	/*
		Use a timer to periodically sync teacher's code with student's code.
		We start it when in teaching mode and stop it when in exercise mode.
	*/
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

	
	/*
		Child class object calls this function to update the code cache.  Upon updating code in the cache,
		#codeSyncManager also advices what kind of changes the code has: appending, deletion, or what not so that
		the child classd objects know what to do.
	 */
	updateCode(codeStr) {
		return this.#codeSyncManager.update(codeStr);
	}
	
	/*
		Copy the entire code to all the student
	 */
	syncCode(codeSrc) {
		return this.#codeSyncManager.syncCode(codeSrc);
	}
	
	/*
		Hnandle running JS code from UI text area
	*/
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
	
	/*
		Formatting JS code from UI text area
	*/
	formatCode() {
		const codeStr = $(this.codeInputTextArea).val();
		if (codeStr) {
			return this.#jsCodeExecutioner.formatCode(codeStr);	
		}
	}
	
	executeCode(codeText) {
		// detect html code for web-previewing
		const {countHtmlNode, isValidHtml} = StringUtil.validateHTMLString(codeText)
		if (countHtmlNode) {
			if (isValidHtml) {
				this.#previewWebPage(codeText)
			} else {
				alert(codeText.substring(0, 16) + '... ' + 'contains invalid html tags')
			}
			return;
		}

		// execute the plain JS Code
		return this.#jsCodeExecutioner.executeCode(codeText);
	}

	#previewWebPage(codeText) {
		// stash the code to storage for later use
		this.#htmlCodeStore.setItem(StringUtil.encodeText(codeText));
	
		// go to the test page
		const studentUrl = '../../assets/student/index.html';
		window.open(studentUrl, '_blank');
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
