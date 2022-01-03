import {CommunicationSpace} 	from './communicationSpace.js';

const lineNoTemplate = '';
const lineTemplete ='';

class DisplayBoard extends CommunicationSpace {  
	_textLines;
	_originalText;
	_formatedText;
	
	constructor(roomName) {
		super(roomName); 
		this._originalText = '';
		this._textLines = [];
	}
	
	get textLines () {
		return this._textLines;
	}
	
	get originalText () {
		return this._originalText;
	}
	
	get formatedText () {
		return this._formatedText;
	}
	
	/**
		After we receved the code text, separate them into lines and
		format it for the white board to display.
		Notice that the child class objedct uses overriden v_composeHtml to 
		get the HTML for displying the formated code sample.
	 **/
	refresh(originalText) {
		if (originalText) {
			this._originalText = originalText;
			this._textLines  = originalText.split("\n");
			this._formatedText = this.v_composeHtml();
		}
		return '';
	}
	
	/**
		Child class can format the original text however it needs
	 **/
	v_composeHtml() {
		throw new Error('v_html: sub-class-should-overload-this');
	}
}

export { DisplayBoard };