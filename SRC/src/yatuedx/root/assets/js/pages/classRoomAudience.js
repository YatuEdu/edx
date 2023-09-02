import {sysConstStrings} 	            from '../core/sysConst.js'
import {ClassRoom} 				        from './classRoom.js'
import {PTCC_COMMANDS}					from '../command/programmingClassCommand.js'
import {CommCenterForAudience}          from '../component/commCenterForAudience.js'

import {PageUtil, StringUtil, RegexUtil, UtilConst, CollectionUtil}	from '../core/util.js';
class ClassRoomAudience extends ClassRoom {
    #commCenterForAudience;                               

    constructor(classMode, groupType, groupId, sequenceId) {
		super(classMode, groupType, groupId, sequenceId)
	}

    /**
    *   initialize classroom's communication handler and event handler
    */
	async init() {
        // hide teacher only elelment
        $(this.teacherOnlyClassSelector).hide();

        // parent initilization
		await super.init();

        // establish live communication session if we are in class mode	
        if (!this.classMode) {
			this.#commCenterForAudience = await CommCenterForAudience.createCommCenterForAudience(
                this.liveSession, 
                this);
        } 
    
        /****
         * add event listners
         */
        this.#addEventListner(); 
      
        // set mode to exercise mode
		this.#setClassMode(sysConstStrings.SWITCH_TO_EXERCISE);
    }

    #addEventListner() {

    }

	/**
	 * over loadables: execute remote command
	 * 
	 * @param {*} cmd 
	 */
    v_execute(cmd) {
		console.log("received command:" + cmd.id);
		switch(cmd.id) {
			// handle message from group:
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:
				this.handleGroupMsg(cmd.data[0], cmd.sender);
				break;

			// set board mode to readonly or not
			case PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE:
				this.#setClassMode(cmd.data[0]);
				break;
				
			// update the sample code
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
				this.#updateCodeSample(cmd.data);
				break;
				
			// highlight a range of text
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_HIGH_LIGHT:
				this.#highlightSelection(cmd.data[0], cmd.data[1]);
				break;			
			// Sroll up or down
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_VERTICALLY_SCROLL:
				this.#scrollVertically(cmd.data[0]);
				break;
			// resync my code with teachwer
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
				this.#syncCodeWithTeacherer(cmd);
				break;
				
			// run code sample and show result on console
			case PTCC_COMMANDS.PTC_CODE_RUN:
				this.#runCodeFrom(cmd.data[0]);
				break;
				
			// GOT message from peers
			case PTCC_COMMANDS.PTC_PRIVATE_MSG:
				this.#receiveMsgFrom(cmd);
				break;
				
			default:
				break;
		}
	}

	/*
	 * send group messages
	*/
	v_sendGroupMessage(msg) {
        this.#commCenterForAudience.sendMsgToTeacher(msg);
    }

    #setClassMode(mode) {
		// set mode by displaying mode in UI
		$(this.currentModeSelector).html(`Class mode: ${mode}`);
    }

    /*
		Append or replace Code Smaple on the Whiteboard
	*/	
	#updateCodeSample(how) {
		// obtain the new code sample using an algorithm defined in parent class as a static method
		const {newContent, digest} = ClassRoom.updateContentByDifference(how, this.contentInputConsole.code);
		
		// update the code on UI
		this.contentInputConsole.code = newContent;
		
		// close output in teaching mode (when new code comes)
		//if (this.#isInTeachingMode) {
		//	this.contentInputConsole.hideOutput();
		//}
		if (!newContent) {
			return;  // no need to validate
		}
		
		// verify the digest if it is present
		if (digest) {
			if (StringUtil.verifyMessageDigest(newContent, digest)) { 
				console.log('verfied content');
			} else {
				console.log('content not verified, asking for re-sync');
				this.#commCenterForAudience.askReSync(this.liveSession.owner_name);
			}
		}
		else {
			console.log('No digest available');
		}
	}

    #highlightSelection(start, end) {
        PageUtil.highlightSelection2(this.contentInputConsole.inputId, start, end);
    }

    /*
		Scroll up and down based on teacher's instruction
	 */
	#scrollVertically(pixels) {
		$(this.contentInputConsole.inputIdSelector).scrollTop (pixels);
	}

    #syncCodeWithTeacherer(cmd) {

    }

    #runCodeFrom() {
		this.v_runCodeFrom()

    }

    #receiveMsgFrom() {

    }

	/**
	 * getters ans setters
	 */
	
	get currentModeId() { return 'yt_span_current_mode' }

	get currentModeSelector() { return `#${this.currentModeId}` }
}

export {ClassRoomAudience}
