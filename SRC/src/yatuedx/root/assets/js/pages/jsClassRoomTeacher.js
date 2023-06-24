import {sysConstants, sysConstStrings, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {Net}			    				from "../core/net.js"
import {uiMan} 								from '../core/uiManager.js';
import {PageUtil, StringUtil, TimeUtil}		from '../core/util.js';
import {DisplayBoardTeacher}				from '../component/displayBoardTeacher.js'
import {STUDENT_BOARD_TEMPLATE}				from '../component/studentCommCard.js';
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {IncomingCommand}					from '../command/incomingCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {CodeInputConsole}					from '../component/new/codeInputConsole.js';

const DIV_VIEDO_AREA 					= "yt_div_video_area";
const BTN_SHARE_SCREEN 					= "yt_btn_share_screen";
const DIV_STUDENT_AREA_ID 				= "yt_div_student_area_";
const DIV_STUDENT_MSG_BOARD 			= "yt_div_students_area";
const DIV_MSG_RECEIVER_SEL  			= "yt_div_msg_receiver_select";
const TA_NOTES							= "yt_txt_notes_console";
const YT_BTN_MSG_SEND					= 'yt_btn_msg_send';
const BTN_SAVE_NOTES					= "yt_btn_save_notes";
const BTN_SYNC_BOARD 					= "yt_btn_sync_board"; 
const BTN_MODE_CHANGE 					= 'yt_btn_switch_mode';
const BTN_ERASE_BOARD  					= 'yt_btn_erase_board';
const BTN_ERASE_RESULT 					= "yt_btn_erase_result";
const BTN_BEAUTIFY_CODE 				= "yt_btn_check_clean_code"
const BTN_RUN_CODE  					= "yt_btn_run_code_on_student_board";
const SEL_MSG_RECEIVER					= "select_option_msg_rcvr";
const STUDENT_MESAGE_BUTTON_PREFIX 		= "yt_btn_std_msg_";
const STUDENT_MESAGE_CONTAINER_PREFIX 	= "yt_div_std_msg_ctnr_";
const STUDENT_MESAGE_SEND_BUTTON_PREFIX = "yt_btn_std_msg_send_";
const STUDENT_MESAGE_TA_PREFIX 			= 'yt_ta_std_msg_';
const TEACHER_MESAGE_TA_PREFIX 			= 'yt_ta_tchr_msg_';
const YT_DIV_CODE_EDITOR				= "yt_div_code_editor";
const YT_TA_CODE_BOARD_ID 				= "yt_ta_code_board";
const YT_TA_OUTPUT_CONSOLE_ID 			= "yt_ta_output_console";


const REPLACEMENT_STUDENT_AREA_ID = '{std_area_id}';
const REPLACEMENT_TA_ID = '{taid}';
const REPLACEMENT_TA_CONTAINER_ID = '{console_ctnr_id}'
const REPLACEMENT_LB = '{lb}';
const REPLACEMENT_STUDENT_ID = '{stdtgid}';
const REPLACEMENT_STUDENT_ID2 = '{stdtgid2}';
const REPLACEMENT_STUDENT_MSG_BTN_ID =  '{stdt_msg_btn_id}';
const REPLACEMENT_CLOSE_BTN_ID =  '{btn_close}';
const REPLACEMENT_TA_MSG_CONTAINER_ID = '{msg_ctnr_id}'
const REPLACEMENT_BTN_MSG_SEND_ID = '{msg_send_btn_id}';
const REPLACEMENT_TA_MSG_ID = '{std_msg_ta_id}';
const REPLACEMENT_TA_TCHR_MSG_ID = '{tchr_msg_ta_id}';

const TA_STUDENT_CONSOLE_PREFIX = "yt_stdf_inpt_ta_for_";
const TA_STUDENT_CONSOLE_CONTAINER_PREFIX = "yt_stdt_inpt_ta_ctnr_div_for_";
const BTN_CONSOLE_CLOSE_PREFIX = 'yt_btn_close_student_board';

const CSS_STUDENT_COMM_NO_TEXT = 'btn-mail-box-dimention-teacher';
const CSS_STUDENT_COMM_WITH_TEXT = 'btn-mail-box-with-msg';
const CSS_STUDENT_CONSOLE_HIDE_BTN = 'student-input-board-button-close';

const STUDENT_TOGGLE_BUTTON_MAX = "Code";
const STUDENT_MESSAGE_BUTTON_MAX = "Message";
const STUDENT_TOGGLE_BUTTON_MIN = "Hide";

const STUDENT_TOGGLE_BUTTON_TEMPLATE = 'yt_bt_student_console_toggle_';
const STUDENT_RUN_BUTTON_TEMPLATE = 'yt_bt_student_console_code_run_';

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
	#codeInputConsoleComponent;
	
	/* 
	 static facotry method for JSClassRoomTeacher to assure that it calls its
	 async init method.
	 */
	 static async createJSClassRoomTeacher() {
		const myInstance = new JSClassRoomTeacher();
		await myInstance.init();
		return myInstance;
	}

    constructor() {
		super(YT_TA_CODE_BOARD_ID, YT_TA_OUTPUT_CONSOLE_ID, DIV_VIEDO_AREA, BTN_SHARE_SCREEN);
	}
	
	// hook up events
	async init() {
		await super.init();
		const paramMap = PageUtil.getUrlParameterMap();
		
		this.#displayBoardTeacher = 
						await DisplayBoardTeacher.createDisplayBoardTeacher(
										this.liveSession, this);
											
		// create component for code input / editor
		this.#codeInputConsoleComponent = new CodeInputConsole(
					"", 
					YT_DIV_CODE_EDITOR, 
					YT_DIV_CODE_EDITOR, 
					YT_TA_CODE_BOARD_ID, 
					YT_TA_OUTPUT_CONSOLE_ID
		);
		
		
		// set mode to teaching mode
		this.setMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// accept tab and insert \t
		this.setTabHandler();
		
		// handle key up 
		$(this.codeInputTextArea).mouseup(this.handleMouseUp.bind(this));

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
		$(this.beautifyCodeButton).click(this.handleCodeBeautify.bind(this));

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
		const resp = await Net.classGetNotes(credMan.credential.token,this.liveSession.class_id);
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
	}
	
	/**
		Handle mouse up event by getting the text selection and pass the selection info to peers
	**/
	handleMouseUp(e) {
		e.preventDefault(); 
		e.stopPropagation();
		const {begin, end} = this.getSelection();
		if (typeof(begin) != "undefined" && typeof(end) != "undefined" && begin != end) {
			this.#displayBoardTeacher.setSelection(begin, end);
		}
	}
	
	/**
		Recieved student incoming messages, display it with student name included
	 **/
	handleStudentMsg(data, sender) {
		const msg = data;
		
		// 1. make message button green 
		const msgBtnSelector = this.getStudentMessageButtonSelector(sender);
		if (msgBtnSelector) {			
			this.toggleStudentButtonInner(msgBtnSelector, true);
			
			// 2. insert message to student message board
			const msgConsoleSelector =  this.getStudentMessageTaIdSelector(sender);
			$(msgConsoleSelector).val(msg);
		}		
	}
	
	/**
		Add student Console for receiving student message and coding text
	 **/
	addStudentConsole(student) {
		// add an area to contain student's video and blackboard
		if (0 === $(this.stdentsTextAreaDivSelecotr).find(this.getStudentAreaId(student)).length) {	
			// add student console
			const sconsoleHtml = STUDENT_BOARD_TEMPLATE
				.replace(REPLACEMENT_STUDENT_AREA_ID, this.getStudentAreaId(student))
				.replace(REPLACEMENT_LB, student)
				.replace(REPLACEMENT_TA_CONTAINER_ID, this.getStudentConsoleContainerId(student))
				.replace(REPLACEMENT_TA_ID, this.getStudentConsoleId(student))
				.replace(REPLACEMENT_STUDENT_ID, this.getstudentConsoleToggleButton(student))
				.replace(REPLACEMENT_STUDENT_ID2, this.getstudentRunCodeButton(student))
				.replace(REPLACEMENT_STUDENT_MSG_BTN_ID, this.getStudentMessageButtonId(student))
				.replace(REPLACEMENT_TA_MSG_CONTAINER_ID, this.getStudentMessageContainerId(student))
				.replace(REPLACEMENT_BTN_MSG_SEND_ID, this.getStudentMessageSendBtnId(student))
				.replace(REPLACEMENT_TA_MSG_ID, this.getStudentMessageTaId(student))
				.replace(REPLACEMENT_TA_TCHR_MSG_ID, this.getTeacherMessageTaId(student));

			$(this.stdentsTextAreaDivSelecotr).append(sconsoleHtml);
			
			// handle toggle code console event
			$(this.getstudentConsoleToggleButtonSelector(student)).click(this.showStudentConsole.bind(this));	
			
			// handle run-code clicking event
			$(this.getstudentConsoleRunCodeButtonSelector(student)).click(this.runStudentCode.bind(this));	
			
			// handle toggle message button event
			$(this.getStudentMessageButtonSelector(student)).click(this.showStudentMessageContainer.bind(this));	
			
			// handle hide student board click
			$(this.StudentBoardHideButtoncClassSelector).click(this.hideStudentContainer.bind(this));	

			// handle sending message to student
			$(this.getStudentMessageSendBtnIdSelector(student)).click(this.sendMessageToStudent.bind(this));
		}
		// set class mode for the new student 
		const currentModeStr = $(this.modeChangeButton).data(sysConstStrings.ATTR_MODE); 
		this.#displayBoardTeacher.setMode(currentModeStr, student);
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
		const id = this.getStudentAreaIdSelector(student);
		$(id).remove();
	}
	
	/**
		When the student has text in their console,  make its background green. Otherwise black.
	 **/
	toggleStudentButton(student, hasCode) {	
		// get student button id
		const selector = this.getstudentConsoleToggleButtonSelector(student)
		this.toggleStudentButtonInner(selector, hasCode);
	}
	
	toggleStudentButtonInner(selector, hasMsg) {		
		// toggle button style by CSS toggle
		if (hasMsg) {
			$(selector).addClass(CSS_STUDENT_COMM_WITH_TEXT);
		}
		else {
			$(selector).removeClass(CSS_STUDENT_COMM_WITH_TEXT);
		}
	}
	
	/**
		When the student message board show/hide button is clicked,  toggle bewtween a min / max sized console.
	 **/
	showStudentConsole(e) {
		e.preventDefault(); 
		e.stopPropagation();
		
		// get student name
		const student = StringUtil.getIdStrFromBtnId(e.target.id);
		// get student console Id
		const containerSelector = this.getStudentConsoleContainerIdSelector(student);
		const btnSelector = '#' + e.target.id;
		
		// show code console
		this.showContainer(containerSelector);
		
		// make message btn non-flashing
		this.toggleStudentButtonInner(btnSelector, false); 
	}
	
	/**
		When the student message board show/hide button is clicked,  toggle bewtween a min / max sized message board.
	 **/
	showStudentMessageContainer(e) {
		e.preventDefault(); 
		e.stopPropagation();
		
		// get student name
		const student = StringUtil.getIdStrFromBtnId(e.target.id);
		const btnSelector = '#' + e.target.id;
		
		// get student console Id
		const containerSelector = this.getStudentMessageContainerIdSelector(student);
		this.showContainer(containerSelector);
		
		// make message btn non-flashing
		this.toggleStudentButtonInner(btnSelector, false);
	}
	
	/**
		When the student message board hide button is clicked,  close its parent container.
	 **/
	hideStudentContainer(e) {
		// 1. get parent
		$(`#${event.target.parentElement.id}`).hide();
	}
	
	/**
		Internal method to  toggle bewtween a min / max sized code/message board.
	 **/
	showContainer(containerSelector) {
		// toggle console size by CSS toggle
		if (!$(containerSelector).is(":visible")) {
			$(containerSelector).show();
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
		let shouldUpdate = false;
		while (true) {		
			// update the code on UI
			if (!newContent) {
				// no new content, brek out of while loop 
				break;  
			}
			
			// verify the digest if it is present
			if (digest) {
				if (!StringUtil.verifyMessageDigest(newContent, digest)) { 
					console.log('content not verified, asking for re-sync');
					this.#displayBoardTeacher.askReSync(student);
				} else {
					shouldUpdate = true;
				}
			}
			else {
				console.log('No digest available');
			}
			
			// update the code for this student on UI
			if (shouldUpdate) {
				$(this.getStudentConsoleIdSelector(student)).val(newContent);
			}
			
			// break out of the while loop normally
			break;
		}
		
		// change student button to indicate that student has new code
		this.toggleStudentButton(student, shouldUpdate);

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
		await Net.classUpdateNotes(credMan.credential.token,this.liveSession.class_id, notes);
	}
	
	/**
		Run code sample on students board
	**/
	handleRunCode(e) {
		e.preventDefault(); 
		
		// run code locally first
		const errorInfo = super.runCodeFromTextInput();
		
		// run code for each student second if we are in teaching mode
		this.#displayBoardTeacher.runCode();
		
		// display error?
		if (errorInfo) {
			this.#codeInputConsoleComponent.showDiagnoticMessage(errorInfo);
		} else {
			// show output cosole
			this.#codeInputConsoleComponent.showOutput();
		}
	}
	
	/**
		Run code sample from students console
	**/
	runStudentCode(e) {
		e.preventDefault(); 
		const student = StringUtil.getIdStrFromBtnId(e.target.id);
		const codeText = $(this.getStudentConsoleIdSelector(student)).val();
		super.executeCode(codeText);
	}
	
	sendMessageToStudent(e) {
		e.preventDefault(); 
		e.stopPropagation();
		
		// Not sure why, but this event is also triggered when message text area is clicked
		// We must prevent the message sending when text area is clicked.
		if (e.target.id && 
			e.target.id.startsWith(this.getStudentMessageSendBtnId(""))) {
			const student = StringUtil.getIdStrFromBtnId(e.target.id);
			const msgText = $(this.getTeacherMessageTaIdSelector(student)).val();
			if (this.#displayBoardTeacher.sendPrivateMsg(msgText, student)) {
				$(this.getTeacherMessageTaIdSelector(student)).val('');
			}
		}
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
		Beautify cdoe by calling the codeAnalyst formatting
	 */
	handleCodeBeautify(e) {
		//obtain code from local "exercise board" and execute it locally
		const result = super.formatCode();
		if (result.hasError) {
			this.#codeInputConsoleComponent.showDiagnoticMessage(result.errors);
		} else {
			$(this.codeInputTextArea).val(result.newSourc);
		}
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
		return `#${YT_TA_OUTPUT_CONSOLE_ID}`;
	}
	
	// techer notes for this class
	get notesConsoleControl() {
		return `#${TA_NOTES}`;
	}
	
	// student text Area div
	get stdentsTextAreaDivSelecotr() {
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
	 
	// button for BEAUTIFY code mode
	get beautifyCodeButton() {
		return `#${BTN_BEAUTIFY_CODE}`;
	}
	
	// student area id
	getStudentAreaId(student) {
		return `${DIV_STUDENT_AREA_ID}${student}`; 
	}
	
	getStudentAreaIdSelector(student) {
		return `#${this.getStudentAreaId(student)}`; 
	}
	
	// student console container id getter
	getStudentConsoleContainerId(student) {
		return `${TA_STUDENT_CONSOLE_CONTAINER_PREFIX}${student}`; 
	}
	
	// student console container selector getter
	getStudentConsoleContainerIdSelector(student) {
		return `#${this.getStudentConsoleContainerId(student)}`; 
	}
	
	// student console id getter
	getStudentConsoleId(student) {
		return `${TA_STUDENT_CONSOLE_PREFIX}${student}`; 
	}
	
	// button for toggle student console max/min mode
	getstudentConsoleToggleButton(student) {
		return `${STUDENT_TOGGLE_BUTTON_TEMPLATE}${student}`;
	}
	
	// button selector for toggle student console max/min mode
	getstudentConsoleToggleButtonSelector(student) {
		return `#${this.getstudentConsoleToggleButton(student)}`;
	}
	
	// button selector for button for hiding student code/message console
	get StudentBoardHideButtoncClassSelector() {
		return `.${CSS_STUDENT_CONSOLE_HIDE_BTN}`;
	}
	
	// button for running student console code locally
	getstudentRunCodeButton(student) {
		return `${STUDENT_RUN_BUTTON_TEMPLATE}${student}`;
	}
	
	// button selector for running student console code locally
	getstudentConsoleRunCodeButtonSelector(student) {
		return `#${this.getstudentRunCodeButton(student)}`;
	}
	
	// button for showing(hide) student message console
	getStudentMessageButtonId(student) {
		return `${STUDENT_MESAGE_BUTTON_PREFIX}${student}`;
	}
	
	// button selector for button which showing(hide) student message console
	getStudentMessageButtonSelector(student) {
		return `#${this.getStudentMessageButtonId(student)}`;
	}
	
	// container student message console
	getStudentMessageContainerId(student) {
		return `${STUDENT_MESAGE_CONTAINER_PREFIX}${student}`;
	}
	
	// selector for container student message console
	getStudentMessageContainerIdSelector(student) {
		return `#${this.getStudentMessageContainerId(student)}`; 
	}
	
	// button for sending messages to student
	getStudentMessageSendBtnId(student) {
		return `${STUDENT_MESAGE_SEND_BUTTON_PREFIX}${student}`;
	}
	
	// selector for button for sending messages to student
	getStudentMessageSendBtnIdSelector(student) {
		return `#${this.getStudentMessageSendBtnId(student)}`; 
	}
	
	// text area for receiving messages from student
	getStudentMessageTaId(student) {
		return `${STUDENT_MESAGE_TA_PREFIX}${student}`;
	}
	
	// selector for text area for receiving messages from student
	getStudentMessageTaIdSelector(student) {
		return `#${this.getStudentMessageTaId(student)}`; 
	}
	
	// text area for teacher to send messages to student
	getTeacherMessageTaId(student) {
		return `${TEACHER_MESAGE_TA_PREFIX}${student}`;
	}
	
	// selector for text area for teacher to send messages to student
	getTeacherMessageTaIdSelector(student) {
		return `#${this.getTeacherMessageTaId(student)}`; 
	}
		
	// selector for student code console
	getStudentConsoleIdSelector(student) {
		return `#${this.getStudentConsoleId(student)}`; 
	}
	
	// MESSAGE RECEIVER dropdown
	get msgReceiverDropdown() {
		return `#${SEL_MSG_RECEIVER} option:selected`; 
	}

	// selector for message sending button
	get sendMsgButonSelector() {
		return `#${YT_BTN_MSG_SEND}`;
	}
	
}

let jsClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "jsClassRoomTeacher page ready!" );
	jsClassRoomTeacher = await JSClassRoomTeacher.createJSClassRoomTeacher();
});