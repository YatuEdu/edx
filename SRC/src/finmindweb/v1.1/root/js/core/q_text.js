import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForClass = '{clss}';
const replacementForName = '{nm}';
const replacementForValue = '{vl}';
const replacementForId = '{id}';

const q_template_text = `
<p>
	<textarea class="q_a_text" rows="5" id="text_area_{id}" spellcheck="true" />
</p>
`;

class UserTextQuestion extends UserQuestionBase {  
    _length; 
	_value;
	
    constructor(qInfo){  
        super(qInfo);  
		this._value = qInfo.sv1;
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		//when text edit is done, set the value ffrom the text field:
		const selector = `#${this.myId}`;
		$(selector).blur(function() {
			self.setValue($(selector).val());
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		this._value = obj;
		if (typeof obj !== 'string' || !this.onValidating()) {
			throw new Error('invalid value for question: ' + this.id);
		}
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._value;
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		if (this._value) {
			const selector = `#${this.myId}`;
			$(selector).val(this._value);
		}
	}
	
	// get radio class 
	get myId() {
		return `text_area_${this.id}`;;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let htmlStr = q_template_text
								   .replace(new RegExp(replacementForId, 'g'),this.id);	
		
		return htmlStr; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret = 
`<qa>
<id>${this.id}</id>
<strv>${this._value}</strv>
</qa>`;
		}
		return ret;
	}
}  

export { UserTextQuestion };