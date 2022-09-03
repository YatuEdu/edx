import {sysConstants, sysConstStrings} 		from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardForCoding}				from '../component/displayBoardForCoding.js'
import {JSCodeExecutioner}					from '../component/jsCodeExecutioner.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'
import {PageUtil, StringUtil}				from '../core/util.js';
import {Net}			    				from "../core/net.js"

const YT_TA_MSG_ID 					    	= "yt_ta_msg";
const YT_TA_MSG_INPUT_ID				    = 'yt_ta_msg_input';
const YT_TA_NOTES_ID 					    = "yt_ta_notes";
const YT_TA_OUTPUT_CONSOLE_ID 				= "yt_ta_output_console";
const YT_TA_CODE_BOARD_ID 					= "yt_ta_code_board";
const YT_BTN_RUN_CODE_ID 					= 'yt_btn_run_code_from_board';
const YT_BTN_COPY_CODE_TO_NOTES				= 'yt_btn_copy_from_board';					
const YT_BTN_CLEAR_RESULT_CODE_ID 			= 'yt_btn_clear_result';
const YT_BTN_SEARCH_NOTES					= 'yt_btn_search_notes';
const YT_BTN_MSG_SEND						= 'yt_btn_msg_send';
const VD_VIEDO_AREA 						= "yt_video_area";
const YT_TB_OUTPUT_CONSOLE					= 'yt_tb_output_console';
const YT_TB_NOTES_CONSOLE					= 'yt_tb_notes_console';
const YT_TB_MSG_CONSOLE					    = 'yt_tb_msg_console';
const YT_TB_MSG_INDICATOR					= 'yt_btn_msg_indicator';

const CSS_MSG_BOX_NO_MSG = 'btn-mail-box-no-msg';
const CSS_MSG_BOX_WITH_MSG = 'btn-mail-box-with-msg';

const TAB_LIST = [
	{tab:YT_TB_OUTPUT_CONSOLE, sub_elements: [YT_TA_OUTPUT_CONSOLE_ID, YT_BTN_CLEAR_RESULT_CODE_ID] },
	{tab:YT_TB_NOTES_CONSOLE,  sub_elements: [YT_TA_NOTES_ID, YT_BTN_SEARCH_NOTES] },
	{tab:YT_TB_MSG_CONSOLE,    sub_elements: [YT_TA_MSG_ID, YT_TA_MSG_INPUT_ID, YT_BTN_MSG_SEND] },
];

const MSG_TAB_INDX = 2;
	
