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
const DIV_VIEDO_AREA = "yt_div_video_area";
const DIV_STUDENT_MSG_BOARD = "yt_div_student_textarea";
const BTN_SYNC_BOARD = "yt_btn_sync_board"; 
const BTN_MODE_CHANGE = 'yt_btn_switch_mode';
const BTN_ERASE_BOARD  = 'yt_btn_erase_board';
const BTN_ERASE_RESULT = "yt_btn_erase_result";
const BTN_RUN_CODE  = "yt_btn_run_code_on_student_board";

const REPLACEMENT_TA_ID = '{taid}';
const REPLACEMENT_TA_CLSS = '{taclss}';

const TA_STUDENT_CONSOLE_PREFIX = "yt_ta_for_";
const CSS_STUDENT_CONSOLE_EX = 'student-input-board-extend';
const CSS_STUDENT_CONSOLE = 'student-input-board';

const STUDENT_BOARD_TEMPLATE = `
<textarea class="{taclss}"
		  id="{taid}" 
		  spellcheck="false"
></textarea>`; 

/**
	This class handles JS Code runner board
**/
class JSClassRoomTeacher extends ProgrammingClassCommandUI {
	#displayBoardTeacher;
	#timer;
	
    constructor(credMan) {
		super(credMan, TA_CODE_INPUT_CONSOLE, TA_RESULT_CONSOLE, DIV_VIEDO_AREA);
		this.init();
	}
	
	/**
		Execute a command 
	**/
	v_execute(cmdObject) {
		switch(cmdObject.id) {
			// new student arrived, add a comm console
			case PTCC_COMMANDS.PTC_STUDENT_ARRIVAL:
				this.addStudentConsole(cmdObject.data[0]);
				break;
			
			// new left, delete the student's comm console
			case PTCC_COMMANDS.PTC_STUDENT_LEAVE:
				this.deleteStudentConsole(cmdObject.data[0]);
				break;
			
			// update the student code console for code from each student
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.updateStudentCode(cmdObject.data);
				break;
				
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
		this.setMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// accept tab and insert \t
		this.setTabHandler();
		
		// hook up event 'send code sample'
		$(this.syncBoardButton).click(this.handleSendCode.bind(this));
		
		// hook up event 'run code sample'
		$(this.modeChangeButton).click(this.handleModeChange.bind(this));
		
		// hook up event 'change class mode'
		$(this.runCodeButton).click(this.handleRunCode.bind(this));
		
		$(this.eraseBoardButton).click(this.handleEraseBoard.bind(this));
		$(this.eraseResultButton).click(this.handleEraseResult.bind(this));
		
		// close the viedo (if any) when closing the window
		window.unload = this.handleLeaving.bind(this);
	}

	/**
		Add student Console for receiving student message and coding text
	 **/
	addStudentConsole(student) {
		if ($(this.stdentTextAreaDiv).find(this.getStudentConsoleIdSelector(student)).length) {	
			return;
		}
		
		// add student console
		const sconsoleHtml = STUDENT_BOARD_TEMPLATE
								.replace(REPLACEMENT_TA_CLSS, CSS_STUDENT_CONSOLE)
								.replace(REPLACEMENT_TA_ID, this.getStudentConsoleId(student));
		$(this.stdentTextAreaDiv).append(sconsoleHtml);
		
		// handle clicking event
		 $(this.getStudentConsoleIdSelector(student)).click(this.toggleStudentConsole);
		
	}
	
	/**
		Delete student Console when he leaves.  This is not totally reliable for now.
	 **/
	 deleteStudentConsole(student) {
		//$(this.getStudentConsoleIdSelector(student)).remove();
	}
	
	/**
		When the student console is clicked,  toggle bewtween a min / max sized console.
	 **/
	toggleStudentConsole(e) {
		e.preventDefault(); 
		if ($(this).hasClass( CSS_STUDENT_CONSOLE)) {
			$(this).removeClass(CSS_STUDENT_CONSOLE);
			$(this).addClass(CSS_STUDENT_CONSOLE_EX);
		}
		else {
			$(this).removeClass(CSS_STUDENT_CONSOLE_EX);
			$(this).addClass(CSS_STUDENT_CONSOLE);
		}
	}
	
	/**
		Got student code and save it to student consle so that a teacher knows what his student is doing.
		The data consists of:
		 1) upadarte id
		 2) update content
		 3) from which student user
	 **/
	updateStudentCode(data) {
		const how = data[0];
		const delta = data[1];
		const fromStudent = data[2];
		const studentCurrentCode = $(this.getStudentConsoleIdSelector(fromStudent)).val();
		
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const newCode = ProgrammingClassCommandUI.updateContentByDifference(how, studentCurrentCode, delta);
		
		// update the code for this student on UI
		$(this.getStudentConsoleIdSelector(fromStudent)).val(newCode);
	}
	
	/**
		Execute when timer is triggered.  Call updateCodeBufferAndSync
	**/
	v_handleTimer() {
		this.updateCodeBufferAndSync();
	}
	
	/**
		Update code buffer sample and sync with students
	**/
	updateCodeBufferAndSync() {
		console.log('JSClassRoomTeacher.updateCodeBufferAndSync called');
		const codeUpdateObj = this.updateCode(this.code); 
		this.#displayBoardTeacher.updateCodeBufferAndSync(codeUpdateObj);
	}
	
	/**
		Send code sample to students
	**/
	handleSendCode(e) {
		e.preventDefault(); 
		this.#displayBoardTeacher.sendCode(this.code);
	}
	
	/**
		Run code sample on students board
	**/
	handleRunCode(e) {
		e.preventDefault(); 
		
		// run code locally first
		super.runCodeFromTextInput();
		
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
			this.startOrStopCodeRefreshTimer(true);
			obj = {
				btnText: sysConstStrings.SWITCH_TO_EXERCISE, 
				newMode: PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE
			};
		}
		else if (mode == PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			this.startOrStopCodeRefreshTimer(false);
			obj ={
				btnText: sysConstStrings.SWITCH_TO_LEARNING, 
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
		Closing the video sharing upon closing the window
	 */
	handleLeaving(e) {
		debugger;
		e.preventDefault();
		
		// clear timer
		this.startOrStopCodeRefreshTimer(false);
		
		// clase window
		this.#displayBoardTeacher.closeWinodw();
	}
	
	/*
		properties for accessingh ui components for jquery
	 */
	 
	// result console
	get resultConsoleControl() {
		return `#${TA_RESULT_CONSOLE}`;
	}
	
	// student text Area div
	get stdentTextAreaDiv() {
		return `#${DIV_STUDENT_MSG_BOARD}`;
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
	
	// student consol it getter
	getStudentConsoleId(student) {
		return `${TA_STUDENT_CONSOLE_PREFIX}${student}`; 
	}
	
	getStudentConsoleIdSelector(student) {
		return `#${this.getStudentConsoleId(student)}`; 
	}
	
}

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoomTeacher = new JSClassRoomTeacher(credMan);
});