import {CommunicationSpace} 	from './communicationSpace.js';

const lineNoTemplate = '';
const lineTemplete ='';

class DisplayBoard extends CommunicationSpace {  
	_textLines;
	
	constructor() {
		super(); 
		this._textLines = [];
	}
	
	refresh(textLines) {
		this._textLines = textLines; 
		return this.v_composeHtml();
	}
	
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { DisplayBoard };