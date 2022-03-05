import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForValue1 = '{val1}';
const replacementForValue2 = '{val2}';
const replacementForValue3 = '{val3}';
const replacementForId = '{id}';

const q_template_fst_mid_lst_name = `
	<div class="row mb-4">
		<div class="col">		
			<label class="form-label" for="first_name">First name</label>
			<input type="text" id="first_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val1}" maxlength="20"/>
		</div>
		<div class="col">
			<label class="form-label" for="middle_name">Middle name</label>
			<input type="text" id="middle_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val2}" maxlength="20"/>
		</div>	
		<div class="col">		
			<label class="form-label" for="last_name">Last name</label>
			<input type="text" id="last_name_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{val3}" maxlength="20"/>
		</div>
	</div>`;
	
const q_template_fst_mid_lst_name_ro = `
	<div class="row mb-4">
		<div class="col">		
			<label class="form-label" for="first_name">First name</label>
			<span class="form-control form-control-lg">{val1}</span>
		</div>
		<div class="col">
			<label class="form-label" for="middle_name">Middle name</label>
			<span class="form-control form-control-lg">{val2}</span>
		</div>	
		<div class="col">		
			<label class="form-label" for="last_name">Last name</label>
			<span class="form-control form-control-lg">{val3}</span>
		</div>	
	</div>`;


class UserNameQuestion extends UserQuestionBase {  
    _first; 
	_middle;
	_last;
	
    constructor(qInfo){  
        super(qInfo);  
		this._first  = qInfo.sv1 ? qInfo.sv1 : '';
		this._middle = qInfo.sv2 ? qInfo.sv2 : '';
		this._last   = qInfo.sv3 ? qInfo.sv3 : '';
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._first && this._last ) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		//when text edit is done, set the value ffrom the text field:
		const selector = `#${this.firstId}`;
		$(selector).blur(function() {
			self.setValueFirst($(selector).val());
		});
		
		const selectorMid = `#${this.middleId}`;
		$(selectorMid).blur(function() {
			self.setValueMiddle($(selectorMid).val());
		});
		
		const selectorLast = `#${this.lastId}`;
		$(selectorLast).blur(function() {
			self.setValueLast($(selectorLast).val());
		});
	}
	
	setValueFirst(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._first = obj.trim();
	}
	
	setValueMiddle(obj) {
		if (typeof obj !== 'string' ) {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._middle = obj.trim();
	}
	
	setValueLast(obj) {
		if (typeof obj !== 'string' ) {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._last= obj.trim();
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._first;
		this.qInfo.sv2 = this._middle;
		this.qInfo.sv3 = this._last;
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		if (this._first) {
			const selector = `#${this.firstId}`;
			$(selector).val(this._first);
		}
		if (this._middle) {
			const selector = `#${this.middleId}`;
			$(selector).val(this._middle);
		}
		if (this._last) {
			const selector = `#${this.lastId}`;
			$(selector).val(this._last);
		}
	}
	
	// get first name id
	get firstId() {
		return `first_name_${this.id}`;;
	}
	
	// get first name id
	get middleId() {
		return `middle_name_${this.id}`;;
	}
	
	// get last name id
	get lastId() {
		return `last_name_${this.id}`;;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let htmlStr = q_template_fst_mid_lst_name
								   .replace(new RegExp(replacementForId, 'g'),this.id)
								   .replace(replacementForValue1, this._first)
								   .replace(replacementForValue2, this._middle)
								   .replace(replacementForValue3, this._last);	
		
		return htmlStr; 
	}
	
	// get read-only display html for the name composition control
	get displayHtmlReadOnly() {
		return	q_template_fst_mid_lst_name_ro
									.replace(replacementForValue1, this._first)
									.replace(replacementForValue2, this._middle)
									.replace(replacementForValue3, this._last);
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret = 
`<qa>
<id>${this.id}</id>
<strv>${this._first}</strv>
<strv2>${this._middle}</strv2>
<strv3>${this._last}</strv3>
</qa>`;
		}
		return ret;
	}
}  

export { UserNameQuestion };