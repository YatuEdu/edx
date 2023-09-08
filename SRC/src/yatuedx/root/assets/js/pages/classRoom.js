import {AuthPage} 							from '../core/authPage.js'
import {sysConstants, sysConstStrings} 		from '../core/sysConst.js'
import {StringUtil, UtilConst, PageUtil, CollectionUtil, RegexUtil} 	from '../core/util.js'
import {Token}								from '../component/parser/token.js'
import {CodeSyncManager} 					from '../component/codeSyncManager.js'	
import {ContentInputConsole}            	from '../component/contentInputConsole.js'
import {CodeContainer}						from '../component/new/codeContainer.js'
import {MessageBoard}						from '../component/messageBoard.js'
import {RteInputConsole}					from '../component/new/rteInputConsole.js'
import {credMan} 							from '../core/credMan.js'
import {Net}			    				from "../core/net.js"

const CSS_VIDEO_MIN 						= 'yt-video';
const CSS_VIDEO_MAX 						= 'yt-video-max';
const CSS_VIDEO_ANY 						= 'yt-video-any';
const CSS_CODING_COL_WITH_VIDEO				= 'col-10';
const CSS_CODING_COL_WITHOUT_VIDEO 			= 'col-11 center_col';
const CSS_CODING_COL_WITHOUT_VIDEO2			= 'center_col';

const YT_DIV_WORK_CONTAINER					= "yt_work_container";  
const YT_DIV_WORK_AREA 						= "yt_div_work_area";
const YT_DIV_CONTENT_INPUT              	= "yt_div_content_input";
const YT_DIV_MESSAGE_BOARDS              	= "yt_div_message_boards";
const YT_DIV_NOTES_RTE_EDITOR				= "yt_div_notes_rte_editor";
const CSS_MESSAGE_TAB_WITH_MSG 				= 'btn-mail-box-with-msg';

const CLCC_SELECTED_TAB                 = "selected_tab";
const CLCC_UNSELECTED_TAB               = "unselected_tab";

const CLCC_WORK_ROW                     = "work_tab_row";
const CLCC_MESSAGE_ROW                  = "message_tab_row";
const CLCC_NOTES_ROW                    = "notes_tab_row";
const CLCC_STUDENT_ROW                  = "student_tab_row";

const BTN_RUN_CODE  					= "yt_btn_run_code_on_student_board";
const BTN_ERASE_OUTPUT					= "yt_btn_erase_output";
const BTN_ERASE_INPUT					= "yt_btn_erase_input_board";

const TAB_INDEX_STUDENTS = 0;
const TAB_INDEX_WORK = 1
const TAB_INDEX_MSG = 2
const TAB_INDEX_NOTES = 3

const TAB_LIST = [
	{tab:"yt_tb_student_console",   sub_elements: [CLCC_STUDENT_ROW]},
	{tab:"yt_tb_work_depot",  	    sub_elements: [CLCC_WORK_ROW] },
	{tab:"yt_tb_msg_console",    	sub_elements: [CLCC_MESSAGE_ROW] },
	{tab:"yt_tb_notes_console",     sub_elements: [CLCC_NOTES_ROW] }
];

const DIV_VIEDO_AREA 					= "yt_div_video_area";
const BTN_SHARE_SCREEN 					= "yt_btn_share_screen";

class ClassRoom extends AuthPage {
	#videoAreaId
	#screenShareBtnId
    #codeSyncManager
	#timer
	#groupType
    #classMode
    #groupId
    #sequenceId
	#codeContainer
	#contentInputConsole
	#notesConsole
	#initialNotes
	#messageBoard
	#tabIndex  
	
	constructor(classMode, groupType, groupId, sequenceId) {
		super();
		this.#groupType =  groupType
		this.#classMode = classMode
		this.#groupId = groupId
		this.#sequenceId = sequenceId
		this.#videoAreaId = DIV_VIEDO_AREA;
		this.#screenShareBtnId = BTN_SHARE_SCREEN;
		this.#tabIndex = -1;
        // create code synchonization mamager to synchrize code between student and teacher
		this.#codeSyncManager = new CodeSyncManager();
	}

