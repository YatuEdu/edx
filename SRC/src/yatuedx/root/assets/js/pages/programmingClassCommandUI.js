import {credMan} 						from '../core/credMan.js'
import {AuthPage} 						from '../core/authPage.js'
import {JSCodeExecutioner}				from '../component/jsCodeExecutioner.js'
import {sysConstants, sysConstStrings} 	from '../core/sysConst.js'

class ProgrammingClassCommandUI extends AuthPage {
	_jsCodeExecutioner;
	
	constructor(credMan, resultConsolId) {
		super(credMan);
		
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
}


export { ProgrammingClassCommandUI };
