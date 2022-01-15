import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardTeacher}				from '../component/displayBoardTeacher.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'
import {PageUtil}							from '../core/util.js';

const TA_CODE_INPUT_CONSOLE = "yt_coding_board";
const TA_RESULT_CONSOLE = "yt_result_console";
const VD_VIEDO_AREA = "yt_video_area";
const BTN_SYNC_BOARD = "yt_btn_sync_board"; 
const BTN_MODE_CHANGE = 'yt_btn_switch_mode';
const BTN_ERASE_BOARD  = 'yt_btn_erase_board';
const BTN_ERASE_RESULT = "yt_btn_erase_result";
const BTN_RUN_CODE  = "yt_btn_run_code_on_student_board";
 
/**
	This class handles JS Code runner board
**/
class JSClassRoomTeacher extends ProgrammingClassCommandUI {
	#displayBoardTeacher;
	
    constructor(credMan) {
		super(credMan, TA_CODE_INPUT_CONSOLE, TA_RESULT_CONSOLE, VD_VIEDO_AREA);
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
		const paramMap = PageUtil.getUrlParameterMap();
		const clssName = paramMap.get(sysConstants.UPN_GROUP);
		//const clssName = 'JS 101 Test';
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
		$(this.runCodeButton).click(this.handleRunCode.bind(this));
		
		$(this.eraseBoardButton).click(this.handleEraseBoard.bind(this));
		$(this.eraseResultButton).click(this.handleEraseResult.bind(this));
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
		super.runCodeFromTextInput();
		
		/*
		const codeStr = $(this.codeInputTextArea).val();
		this._jsCodeExecutioner.executeCode(codeStr);
		*/
		
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
	handleEraseBoard(e) {
		e.preventDefault();
		$(this.codeInputTextArea).val('');
	}
	
	/*
		Clear text from the output console.
	 */
	handleEraseResult(e) {
		e.preventDefault();
		$(this.resultConsoleControl).val('');
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
	
	// button for erasing text from board
	get eraseBoardButton() {
		return `#${BTN_ERASE_BOARD}`;
	}
	
	// button for RUN code
	get runCodeButton() {
		return `#${BTN_RUN_CODE}`;
	}
	
	// button for SWITCHING mode
	get modeChangeButton() {
		return `#${BTN_MODE_CHANGE}`;
	}
	
	// button for SWITCHING mode
	get eraseResultButton() {
		return `#${BTN_ERASE_RESULT}`;
	}
}

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoomTeacher = new JSClassRoomTeacher(credMan);
});