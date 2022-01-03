import {sysConstants, languageConstants} from '../core/sysConst.js'
import {uiMan} from '../core/uiManager.js';

var var_consoleId = '';

/**
	This class handles JS Code runner board
**/
class JSCodeExecutioner {
	
    constructor(consoleId) {
		var_consoleId = consoleId; 
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
				const func = new Function('print', src);
				const res = func(this.print_prv);
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
		append message text to console.
	 */
	print_prv(msg) {
        //  append message to console
		const id = var_consoleId;
        const oldTxt = $(`#${id}`).val();
        const printTex = `${oldTxt} ${msg}`;
        $(`#${id}`).val(printTex);
    }
}

export {JSCodeExecutioner}