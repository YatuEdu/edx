import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForClass = '{clss}';
const replacementForName = '{nm}';
const replacementForValue = '{vl}';
const replacementForId = '{id}';
const replacementForLabel = '{lb}';
const replacementForRadio = '{radio}';
const replacementForText = '{txt}';

const q_template_enum_text_group = `
<div class="row g-0 px-3 px-md-0">
	{radio}
</div>
<div class="row g-0 px-3 px-md-0">
	{txt}
</div>
`;

const q_template_enum = `
<div class="col">
	<input type="radio" data-name="Radio 5" name="{nm}" value="{vl}">
	<span class="radio-button-label-2 w-form-label">{vl}</span>
</div>`;

const q_template_enum_text = `
<div class="col" id="div_with_text_{id}">
	<label>{lb}</label>
	<input type="text" id="tx_addtional_text_input_{id}" class="fm_text_input" data-seq="1" value="" maxlength="32"/>
</div>
`;

	

class UserEnumRadioWithText extends UserQuestionBase {  
    _enumValues; 
	_value;
	_value2;
	_yesValue;
	
    constructor(qInfo, enumValues, yesValue, childId){  
        super(qInfo, childId);  
        this._enumValues = enumValues; 
		this._value = qInfo.sv1;
		this._value2 = qInfo.sv2;
		this._yesValue = yesValue;
		
		// cameral case (why?)
		//if (this._value) {
		//	this._value = StringUtil.convertToCamelCase(this._value);
		//}
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value && this._enumValues.includes(this._value)) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		const radioName = this.radioName;
		const jqName = `input[name='${radioName}']`;
		$(jqName).change(function(e){
			e.preventDefault();
			const rName = self.radioName;
			const jqStatus = `input[name='${rName}']:checked`;
			self.setValue( $( jqStatus ).val());
		});
		
		// also set text event:
		const txtField = `#${this.textId}`;
		$(txtField).blur(function() {
			self.setValue2($(txtField).val());
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		this._value = obj;
		if (typeof obj !== 'string' || !this.onValidating()) {
			
		}
		this.setTextDisplay();
	}
	
	setValue2(obj) {
		this._value2 = obj;
		if (typeof obj !== 'string' ) {
			
		}
	}
	
	setTextDisplay() {
		const txtField = `#${this.textId}`;
		const textDiv = `#${this.textDivId}`;
		
		// if value is the first, show text are, or hide text area
		if (this._value === this._yesValue){
			// display text
			$(textDiv).show();
			$(txtField).val(this._value2);
		}
		else {
			// hide text
			$(textDiv).hide();
		}
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._value;
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		if (this._value) {
			const selector = `input:radio[name=${this.radioName}][value='${this._value}']`;
			$(selector).prop('checked', true);
			
			// display text area? or hide it
			this.setTextDisplay()
		}
	}
	
	// get radio class 
	get radioClass() {
		return `enum_for_${this.id}`;
	}
	
	// get radio (group) name 
	get radioName() {
		return `name_for_${this.id}`;
	}
	
	// get radio id
	get radioId() {
		return `radio_${this.id}_${this._value}`;
	}
	
	// get text id
	get textId() {
		return `tx_addtional_text_input_${this.id}`;
	}
	
	// get text div id
	get textDivId() {
		return `div_with_text_${this.id}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const clssStr= this.radioClass;
		const name = this.radioName;	
		let htmlRadio = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			htmlRadio += q_template_enum
										.replace(replacementForClass, clssStr)
										.replace(replacementForName, name)
										.replace(replacementForId, this.id)
										.replace(new RegExp(replacementForValue, 'g'),theValue);	
		}
		// text box for extra text input
		const htmlText = q_template_enum_text
									.replace(new RegExp(replacementForId, 'g'), this.id)
									.replace(replacementForLabel, this.label);
		
		const htmlRadioAndText = q_template_enum_text_group
									.replace(replacementForRadio, htmlRadio)
									.replace(replacementForText, htmlText);
		
		return htmlRadioAndText; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret = 
`<qa>
<id>${this.id}</id>
<strv>${this._value}</strv>
<strv2>${this._value2}</strv2>
</qa>`;
		}
		return ret;
	}
}  

export { UserEnumRadioWithText };