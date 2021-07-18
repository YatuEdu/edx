import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class manages both login and sigup workflow
**/
class WhiteboardHandler {

	
    constructor(credMan) {
		this.init();
	}
	
	// hook up events
	async init() {
		// get all the translatable elemnts

		// hook up event handleRun
		$("#bt_white_board_run").click(this.handleRun.bind(this));
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
		$("#bt_console_clear").click(this.handleClearConsole.bind(this));
		$("#bt_white_board_send").click(this.handleSend.bind(this));
	}
	
	/*
		Clear program from the board.
	 */
	handleClearBoard(e) {
		e.preventDefault();
		$("#ta_white_board").val('');
	}
	
	/*
		Clear text from the output console.
	 */
	handleClearConsole(e) {
		e.preventDefault();
		$("#ta_console").val('');
	}
	
	/*
		Run program on the board.
	 */
	handleRun(e) {
		e.preventDefault();
		const srcTxt = $("#ta_white_board").val();
		this.runJSCode_prv(srcTxt);
	}
	
	/*
		Send program to the group.
	 */
	handleSend(e) {
		e.preventDefault();
		const srcTxt = $("#ta_white_board").val();
		this.print_prv("sending ...");
	}
	
	/*
		append message text to console.
	 */
	print_prv(msg) {
        //  append message to console
        const oldTxt = $("#ta_console").val();
        const printTex = `${oldTxt} ${msg}`;
        $("#ta_console").val(printTex);
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
}

let whiteboardHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	whiteboardHandler = new WhiteboardHandler(credMan);
});