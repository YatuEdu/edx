import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardTeacher}				from '../component/displayBoardTeacher.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from '../command/programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'

const TAB_STRING = "\t";
const MODE_CHANGE_CONTROL = '#yt_switch_mode';
const MODE_ATTR = 'mode';

/**
	This class handles JS Code runner board
**/
class JSClassRoomTeacher extends ProgrammingClassCommandUI {
	#displayBoardTeacher;
	
    constructor(credMan) {
		super();
		this.init();
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		const cmdObject = new IncomingCommand(cmd);
		switch(cmdObject.id) {
			default:
				break;
		}
	}
	
	// hook up events
	async init() {
		const clssName = 'JS 101 Test';
		this.#displayBoardTeacher = new DisplayBoardTeacher(clssName, this);
		
		// set mode to teaching mode
		this.setMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READ_ONLY);
		
		// accept tab and insert \t
		$("#yt_coding_board").keydown(this.handleTab);
		
		// hook up event 'send code sample'
		$("#yt_sync_board").click(this.handleSendCode.bind(this));
		
		// hook up event 'run code sample'
		$(MODE_CHANGE_CONTROL).click(this.handleModeChange.bind(this));
		
		// hook up event 'change class mode'
		$("#yt_run_code_on_student_board").click(this.handleRunCode.bind(this));
		
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
		$("#bt_console_clear").click(this.handleClearConsole.bind(this));
		$("#bt_white_board_send").click(this.handleSend.bind(this));
	}
	
	/**
		Send code sample to students
	**/
	handleSendCode(e) {
		e.preventDefault(); 
		const codeStr = $("#yt_coding_board").val();
		this.#displayBoardTeacher.sendCode(codeStr);
	}
	
	/**
		Run code sample on students board
	**/
	handleRunCode(e) {
		e.preventDefault(); 
		this.#displayBoardTeacher.runCode();
	}
	
	/**
		Change class mode for all the attending students
	**/	
	handleModeChange(e) {
		e.preventDefault(); 
		const m = this.setMode();
		// send the command to peers
		this.#displayBoardTeacher.setMode(m);
	}
	
	/**
		Set students board mode
	**/
	setMode() {
		// current mode:
		let m = $(MODE_CHANGE_CONTROL).data(MODE_ATTR); 
		const {btnText, newMode} = this.priv_changeMode(m);
		$(MODE_CHANGE_CONTROL).data(MODE_ATTR, newMode); 
		$(MODE_CHANGE_CONTROL).text(btnText);
		return newMode;
	}
	
	/**
		Mode switching
	**/
	priv_changeMode(m) {
		const mode =  parseInt(m, 10);
		let obj = {};
		if ( mode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			obj = {
				btnText: sysConstStrings.SWITCH_TO_EXERCISE, 
				newMode: PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE
			};
		}
		else if (mode == PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			obj ={
				btnText: sysConstStrings.SWITCH_TO_LEARNING, 
				newMode: PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY
			};
			
		}
		return obj;
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

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoomTeacher = new JSClassRoomTeacher(credMan);
});