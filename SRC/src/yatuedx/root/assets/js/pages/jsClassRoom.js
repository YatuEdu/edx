import {sysConstants, sysConstStrings} 		from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js';
import {DisplayBoardForCoding}				from '../component/displayBoardForCoding.js'
import {JSCodeExecutioner}					from '../component/jsCodeExecutioner.js'
import {PTCC_COMMANDS}						from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}			from './programmingClassCommandUI.js'
import {IncomingCommand}					from '../command/incomingCommand.js'

const YT_CONSOLE_ID 						= "yt_console";
const YT_CODE_BOARD_ID 						= "yt_code_board";
const YT_DIV_CODE_DISPLAY_OR_INPUT_AREA_ID 	= "yt_div_code_display_or_input_area";
const YT_BTN_RUN_CODE_ID 					= 'yt_btn_run_code_from_board';
const YT_BTN_CLEAR_RESULT_CODE_ID 			= 'yt_btn_clear_result';

const REPLACE_CBID = '{cbid}';
const REPLACE_RN = '{rn}';

const HIDDEN_BOARD_TEMPLATE = `
<textarea class="board"
		  id="{cbid}" 
		  spellcheck="false"
		  placeholder='type your code herer....'
		  rows="{rn}"></textarea>`;
								  
/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	
	#displayBoardForCoding;
	
    constructor(credMan) {
		super(credMan, YT_CONSOLE_ID);
		this.init();
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
		this.setClassMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READONLY);
		$(this.codeDisplayOrInputAreaDiv).html(codeHtml);
	}
	
	/**
		Run JS Code Smaple and print results on the Console
	**/
	runCodeFrom(codeText) {
		// first clear the output console
		$(this.resultConsoleControl).val(sysConstStrings.EMPTY);
		this._jsCodeExecutioner.executeCode(codeText);
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
			// result console readonly
			$(this.resultConsoleControl).attr('readonly', true);
			$(this.resultConsoleControl).addClass('input-disabled');
			// Make code-demo board active
			$(this.codeDisplayOrInputAreaDiv).html(sysConstStrings.EMPTY);
			// hide run code and clear consol buttons
			$(this.runCodeButton).hide(); 
			$(this.clearResultButton).hide();
		}
		else if (newMode === PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE) {
			// result console read and write
			$(this.resultConsoleControl).attr('readonly', false);
			$(this.resultConsoleControl).removeClass('input-disabled');
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
			$(this.codeInputTextArea).keydown(this.handleTab);
		}
		
		// remember the mode in UI
		$(this.codeDisplayOrInputAreaDiv).data(sysConstStrings.ATTR_MODE, newMode);
	}
		
	// hook up events
	async init() {
		const clssName = 'JS 101 Test'; // TODO: fetch class name from URL:
		this.#displayBoardForCoding = new DisplayBoardForCoding(clssName, this);
		
		// upon initialization, student board is in "exercise" mode
		this.setClassMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
		
		// hook up event handleRun  to run code locally in learning "exercise mode"
		$(this.runCodeButton).click(this.handleRun.bind(this));
		$(this.clearResultButton).click(this.handleClearConsole.bind(this));
			
		$("#bt_white_board_clear").click(this.handleClearBoard.bind(this));
	
		$("#bt_white_board_send").click(this.handleSend.bind(this));
		
	}
	
	get resultConsoleControl() {
		return `#${YT_CONSOLE_ID}`;
	}
	
	get codeInputTextArea() {
		return `#${YT_CODE_BOARD_ID}`;
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
		//obtain coding from local "exercise board"
		const codeStr = $(this.codeInputTextArea).val();
		this._jsCodeExecutioner.executeCode(codeStr);
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