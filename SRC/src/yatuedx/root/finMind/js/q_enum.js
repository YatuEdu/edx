import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForName = '{nm}';
const replacementForValue = '{vl}';

const q_template_enum = `
		<input type="radio" class="{clss}" name="{nm}" value="{vl}">
		<label for="{vl}">{vl}</label>
	`;
class UserEnumQuestionRadio extends UserQuestionBase {  
    _enumValues; 
	_value;
	
    constructor(id, txt, type, enumValues){  
          
        super(id, txt, type);  
          
        this._enumValues = enumValues;  
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
		const radioName = this.radioName;
		const jqName = `input[name=${radioName}]`;
		const jqStatus = `input[name=${radioName}]:checked`;
		const self = this;
		$(jqName).change(function(){
			self.setValue( $( jqStatus ).val());
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question ' + super._qid);
		}
		this._value = obj;
	}
	
	// get radio class 
	get radioClass() {
		return `enum_for_${this._qid}`;
	}
	
	// get radio (group) nsme 
	get radioName() {
		return `name_for_${this._qid}`;
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
		return 
		`<qa>
			<id>${this.id}</id>
			<strv>${this._value}</strv>
		</qa>
		`;
	}
}  

export { UserEnumQuestionRadio };