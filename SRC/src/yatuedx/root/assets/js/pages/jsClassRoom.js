import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardForCoding}				from '../component/displayBoardForCoding.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from '../command/programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'

const TAB_STRING = "\t";

/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	#displayBoardForCoding;
    constructor(credMan) {
		super();
		this.init();
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		switch(cmd.id) {
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH:
				this.displayCodeSample(cmd.data[0]);
				break;
			default:
				break;
		}
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/	
	displayCodeSample(codeHtml) {
		$("#yt_formatted_code_display_board").html(codeHtml);
	}
	
	// hook up events
	async init() {
		const clssName = 'JS 101 Test'; // TODO: fetch class name from URL:
		this.#displayBoardForCoding = new DisplayBoardForCoding(clssName, this);
		
		// hook up event handleRun
		
		// accept tab and insert \t
		$("#yt_input_area").keydown(this.handleTab);
		
		$("#bt_white_board_run").click(this.handleRun.bind(this));
		
		
		
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
		$("#bt_console_clear").click(this.handleClearConsole.bind(this));
		$("#bt_white_board_send").click(this.handleSend.bind(this));
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
			this.value = val.substring(0, start) + selected.replace(re, TAB_STRING) + val.substring(end);
			//Keep the cursor in the right index
			this.selectionStart=start+1;
			this.selectionEnd=start+1; 
			e.stopPropagation();
			e.preventDefault(); 			
		}
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

let jsClassRoom = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoom = new JSClassRoom(credMan);
});