import {CommunicationSpace} 	from './communicationSpace.js';
import {PTCC_COMMANDS}			from '../command/programmingClassCommand.js'
import {OutgoingCommand}		from '../command/outgoingCommand.js'

const lineNoTemplate = '';
const lineTemplete ='';

class DisplayBoardTeacher extends CommunicationSpace {  
	_textLines;
	#view;
	
	constructor(roomName, view) {
		super(roomName, view.videoAreaId); 
		this._textLines = [];
		this.#view = view;
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