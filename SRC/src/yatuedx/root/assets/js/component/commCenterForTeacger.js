import {CommunicationSpace} 	from './communicationSpace.js';
import {PTCC_COMMANDS}			from '../command/programmingClassCommand.js'
import {OutgoingCommand}		from '../command/outgoingCommand.js'

const VIDEO_TEMPLATE = `
<
<video class="yt_video" id="yt_vido_{pid}" autoplay playsinline>"`;


class CommCenterForLangTeacher extends CommunicationSpace {  
	#view;
	
	/*private*/
	constructor(view) {
		super(view.videoAreaId, view.screenShareBtnId); 
		this.#view = view;
	}
	
	/* 
	 static facotry method for DisplayBoardTeacher to assure that it calls its
	 async init method.
	 */
	static async createCommCenterForLangTeacher(liveSession, view) {
		const myInstance = new CommCenterForLangTeacher(view);
		await myInstance.init(liveSession);
		return myInstance;
	}
	
	
	/**
		Update code buffer sample and sync with students
	**/
	updateCodeBufferAndSync(codeUpdateObj) {
		let cmd = this.composeContentUpateMsg(codeUpdateObj);
		if (cmd) {
			this.sendMessageToGroup(cmd.str);
		}
	}
	
	/**	
		Execute command sent by student or hadling events triggered by peers
	**/	
	v_execute(cmdObject) {
		switch (cmdObject.id) {
			case PTCC_COMMANDS.GM_HELLO_FROM_PEER:	
			case PTCC_COMMANDS.PTC_STUDENT_ARRIVAL:
			case PTCC_COMMANDS.PTC_STUDENT_LEAVE:
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE:
			case PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC:
			case PTCC_COMMANDS.PTC_USER_LIST:
				this.#view.v_execute(cmdObject);
				break;
				
			default:
				break;
		}
	}
	
	/**
		Send code sample to all students to disaply on students white-board
	 **/
	sendCode(codeStr) {
		debugger
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH, codeStr);
		this.sendMessageToGroup(cmd.str);
	}
	
	/**
		Highlight code selection text for all students
	 **/
	setSelection(begin, end) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_HIGH_LIGHT, begin, end);
		this.sendMessageToGroup(cmd.str);
	}

	/**
		vertically scroll student's text
	 **/
	verticallyScroll(pixels) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_VERTICALLY_SCROLL, pixels);
		this.sendMessageToGroup(cmd.str);
	}
	
	
	/**
		Change class mode for all the attending students
	**/	
	setMode(m, user) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE, m);
		if (!user) {
			this.sendMessageToGroup(cmd.str);
		} else {
			this.sendMessageToUser(user, cmd.str);
		}
	}
	
	// {cmd: hi, p1: hello} -> stringfy jason
	refresh(coomandObj ) {
		return this.v_composeHtml();
	}
	
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { CommCenterForLangTeacher };