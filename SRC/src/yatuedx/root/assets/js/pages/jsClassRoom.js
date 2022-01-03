import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardForCoding}				from '../component/displayBoardForCoding.js'
import {JSCodeExecutioner}					from '../component/jsCodeExecutioner.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from '../command/programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'

const TAB_STRING = "\t";

const YT_CONSOLE_ID = "yt_console";

/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	
	#displayBoardForCoding;
	#jsCodeExecutioner;
	
    constructor(credMan) {
		super();
		this.init();
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		switch(cmd.id) {
			// display formated code sample on board
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH:
				this.displayCodeSample(cmd.data[0]);
				break;
			
			// run code sample and show result on console
			case PTCC_COMMANDS.PTC_CODE_RUN:
				this.runCodeFrom(cmd.data[0]);
				break;
			default:
				break;
		}
	}
	
	/**
		Display JS Code Smaple on the Whiteboard
	**/	
	displayCodeSample(codeHtml) {
		$("#yt_formatted_code_display_board").html(codeHtml);
	}
	
	/**
		Run JS Code Smaple and print results on the Console
	**/
	runCodeFrom(codeText) {
		this.#jsCodeExecutioner.executeCode(codeText);
	}
	
	// hook up events
	async init() {
		const clssName = 'JS 101 Test'; // TODO: fetch class name from URL:
		this.#displayBoardForCoding = new DisplayBoardForCoding(clssName, this);
		
		// accept tab and insert \t when tab key is hit by user
		// note that we do not want to bind this handler the "this" class
		$("#yt_input_area").keydown(this.handleTab);
		
		// initializing code executioner
		this.#jsCodeExecutioner =  new JSCodeExecutioner(YT_CONSOLE_ID);
		
		// hook up event handleRun  to run code locally in learning "exercise mode"
		$("#bt_white_board_run").click(this.handleRun.bind(this));
		
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
		$("#bt_console_clear").click(this.handleClearConsole.bind(this));
		$("#bt_white_board_send").click(this.handleSend.bind(this));
	}
	
	/**
		Hnandle tab by insertng \t
	**/
	handleRun(e) {
		e.preventDefault(); 
		//TODO: obtain coding from local "exercise board"
		this.#jsCodeExecutioner.executeCode("print('hello world')");
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
		Send program to the group.
	 */
	handleSend(e) {
		e.preventDefault();
		const srcTxt = $("#ta_white_board").val();
		this.print_prv("sending ...");
	}
}

let jsClassRoom = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoom = new JSClassRoom(credMan);
});