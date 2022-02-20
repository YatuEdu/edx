import {credMan} 						from '../core/credMan.js'
import {AuthPage} 						from '../core/authPage.js'
import {JSCodeExecutioner}				from '../component/jsCodeExecutioner.js'
import {sysConstants, sysConstStrings} 	from '../core/sysConst.js'
import {CodeSyncManager} 				from '../component/codeSyncManager.js'	
import {StringUtil, UtilConst}			from '../core/util.js'

class ProgrammingClassCommandUI extends AuthPage {
	#jsCodeExecutioner;
	#codeInputId;
	#videoAreaId;
	
	#timer;
	#codeSyncManager;

	constructor(credMan, codeInputId, resultConsolId, videoAreaId) {
		super(credMan);
		this.#codeInputId = codeInputId;
		this.#videoAreaId = videoAreaId;
		
		// create js code executioner
		this.#jsCodeExecutioner =  new JSCodeExecutioner(resultConsolId);
		this.#codeSyncManager = new CodeSyncManager();
	}
	
	/**
		Use a timer to periodically sync teacher's code with student's code.
		We start it when in teaching mode and stop it when in exercise mode.
	**/
	startOrStopCodeRefreshTimer(start) {
		if (start) {
			this.#timer = setInterval(this.handleTimter.bind(this), sysConstants.YATU_CODE_BUFFER_REFRESH_FREQUENCY);
		}
		else {
			clearInterval(this.#timer);
		}
	}
	
	/**
		Stub function for handling timer. Calls the actual handler "v_handleTimer", which would be provided
		by the child class, who knows what to do.
	 **/
	handleTimter() {
		this.v_handleTimer();
	}
	
	/**
		Child class object calls this function to update the code cache.  Upon after dating the code in the cache,
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
		Our algorithm to code updating by difference in order to optimize network traffic 
		
	 **/
	static updateContentByDifference(how, oldStr) {
		let newContent = "";
		let digest = "";
		const flag = how[0];
		switch(flag) {
			// REFRESH EVERYTHING
			case UtilConst.STR_CHANGE_ALL:
			{
				console.log('code repalced');
				newContent = how[1];
				break;
			}
			
			// code appened (70% of cases)
			case UtilConst.STR_CHANGE_APPEND:
			{
				console.log('code appened');
				newContent = oldStr + how[1];
				digest = how[2];
				break;
			}
			
			// code deleted at the end (10% of cases)			
			case UtilConst.STR_CHANGE_DELETE_END:
			{
				console.log('code tail deleteed');
				const delLen = parseInt(how[1], 10);
				newContent = oldStr.substring(0, delLen);
				digest = how[2];
				break;
			}
			
			// prepend at the header			
			case UtilConst.STR_CHANGE_PREPEND:
			{
				console.log('code in the middle replaced');
				newContent = how[1] + oldStr;
				digest = how[2];
				break;
			}
			
			// delete at the header			
			case UtilConst.STR_CHANGE_DELETE_BEGIN:
			{
				console.log('code deleted at beginning');
				const delLen = parseInt(how[1], 10);
				newContent = oldStr.substring(oldStr.length - delLen);
				digest = how[2];
				break;
			}
			
			// replace in the middle			
			case UtilConst.STR_CHANGE_MIDDLE:
			{
				console.log('code in the middle replaced');
				const delter = how[1];
				const b = parseInt(how[2], 10);
				const e = parseInt(how[3], 10);
				digest = how[4];
				newContent = newContent = StringUtil.replaceInTheMiddle(oldStr,delter, b, e);
				break;
			}
		}
		return {newContent: newContent, digest: digest};
	}
	
	/**
		Execute when timer is triggered.  IMplemented by child class.
	**/
	v_handleTimer() {
		throw new Error('v_handleTimer: sub-class-should-overload-this');
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		throw new Error('v_execute: sub-class-should-overload-this');
	}
	
	/**
		Call this to set tab handler
	**/
	setTabHandler() {
		$(this.codeInputTextArea).keydown(this.handleTab);
	}
	
	/**
		Hnandle tab by insertng \t
	**/
	handleTab(e) {
		if(e.which===9){ 
			const start = this.selectionStart;
			const end = this.selectionEnd;
			const val = this.value;
			const selected = val.substring(start, end);
			const re = /^/gm;
			this.value = val.substring(0, start) + selected.replace(re, sysConstStrings.TAB_STRING) + val.substring(end);
			//Keep the cursor in the right index
			this.selectionStart=start+1;
			this.selectionEnd=start+1; 
			e.stopPropagation();
			e.preventDefault(); 			
		}
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
		this.executeCode(codeStr);
	}
	
	executeCode(codeText) {
		this.#jsCodeExecutioner.executeCode(codeText);
	}
	
	get codeInputTextArea() {
		return `#${this.#codeInputId}`;
	}
	
	get code() {
		return $(this.codeInputTextArea).val();
	}
	
	set code(str) {
		$(this.codeInputTextArea).val(str);
	}
	
	get videoAreaId() {
		return `#${this.#videoAreaId}`;
	}
}


export { ProgrammingClassCommandUI };
