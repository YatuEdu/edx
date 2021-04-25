import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForMin = '{min}';
const replacementForMax = '{max}';


const q_template_integer = `<input type="number" min="{min}"  max="{max}" step="1" class="{clss}"/>`;
		
class UserIntegerQuestionText extends UserQuestionBase {  
    _min;
	_max;
	_value;
	
    constructor(id, txt, type, low, high){       
        super(id, txt, type);  
          
        this._min = low; 
		this._max = high; 
    }  
	
	setValue(obj) {
		if (typeof obj !== 'number') {
			throw new Error('invalid value for question ' + super._qid);
		}
		this._value = obj;
	}
	
	// get radio class 
	get uiClass() {
		return `integer_for_${this._qid}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	displayHtml() {
		const clssStr= this.uiClass;
		const htmlStr = q_template_integer.replace(replacementForClass, clssStr)
								   .replace(replacementForMin, this._min)
								   .replace(replacementForMax, this._max);
		return {class: clssStr, html: htmlStr}; 
	}
	
	// get xml for service
	get serverXML() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
}  

export { UserIntegerQuestionText };