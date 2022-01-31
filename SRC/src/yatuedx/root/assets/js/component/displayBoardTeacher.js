import {CommunicationSpace} 	from './communicationSpace.js';
import {PTCC_COMMANDS}			from '../command/programmingClassCommand.js'
import {OutgoingCommand}		from '../command/outgoingCommand.js'

const VIDEO_TEMPLATE = `
<
<video class="yt_video" id="yt_vido_{pid}" autoplay playsinline>"`;


class DisplayBoardTeacher extends CommunicationSpace {  
	_textLines;
	#view;
	
	constructor(roomName, view) {
		super(roomName, view.videoAreaId); 
		this._textLines = [];
		this.#view = view;
	}
	
	/**
		Update code buffer sample and sync with students
	**/
	updateCodeBufferAndSync(codeUpdateObj) {
		switch (codeUpdateObj.flag) {
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE:
				// do nothing
				break;
				
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_ALL:
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_APPENDED:
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_TALI_DELETED:
				const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE, codeUpdateObj.flag, codeUpdateObj.content, codeUpdateObj.md);
				this.sendMessageToGroup(cmd.str);
				break;
				
		default:
			break;
		}
	}
	
	/**	
		Execute command sent by student or hadling events triggered by peers
	**/	
	v_execute(cmdObject) {
		switch (cmdObject.id) {
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE:
				// do nothing
				break;
				
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
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH, codeStr);
		this.sendMessageToGroup(cmd.str);
	}
	
	/**
		Send code sample to one student whose code is out of sync
	 **/
	syncCodeWithStudent(codeStr, targetUser) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_REFRESH, codeStr);
		this.sendMessageToUser(targetUser, cmd.str);
		log.console('send:' + codeStr + ' to: ' + targetUser);
	}
	
	/**
		Run code sample we swent prior to this command on student's board remotely
		for all students who are attending the class
	 **/
	runCode() {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_CODE_RUN, null);
		this.sendMessageToGroup(cmd.str);
	}
	
	/**
		Change class mode for all the attending students
	**/	
	setMode(m) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE, m);
		this.sendMessageToGroup(cmd.str);
	}
	
	// {cmd: hi, p1: hello} -> stringfy jason
	refresh(coomandObj ) {
		this._textLines = textLines; 
		return this.v_composeHtml();
	}
	
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { DisplayBoardTeacher };