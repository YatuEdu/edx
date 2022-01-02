import {CommunicationSpace} 	from './communicationSpace.js';

const lineNoTemplate = '';
const lineTemplete ='';

class DisplayBoard extends CommunicationSpace {  
	_textLines;
	
	constructor(roomName) {
		super(roomName); 
		this._textLines = [];
	}
	
	/**
		After we receved the code text, separate them into lines and
		format it for the white board to display.
		Notice that the child class objedct uses overriden v_composeHtml to 
		get the HTML for displying the formated code sample.
	 **/
	refresh(textLines) {
		if (textLines) {
			this._textLines = textLines[0].split("\n");
			return this.v_composeHtml();
		}
		return '';
	}
	
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { DisplayBoard };