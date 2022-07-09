import {UserQuestionBase} from './q_base.js';
import {StringUtil}		  from './util.js';

const replacementForId = '{id}';
const replacementForLabel = '{lb}';
const replacementForValue = '{vl}';
const replacementFordDivId = '{divid}';

const q_template_decimal_input = `
<div class="mb-4" id="{divid}">
  <label for="attributes" class="form-label">{lb}</label>
  <input type="number" size="11" min="{min}"  max="{max}" step="1" 
       class="form-control form-control-lg {clss}" 
	   value="{val}"/>
</div>
`;

const q_template_decimal_ro = `
<div>
	<label>{lb}</label>
	<span class="form-control form-control-lg">{vl}</span>
</div>
`;

class UserDecimalQuestionText extends UserQuestionBase {
	_value;

    constructor(qInfo, childId){
        super(qInfo, childId);

		// set the existing vlaue
		this._value = qInfo.dv1;
    }

	// Method for validating the result value upon moving away
	// from the page.
	onValidating() {
		if (this._value === parseFloat(this._value)) {
			return true;
		}
		return false;
	}

	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		const selector = `#${this.myId}`;
		$(selector).change(function(e) {
			e.preventDefault();
			const obj = $(selector).val();

		    // get the integer value from input
			const iv = StringUtil.strWithCommasToInteger(obj);
			self.setValue(iv);
		});

		// Add "," per thousands
		$(selector).keyup(function (e) {
			e.preventDefault();
			const obj = $(selector).val();
			if (obj) {
				// get the integer value from input
				const iv = StringUtil.strWithCommasToInteger(obj);
				// now convert to string with comma
				$(selector).val(StringUtil.intToNumberWithCommas(iv));
			}
		});

		// prevent none digit from entering
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
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
		});
	}

	// Validate the input value and save teh legit value
	setValue(iv) {
		this._value = iv;
	}

	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.iv1 = this._value;
	}

	// get the input UI element id
	get myId() {
		return `tx_number_input_${this.id}`;
	}

	// get text input label
	get textLabel() {
		return this.qInfo.attr_label;
	}

	// This method is called after the UI is rendered to display its
	// input value
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		if (this._value) {
			const selector = `#${this.myId}`;
			// convert to string with comma
			$(selector).val(StringUtil.intToNumberWithCommas(this._value));
		}
	}

	// get display html for the control
	get displayHtml() {
		const clssStr= this.uiClass;
		const htmlStr = q_template_decimal_input
							.replace(new RegExp(replacementForId, 'g'), this.id)
							.replace(replacementForLabel, this.textLabel)
							.replace('{val}', this._value)
							.replace(replacementFordDivId, `${this.wrapperDivId}`);
		return htmlStr;
	}

	// get read-only display html for the control
	get displayHtmlReadOnly() {
		return	q_template_decimal_ro
							.replace(replacementForLabel, this.textLabel)
							.replace(replacementForValue,this._value);
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

export { UserDecimalQuestionText };
