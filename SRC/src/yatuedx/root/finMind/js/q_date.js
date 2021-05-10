	
import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForValue = '{vl}';

const q_template_date = `
	<input type="date" name="begin" placeholder="dd-mm-yyyy" value="{vl}" min="1900-01-01" max="2020-12-31" class="{clss}>
`;
		
class UserDateQuestion extends UserQuestionBase {  
 
	_dateStr;
	
    constructor(id, txt, type, dateStr){       
        super(id, txt, type);   
        this._dateStr = dateStr; 
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._dateStr === parseDatethis._firstValue, 10) &&
		    this._secondValue === parseInt(this._secondValue, 10)) {
			return true;
		}
		return false;
	}

	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		// first integer
		$(`.${this.uiClass}`).blur(function() {
			self.setValue1($(this).val());
		});
	}

	setValue(obj) {
		this._dateStr = parseInt(obj, 10);
	}
	
	// get low value class 
	get uiClass() {
		return `date_for_${this._qid}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const htmlStr = q_template_integer_pair
									.replace(replacementForClass1, this.uiClass);
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

export { UserDateQuestion };