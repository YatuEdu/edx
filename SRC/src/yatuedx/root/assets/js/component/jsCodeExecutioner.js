import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan} from '../core/credMan.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class handles JS Code runner board
**/
class JSCodeExecutioner {
	#consoleId;
	
    constructor(credMan, consoleId) {
		this.#consoleId = `#${consoleId}`;
	}
	
	// hook up events
	async init() {
		// get all the translatable elemnts

		// hook up event handleRun
		
		/*
		$("#bt_white_board_run").click(this.handleRun.bind(this));
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
		$("#bt_console_clear").click(this.handleClearConsole.bind(this));
		$("#bt_white_board_send").click(this.handleSend.bind(this));
		*/
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
		console.log(`exe code: ${src}`);
	}
	
	/*
		append message text to console.
	 */
	print_prv(msg) {
        //  append message to console
        const oldTxt = $(this.#consoleId).val();
        const printTex = `${oldTxt} ${msg}`;
        $(this.#consoleId).val(printTex);
    }
}

export {JSCodeExecutioner}