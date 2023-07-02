import {sysConstants, sysConstStrings, uiConstants} from '../core/sysConst.js'
import {credMan} 									from '../core/credMan.js'
import {DisplayBoardForCoding}						from '../component/displayBoardForCoding.js'
import {LocalStoreAccess}							from '../core/localStorage.js'
import {PTCC_COMMANDS}								from '../command/programmingClassCommand.js'
import {ProgrammingClassCommandUI}					from './programmingClassCommandUI.js'
import {PageUtil, StringUtil, RegexUtil, UtilConst}	from '../core/util.js';
import {Net}			    						from "../core/net.js"
import {CodeManContainer}							from '../component/new/codeManager.js'
import {CodeInputConsole}							from '../component/new/codeInputConsole.js';

const YT_TA_MSG_ID 					    	= "yt_ta_msg";
const YT_TA_MSG_INPUT_ID				    = 'yt_ta_msg_input';
const YT_TA_NOTES_ID 					    = "yt_ta_notes"; //todo: remove it
const YT_DIV_CODE_MANAGER 					= "yt_div_code_manager";
const YT_DIV_CODE_EDITOR					= "yt_div_code_editor";
const YT_TA_OUTPUT_CONSOLE_ID 				= "yt_ta_output_console";
const YT_TA_CODE_BOARD_ID 					= "yt_ta_code_board";
const YT_BTN_RUN_CODE_ID 					= 'yt_btn_run_code_from_board';
const YT_BTN_SHARE_SCREEN 					= 'yt_btn_share_screen';
const YT_BTN_PREVIEW_WEB 					= 'yt_btn_run_web_from_board';
const YT_BTN_FORMAT_CODE_ID 				= 'yt_btn_format_code';
const YT_BTN_SAVE_CODE_POPUP				= 'yt_btn_save_code_to_db_popup';					
const YT_BTN_CLEAR_RESULT_CODE_ID 			= 'yt_btn_clear_result';
const YT_BTN_CLEAR_CODE_BOARD				= 'yt_btn_erase_code';
const YT_BTN_SAVE_CODE						= 'yt_btn_save_code_to_db';
const VD_VIEDO_AREA 						= "yt_video_area";	
const YT_TB_NOTES_CONSOLE					= 'yt_tb_notes_console';
const YT_TB_MSG_CONSOLE					    = 'yt_tb_msg_console';
const YT_DL_ASK_FOR_SAVING_CODE				= 'yt_dl_ask_to_save';
const YT_TXT_CODE_NAME						= 'yt_txt_code_name';
const YT_COL_CODE_LIST						= 'yt_col_code_list';
const YT_COL_VIDEO_AREA  					= 'yt_col_video_area';
const YT_COL_CODING_AREA					= 'yt_col_coding_area';

const CSS_MSG_BOX_NO_MSG 					= 'btn-mail-box-no-msg';
const CSS_MSG_BOX_WITH_MSG 					= 'btn-mail-box-with-msg';
const CSS_BTN_MAX_INPUT 					= 'ta-btn-minmax';
const CSS_MAX_CONTAINER 					= 'ta-container-max';
const CSS_MIN_CONTAINER						= 'ta-container';
const CSS_CODING_COL_WITH_VIDEO				= 'col-10';
const CSS_CODING_COL_WITHOUT_VIDEO 			= 'col-12';

const TAB_LIST = [
	{tab:YT_TB_NOTES_CONSOLE,  sub_elements: [YT_DIV_CODE_MANAGER] },
	{tab:YT_TB_MSG_CONSOLE,    sub_elements: [YT_TA_MSG_ID, YT_TA_MSG_INPUT_ID] },
];

const MIN_CODE_LENGTH = 16;
const MSG_TAB_INDX = 1;
const USER_VIDEO_AREA = uiConstants.VIDEO_AREA_ID;
const USER_VIDEO_ID_TEMPLATE = uiConstants.VIDEO_ID_TEMPLATE;
	
const REPLACE_CODELIST_ID = "{codelstid}";
const REPLACE_CODELIST_LABEL = "{lb}";

/**
	This class handles JS Code runner board
**/
class JSClassRoom extends ProgrammingClassCommandUI {
	
	#displayBoardForCoding;
	#notes;
	#tabIndex;
	#codeManContainer;
	#codeInputConsoleComponent;
	#groupId;
	#sequenceId;
	#codeStore;

