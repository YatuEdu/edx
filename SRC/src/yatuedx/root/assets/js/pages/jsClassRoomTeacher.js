import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {Net}			    				from "../core/net.js"
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardTeacher}				from '../component/displayBoardTeacher.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'
import {PageUtil, StringUtil, TimeUtil}		from '../core/util.js';

const TA_CODE_INPUT_CONSOLE = "yt_coding_board";
const TA_RESULT_CONSOLE 	= "yt_result_console";
const DIV_VIEDO_AREA 		= "yt_div_video_area";
const BTN_SHARE_SCREEN 		= "yt_btn_share_screen";
const DIV_STUDENT_MSG_BOARD = "yt_div_student_textarea";
const DIV_MSG_RECEIVER_SEL  = "yt_div_msg_receiver_select";
const TA_NOTES				= "yt_txt_notes_console";
const BTN_SAVE_NOTES		= "yt_btn_save_notes";
const BTN_SYNC_BOARD 		= "yt_btn_sync_board"; 
const BTN_MODE_CHANGE 		= 'yt_btn_switch_mode';
const BTN_ERASE_BOARD  		= 'yt_btn_erase_board';
const BTN_ERASE_RESULT 		= "yt_btn_erase_result";
const BTN_BEAUTIFY_CODE 	= "yt_btn_btfy_code"
const BTN_RUN_CODE  		= "yt_btn_run_code_on_student_board";
const BTN_MSG_SEND			= "yt_btn_msg_send";
const SEL_MSG_RECEIVER		= "select_option_msg_rcvr";

const REPLACEMENT_TA_ID = '{taid}';
const REPLACEMENT_TA_CLSS = '{taclss}';
const REPLACEMENT_LB = '{lb}';

const TA_STUDENT_CONSOLE_PREFIX = "yt_ta_for_";
const CSS_STUDENT_CONSOLE_EX = 'student-input-board-extend';
const CSS_STUDENT_CONSOLE = 'student-input-board';

const STUDENT_BOARD_TEMPLATE = `
<label>{lb}</lable>
<textarea class="{taclss}"
		  id="{taid}" 
		  spellcheck="false"
		  placeholder="Enter Code Here"></textarea>`; 

const MSG_RECEIVER_SELECTION_TEMPLATE = `
  <label class="form-label">Message receiver:</label>
  <select class="form-select form-control-lg" id="select_option_msg_rcvr">
	{opt_body}
  </select>
`;

const MSG_RECEIVER_OPTION_TEMPLATE = `
<option value="{nm}">{nm}</option>
`;
/**
	This class handles JS Code runner board
**/
class JSClassRoomTeacher extends ProgrammingClassCommandUI {
	#displayBoardTeacher;
	#timer;
	
    constructor(credMan) {
		super(credMan, TA_CODE_INPUT_CONSOLE, TA_RESULT_CONSOLE, DIV_VIEDO_AREA, BTN_SHARE_SCREEN);
		this.init();
	}
	
	// hook up events
	async init() {
		const paramMap = PageUtil.getUrlParameterMap();
		this.groupId = paramMap.get(sysConstants.UPN_GROUP);
		//const clssName = 'JS 101 Test';
		this.#displayBoardTeacher = new DisplayBoardTeacher(this.groupId, this);
		
		// set mode to teaching mode
		this.setMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// accept tab and insert \t
		this.setTabHandler();
		
		// hook up event 'send code sample'
		$(this.syncBoardButton).click(this.handleSyncBoard.bind(this));
		
		// hook up event 'save notes;
		$(this.saveNotesButton).click(this.handleSaveNotes.bind(this));

		// hook up event 'run code sample'
		$(this.modeChangeButton).click(this.handleModeChange.bind(this));
		
		// hook up event 'change class mode'
		$(this.runCodeButton).click(this.handleRunCode.bind(this));
		
		$(this.eraseBoardButton).click(this.handleEraseBoard.bind(this));
		$(this.eraseResultButton).click(this.handleEraseResult.bind(this));
		$(this.msgSendButton).click(this.handleMsgSend.bind(this));
		
		// close the viedo (if any) when closing the window
		window.unload = this.handleLeaving.bind(this);
		
		// load teacher's notes from previous classes
		this.loadNotes();
	}
	
