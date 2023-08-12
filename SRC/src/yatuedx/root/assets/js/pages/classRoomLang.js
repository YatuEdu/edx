import {AuthPage} 							from '../core/authPage.js'
import {sysConstants, sysConstStrings} 		from '../core/sysConst.js'
import {StringUtil, UtilConst, PageUtil}	from '../core/util.js'
import {Token}								from '../component/parser/token.js'
import {CodeSyncManager} 					from '../component/codeSyncManager.js'	

const CSS_VIDEO_MIN 						= 'yt-video';
const CSS_VIDEO_MAX 						= 'yt-video-max';
const CSS_VIDEO_ANY 						= 'yt-video-any';

class ClassRoomLang extends AuthPage {
    #codeInputTextArea
	#videoAreaId;
	#screenShareBtnId;
    #codeSyncManager;
	#timer;
	#groupId;
	#classMode
	
	constructor(codeInputTextArea, videoAreaId, screenShareBtnId) {
		super();
        this.#codeInputTextArea = codeInputTextArea;
		this.#videoAreaId = videoAreaId;
		this.#screenShareBtnId = screenShareBtnId;
        // create code synchonization mamager to synchrize code between student and teacher
		this.#codeSyncManager = new CodeSyncManager();
		this.#classMode = 0;
	}
	
	async init() {
		await super.init();

		// handle maximize or minimize video screen
		$(this.videoAreaId).click(this.toggleVideoSize);
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
		get selected text range
	 **/
	getSelection() {
		let position = {begin:0,end:0};
		let selection = document.getSelection();
		
		if (selection.rangeCount){
			let range = selection.getRangeAt(0);
			position.begin = range.startOffset
			position.end = range.endOffset
		}
			
		return position;
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
	
	/**
		Call this to set tab handler and other coding helper features
	**/
	setKeyDownHandler() {
		$(this.codeInputTextArea).keydown(this.handleKeyDown);
	}
	
	/**
		Hnandle tab by insertng \t
	**/
	handleKeyDown(e) {
		const start = this.selectionStart;
		const end = this.selectionEnd;
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

			// help close " and ' and `
			if (Token.isQuote(e.key)) {
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
		Highlight a text selection based on teacher instruction
	 */
	highlightSelection(begin, end) {
		//PageUtil.highlightSelection(this.#codeInputTextArea, begin, end);
		const el = document.getElementById(this.#codeInputTextArea);
		const range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	
	}
	
	/*
		Scroll up and down based on teacher's instruction
	 */
	scrollVertically(pixels) {
		$(this.codeInputTextArea).scrollTop (pixels);
	}
	
	set classMode(cm) {
		this.#classMode = cm;

	}
	
	get groupId() {
		return this.#groupId;
	}
	
	set groupId(gid) {
		this.#groupId = gid;
	}
	

    get code() {
		return $(this.codeInputTextArea).html()
	}
	
	set code(str) {
		$(this.codeInputTextArea).html(str);
		$(this.codeInputTextArea).trigger('change');
	}

    get codeInputTextArea() {
        return `#${this.#codeInputTextArea}`;
    }

	get videoAreaId() {
		return `#${this.#videoAreaId}`;
	}
	
	get screenShareBtnId() {
		return `#${this.#screenShareBtnId}`;
	}
}


export { ClassRoomLang };
