import {sysConstStrings} 	            from '../core/sysConst.js'
import {ClassRoom} 				        from './classRoom.js'
import {CommCenterForPresenter}         from '../component/commCenterForPresenter.js'
import {PTCC_COMMANDS}					from '../command/programmingClassCommand.js'
import {StringUtil}	                    from '../core/util.js';

// let myEditor = new ysEditor();
class ClassRoomOwner extends ClassRoom {
	#commCenterForPresenter;                               

    constructor(classMode, groupType, groupId, sequenceId) {
		super(classMode, groupType, groupId, sequenceId)
	}

    /**
    *   initialize classroom's communication handler and event handler
    */
	async init() {
		 // hide student only elelment
		 $(this.studentOnlyClassSelector).hide();

		await super.init();

        // establish live communication session if we are in class mode	
        if (!this.classMode) {
			this.#commCenterForPresenter
 				= await CommCenterForPresenter.createCommCenterForPresenter(this.liveSession, this);
        } 

		/*
		 * INITIALIZE CLASS MODE SELECTED
		 */
		$(this.classModeSelector).selectmenu();

        /****
         * add event listners
         */
        this.#addEventListner(); 
      
        // set mode to exercise mode
		this.#setMode(sysConstStrings.SWITCH_TO_EXERCISE);
    }

    #addEventListner() {
		// handle key up 
		$(this.contentInputConsole.inputIdSelector).mouseup(this.handleMouseUp.bind(this));

		// hanlding vertical scroll during live show
		if (this.#commCenterForPresenter) {
			 // hook up event 'run code sample'
			$(this.classModeSelector).on("selectmenuchange", this.#handleModeChange.bind(this));

			// handle vertical scroll during teaching
			$(this.contentInputConsole.inputIdSelector).scroll(this.handleScroll.bind(this));

			// show UI elements that are only visible during live session
			$(this.liveOnlyClassSelector).show()
		} else {
			// hide UI elements that are only visible during live session
			$(this.liveOnlyClassSelector).hide()
		}
    }

    /*
		Change class mode for all the attending students
	*/	
	#handleModeChange(e) {
		e.preventDefault(); 
		const selected = $(e.target).find(":selected").val()
		this.#setMode(selected);
		// send the command to peers
		this.#commCenterForPresenter.setMode(selected);
	}

	/*
		when teacher scrolls we need to have students window scroll as well
	*/
	handleScroll(e) {
		// regenerate line number to adjust to the top
		const top = $(e.target).scrollTop();
		this.#commCenterForPresenter.verticallyScroll(top);
	}

	/*
		Handle mouse up event by getting the text selection and pass the selection info to peers
	*/
	handleMouseUp(e) {
		e.preventDefault(); 
		e.stopPropagation();
		const {begin, end} = this.contentInputConsole.getSelection();
		if (begin != end) {
			this.#commCenterForPresenter.setSelection(begin, end);
		}
	}
	
    /**
		Direct mode setting by start refreshing timer for presentation mode or stop the timer for
		exercizing mode
	**/
	#setMode(newMode) {
		if ( newMode === sysConstStrings.SWITCH_TO_LEARNING) {
			this.startOrStopCodeRefreshTimer(true);
		}
		else if (newMode == sysConstStrings.SWITCH_TO_EXERCISE) {
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
				this.handleGroupMsg(cmdObject.data[0], cmdObject.sender);
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

    v_sendGroupMessage(msg) {
		if (msg) {
			this.#commCenterForPresenter.sendGroupMessage(msg);
			return true;
		}
		return false;
       
    }

    /*
		Got student code and save it to student consle so that a teacher knows what his student is doing.
		The data consists of:
		 1) upadarte id
		 2) update content
		 3) from which student user
	 */
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
					this.#commCenterForPresenter.askReSync(student);
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
		this.#commCenterForPresenter.syncCodeWithRequester(this.contentInputConsole.code, cmdObject.sender);
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
		console.log('ClassRoomOwner.updateCodeBufferAndSync called');
        const code = this.contentInputConsole.code;
		const codeUpdateObj = this.updateCode(code); 
		if (codeUpdateObj) {
			this.#commCenterForPresenter.updateCodeBufferAndSync(codeUpdateObj);
		}
	}
	
    // button for SWITCHING mode
	get modeChangeButton() {
		return '#yt_btn_switch_mode'
	}

    /*****  
     * getters and setters
    */
    get ytTabSelector() { return ".yt_tab" }

    get columnVideoAreaSelector() { return `#yt_col_video_area`;}

    get commCenterForPresenter() { return this.#commCenterForPresenter }

	get classModeSelectorId() { return 'yt_opt_class_mode' }

	get classModeSelector () { return `#${this.classModeSelectorId}` }

}

export {ClassRoomOwner}