	/* 
	 static facotry method for JSClassRoom to assure that it calls its
	 async init method.
	 */
	 static async createJSClassRoom() {
		const myInstance = new JSClassRoom();
		await myInstance.init();
		return myInstance;
	}
	
    constructor() {
		super(YT_TA_CODE_BOARD_ID, YT_TA_OUTPUT_CONSOLE_ID, VD_VIEDO_AREA, YT_BTN_SHARE_SCREEN);
		this.#codeStore =  new LocalStoreAccess(sysConstants.YATU_MY_CODE_STORE_KEY);
	}
	
	// hook up events
	async init() {
		const paramMap = PageUtil.getUrlParameterMap();
		const modeStr = paramMap.get(sysConstants.UPN_MODE);
		const mode = modeStr ? parseInt(modeStr, 10) : 0;
		const groupStr = paramMap.get(sysConstants.UPN_GROUP);
		const sequenceStr = paramMap.get(sysConstants.UPN_SEQUENCE);

		// set class mode needs to be called before super.init()
		this.classMode = mode;

		// call parent init (such as AuthPage init, !important)
		await super.init();

		// initialize dialog boxes for this page
		$(this.codeSaveDialogSelector).dialog({
				autoOpen : false, 
				modal : true, 
				show : "blind", 
				hide : "blind", 
		});


		// other initialization
		this.#tabIndex = 0;

		// initialize UI accordin to mode
		if (mode && mode === 1) {
			if (!groupStr) {
				alert('Invalid URL.  You probably have no privilge to access this page!');
				return;
			}
			// Do not show video if we are only doing excersize
			$(this.columnVideoAreaSelector).hide();
			$(this.columnCodingAreaSelector).removeClass(CSS_CODING_COL_WITH_VIDEO);
			$(this.columnCodingAreaSelector).addClass(CSS_CODING_COL_WITHOUT_VIDEO);
			this.#groupId = parseInt(groupStr);	
			this.#sequenceId = parseInt(sequenceStr);

		} else {
			// show video if we are in class mode	
			this.#displayBoardForCoding = 
				await DisplayBoardForCoding.createDisplayBoardForCoding(
													this.liveSession, 
													this);
				this.#groupId = this.liveSession.group_id;
				this.#sequenceId = this.liveSession.sequence_id;
		}
		
		// itialize code manager
		await this.initCodeDepot();
		
		// initialize code editor
		this.#codeInputConsoleComponent = new CodeInputConsole(
					"", 
					YT_DIV_CODE_EDITOR, 
					YT_DIV_CODE_EDITOR, 
					YT_TA_CODE_BOARD_ID, 
					YT_TA_OUTPUT_CONSOLE_ID
		);
		
		/**
			maxize or minimize input consoles.
			Note that we handle this event at the body level so that all "+" button events are
			handled, not just the "+" button in this class.
			
			We should make the button a component, and place it anywhere we want.
			
		 **/
		$(document.body).on('click', this.inputMaxMinButtonClassSelector, this.handleInputMaxMin);
			
		// hook up event handleRun  to run code locally in learning "exercise mode"
		$(this.runCodeButton).click(this.handleRun.bind(this));
		// web preview event handler
		$(this.previewhWebButtonSelector).click(this.handleWebPreviewing.bind(this));
		// handle format Code
		$(this.formatCodeButton).click(this.handleCodeFormatting.bind(this));
		// handle copy code to notes
		$(this.copyAndSaveCodeButtonSelector).click(this.handleCopyAndSaveCodeToDb.bind(this));
		// handle erase result board
		$(this.clearResultButton).click(this.handleClearConsole.bind(this));
		// switching tab to notes
		$(this.notesConsoleTab).click(this.toggleTab.bind(this));
		// switching tab to msg
		$(this.msgConsoleTab).click(this.toggleTab.bind(this));
		// handle sending message to teacher by 'return key'
		$(this.messageBoardInputSlector).keydown(this.handleSendMessage.bind(this));
		// handle save code to DB
		$(this.saveCodeToDbButtonSelector).click(this.saveCodeToDb.bind(this));
		// handle erasing code from board
		$(this.eraseCodeFromBoardButtonSelector).click(this.eraseCodeFromBoard.bind(this));

