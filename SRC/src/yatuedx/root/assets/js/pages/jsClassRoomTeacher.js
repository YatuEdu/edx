import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardTeacher}				from '../component/displayBoardTeacher.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'

const TA_CODE_INPUT_CONSOLE = "yt_coding_board";
const TA_RESULT_CONSOLE = "yt_result_console";
const BTN_SYNC_BOARD = "yt_btn_sync_board"; 
const BTN_MODE_CHANGE = 'yt_btn_switch_mode';

/**
	This class handles JS Code runner board
**/
class JSClassRoomTeacher extends ProgrammingClassCommandUI {
	#displayBoardTeacher;
	
    constructor(credMan) {
		super(credMan, TA_RESULT_CONSOLE);
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
		$(this.codeInputTextArea).keydown(this.handleTab);
		
		// hook up event 'send code sample'
		$(this.syncBoardButton).click(this.handleSendCode.bind(this));
		
		// hook up event 'run code sample'
		$(this.modeChangeButton).click(this.handleModeChange.bind(this));
		
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
		const codeStr = $(this.codeInputTextArea).val();
		this.#displayBoardTeacher.sendCode(codeStr);
	}
	
	/**
		Run code sample on students board
	**/
	handleRunCode(e) {
		e.preventDefault(); 
		
		// run code locally first
		const codeStr = $(this.codeInputTextArea).val();
		this._jsCodeExecutioner.executeCode(codeStr);
		
		// run code for each student second
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
		let m = $(this.modeChangeButton).data(sysConstStrings.ATTR_MODE); 
		const {btnText, newMode} = this.priv_changeMode(m);
		$(this.modeChangeButton).data(sysConstStrings.ATTR_MODE, newMode); 
		$(this.modeChangeButton).text(btnText);
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
				btnText: sysConstStrings.SWITCH_TO_LEARNING, 
				newMode: PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE
			};
		}
		else if (mode == PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			obj ={
				btnText: sysConstStrings.SWITCH_TO_EXERCISE, 
				newMode: PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY
			};
			
		}
		return obj;
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
	
	/*
		properties for accessingh ui components for jquery
	 */
	 
	// result console
	get resultConsoleControl() {
		return `#${TA_RESULT_CONSOLE}`;
	}
	
	// CODE INPUT TEXT Area
	get codeInputTextArea() {
		return `#${TA_CODE_INPUT_CONSOLE}`;
	}
	
	// button for syncing code
	get syncBoardButton() {
		return `#${BTN_SYNC_BOARD}`;
	}
	
	// button for SWITCHING mode
	get modeChangeButton() {
		return `#${BTN_MODE_CHANGE}`;
	}
	
}

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoomTeacher = new JSClassRoomTeacher(credMan);
});