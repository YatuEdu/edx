import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForClass = '{clss}';
const replacementForName = '{nm}';
const replacementForValue = '{vl}';

const q_template_enum = `
		<input type="radio" class="{clss}" name="{nm}" value="{vl}">
		<label for="{vl}">{vl}</label><br>
	`;
class UserEnumQuestionRadio extends UserQuestionBase {  
    _enumValues; 
	_value;
	
    constructor(qInfo, enumValues){  
        super(qInfo);  
        this._enumValues = enumValues; 
		this._value = qInfo.sv1;
		// cameral case
		if (this._value) {
			this._value = StringUtil.convertToCamelCase(this._value);
		}
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
		const self = this;
		const radioName = this.radioName;
		const jqName = `input[name=${radioName}]`;
		$(jqName).change(function(){
			const rName = self.radioName;
			const jqStatus = `input[name=${rName}]:checked`;
			self.setValue( $( jqStatus ).val());
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
			const selector = `input:radio[name=${this.radioName}][value=${this._value}]`;
			$(selector).prop('checked', true);
		}
	}
	
	// get radio class 
	get radioClass() {
		return `enum_for_${this.id}`;
	}
	
	// get radio (group) nsme 
	get radioName() {
		return `name_for_${this.id}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const clssStr= this.radioClass;
		const name = this.radioName;	
		let htmlStr = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			htmlStr += q_template_enum.replace(replacementForClass, clssStr)
								   .replace(replacementForName, name)
								   .replace(new RegExp(replacementForValue, 'g'),theValue);	
		}
		
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

export { UserEnumQuestionRadio };