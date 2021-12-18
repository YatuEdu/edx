import {CommunicationSpace} 	from './communicationSpace.js';

const lineNoTemplate = '';
const lineTemplete ='';

class DisplayBoard extends CommunicationSpace {  
	#textLines;
	
	constructor() {
		this.#textLines = [];
	}
	
	refresh(textLines) {
		this.#textLines = textLines; 
		return v_composeHtml();
	}
	
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { DisplayBoard };