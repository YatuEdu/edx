import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForLabel = '{lb}';
const replacementForValue = '{vl}';
const replacementForId = '{id}';
const replacementFordDivId = '{divid}';

const q_template_text = `
<div class="mb-4">
  <label for="ExistingInsurance" class="form-label">{lb}</label>
  <input type="text" id="tx_field_{id}" class="form-control form-control-lg" placeholder="Please enter" value="{vl}">
</div>
`;

class UserTextQuestion extends UserQuestionBase {  
    _name;
	_regex; 
	_value;
	
    constructor(qInfo, regex, childId){  
        super(qInfo, childId);  
		this._value = qInfo.sv1 != null ? qInfo.sv1 : '';
		this._regex = regex;
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value && this.regexValidating(this._value)) {
			return true;
		}
		return false;
	}
	
	// Method for validating the result value upon moving away 
	// from the page.
	regexValidating(v) {
		return this._regex == null || this._regex.test(v);
	}		
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		//when text edit is done, set the value ffrom the text field:
		const selector = `#${this.myId}`;
		$(selector).blur(function(e) {
			e.preventDefault();
			const newVal = $(selector).val();
			
			// if it does not conform with the regex, alert and not set
			if (newVal && !self.regexValidating(newVal)){
				alert(`Invalid ${self.label} value`);
				return;
			}
			self.setValue(newVal);
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._value = obj.trim();
	
	}
	
	// get XML element for parent control if I am serving as a sub-control
	get xmlElement() {
		return {tag: 'strv', obj: this._value};
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
		return `tx_field_${this.id}`;;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let htmlStr = q_template_text
								.replace(replacementForId, this.id)
								.replace(replacementForLabel, this.label)
								.replace(replacementForValue, this._value)
								.replace(replacementFordDivId, `${this.wrapperDivId}`);
		
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