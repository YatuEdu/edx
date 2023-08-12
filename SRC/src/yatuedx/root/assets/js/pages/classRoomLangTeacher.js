import {sysConstStrings} 				from '../core/sysConst.js'
import {ClassRoomLang} 				    from './classRoomLang.js'
import {CommCenterForLangTeacher}       from '../component/commCenterForTeacger.js'
import {PTCC_COMMANDS}					from '../command/programmingClassCommand.js'

const DIV_VIEDO_AREA 					= "yt_div_video_area";
const BTN_SHARE_SCREEN 					= "yt_btn_share_screen";
const YT_DIV_TEXT_INPUT_ID              = "yt_div_text_board";
const BTN_MODE_CHANGE 					= 'yt_btn_switch_mode';

let myEditor = new ysEditor();
class ClassRoomLangTeacher extends ClassRoomLang {
	#commCenterForLangTeacher;
	
	/* 
	 static facotry method for JSClassRoomTeacher to assure that it calls its
	 async init method.
	 */
	 static async createClassRoomLangTeacher() {
		
		const myInstance = new ClassRoomLangTeacher();
		await myInstance.init();
		return myInstance;
	}

    constructor() {
		super(YT_DIV_TEXT_INPUT_ID, DIV_VIEDO_AREA, BTN_SHARE_SCREEN)
	}

    // hook up events
	async init() {
		await super.init();
		// const paramMap = PageUtil.getUrlParameterMap();
		
		this.#commCenterForLangTeacher = 
			await CommCenterForLangTeacher.createCommCenterForLangTeacher(this.liveSession, this);

		// handle key up 
		$(this.codeInputTextArea).mouseup(this.handleMouseUp.bind(this));

        // hook up event 'run code sample'
		$(this.modeChangeButton).click(this.handleModeChange.bind(this));

		// hanlding vertical scroll
		$(this.codeInputTextArea).scroll(this.handleScroll.bind(this));

        // set mode to teaching mode
		this.setMode(PTCC_COMMANDS.PTCP_CLASSROOM_MODE_READWRITE);
    }

    /**
		Change class mode for all the attending students
	**/	
	handleModeChange(e) {
		e.preventDefault(); 
		const newMode = this.switchMode();
		// send the command to peers
		this.#commCenterForLangTeacher.setMode(newMode);
	}

	/*
		when teacher scrolls we need to have students window scroll as well
	**/
	handleScroll(e) {
		// regenerate line number to adjust to the top
		const top = $(e.target).scrollTop();
		this.#commCenterForLangTeacher.verticallyScroll(top);
	}

	/**
		Handle mouse up event by getting the text selection and pass the selection info to peers
	**/
	handleMouseUp(e) {
		e.preventDefault(); 
		e.stopPropagation();
		const {begin, end} = this.getSelection();
		if (begin != end) {
			this.#commCenterForLangTeacher.setSelection(begin, end);
		}
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

    /**
		Execute a command 
	**/
	v_execute(cmdObject) {
		switch(cmdObject.id) {
			// NEW message from student
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:
				//this.handleStudentMsg(cmdObject.data[0], cmdObject.sender);
				break;
			
			// new student arrived, add a comm console
			case PTCC_COMMANDS.PTC_STUDENT_ARRIVAL:
				//this.addStudentConsole(cmdObject.data[0]);
				break;
			
			// new left, delete the student's comm console
			case PTCC_COMMANDS.PTC_STUDENT_LEAVE:
				//this.deleteStudentConsole(cmdObject.data[0]);
				break;
				
			// got a list of current users that are alreay in the chat room:
			case PTCC_COMMANDS.PTC_USER_LIST:
				//this.addStudentConsoles(cmdObject.data[0]);
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
		Got student code and save it to student consle so that a teacher knows what his student is doing.
		The data consists of:
		 1) upadarte id
		 2) update content
		 3) from which student user
	 **/
	updateStudentCode(how, student) {
		const studentCurrentCode = $(this.getStudentConsoleIdSelector(student)).val();
		
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ClassRoomLang.updateContentByDifference(how, studentCurrentCode);
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
					$(this.getStudentConsoleIdSelector(student)).val(newContent); // update anyway
					this.#commCenterForLangTeacher.askReSync(student);
				} else {
					shouldUpdate = true;
				}
			}
			else {
				console.log('No digest available');
				shouldUpdate = true;
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
		Sync code with one student 
	 **/
	syncCodeWithStudent(cmdObject) {
		this.#commCenterForLangTeacher.syncCodeWithRequester(this.code, cmdObject.sender);
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
		console.log('ClassRoomLangTeacher.updateCodeBufferAndSync called');
		const codeUpdateObj = this.updateCode(this.code); 
		if (codeUpdateObj) {
			this.#commCenterForLangTeacher.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
    // button for SWITCHING mode
	get modeChangeButton() {
		return `#${BTN_MODE_CHANGE}`;
	}
}

let langClassRoomTeacher = null;

// A $( document ).ready() block.
$( document ).ready(async function() {
    console.log( "LangClassRoomTeacher page ready!" );
	langClassRoomTeacher = await ClassRoomLangTeacher.createClassRoomLangTeacher();
});