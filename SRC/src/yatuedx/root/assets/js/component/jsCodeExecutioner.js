import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {uiMan} 								from '../core/uiManager.js';
import {CodeAnalyst}						from './new/codeAnalyst.js'

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
		this.runJSCode_prv(srcTxt);
	}
	
	/*
		Run js code 
	 */
	runJSCode_prv(src) {
		// first cleasr left over globals
		this.#undefineVars();
		src = src.trim();
		if (src) {
			try {
				const func = new Function('print', 'printx', src);
				const res = func(this.#printLine.bind(this), this.#appendMessage.bind(this));
				if (res) {
					this.#appendMessage(res);
				}
				
				// print well-know variqables (from a ~ z)
				this.#printvars();
			}
			catch (e) {
				this.#handleErrors(src, e);
			}
		} else {
			this.#printLine('No code is present')
		}
		//console.log(`exe code: ${src}`);
	}
	
	/**
		When errors are encountered, we use our own JS cod analyst to dispply our
		diagnostic messagews
	 **/
	#handleErrors(codeText, e) {
		this.#printLine(e);
		
		// analyse the code
		const codeAnalyst = new CodeAnalyst(codeText);
		const errors = codeAnalyst.shallowInspect();
		errors.forEach(e  => this.#printLine(e.errorDisplay));
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