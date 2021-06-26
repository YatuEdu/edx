import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForId = '{id}';
const replacementForValue = '{vl}';
const replacementForSeq = '{seq}';
const replacementForOptionBody = '{opt_body}';

const select_option_html_template = `
<select id=select_option_{id}">
	{opt_body}
</select>
`;

const select_option_item_template = `
<option value="{seq}">{vl}</option>
`;

class UserDropdownSelection extends UserQuestionBase {  
    _enumValues; 
	_value;
	
    constructor(qInfo, enumValues){  
        super(qInfo);  
        this._enumValues = enumValues; 
		this._value = qInfo.sv1;
		
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value && this._enumValues.includes(this._value)) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const jqSel = `#${this.myId}`;
		const self = this;
		$(jqSel).change(function(){
			const jqSelOpt = `#${self.myId} option:selected`;
			const selVal = $( jqSelOpt).text();
			self.setValue( selVal);
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		this._value = obj;
		if (typeof obj !== 'string' || !this.onValidating()) {
			throw new Error('invalid value for question ' + super._qid);
		}
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		if (this._value) {
			const jqSel = `#${this.myId}`;
			$(jqSel).val(this._value);
		}
	}
	
	// get the id of the selection controllers
	get myId () {
		return `select_option_${this.id}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {	
		let selStr = select_option_html_template.replace(replacementForId, this.id);
		let optionStr = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			optionStr += select_option_item_template
									.replace(replacementForSeq, i)
								    .replace(replacementForValue, theValue);	
		}
		selStr = selStr.replace(replacementForOptionBody, optionStr);
		return selStr; 
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._value;
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

export { UserDropdownSelection };