		// accept tab and insert \t when tab key is hit by user
		// note that we do not want to bind this handler the "this" class
		this.setTabHandler();
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
	async initCodeDepot() {
		const codeDataList = [];
		const resp = await Net.memberListAllCode(credMan.credential.token);
		if (resp.data.length > 0) {
			let first = true;
			
			resp.data.forEach(codeHeader => {
				const codeEntry = {sequence_id: codeHeader.sequence_id, name: codeHeader.name, hash: codeHeader.hash};
				codeDataList.push(codeEntry);
				
				// the first entry is selected by default
				if (first) {
					// insert code to the code text area
					codeEntry.text = this.getCodeFor(codeHeader.name);
					first = false;
				}
			});
		}
		this.#codeManContainer = new CodeManContainer(
			'', 
			'CODEManger', 
			'yt_div_code_manager',
			YT_TA_CODE_BOARD_ID,
			codeDataList,
			this.getCodeFor.bind(this),
			this.updateCodeToDb.bind(this),
			this.deleteCodeFor.bind(this),
			"tbd", 0);
	}
	
	async getCodeFor(codeName) {
		const respCodeText = await Net.memberGetCodeText(credMan.credential.token,
														 0, 
														 codeName);
		if (respCodeText.code === 0) {
			return StringUtil.decodeText(respCodeText.data[0].text);
		}
	}

	async deleteCodeFor(codeName) {
		const resp = await Net.memberDeleteCode(credMan.credential.token,
												0, codeName);
		return resp.code;
	}
	
	
	/*
		Save user's code to his code depot in DB.  
		The code name needs to be normalized to prevent SQL injections and makes it easier to
		organize in UI.
	*/
	async saveCodeToDb(e) {
		e.preventDefault();
		
		const codeName = $(this.codeNameTextSelector).val();
		if (!codeName) {
			alert("Please enter code name!");
			return;
		}
		
		if (!RegexUtil.isValidCodeName(codeName)) {
			alert("Code name must start with an alphabet and contains only alphanumeric chars without space or special chars!");
			return;
		}
		
		const codeText = $(this.codeBoardTextArea).val();
		if (!codeText || codeText.length < MIN_CODE_LENGTH) {
			alert("Please enter more code!");
			return;
		}
		
		const existingCodeEntry = this.#codeManContainer.getCodeEntry(codeName);
		if (existingCodeEntry) {
			// do you want to update existing code in db?
			alert(`Error: code with name [${codeName}] already exists in db.  Use update button to update the code.`);
			return;
		} 
		
		const resp = await this.updateCodeToDb(codeName, codeText);
		if (resp.code) {
			alert("Error encountered: error code:" +  resp.code);
		} else {
			alert("Code added to your depot:");
			// add code to our code manager
			this.#codeManContainer.addCodeEntry(codeName, codeText);
		}
		
		//close dialog box:
		$(this.codeSaveDialogSelector).dialog("close");
	}
	
	async updateCodeToDb(codeName, codeText) {
		// encode text for safety and viewbility
		const codeHash = StringUtil.getMessageDigest(codeText);
		const encodedCodeText = StringUtil.encodeText(codeText);
		const resp = await Net.memberAddCode(credMan.credential.token, 
											 this.#groupId,
											 this.#sequenceId,
											 codeName, 
											 encodedCodeText, 
											 codeHash);
		return resp;
	}
	
	/**
		Clicking the max-min button toggles bewtween a min / max sized screen.
	 **/
	handleInputMaxMin(e) {
		e.preventDefault();
		
		// find the target container to toggle
		const par = $(event.target).parent();
		if ($(par).hasClass( CSS_MIN_CONTAINER)) {
			$(par).removeClass(CSS_MIN_CONTAINER);
			$(par).addClass(CSS_MAX_CONTAINER);
			// change button text to "-"
			$(event.target).html('-');
	
		}
		else {
			$(par).removeClass(CSS_MAX_CONTAINER);
			$(par).addClass(CSS_MIN_CONTAINER);
			// change button text to "+"
			$(event.target).html('+');
		}
	}
	
	/**
		toggle tag between output, notes, and etc.
	 **/
	toggleTab(e) {
		const jqTarget = $(e.target);
		let ti = jqTarget.attr('data-tabindex');
		ti = parseInt(ti, 10);
		this.prv_toggleTab(ti);
	}
	
	/**
		toggle tag between output, notes, and etc.
	 **/
	toggleToMegTab() {
		// make the message box to be "no new message"
		const selector = $(this.msgConsoleTab);
		this.messageIndicatorHasNoMessage(selector)
	}
	
	/**
		erase code from board
	 **/
	eraseCodeFromBoard(e) {
		$(this.codeBoardTextArea).val('');
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
					// special case message tqab
					if (e.tab === YT_TB_MSG_CONSOLE) {
						this.toggleToMegTab();
					}
				}
			});
			this.#tabIndex = ti;

		}
	}
	
	/**
		Handle code execution errors
	 **/
	handleCodeError() {
		alert("gotacha");
	}
	
	/**
		Periodically passing our code to teacher to examine student's progress.
	 **/
	updateCodeBufferAndSync() {
		console.log('JSClassRoom.updateCodeBufferAndSync called');
		const codeUpdateObj = this.updateCode(this.code); 
		if (codeUpdateObj && codeUpdateObj.flag !== UtilConst.STR_CHANGE_NON) {
			this.#displayBoardForCoding.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		console.log("received command:" + cmd.id);
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
		if (this.displayMessage(cmdObject.data[0], cmdObject.sender)) {
			// make message indicator green
			this.toggleMessageIndicator();
		}
	}
	
	/**
		After receiving message from a peer we make the message indicator green. After the message is viewed,
		we make it normal.
	 **/
	toggleMessageIndicator() {
		const selector = $(this.msgConsoleTab);
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
	
	/**
		Append or replace Code Smaple on the Whiteboard
	**/	
	updateCodeSample(how) {
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ProgrammingClassCommandUI.updateContentByDifference(how, this.code);
		
		// update the code on UI
		this.code = newContent;
		
		// close output in teaching mode (when new code comes)
		if (this.#isInTeachingMode) {
			this.#codeInputConsoleComponent.hideOutput();
		}
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
		if (this.#isInTeachingMode) {
			// when in teaching mode, only show out put for this run
			$(this.resultConsoleControl).val("");
		}
		let errorInfo = null;
		if (!codeText) {
			// run code locally text console
			errorInfo = super.runCodeFromTextInput();
		} else {
			// run code from teacher
			errorInfo = super.executeCode(codeText);
		}
		
		this.#showOutputOrErro(errorInfo, true);
	}
	
	/**
		Hnandle code formatting text from code baord
	**/
	handleCodeFormatting(e) {
		e.preventDefault(); 
		
		//obtain code from local "exercise board" and execute it locally
		const result = super.formatCode();
		if (result.hasError) {
			// display error only in self-study mode
			this.#showOutputOrErro(result.errors, false);
		} else {
			$(this.codeBoardTextArea).val(result.newSourc);
		}
	}
	
	/**
		Set class room mode to "readonly" or "readwrite"
	 **/
	setClassMode(newMode, classMode) {
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
			// restart code transmit timer (only in classroom mode (not in offline-exercise mode))
			if (classMode === undefined || classMode === sysConstants.LIVE_MODE) { 
				this.startOrStopCodeRefreshTimer(true);
			}
			
			// result console read and write
			$(this.resultConsoleControl).attr('readonly', false);
			$(this.resultConsoleControl).removeClass('input-disabled');
			$(this.codeInputTextArea).removeClass('input-disabled');
			// show run code and clear consol buttons
			$(this.runCodeButton).show(); 
			$(this.clearResultButton).show();
		}
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
	 * Preview web page we made inside code text area by opening another tab to show it.
	 * 
	 * @param {*} e 
	 * @returns 
	 */
	handleWebPreviewing(e) {
		// convert code to base64 string
		const codeTxt = $(this.codeBoardTextArea).val();
		if (!codeTxt) {
			return;
		}

		// stash the code to storage for later use
		this.#codeStore.setItem(StringUtil.encodeText(codeTxt));
	
		// go to the test page
		const studentUrl = './assets/student/index.html';
		window.open(studentUrl, '_blank');
	}

	/**
		Hnandle copy code to from code console to memory and eventually save to DB
	**/
	handleCopyAndSaveCodeToDb(e) {
		e.preventDefault(); 
		const codeTxt = $(this.codeBoardTextArea).val();
		if (!codeTxt) {
			return;
		}
		
		// switch tab to notes:
		const ti = TAB_LIST.findIndex(t => t.tab == YT_TB_NOTES_CONSOLE);
		this.prv_toggleTab(ti);
		
		// ask if user want to save code to code depot?
		const selectedCodeName = this.#codeManContainer.currentSelection;
		$(this.codeNameTextSelector).val(selectedCodeName);
		 $(this.codeSaveDialogSelector).dialog("open");
	}
	
	/**
		Hnandle saving notes
	**/
	async prv_saveNotesToDb() {
		const noteTxt = $(this.notesTextArea).val();
		if (!StringUtil.testEqual(this.#notes, noteTxt)) {
			await Net.userUpdateClassNotes(credMan.credential.token, this.#groupId, noteTxt);
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
	
	/**
		Display messages from peers on message board
	**/
	displayMessage(msgTxt, sender) {
		if (msgTxt) {
			// prepend to the old messages
			const oldMsg = $(this.msgTextArea).val();
			const newMsg = `${sender}: ${msgTxt}\n`;
			$(this.msgTextArea).val(newMsg + oldMsg);
			return true;
		}
		
		return false;
	}

	/*
		Send message button clicked and send message to techer. This only works during live class
	 */
	handleSendMessage(e) {
		if (!this.#displayBoardForCoding) {
			alert('Teacher is not on-line now');
			return;
		}

		if(this.#displayBoardForCoding && e.which===13){ 
			const outgoingMsg = $(e.target).val();

			// send message to teacher (so far we only allow messages between student and teacher)
			this.#displayBoardForCoding.sendMsgToTeacher(outgoingMsg);

			// display my message as well
			this.displayMessage(outgoingMsg, "\t" + "me");
			// clear sent messages:
			$(e.target).val("");

			// prevent "enter"" to be populated and handled further
			e.stopPropagation();
			e.preventDefault(); 			
		}
	}
	
	get #isInTeachingMode() {
		return $(this.resultConsoleControl).prop('readonly');
	}
	
	#showOutputOrErro(errorInfo, showConsole) {
		let teachingMode = false;
		if (this.#isInTeachingMode) {
			teachingMode = true;
		}
		if (errorInfo) {
			if (teachingMode) {
				// do not show diagnostical dbox when we are in teaching mode
				$(this.resultConsoleControl).val("error");
			} else {
				this.#codeInputConsoleComponent.showDiagnoticMessage(errorInfo);
			}
		} 

		if (showConsole) {
			// show output cosole
			this.#codeInputConsoleComponent.showOutput();
		}
	}
	
	/**
			UI Properties
	 **/
	
	get columnVideoAreaSelector() {
		return `#${YT_COL_VIDEO_AREA}`;
	}
	
	get columnCodingAreaSelector() {
		return `#${YT_COL_CODING_AREA}`;
	}
	
	get resultConsoleControl() {
		return `#${YT_TA_OUTPUT_CONSOLE_ID}`;
	}
	
	
	get eraseCodeFromBoardButtonSelector() {
		return `#${YT_BTN_CLEAR_CODE_BOARD}`;
	}
	
	get codeSaveDialogSelector() {
		return `#${YT_DL_ASK_FOR_SAVING_CODE}`;
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

	get previewhWebButtonSelector() {
		return `#${YT_BTN_PREVIEW_WEB}`;
	}
	
	get formatCodeButton() {
		return `#${YT_BTN_FORMAT_CODE_ID}`;
	}	
	
	get videoScreenSelector() {
		return `#${VD_VIEDO_AREA}`;
	}
	
	get copyAndSaveCodeButtonSelector() {
		return `#${YT_BTN_SAVE_CODE_POPUP}`;
	}
	
	get saveCodeToDbButtonSelector() {
		return `#${YT_BTN_SAVE_CODE}`;
	}
		
	get codeNameTextSelector() {
		return `#${YT_TXT_CODE_NAME}`;
	}
	
	get clearResultButton() {
		return `#${YT_BTN_CLEAR_RESULT_CODE_ID}`;
	}

	get codeManagerDivSelector() {
		return `#${YT_DIV_CODE_MANAGER}`;
	}
	
	get notesTextArea() {
		return `#${YT_TA_NOTES_ID}`;
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
	
	get messageBoardInputSlector() {
		return `#${YT_TA_MSG_INPUT_ID}`;
	}
	
	get teacherVideoSelector() {
		return `#${USER_VIDEO_ID_TEMPLATE}${this.liveSession.owner_name}`;	
	}
	
	videoAreaSelector(userId) {
		return `#${USER_VIDEO_ID_TEMPLATE}${userId}`;	
	}

	videoAreaClassSelector() {
		return `.yt-video-area`;	
	}
	
	get codeListDivSelector() {
		return `#${YT_COL_CODE_LIST}`;
	}	
	
	get inputMaxMinButtonClassSelector() {
		return `.${CSS_BTN_MAX_INPUT}`;
	}
}

let jsClassRoom = null;

// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "JSClassRoom page ready!" );
	jsClassRoom = await JSClassRoom.createJSClassRoom();
});