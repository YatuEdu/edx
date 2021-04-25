import {UserQuestionBase} from './q_base.js';

const replacementForClass1 = '{clss1}';
const replacementForClass2 = '{clss2}';
const replacementForMin1 = '{min1}';
const replacementForMax1 = '{max1}';
const replacementForMin2 = '{min2}';
const replacementForMax2 = '{max2}';


const q_template_integer_pair = `
	<input type="number" min="{min1}"  max="{max1}" step="1" class="{clss1}" data-seq="1"/>
	<input type="number" min="{min2}"  max="{max2}" step="1" class="{clss2}" data-seq="2"/>
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
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._firstValue === parseInt(this._firstValue, 10) &&
		    this._secondValue === parseInt(this._secondValue, 10)) {
			return true;
		}
		return false;
	}

	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		// first integer
		$(`.${this.uiClass1}`).blur(function() {
			self.setValue1($(this).val());
		});
		
		// second integer
		$(`.${this.uiClass2}`).blur(function() {
			self.setValue2($(this).val());
		});
	}

	setValue1(obj) {
		this._firstValue = parseInt(obj, 10);
	}
	
	setValue2(obj) {
		this._secondValue = parseInt(obj, 10);
	}
	
	// get low value class 
	get uiClass1() {
		return `integer_pair1_for_${this._qid}`;
	}
	
	// get high value class 
	get uiClass2() {
		return `integer_pair2_for_${this._qid}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const htmlStr = q_template_integer_pair
									.replace(replacementForClass1, this.uiClass1)
									.replace(replacementForClass2, this.uiClass2)
									.replace(replacementForMin1, this._min1)
									.replace(replacementForMax1, this._max1)
									.replace(replacementForMin2, this._min2)
									.replace(replacementForMax2, this._max2);
		return htmlStr; 
	}
	
	// get the question in xml format for saving to API server
	get serverXML() {
		const ret =  
		`<qa>
			<id>${this.id}</id>
			<intv>${this._firstValue}</intv>
			<intv2>${this._secondValue}</intv2>
		</qa>
		`;
		return ret;
	}
}  

export { UserIntegerPairQuestion };