/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	
	#displayBoardForCoding;
	#notes;
	#tabIndex;
	
    constructor(credMan) {
		super(credMan, YT_TA_CODE_BOARD_ID, YT_TA_OUTPUT_CONSOLE_ID, VD_VIEDO_AREA);
		this.init();
	}
	
	// hook up events
	async init() {
		this.#tabIndex = 0;
		const paramMap = PageUtil.getUrlParameterMap();
		const groupId = paramMap.get(sysConstants.UPN_GROUP);
		this.groupId = groupId;
		const teacher=paramMap.get(sysConstants.UPN_TEACHER);
		this.#displayBoardForCoding = new DisplayBoardForCoding(groupId, teacher, this);
			
		// upon initialization, student board is in "exercise" mode
		this.setClassMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// hook up event handleRun  to run code locally in learning "exercise mode"
		$(this.runCodeButton).click(this.handleRun.bind(this));
		// handle copy code to notes
		$(this.copyNotesButton).click(this.handleCopyCodeToNotes.bind(this));
		// handle erase result board
		$(this.clearResultButton).click(this.handleClearConsole.bind(this));
		// handle notes editing
		$(this.notesTextArea).blur(this.handleNeedtoUpdateNotes.bind(this));
		// handle maximize or minimize video screen
		$(this.videoScreen).click(this.toggleVideoSize);
		// switching tab to output
		$(this.outputConsoleTab).click(this.toggleTab.bind(this));
		// switching tab to notes
		$(this.notesConsoleTab).click(this.toggleTab.bind(this));
		// switching tab to msg
		$(this.msgConsoleTab).click(this.toggleTab.bind(this));
		// handle sending message to teacher
		$(this.sendMsgButon).click(this.handleSendMessage.bind(this));
		// handle message indicator clicking
		$(this.messageIndicatorBtnSelector).click(this.toggleToMegTab.bind(this));
		
		// itialize notes we saved before
		this.initNotes();
	}
	
	/**
		Execute when timer is triggered.  Call updateCodeBufferAndSync
	**/
	v_handleTimer() {
		this.updateCodeBufferAndSync();
	}
	
	/**
		Load notes from data base
	 **/
	async initNotes() {
		const resp = await Net.userGetClassNotes(credMan.credential.token, this.groupId);
		if (resp.data.length > 0) {
			const dbnotes = resp.data[0].notes;
			$(this.notesTextArea).val(dbnotes);
			this.#notes = $(this.notesTextArea).val();
		}
	}
	
	/**
		When the teacher video is clicked,  toggle bewtween a min / max sized screen.
	 **/
	toggleVideoSize(e) {
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
		toggle tag between output, notes, and etc.
	 **/
	toggleTab(e) {
		const jqTarget = $(event.target);
		let ti = jqTarget.attr('data-tabindex');
		ti = parseInt(ti, 10);
		this.prv_toggleTab(ti);
	}
	
	/**
		toggle tag between output, notes, and etc.
	 **/
	toggleToMegTab(e) {
		this.prv_toggleTab(MSG_TAB_INDX);
		
		// make the message box to be "no new message"
		const selector = $(this.messageIndicatorBtnSelector);
		this.messageIndicatorHasNoMessage(selector)
	}
	
	/**
		toggle tag between output, notes, and etc.
	 **/
	prv_toggleTab(ti) {
		if (ti != this.#tabIndex) {
			TAB_LIST.forEach( (e, i) => {
				if (i != ti) {
					$(`#${e.tab}`).removeClass('selected-tab');
					$(`#${e.tab}`).addClass('unselected-tab');
					e.sub_elements.forEach(se => {
						$(`#${se}`).hide();
					});
				}
				else {
					$(`#${e.tab}`).removeClass('unselected-tab');
					$(`#${e.tab}`).addClass('selected-tab');
					e.sub_elements.forEach(se => {
						$(`#${se}`).show();
					});
				}
			});
			this.#tabIndex = ti;
		}
		// scroll to bottom so we can see the bottom panel better
		$(window).scrollTop(300);
	}
	
	/**
		Periodically passing our code to teacher to examine student's progress.
	 **/
	updateCodeBufferAndSync() {
		console.log('JSClassRoom.updateCodeBufferAndSync called');
		const codeUpdateObj = this.updateCode(this.code); 
		if (codeUpdateObj) {
			this.#displayBoardForCoding.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		switch(cmd.id) {
			// set board mode to readonly or not
			case PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE:
				this.setClassMode(cmd.data[0]);
				break;
				
			// update the sample code
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.updateCodeSample(cmd.data);
				break;
				
			// highlight a range of text
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_HIGH_LIGHT:
				this.highlightSelection(cmd.data[0], cmd.data[1]);
				break;			
			
			// resync my code with teachwer
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
				this.syncCodeWithTeacherer(cmd);
				break;
				
			// run code sample and show result on console
			case PTCC_COMMANDS.PTC_CODE_RUN:
				this.runCodeFrom(cmd.data[0]);
				break;
				
			// GOT message from peers
			case PTCC_COMMANDS.PTC_PRIVATE_MSG:
				this.receiveMsgFrom(cmd);
				break;
				
			default:
				break;
		}
	}
	
	/**
		Sync code with teacher when teacher asks for it.
	 **/
	syncCodeWithTeacherer(cmdObject) {
		this.#displayBoardForCoding.syncCodeWithRequester(this.code, cmdObject.sender);
	}
	
	/**
		Display JS Code Smaple on the Whiteboard
	**/	
	displayCodeSample(codeData) {
		debugger;
	}
	
	/**
		Receive message from a peer by displaying the text in the message tab.
	 **/
	receiveMsgFrom(cmdObject) {
		this.displayMessage(cmdObject.data[0], cmdObject.sender);
		
		// make message indicator green
		this.toggleMessageIndicator();
	}
	
	/**
		After receiving message from a peer we make the message indicator green. After the message is viewed,
		we make it normal.
	 **/
	toggleMessageIndicator() {
		const selector = $(this.messageIndicatorBtnSelector);
		if (selector.hasClass(CSS_MSG_BOX_NO_MSG)) {
			this.messageIndicatorHasMessage(selector);
		}
		else {
			this.messageIndicatorHasNoMessage(selector)
		}
	}
	
	messageIndicatorHasNoMessage(selector) {
		selector.removeClass(CSS_MSG_BOX_WITH_MSG);
		selector.addClass(CSS_MSG_BOX_NO_MSG);
		selector.prop('title', 'your have no new messages');
	}
	
	messageIndicatorHasMessage(selector) {
		selector.removeClass(CSS_MSG_BOX_NO_MSG);
		selector.addClass(CSS_MSG_BOX_WITH_MSG);
		selector.prop('title', 'your have new messages');
	}
	
	displayMessage(msgTxt, sender) {
		if (msgTxt) {
			// prepend to the old messages
			const displayMsg = `from ${sender}: ${msgTxt}\n`;
			const currentMsgs = $(this.msgTextArea).val();
			const newMessages = displayMsg + currentMsgs;
			$(this.msgTextArea).val(newMessages);
			// switch tab to message:
			const ti = TAB_LIST.findIndex(t => t.tab == YT_TB_MSG_CONSOLE);
			this.prv_toggleTab(ti);
		}
	}
	
	/**
		Append or replace Code Smaple on the Whiteboard
	**/	
	updateCodeSample(how) {
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ProgrammingClassCommandUI.updateContentByDifference(how, this.code);
		
		// update the code on UI
		this.code = newContent;
		if (!newContent) {
			return;  // no need to validate
		}
		
		// verify the digest if it is present
		if (digest) {
			if (StringUtil.verifyMessageDigest(newContent, digest)) { 
				console.log('verfied content');
			} else {
				console.log('content not verified, asking for re-sync');
				this.#displayBoardForCoding.askReSync(this.#displayBoardForCoding.classTeacher);
			}
		}
		else {
			console.log('No digest available');
		}
	}
	
	/**
		Run JS Code Smaple and print results on the Console
	**/
	runCodeFrom(codeText) {
		// first clear the output console
		this.prv_clearConsole();
		if (!codeText) {
			// run code from local cache, in stead of from teacher
			codeText= this.code;
		}
		// then run the new code from teacher
		super.executeCode(codeText);
		
		// switch tab to output:
		const ti = TAB_LIST.findIndex(t => t.tab == YT_TB_OUTPUT_CONSOLE);
		this.prv_toggleTab(ti);
	}
	
	/**
		Set class room mode to "readonly" or "readwrite"
	 **/
	setClassMode(newMode) {
		if (newMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			// clear code transmit timer
			this.startOrStopCodeRefreshTimer(false);
			
			// result console readonly
			$(this.resultConsoleControl).attr('readonly', true);
			$(this.resultConsoleControl).addClass('input-disabled');
			$(this.codeInputTextArea).addClass('input-disabled');
			
			$(this.runCodeButton).hide(); 
			$(this.clearResultButton).hide();
		}
		else if (newMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			// restart code transmit timer
			// clear code transmit timer
			this.startOrStopCodeRefreshTimer(true);
			
			// result console read and write
			$(this.resultConsoleControl).attr('readonly', false);
			$(this.resultConsoleControl).removeClass('input-disabled');
			$(this.codeInputTextArea).removeClass('input-disabled');
			// show run code and clear consol buttons
			$(this.runCodeButton).show(); 
			$(this.clearResultButton).show();
			
			// accept tab and insert \t when tab key is hit by user
			// note that we do not want to bind this handler the "this" class
			this.setTabHandler();
		}
	}
		
	get codeBoardTextArea() {
		return `#${YT_TA_CODE_BOARD_ID}`;
	}
	
	get resultConsoleControl() {
		return `#${YT_TA_OUTPUT_CONSOLE_ID}`;
	}
	
	get runCodeButton() {
		return `#${YT_BTN_RUN_CODE_ID}`;
	}
	
	get videoScreen() {
		return `#${VD_VIEDO_AREA}`;
	}
	
	get copyNotesButton() {
		return `#${YT_BTN_COPY_CODE_TO_NOTES}`;
	}
		
	get clearResultButton() {
		return `#${YT_BTN_CLEAR_RESULT_CODE_ID}`;
	}

	get notesTextArea() {
		return `#${YT_TA_NOTES_ID}`;
	}
	
	get outputConsoleTab() {
		return `#${YT_TB_OUTPUT_CONSOLE}`;
	}
	
	get notesConsoleTab() {
		return `#${YT_TB_NOTES_CONSOLE}`;
	}
	
	get msgConsoleTab() {
		return `#${YT_TB_MSG_CONSOLE}`;
	}
	
	
	get msgTextArea() {
		return `#${YT_TA_MSG_ID}`;
	}
	
	get sendMsgButon() {
		return `#${YT_BTN_MSG_SEND}`;
	}
	
	get messageInputTa() {
		return `#${YT_TA_MSG_INPUT_ID}`;
	}
	
	get messageIndicatorBtnSelector() {
		return `#${YT_TB_MSG_INDICATOR}`;
	}
	
	/**
		Hnandle running code using text from code baord
	**/
	handleRun(e) {
		e.preventDefault(); 
		
		//obtain code from local "exercise board" and execute it locally
		this.runCodeFrom();
	}
	
	/**
		Hnandle copy code to notes console (and eventually save to DB)
	**/
	handleCopyCodeToNotes(e) {
		e.preventDefault(); 
		const codeTxt = $(this.codeBoardTextArea).val();
		if (!codeTxt) {
			return;
		}
		const noteTxt = $(this.notesTextArea).val();
		const newNotes = codeTxt + '\n' + noteTxt;
		$(this.notesTextArea).val(newNotes);
		this.prv_saveNotesToDb();
		// switch tab to notes:
		const ti = TAB_LIST.findIndex(t => t.tab == YT_TB_NOTES_CONSOLE);
		this.prv_toggleTab(ti);
	}
	
	/**
		Hnandle event after notes are edited. If notes are modified, save the
		modified notes to database.
	**/
	async handleNeedtoUpdateNotes(e) {
		e.preventDefault(); 
		this.prv_saveNotesToDb();
	}
	
	/**
		Hnandle saving notes
	**/
	async prv_saveNotesToDb() {
		const noteTxt = $(this.notesTextArea).val();
		if (!StringUtil.testEqual(this.#notes, noteTxt)) {
			await Net.userUpdateClassNotes(credMan.credential.token, this.groupId, noteTxt);
			this.#notes=noteTxt;
			console.log("saved: " + this.#notes);
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
		this.prv_clearConsole();
	}
	
	prv_clearConsole() {
		$(this.resultConsoleControl).val(sysConstStrings.EMPTY);
	}
	
	/*
		Send message button clicked and send message to techer.
	 */
	handleSendMessage(e) {
		e.preventDefault();
		
		// 1. get the message
		const outgoingMsg = $(this.messageInputTa).val();
		
		if (outgoingMsg) {
			// 2. send to teacher
			this.#displayBoardForCoding.sendMsgToTeacher(outgoingMsg);
			// 3. erase the message (so that it does not linger)
			$(this.messageInputTa).val("");
		}
		
	}
}

let jsClassRoom = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	jsClassRoom = new JSClassRoom(credMan);
});