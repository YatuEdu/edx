import {sysConstants, languageConstants} from '../core/sysConst.js'
import {uiMan} from '../core/uiManager.js';

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
		this.undefine_vars();
		src = src.trim();
		if (src) {
			try {
				const func = new Function('print', 'printx', src);
				const res = func(this.printLine_prv.bind(this), this.print_prv.bind(this));
				if (res) {
					this.print_prv(res);
				}
				
				// print well-know variqables (from a ~ z)
				this.print_vars();
			}
			catch (e) {
				this.print_prv(e);
			}
		} else {
			this.printLine_prv('No code is present')
		}
		//console.log(`exe code: ${src}`);
	}
	
	/*
		append message text to console in a new line
	 */
	printLine_prv(msg) {
		const id = `#${this.#consoleId}`;
		const oldTxt = $(id).val();
		if (oldTxt) {
			msg = '\n' + msg;
		}
		//printResult(msg);
		this.print_prv(msg);
	}
	
	/*
		append message text to console.
	 */
	print_prv(msg) {
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
	undefine_vars() {
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
	print_vars() {
		// if any of the vars defined, print them:
		this.#vars.forEach(maybe => {
			try {
				if (eval(maybe + "!==undefined")) {
					this.printLine_prv(maybe + "=" + eval(maybe));
				}
			}
			catch(e) {
			} 
		});
	}
}

export {JSCodeExecutioner}