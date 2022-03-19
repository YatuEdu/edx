import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForMin = '{min}';
const replacementForMax = '{max}';
const replacementValue  = '{val}';
const replacementForLabel = '{lb}';

const q_template_integer = `
<div class="mb-4">
  <label for="attributes" class="form-label">{lb}</label>
  <input type="number" size="11" min="{min}"  max="{max}" step="1" 
       class="form-control form-control-lg {clss}" 
	   value="{val}"/>
</div>
`;

const q_template_usd = `
<div class="input-group mb-3">
	<label for="attributes" class="form-label">{lb}</label>
	<span class="input-group-text bg-transparent">$</span>
	<input type="number" 
		   class="form-control form-control-lg border-start-0 ps-1 {clss}"
		   step="1500"
	       placeholder="Please enter"
		   value="{val}">
</div>	
`;

class UserIntegerQuestionText extends UserQuestionBase {  
    _min;
	_max;
	_value;
	#templateToUse;
	
    constructor(qInfo, low, high, isUDS){ 	
        super(qInfo);      
        this._min = low; 
		this._max = high; 
		
		// set the existing vlaue
		this._value = qInfo.iv1;
		
		// set templateToUse
		if (isUDS) {
			this.#templateToUse = q_template_usd;
		}
		else {
			this.#templateToUse = q_template_integer;
		}
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value === parseInt(this._value, 10)) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		$(`.${this.uiClass}`).blur(function() {
			self.setValue($(this).val());
		});
	}
	
	// Validate the input value and save teh legit value
	setValue(obj) {
		this._value = parseInt(obj, 10);
	}
	
	// Over-ride: get value object 
	get value() {
		return this._value;
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.iv1 = this._value;
	}
	
	// get the input UI element class 
	get uiClass() {
		return `integer_for_${this.id}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const clssStr= this.uiClass;
		const htmlStr = this.#templateToUse.replace(replacementForClass, clssStr)
								   .replace(replacementForMin, this._min)
								   .replace(replacementForMax, this._max)
								   .replace(replacementForLabel, this.label)
								   .replace(replacementValue, this._value);
		return htmlStr; 
	}
	
	// get the question in xml format for saving to API server
	get serverXML() {
		let ret = '';
		if (this.onValidating()) {
			ret  =
				`<qa>
					<id>${this.id}</id>
					<intv>${this._value}</intv>
				</qa>
				`;
		} 
		return ret;
	}
}  

export { UserIntegerQuestionText };