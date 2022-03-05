import {UserQuestionBase} from './q_base.js';
import {StringUtil}		  from './util.js';

const replacementForId = '{id}';
const replacementForLabel = '{lb}';
const replacementFordDivId = '{divid}';
const replacementForValue = '{vl}';

const q_template_text_input = `
<div class="mb-4">
  <label  class="form-label" >{lb}</label>
  <input id="tx_formatter_input_{id}" type="text" class="form-control form-control-lg" value=""/>
</div>
`;

const q_template_text_ro = `
<div class="mb-4">
  <label  class="form-label" >{lb}</label>
  <span class="form-control form-control-lg">{vl}</span>
</div>
`;

class UserFormatterText extends UserQuestionBase {  
	_value;
	_regex;
	_formatter;
	_numberOnly;
	
    constructor(qInfo, numberOnly, regex, formatter, childId){ 	
        super(qInfo, childId);
		
		// set the existing vlaue
		this._value = qInfo.sv1;
		this._regex = regex;
		this._formatter =  formatter;
		this._numberOnly = numberOnly;
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value && this._regex.test(this._value)) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		const selector = `#${this.myId}`;
		
		// format the text and reset the display
		$(selector).change(function(e) {
			e.preventDefault();
			const obj = $(selector).val();
			
		    // GET formatted text
			const formetted = self._formatter(obj);
			self.setValue(formetted);
		});
		
		// Add "," per thousands
		$(selector).keyup(function (e) {
			e.preventDefault();
			const obj = $(selector).val();
			if (obj) {
				// GET formatted text
				const formetted = self._formatter(obj);	
				// now convert to string with comma
				$(selector).val(formetted);
			}			
		});
		
		// prevent none digit from entering
		if (this._numberOnly) {
			$(selector).keydown(function (e) {
				// Allow: backspace, delete, tab, escape and enter
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
					 // Allow: Ctrl+A
					(e.keyCode == 65 && e.ctrlKey === true) || 
					 // Allow: home, end, left, right
					(e.keyCode >= 35 && e.keyCode <= 39)) {
						 // let it happen, don't do anything
						 return;
				}
				// Ensure that it is a number and stop the keypress
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
				    (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
			});
		}
	}
	
	// Validate the input value and save the legit value
	setValue(iv) {
		this._value = iv; 
	}	
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._value;
	}
	
	// get the input UI element id 
	get myId() {
		return `tx_formatter_input_${this.id}`;
	}
	
	// get XML element for parent control if I am serving as a sub-control
	get xmlElement() {
		return {tag: 'strv', obj: this._value};
	}
	
	// This method is called after the UI is rendered to display its
	// input value
	setDisplayValue() {
		// _value should be formatted to start with
		if (this._value) {
			const selector = `#${this.myId}`;
			// set the text value of ui
			$(selector).val(this._value);
		}
	}
	
	// Over-ride: get value object 
	get value() {
		return this._value;
	}
	
	// get display html for the entire component with label and text input
	get displayHtml() {
		const clssStr= this.uiClass;
		const htmlStr = q_template_text_input
							.replace(new RegExp(replacementForId, 'g'), this.id)
							.replace(replacementForLabel, this.label)
							.replace(replacementFordDivId, `${this.wrapperDivId}`);
		return htmlStr; 
	}
	
	// get read-only display html for the address combination
	get displayHtmlReadOnly() {
		return	q_template_text_ro
							.replace(replacementForLabel, this.label)
							.replace(replacementForValue,this._value);
	}
	
	// get the question in xml format for saving to API server
	get serverXML() {
		let ret = '';
		if (this.onValidating()) {
			ret  =
				`<qa>
					<id>${this.id}</id>
					<strv>${this._value}</strv>
				</qa>
				`;
		} 
		return ret;
	}
}  

export { UserFormatterText };