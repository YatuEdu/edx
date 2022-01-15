import {credMan} 						from '../core/credMan.js'
import {AuthPage} 						from '../core/authPage.js'
import {JSCodeExecutioner}				from '../component/jsCodeExecutioner.js'
import {sysConstants, sysConstStrings} 	from '../core/sysConst.js'

class ProgrammingClassCommandUI extends AuthPage {
	_jsCodeExecutioner;
	_codeInputId;
	_videoAreaId;
	
	constructor(credMan, codeInputId, resultConsolId, videoAreaId) {
		super(credMan);
		this._codeInputId = codeInputId;
		this._videoAreaId = videoAreaId;
		
		// create js code executioner
		this._jsCodeExecutioner =  new JSCodeExecutioner(resultConsolId);
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		throw new Error('v_execute: sub-class-should-overload-this');
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
			codeStr = $(this.codeInputId).val();
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
		this._jsCodeExecutioner.executeCode(codeStr);
	}
	
	get codeInputId() {
		return `#${this._codeInputId}`;
	}
	
	get videoAreaId() {
		return `#${this._videoAreaId}`;
	}
}


export { ProgrammingClassCommandUI };