	static get TAB_INDEX_STUDENTS() { return TAB_INDEX_STUDENTS}
	static get TAB_INDEX_WORK() { return TAB_INDEX_WORK} 
	static get TAB_INDEX_MSG() { return TAB_INDEX_MSG} 
	static get TAB_INDEX_NOTES() { return TAB_INTAB_INDEX_NOTESDEX_WORK} 
	
	async init() {
		await super.init();

		/**
		 * DISABLE VIDEO IN NON-LIVE MODE
		 */
		if (this.classMode) {
            // Do not show video if we are only doing excersize
			$(this.columnVideoAreaSelector).hide();
			$(this.selectClassModeOptionSelector).hide();
			$(this.columnWorkAreaSelector).removeClass(CSS_CODING_COL_WITH_VIDEO);
			$(this.columnWorkAreaSelector).addClass(CSS_CODING_COL_WITHOUT_VIDEO);
			$(this.columnWorkAreaSelector).addClass(CSS_CODING_COL_WITHOUT_VIDEO2);
        }

		  /*
          * initialize dialog boxes for this page
          */
		  $(this.codeSaveDialogSelector).dialog({
            autoOpen : false, 
            modal : true, 
            show : "blind", 
            hide : "blind", 
        });

		/*
         * load content input control
         */
		this.#loadContentInputControl(this.groupType, YT_DIV_CONTENT_INPUT, YT_DIV_NOTES_RTE_EDITOR);
		await this.initNotes()

		/****
         * create code container for saving / updating code
        */
		this.#codeContainer = await CodeContainer.createCodeContainer(YT_DIV_WORK_CONTAINER, this.contentInputConsole.inputId, this.groupId, this.sequenceId);

		/****
		 * create message board component
		 */
		this.#messageBoard = new MessageBoard(YT_DIV_MESSAGE_BOARDS, this.v_sendGroupMessage.bind(this));

		this.#addEventListner()

		// switch to default tab index
		const switchToTab = this.v_switchToDefaultTab()
		this.#switchTab(switchToTab)

		/*
			initialize tooltips for all ui elements with titles.  This functionality is provided by
			jQueryUI
		 */
		$( document ).tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function( position, feedback ) {
					$( this ).css( position );
					$( "<div>" )
						.addClass( "arrow" )
						.addClass( feedback.vertical )
						.addClass( feedback.horizontal )
						.appendTo( this );
				}
			}
		});

		/**
		 * Initialize UI components for programming classes
		 */
		this.#initProgrammingElements()
	}

	#initProgrammingElements() {
		if (this.#groupType <= 20) {
			/*
				yt_tab_output
			*/
			$( "#yt_tab_output_for_coding" ).tabs({
				event: "mouseover"
			});
		}
	}
	
	/***
	* add event listners
	*/
	#addEventListner() {
        
        /**** handle tab switching  ****/
        $(this.ytTabSelector).click(this.onSwitchingTab.bind(this));
		
		// handle maximize or minimize video screen
		$(this.videoAreaId).click(this.toggleVideoSize);

		// handle clicking save button
		$(this.saveBtnSelector).unbind('click').click(this.handleSaveToDb.bind(this));

		// save clicking save button on the dialog boc
		$(this.saveBtnOnSaveDialogSelector).click(this.handleSaveCodeToDb.bind(this))

		// hookup erasing output console
		$(this.eraseOutputSelector).click(this.handleEraseOutput.bind(this));
		$(this.eraseInputSelector).click(this.handleEraseIntput.bind(this));

		// accept tab and insert \t
		if (this.contentInputConsole.inputIsTextArea) {
			$(this.contentInputConsole.inputIdSelector).keydown(this.handleKeyDown);
		}
	}
	
	/****
     * load content input control according to class type
     */
    #loadContentInputControl(classType, parentIdMain, parentIdNotes) {
        this.#contentInputConsole = new ContentInputConsole(classType, this, parentIdMain, "main", this.outputId);

		// also create notes input console
		this.#notesConsole = new RteInputConsole(this, parentIdNotes,  "user", this.ysEditorWrapperSelectorForNotes);
    }

	async initNotes() {
		const resp = await Net.memberGetNotes(credMan.credential.token);
		if (resp.code === 0 && resp.data.length > 0) {
			// group by classes:
			const classNotes = CollectionUtil.groupByReduce(resp.data, "group_id");
			const myClassNotes = classNotes[this.#groupId];
			if (myClassNotes && myClassNotes.length) {
				this.#initialNotes = myClassNotes[0].notes;
				this.#notesConsole.code = StringUtil.decodeText(this.#initialNotes);;
			}
		}
	}
	
	/***
	 * event handlers
	 */

	 /***
     * 
     */
	 onSwitchingTab(e) {
        const jqTarget = $(e.target);
		let ti = jqTarget.attr('data-tabindex');
		ti = parseInt(ti, 10);
		this.#switchTab(ti);
    }

	 /**
		Recieved peer incoming messages, display it with student name included
	 **/
	handleGroupMsg(data, sender) {
		const msg = data;
		
		// turn on message tab flashing when the message tab is not selected
		if (this.#tabIndex !== TAB_INDEX_MSG) {
			this.#toggleMessageTabHasMessage(true)
		}

		/*
		const msgBtnSelector = this.getStudentMessageButtonSelector(sender);
		if (msgBtnSelector) {			
			this.toggleStudentButtonInner(msgBtnSelector, true);
			
			// 2. insert message to student message board
			const msgConsoleSelector =  this.getStudentMessageTaIdSelector(sender);
			$(msgConsoleSelector).val(msg);
		}	
		*/	
		this.messageBoard.displayMessage(sender, msg);
	}
	
	#toggleMessageTabHasMessage(hasMsg) {	
		const msgTabId = this.messageTabSelector;
		// toggle button style by CSS toggle
		if (hasMsg) {
			$(msgTabId).addClass(CSS_MESSAGE_TAB_WITH_MSG);
		}
		else {
			$(msgTabId).removeClass(CSS_MESSAGE_TAB_WITH_MSG);
		}
	}

	/**
		Use a timer to periodically sync teacher's code with student's code.
		We start it when in teaching mode and stop it when in exercise mode.
	**/
	startOrStopCodeRefreshTimer(start) {
		if (start) {
			if (!this.#timer) {
				// do not set interval when one is already working
				this.#timer = setInterval(this.handleTimter.bind(this), sysConstants.YATU_CODE_BUFFER_REFRESH_FREQUENCY);
			}
		}
		else {
			console.log(this.#timer + ' clearled');
			clearInterval(this.#timer);
			this.#timer = undefined;
			
		}
	}

	/**
		Stub function for handling timer. Calls the actual handler "v_handleTimer", which would be provided
		by the child class, who knows what to do.
	 **/
	handleTimter(e) {
		if (this.#timer) {
			this.v_handleTimer();
		} else {
			console.log('warning: undefined timer called');
		}
	}

    /**
		Child class object calls this function to update the code cache.  Upon updating code in the cache,
		#codeSyncManager also advices what kind of changes the code has: appending, deletion, or what not so that
		the child classd objects know what to do.
	 **/
	updateCode(codeStr) {
		return this.#codeSyncManager.update(codeStr);
	}
	
	/**
		Copy the entire code to all the student
	 **/
	syncCode(codeSrc) {
		return this.#codeSyncManager.syncCode(codeSrc);
	}

	/**
		When a video is clicked,  toggle bewtween a min / max sized screen.
	 **/
	toggleVideoSize(e) {
		// the click is only on the video area
		if ($(e.target).hasClass(CSS_VIDEO_ANY))  {
			e.preventDefault(); 

			if ($(e.target).hasClass(CSS_VIDEO_MIN)) {
				$(e.target).removeClass(CSS_VIDEO_MIN);
				$(e.target).addClass(CSS_VIDEO_MAX);
			}
			else {
				$(e.target).removeClass(CSS_VIDEO_MAX);
				$(e.target).addClass(CSS_VIDEO_MIN);
			}

			e.stopPropagation();
			e.preventDefault();
		}
			
	}
	
	/**
		Our algorithm to code updating by delta in order to optimize network traffic 
	 **/
	static updateContentByDifference(how, oldStr) {
		let newContent = "";
		let digest = "";
		const flag = how[0];
		if (oldStr === undefined) {
			oldStr = "";
		}
		switch(flag) {
			// REFRESH EVERYTHING
			case UtilConst.STR_CHANGE_ALL:
			{
				console.log('code repalced');
				newContent = how[1];
				break;
			}
			
			// code appened (70% of cases)
			case UtilConst.STR_CHANGE_APPEND:
			{
				console.log('code appened');
				newContent = oldStr + how[1];
				digest = how[2];
				break;
			}
			
			// code deleted at the end (10% of cases)			
			case UtilConst.STR_CHANGE_DELETE_END:
			{
				console.log('code tail deleteed');
				const delLen = parseInt(how[1], 10);
				newContent = oldStr.substring(0, delLen);
				digest = how[2];
				break;
			}
			
			// prepend at the header			
			case UtilConst.STR_CHANGE_PREPEND:
			{
				console.log('code in the middle replaced');
				newContent = how[1] + oldStr;
				digest = how[2];
				break;
			}
			
			// delete at the header			
			case UtilConst.STR_CHANGE_DELETE_BEGIN:
			{
				console.log('code deleted at beginning');
				const delLen = parseInt(how[1], 10);
				newContent = oldStr.substring(oldStr.length - delLen);
				digest = how[2];
				break;
			}
			
			// replace in the middle			
			case UtilConst.STR_CHANGE_MIDDLE:
			{
				console.log('code in the middle replaced');
				const delter = how[1];
				const b = parseInt(how[2], 10);
				const e = parseInt(how[3], 10);
				digest = how[4];
				newContent = newContent = StringUtil.replaceInTheMiddle(oldStr,delter, b, e);
				break;
			}
		}
		return {newContent: newContent, digest: digest};
	}
	
	/*
		This page is A BASE PAGE for live chat page, 
		we don't need to call initGroups logic of that in parent class (AuthPage)
	 */
	v_isLiveChatPage() {
		return this.#classMode === 0;
	}
	
	/**
		Execute when timer is triggered.  IMplemented by child class.
	**/
	v_handleTimer() {
		throw new Error('v_handleTimer: sub-class-should-overload-this');
	}
	
	/**
		Execute a command encapsulated by command string (cmd)
	**/
	v_execute(cmd) {
		throw new Error('v_execute: sub-class-should-overload-this');
	}

	/*
	 * Send group message
	 */
	v_sendGroupMessage(msg) {
		throw new Error('v_sendGroupMessage: sub-class-should-overload-this');
	}
		
	/*
	 * Erase output content
	 */
	handleEraseOutput(e) {
		$(this.outputSelector).val("")
	}

	/*
	 * Erase intput content
	 */
	handleEraseIntput(e) {
		this.#contentInputConsole.eraseInputBoard()
	}

	/**
		Hnandle tab by insertng \t
	**/
	handleKeyDown(e) {
		const start = this.selectionStart;
		const end = this.selectionEnd;
		if (!start) {
			// this function only works for textarea, for contenteditable for do not need it for now
			return;
		}
		const uiText = this.value;
		const selected = uiText.substring(start, end);
		const re = /^/gm;

		// insert tab char when tab key is hit
		let inputModified = true;
		let charAdded = 1;
		while(true) {
			if(e.which===9) { 
				this.value = uiText.substring(0, start) + selected.replace(re, sysConstStrings.TAB_STRING) + uiText.substring(end);
				break;	
			}

			// help close open bracket by close bracket 
			if (Token.isOpenBracket(e.key)) {
				const closeBracket = Token.getCloseBracketFor(e.key);
				this.value = uiText.substring(0, start) + selected.replace(re, e.key + closeBracket) + uiText.substring(end);
				break;
			}

			// help close " and ' and ` when the next char is space
			if (Token.isQuote(e.key) && !StringUtil.isAlphanumeric(uiText[start])) {
				this.value = uiText.substring(0, start) + selected.replace(re, e.key + e.key) + uiText.substring(end);
				break;
			}

			// help inserting the right number of tabs when CR is hit
			if(e.which === 13) {
				const tabLEvel = PageUtil.findTabLevel(uiText, start);
				if(tabLEvel > 0) {
					this.value = uiText.substring(0, start) + 
								 selected.replace(re, Token.TOKEN_CR + sysConstStrings.TAB_STRING.repeat(tabLEvel)) + 
								 uiText.substring(end);
					charAdded = 1 + tabLEvel;
				} else {
					inputModified = false;
				}
				break;
			}

			// no modification performed
			inputModified = false;
			break;
		}

		if (inputModified) {
			//Keep the cursor in the right index
			this.selectionStart = start + charAdded;
			this.selectionEnd   = start + charAdded; 	
			e.stopPropagation();
			e.preventDefault(); 	
		}
	}
	
	/*
		Save user's work or notes to db
	*/
	async handleSaveToDb(e) {
		e.preventDefault();

		if (this.#tabIndex === TAB_INDEX_WORK ) {
			this.#handleSavePopup()
		} else if (this.#tabIndex === TAB_INDEX_NOTES) {

			await this.#saveNotesToDb()
		}
		e.stopPropagation()
	}

	/***
	 * pop up "save" dialog box
	 */
	#handleSavePopup(e) {
		e.preventDefault(); 
		const codeTxt = this.contentInputConsole.code;
		if (!codeTxt) {
			return;
		}
		
		// ask if user want to save code to code depot?
		const selectedCodeName = this.#codeContainer.currentSelection;
		$(this.codeNameTextSelector).val(selectedCodeName);
		$(this.codeSaveDialogSelector).dialog("open");
	}

	/*
		Save user's work to his code depot in DB.  
		The code name needs to be normalized to prevent SQL injections and makes it easier to
		organize in UI.
	*/
	async handleSaveCodeToDb(e) {
		const codeName = $(this.codeNameTextSelector).val();
		if (!codeName) {
			alert("Please enter code name!");
			return;
		}
		
		if (!RegexUtil.isValidCodeName(codeName)) {
			alert("Code name must start with an alphabet and contains only alphanumeric chars without space or special chars!");
			return;
		}
		
		const codeText = this.contentInputConsole.code;
		if (!codeText || codeText.length < sysConstants.MIN_CODE_LENGTH) {
			alert("Minimum of " + sysConstants.MIN_CODE_LENGTH + " bytes of work can be saved. Please enter more code to save!");
			return;
		}
		
		const existingCodeEntry = this.#codeContainer.getCodeEntry(codeName);
		if (existingCodeEntry) {
			// do you want to update existing code in db?
			alert(`Error: code with name [${codeName}] already exists in db.  Use update button to update the code.`);
			return;
		} 
		
		const resp = await this.#codeContainer.updateCodeToDb(codeName, codeText);
		if (resp.code) {
			alert("Error encountered: error code:" +  resp.code);
		} else {
			alert("Code added to your depot:");
			// add code to our code manager
			this.#codeContainer.addCodeEntry(codeName, codeText);
		}
		
		//close dialog box:
		$(this.codeSaveDialogSelector).dialog("close");
	}

	/**
	 * Save notes to db
	 */
	async #saveNotesToDb() {
		const currentNotes = this.#notesConsole.code;
		if (this.#isNotesDirty(currentNotes)) {
			const notesB64 = StringUtil.encodeText(currentNotes);
			const status = await Net.memberAddNotes(credMan.credential.token, this.#groupId, notesB64);
			if (status.code !== 0) {
				alert("Failed to save notes, error code is" + status.code);
				return;
			} 
			
			alert("Notes updated!");
			this.#initialNotes = notesB64;
		}
	}

	#isNotesDirty(notes) {
		if (!notes && !this.#initialNotes) {
			return false;
		}

		if (notes && !this.#initialNotes || !notes && this.#initialNotes) {
			return true;
		}

		const notesB64 = StringUtil.encodeText(notes);
		if (!StringUtil.testEqual(this.#initialNotes, notesB64)) {
			return true;
		}

		return false;
	}

	/**
	 * private methods
	 */
	  /****
     * private helpers
     */
	  #switchTab(ti) {
        if (ti != this.#tabIndex) {
			TAB_LIST.forEach( (e, i) => {
				if (i != ti) {
					$(`#${e.tab}`).removeClass(CLCC_SELECTED_TAB);
					$(`#${e.tab}`).addClass(CLCC_UNSELECTED_TAB);
					e.sub_elements.forEach(se => {
						$(`.${se}`).hide();
					});
				}
				else {
					$(`#${e.tab}`).removeClass(CLCC_UNSELECTED_TAB);
					$(`#${e.tab}`).addClass(CLCC_SELECTED_TAB);
					e.sub_elements.forEach(se => {
						$(`.${se}`).show();
					});	
					// turn off message flashing
					if (i === TAB_INDEX_MSG) {
						this.#toggleMessageTabHasMessage(false)
					}
				}
			});
			this.#tabIndex = ti;

		}
    }

	/***
	 * getters and setters
	 */

	get ytTabSelector() { return ".yt_tab" }

	set classMode(cm) { this.#classMode = cm }
	
	get groupId() { return this.#groupId }
	
	set groupId(gid) { this.#groupId = gid }

	get videoAreaId() { return `#${this.#videoAreaId}` }
	
	get screenShareBtnId() { return `#${this.#screenShareBtnId}`; }

	get saveBtnSelector() { return '#yt_btn_save_work_or_notes' }

	get saveBtnOnSaveDialogSelector() { return '#yt_btn_save_code_to_db' }
    
    get codeSaveDialogSelector() { return '#yt_dl_ask_to_save' }

	get codeNameTextSelector() { return '#yt_txt_code_name'}

	get contentInputConsole() { return this.#contentInputConsole }

    get inputId() { return this.#contentInputConsole.inputId }

	get outputId() { return 'yt_ta_global_output' }

	get outputSelector() { return `#${this.outputId}` }

	get groupType() { return this.#groupType }

    get groupId() { return this.#groupId }
    
    get sequenceId() { return this.#sequenceId }

    get classMode() { return this.#classMode }

	get messageBoard() { return this.#messageBoard }

	get messageTabSelector() { return `#${TAB_LIST[TAB_INDEX_MSG].tab}`; }
	
	get ysEditorWrapperSelectorForNotes() { return 'ysEditorWrapperSelectorForNotes'}

	get teacherOnlyClassSelector () { return `.teacher_only`}

	get selectClassModeOptionSelector() { return `.yt_select_class_mode`}

	get liveOnlyClassSelector() { return '.live_only'}

	get studentOnlyClassSelector() { return `.student_only`}

	get runCodeButton() { return `#${BTN_RUN_CODE}` }

	get eraseOutputSelector() { return `#${BTN_ERASE_OUTPUT}` }

	get eraseInputSelector() { return `#${BTN_ERASE_INPUT}`}

	get forCodingOnlyClassSelector() { return '.for_coding_only'}

	get columnWorkAreaSelector() { return `#${YT_DIV_WORK_AREA}`}
}


export { ClassRoom };
