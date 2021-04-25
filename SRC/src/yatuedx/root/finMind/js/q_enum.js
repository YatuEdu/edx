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
	displayHtml() {
		const clssStr= this.radioClass;
		const name = this.radioName;	
		let htmlStr = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			htmlStr += q_template_enum.replace(replacementForClass, clssStr)
								   .replace(replacementForName, name)
								   .replace(new RegExp(replacementForValue, 'g'),theValue);
			
		}
		return {class: clssStr, html: htmlStr}; 
	}
	
	// get xml for service
	get serverXML() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
}  

export { UserEnumQuestionRadio };