	/**
		Execute a command 
	**/
	v_execute(cmdObject) {
		switch(cmdObject.id) {
			// NEW message from student
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:
				this.handleStudentMsg(cmdObject.data[0], cmdObject.sender);
				break;
			
			// new student arrived, add a comm console
			case PTCC_COMMANDS.PTC_STUDENT_ARRIVAL:
				this.addStudentConsole(cmdObject.data[0]);
				break;
			
			// new left, delete the student's comm console
			case PTCC_COMMANDS.PTC_STUDENT_LEAVE:
				this.deleteStudentConsole(cmdObject.data[0]);
				break;
				
			// got a list of current users that are alreay in the chat room:
			case PTCC_COMMANDS.PTC_USER_LIST:
				this.addStudentConsoles(cmdObject.data[0]);
				break;
			
			// update the student code console for code from each student
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.updateStudentCode(cmdObject.data, cmdObject.sender);
				break;
			
			// Sync with a student whose code is out of sync with teacher
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
				this.syncCodeWithStudent(cmdObject);
				break;
				
			default:
				break;
		}
	}

	/**
		Load teacher's notes for the class from backend
	 **/
	async loadNotes() {
		const resp = await Net.classGetNotes(credMan.credential.token,this.groupId);
		let notes = '';
		if (resp.data.length > 0) {
			resp.data.forEach(n => {
				const seq = n.sequenceId ?? 0;
				const date = TimeUtil.sqlDateToJsDate(n.time);
				const dateStr = date.toDateString();
				const note = `${n.notes} [class(${seq}) at ${dateStr}]\n`;
				notes += note;
			});
			$(this.notesConsoleControl).val(notes);
		}
	}
	
