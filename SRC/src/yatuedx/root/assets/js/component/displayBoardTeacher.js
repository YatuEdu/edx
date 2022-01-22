import {CommunicationSpace} 	from './communicationSpace.js';
import {PTCC_COMMANDS}			from '../command/programmingClassCommand.js'
import {OutgoingCommand}		from '../command/outgoingCommand.js'
import {CodeSyncManager} 		from '../component/codeSyncManager.js'	

const VIDEO_TEMPLATE = `
<
<video class="yt_video" id="yt_vido_{pid}" autoplay playsinline>"`;


class DisplayBoardTeacher extends CommunicationSpace {  
	_textLines;
	#view;
	#codeSyncManager;
	
	constructor(roomName, view) {
		super(roomName, view.videoAreaId); 
		this._textLines = [];
		this.#view = view;
		this.#codeSyncManager = new CodeSyncManager();
	}
	
	/**
		Update code buffer sample and sync with students
	**/
	updateCodeBufferAndSync(codeStr) {
		const codeUpdateObj = this.#codeSyncManager.update(codeStr);
		switch (codeUpdateObj.flag) {
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_NONE:
				// do nothing
				break;
				
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_ALL:
			case PTCC_COMMANDS.PTC_CONTENT_CHANGED_APPENDED:
				const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE, codeUpdateObj.flag, codeUpdateObj.content);
				this._commClient.sendPublicMsg(cmd.str);
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
		this._commClient.sendPublicMsg(cmd.str);
	}
	
	/**
		Run code sample we swent prior to this command on student's board remotely
		for all students who are attending the class
	 **/
	runCode() {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_CODE_RUN, null);
		this._commClient.sendPublicMsg(cmd.str);
	}
	
	/**
		Change class mode for all the attending students
	**/	
	setMode(m) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_CLASSROOM_SWITCH_MODE, m);
		this._commClient.sendPublicMsg(cmd.str);
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