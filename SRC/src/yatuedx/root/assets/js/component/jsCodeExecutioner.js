import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {uiMan} 								from '../core/uiManager.js';
import {CodeAnalyst}						from './new/codeAnalyst.js'

/**
	This class handles JS Code runner board
**/
class CodeError {
	#exception;
	#analyticalInfo;
	
	constructor(exception, analyticalInfo) {
		this.#exception = exception;
		this.#analyticalInfo = analyticalInfo;
	}
	
	get exception() { return this.#exception; }
	get analyticalInfo() { return this.#analyticalInfo; }
}

/**
	This class handles JS Code runner board
**/
class JSCodeExecutioner {
	#consoleId;
	#vars;
	
    constructor(consoleId) {
		this.#consoleId = consoleId; 
		// A ~ Z
		const alpha = Array.from(Array(26)).map((e, i) => i + 65);
		const alphabet = alpha.map((x) => String.fromCharCode(x));
		// a ~ z
		const alpha2 = Array.from(Array(26)).map((e, i) => i + 97);
		const alphabet2= alpha2.map((x) => String.fromCharCode(x));
		// merge
		this.#vars = alphabet.concat(alphabet2);
	}
	
	/*
		Run program on the board.
	 */
	executeCode(srcTxt) {
		return this.#runJSCode(srcTxt);
	}
	
	/*
		Run js code 
	 */
	#runJSCode(src) {
		// first cleasr left over globals
		this.#undefineVars();
		src = src.trim();
		let analyticalInfo = [];
		if (src) {
			// anaylize code
			const codeAnalyst = new CodeAnalyst(src);
			analyticalInfo  = codeAnalyst.shallowInspect();
		}
		// we detected error, no need to executeCode
		if (analyticalInfo.length) {
			return new CodeError(null, analyticalInfo);
		}
		
		if (src) {
			// run code
			try {		
				// exec code
				const func = new Function('print', 'printx', src);
				const res = func(this.#printLine.bind(this), this.#appendMessage.bind(this));
				if (res) {
					this.#appendMessage(res);
				}
				
				// print well-know variqables (from a ~ z)
				this.#printvars();
			}
			catch (e) {
				// return error info to caller 
				return this.#handleErrors(analyticalInfo, e);
			}
		} else {
			this.#printLine('No code is present')
		}
		// no error 
		return null;
	}
	
	/**
		When errors are encountered, we use our own JS cod analyst to dispply our
		diagnostic messagews
	 **/
	#handleErrors(analyticalInfo, e) {
		// analyse the code
		return new CodeError(e, analyticalInfo);
		
		/*
		if (this.#codeErrorCallback && errors.length > 0) {
			this.#codeErrorCallback(errors);
		} else {
			// simply print the error on the console
			this.#printLine(e);		
			errors.forEach(e  => this.#printLine(e.errorDisplay));
		}
		*/
	}
	
	/*
		append message text to console in a new line
	 */
	#printLine(msg) {
		const id = `#${this.#consoleId}`;
		const oldTxt = $(id).val();
		if (oldTxt) {
			msg = '\n' + msg;
		}
		//printResult(msg);
		this.#appendMessage(msg);
	}
	
	/*
		append message text to console.
	 */
	#appendMessage(msg) {
		//  append message to console
		const id = `#${this.#consoleId}`;
		const oldTxt = $(id).val();
		let printTex = '';
		if (oldTxt) {
			printTex = `${oldTxt}  ${msg}`;
		}
		else {
			printTex = `${msg}`;
		}
		$(id).val(printTex);
    }
	
	/*
		undefine well know variables (a ~ z, A, Z) to avoid polluting the
		global space.
	 */
	#undefineVars() {
		// if any of the vars defined, print them:
		this.#vars.forEach(maybe => {
			try {
				eval(maybe + "=undefined");
			}
			catch(e) {
			} 
		});
	}
	
	/*
		print well know variables (a ~ z, A, Z) to console.
	 */
	#printvars() {
		// if any of the vars defined, print them:
		this.#vars.forEach(maybe => {
			try {
				if (eval(maybe + "!==undefined")) {
					this.#printLine(maybe + "=" + eval(maybe));
				}
			}
			catch(e) {
			} 
		});
	}
}

export {JSCodeExecutioner}