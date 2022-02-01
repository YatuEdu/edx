import {sysConstants, sysConstStrings} 		from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardForCoding}				from '../component/displayBoardForCoding.js'
import {JSCodeExecutioner}					from '../component/jsCodeExecutioner.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'
import {PageUtil, StringUtil}				from '../core/util.js';

const YT_CONSOLE_ID 						= "yt_console";
const YT_CODE_BOARD_ID 						= "yt_code_board";
const YT_DIV_CODE_DISPLAY_OR_INPUT_AREA_ID 	= "yt_div_code_display_or_input_area";
const YT_BTN_RUN_CODE_ID 					= 'yt_btn_run_code_from_board';
const YT_BTN_CLEAR_RESULT_CODE_ID 			= 'yt_btn_clear_result';
const VD_VIEDO_AREA = "yt_video_area";

const REPLACE_CBID = '{cbid}';
const REPLACE_RN = '{rn}';

const HIDDEN_BOARD_TEMPLATE = `
<textarea class="input-board"
		  id="{cbid}" 
		  spellcheck="false"
		  placeholder="ype your code herer...."
		  rows="{rn}"></textarea>`;
								  
/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	
	#displayBoardForCoding;
	
    constructor(credMan) {
		super(credMan, YT_CODE_BOARD_ID, YT_CONSOLE_ID, VD_VIEDO_AREA);
		this.init();
	}
	
	// hook up events
	async init() {
		//const clssName = 'JS 101 Test'; // TODO: fetch class name from URL:
		const paramMap = PageUtil.getUrlParameterMap();
		const clssName = paramMap.get(sysConstants.UPN_GROUP);
		const teacherName =paramMap.get(sysConstants.UPN_TEACHER);
		this.#displayBoardForCoding = new DisplayBoardForCoding(clssName, teacherName, this);
		
		// error handling code herer
			// if err goto errpage
		
		// upon initialization, student board is in "exercise" mode
		this.setClassMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// hook up event handleRun  to run code locally in learning "exercise mode"
		$(this.runCodeButton).click(this.handleRun.bind(this));
		$(this.clearResultButton).click(this.handleClearConsole.bind(this));
			
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
	
		$("#bt_white_board_send").click(this.handleSend.bind(this));
		
	}
	
	/**
		Execute when timer is triggered.  Call updateCodeBufferAndSync
	**/
	v_handleTimer() {
		this.updateCodeBufferAndSync();
	}
	
	/**
		Periodically passing our code to teacher to examine student's progress.
	 **/
	updateCodeBufferAndSync() {
		console.log('JSClassRoom.updateCodeBufferAndSync called');
		const codeUpdateObj = this.updateCode(this.code); 
		this.#displayBoardForCoding.updateCodeBufferAndSync(codeUpdateObj);
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
				
			// display code sample on board
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH:
				this.displayCodeSample(cmd.data);
				break;
			
			// update the sample code
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.updateCodeSample(cmd.data[0], cmd.data[1], cmd.data[2]);
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
	displayCodeSample(codeData) {
		const srcCode = codeData[0];
		const formattedCode = codeData[1];
		const currentMode = $(this.codeDisplayOrInputAreaDiv).data(sysConstStrings.ATTR_MODE);
		if (currentMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			// show in formatted code on board
			$(this.codeDisplayOrInputAreaDiv).html(formattedCode);
		}
		else {
			this.code=srcCode;
		}
		this.prv_clearConsole();
	}
	
	/**
		Append or replace Code Smaple on the Whiteboard
	**/	
	updateCodeSample(how, text, digest) {
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const newCode = ProgrammingClassCommandUI.updateContentByDifference(how, this.code, text);
		
		// update the code on UI
		this.code = newCode;
		if (!newCode) {
			return;  // no need to validate
		}
		
		// verify the digest
		if (StringUtil.verifyMessageDigest(newCode, digest)) { 
			console.log('verfied content');
		} else {
			console.log('content not verified, asking for re-sync');
			this.#displayBoardForCoding.askReSync();
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
	}
	
	/**
		Set class room mode to "readonly" or "readwrite"
	 **/
	setClassMode(newMode) {
		const currentMode = $(this.codeDisplayOrInputAreaDiv).data(sysConstStrings.ATTR_MODE);
		if (currentMode === newMode) {
			// mode already set;
			return;
		}
		
		if (newMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY) {
			// clear code transmit timer
			this.startOrStopCodeRefreshTimer(false);
			
			// result console readonly
			$(this.resultConsoleControl).attr('readonly', true);
			$(this.resultConsoleControl).addClass('input-disabled');
			$(this.codeInputTextArea).addClass('input-disabled');
			
			// Make code-demo board active
			// $(this.codeDisplayOrInputAreaDiv).html(sysConstStrings.EMPTY);
			// hide run code and clear consol buttons
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
			// Make code-input board active
			const cbHtml = HIDDEN_BOARD_TEMPLATE
								.replace(REPLACE_CBID,YT_CODE_BOARD_ID)
								.replace(REPLACE_RN, sysConstants.YATU_DEFAULT_BOARD_ROWS);
			$(this.codeDisplayOrInputAreaDiv).html(cbHtml);
			
			// show run code and clear consol buttons
			$(this.runCodeButton).show(); 
			$(this.clearResultButton).show();
			
			// accept tab and insert \t when tab key is hit by user
			// note that we do not want to bind this handler the "this" class
			this.setTabHandler();
		}
		
		// remember the mode in UI
		$(this.codeDisplayOrInputAreaDiv).data(sysConstStrings.ATTR_MODE, newMode);
	}
		
	get resultConsoleControl() {
		return `#${YT_CONSOLE_ID}`;
	}
	
	get runCodeButton() {
		return `#${YT_BTN_RUN_CODE_ID}`;
	}
	
	get clearResultButton() {
		return `#${YT_BTN_CLEAR_RESULT_CODE_ID}`;
	}
	
	get codeDisplayOrInputAreaDiv() {
		return `#${YT_DIV_CODE_DISPLAY_OR_INPUT_AREA_ID}`;
	}
	
	/**
		Hnandle tab by insertng \t
	**/
	handleRun(e) {
		e.preventDefault(); 
		
		//obtain code from local "exercise board" and execute it locally
		super.runCodeFromTextInput();
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