import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForMin1 = '{min1}';
const replacementForMax1 = '{max1}';
const replacementForMin2 = '{min2}';
const replacementForMax2 = '{max2}';


const q_template_integer_pair = `
	<input type="number" min="{min1}"  max="{max1}" step="1" class="{clss}" data-seq="1"/>
	<input type="number" min="{min2}"  max="{max2}" step="1" class="{clss}" data-seq="2"/>
`;
		
class UserIntegerPairQuestion extends UserQuestionBase {  
    _min1;
	_max1;
	_min2;
	_max2;
	_firstValue;
	_secondValue;
	
    constructor(id, txt, type, low1, high1, low2, high2){       
        super(id, txt, type);  
          
        this._min1 = low1; 
		this._max1 = high1; 
		this._min2 = low2; 
		this._max2 = high2; 
    }  
	
	setValue(obj) {
		if (typeof obj !== 'number') {
			throw new Error('invalid value for question ' + super._qid);
		}
		this._value = obj;
	}
	
	// get radio class 
	get uiClass() {
		return `integer_pair_for_${this._qid}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	displayHtml() {
		const clssStr= this.uiClass;
		const htmlStr = q_template_integer_pair.replace(replacementForClass, clssStr)
								   .replace(replacementForMin1, this._min1)
								   .replace(replacementForMax1, this._max1)
								   .replace(replacementForMin2, this._min2)
								   .replace(replacementForMax2, this._max2);
		return {class: clssStr, html: htmlStr}; 
	}
	
	// get xml for service
	get serverXML() {
		throw new Error('displayHtml: sub-class-should-overload-this');
	}
}  

export { UserIntegerPairQuestion };