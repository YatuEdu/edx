import {sysConstants, languageConstants} from '../core/sysConst.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class handles JS Code runner board
**/
class JSCodeExecutioner {
	#consoleId;
	
    constructor(consoleId) {
		this.#consoleId = consoleId; 
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
		if (src) {
			try {
				const func = new Function('print', 'printx', src);
				const res = func(this.printLine_prv.bind(this), this.print_prv.bind(this));
				if (res) {
					this.print_prv(res);
				}
			}
			catch (e) {
				this.print_prv(e);
			}
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
}

export {JSCodeExecutioner}