	/**
		Add student Console for a list of students already in the room
	 **/
	addStudentConsoles(userList) {
		let msgReceiverDropdown = '';
		let msgReceiverNames = '';
		for(let u of userList) {
			const userName = u.userName;
			if (userName.localeCompare(this.#displayBoardTeacher.me) != 0) {
				this.addStudentConsole(userName);
				msgReceiverNames += 
						MSG_RECEIVER_OPTION_TEMPLATE
							.replace(new RegExp('{nm}', 'g'), userName);
			}
		}
		// add message receiver dropdown
		msgReceiverDropdown  = MSG_RECEIVER_SELECTION_TEMPLATE
									.replace('{opt_body}', msgReceiverNames);
		$(this.msgReceiverSelect).html(msgReceiverDropdown);
	}
	
	/**
		Recieved student incoming messages, display it with student name included
	 **/
	handleStudentMsg(data, sender) {
		const msg = `${data} (from ${sender})`;
		$("#yt_txt_msg_console").val(msg);
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
								.replace(REPLACEMENT_LB, student)
								.replace(REPLACEMENT_TA_CLSS, CSS_STUDENT_CONSOLE)
								.replace(REPLACEMENT_TA_ID, this.getStudentConsoleId(student));
		$(this.stdentTextAreaDiv).append(sconsoleHtml);
		
		// handle clicking event
		$(this.getStudentConsoleIdSelector(student)).click(this.toggleStudentConsole);	
	}
	
	/**
		Sync code with one student 
	 **/
	syncCodeWithStudent(cmdObject) {
		this.#displayBoardTeacher.syncCodeWithRequester(this.code, cmdObject.sender);
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
	updateStudentCode(how, student) {
		const studentCurrentCode = $(this.getStudentConsoleIdSelector(student)).val();
		
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ProgrammingClassCommandUI.updateContentByDifference(how, studentCurrentCode);
		
		// update the code on UI
		if (!newContent) {
			return;  // no need to validate
		}
		
		// verify the digest if it is present
		let shouldUpdate = true;
		if (digest) {
			if (!StringUtil.verifyMessageDigest(newContent, digest)) { 
				shouldUpdate = false;
				console.log('content not verified, asking for re-sync');
				this.#displayBoardTeacher.askReSync(student);
			}
		}
		else {
			console.log('No digest available');
		}
		
		// update the code for this student on UI
		if (shouldUpdate) {
			$(this.getStudentConsoleIdSelector(student)).val(newContent);
		}
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
		if (codeUpdateObj) {
			this.#displayBoardTeacher.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
	/**
		Copy code sample as all to students
	**/
	handleSyncBoard(e) {
		e.preventDefault(); 
		const codeUpdateObj = this.syncCode(this.code); 
		if (codeUpdateObj) {
			this.#displayBoardTeacher.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
	/**
		Save notes to DB: THE NOTES ARE FROM CONSOLE OUTPUT
	**/	
	async handleSaveNotes(e) {
		e.preventDefault(); 
		const notes = $(this.resultConsoleControl).val();
		await Net.classUpdateNotes(credMan.credential.token,this.groupId, notes);
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
		const newMode = this.switchMode();
		// send the command to peers
		this.#displayBoardTeacher.setMode(newMode);
	}
	
	/**
		Switch students board mode
	**/
	switchMode() {
		// current mode:
		let currentModeStr = $(this.modeChangeButton).data(sysConstStrings.ATTR_MODE); 
		const newMode = this.priv_changeMode(currentModeStr);
		return newMode;
	}
	
	/**
		Mode switching
	**/
	priv_changeMode(currentModeStr) {
		const currentMode =  parseInt(currentModeStr, 10);
		let newMode;
		if ( currentMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			newMode = PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE;
		}
		else if (currentMode == PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			newMode = PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY;	
		}
		this.setMode(newMode);
		return newMode;
	}
	
	/**
		Direct mode setting
	**/
	setMode(newMode) {
		$(this.modeChangeButton).data(sysConstStrings.ATTR_MODE, newMode); 
		if ( newMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			$("#yt_div_switch_mode").html(sysConstStrings.SWITCH_TO_EXERCISE);
			this.startOrStopCodeRefreshTimer(true);
		}
		else if (newMode == PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			$("#yt_div_switch_mode").html(sysConstStrings.SWITCH_TO_LEARNING);
			this.startOrStopCodeRefreshTimer(false);	
		}
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
		Send message to the selected user
	 */
	handleMsgSend(e) {
		const targetUser = $(this.msgReceiverDropdown).text();	
		const msg = $(this.resultConsoleControl).val();
		this.#displayBoardTeacher.sendPrivateMsg(msg, targetUser);
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
	
	// techer notes for this class
	get notesConsoleControl() {
		return `#${TA_NOTES}`;
	}
	
	// student text Area div
	get stdentTextAreaDiv() {
		return `#${DIV_STUDENT_MSG_BOARD}`;
	}
	
	// MESSAGE RECEIVER div
	get msgReceiverSelect() {
		return `#${DIV_MSG_RECEIVER_SEL}`;
	}
		
	// button for saving notes
	get saveNotesButton() {
		return `#${BTN_SAVE_NOTES}`;
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
	
	// button for sending message
	get msgSendButton() {
		return `#${BTN_MSG_SEND}`;
	}
	 
	// button for BEAUTIFY code mode
	get beautifyCodeButton() {
		return `#${BTN_BEAUTIFY_CODE}`;
	}
	
	// student consol it getter
	getStudentConsoleId(student) {
		return `${TA_STUDENT_CONSOLE_PREFIX}${student}`; 
	}
	
	getStudentConsoleIdSelector(student) {
		return `#${this.getStudentConsoleId(student)}`; 
	}
	
	// MESSAGE RECEIVER dropdown
	get msgReceiverDropdown() {
		return `#${SEL_MSG_RECEIVER} option:selected`; 
	}
	
}

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoomTeacher = new JSClassRoomTeacher(credMan);
});