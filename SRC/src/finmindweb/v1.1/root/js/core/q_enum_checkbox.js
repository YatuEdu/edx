import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForClass = '{clss}';
const replacementQuestion = '{qst}';
const replacementForName = '{nm}';
const replacementForIndex = '{indx}';
const replacementForValue = '{vlu}';
const replacementForCheckBoxGroup = '{cbg}';

const q_template_enum_single_old = `
	<input 	type="checkbox" 
			name="{nm}" 
			class="{clss}"
			data-indx="{indx}"
			value="{vlu}">{vlu}<br>`;
			
const q_template_enum_single = `
<div class="div-block-62">
	<div class="div-block-61"><label class="w-checkbox checkbox-field-3 _3">
		<div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-3"></div>
		<input type="checkbox" class="{clss}" id="checkbox-3" name="{nm}" value="{vlu}" data-indx="{indx}" data-name="Checkbox 3">
		<span class="radio-button-label-2 w-form-label">{vlu}</span>
	  </label></div>
	<div data-hover="1" data-delay="0" class="tip w-dropdown">
	  <div class="tip-toggle w-dropdown-toggle"><img src="../images/help-circle.svg" loading="eager" alt=""></div>
	  <nav class="tip-list w-dropdown-list">
		<div class="tip-text">There should be some explanation here.</div>
	  </nav>
	</div>
</div>
`;

		
const q_template_enum_multiple = `
<form>      
    <fieldset>          
        {cbg}  
    </fieldset>      
</form>
`;
	
class UserEnumQuestionCheckbox extends UserQuestionBase {  
    _enumValues; 
	_value;
	
    constructor(qInfo, enumValues){  
        super(qInfo);  
        this._enumValues = enumValues;
		if (qInfo.sv1) {
			this._value = StringUtil.convertStringToArray(qInfo.sv1);
		} 
		else {
			this._value = [];
		}
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		// make sure all the index value is in range and no duplicates found
		if (!Array.isArray(this._value)) {
			return false;
		}
		const indxSet = new Set(this._value);
		
		// detect duplicates
		if (this._value.length != indxSet.size) {
			return false;
		}
		// detect range error
		if (undefined !== this._value.find(e => e >= this._enumValues.length || e < 0) ) 
		{
			return false;
		}
		return true;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const classSelector = `.${this.groupClass}`;
		const self = this;
		
		$(classSelector).change(function(){
			// get all the indexs of the selected items
			const checkboxes = $(classSelector); 
			self._value = [];			
			for(var i = 0; i < checkboxes.length; i++) {
				if(checkboxes[i].checked){
					const inx = $(checkboxes[i]).attr("data-indx");
					self._value.push(inx);
				}
			}			
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		this._value = obj;
		if (!Array.isArray(obj) || !this.onValidating() ) {
			throw new Error('invalid value for question ' + this.id);
		}
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this.getSerializedValue();
	}
	getSerializedValue() {
		let sv = '';
		for(let i = 0; i < this._value.lenght; i++) {
			if (i > 0) {
				sv += ',';
			}
			sv += this._value[i];
		}
		return sv;
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		if (this._value.length ==0 ) {
			return;
		}
		const classSelector = `.${this.groupClass}`;
		// get all the indexs of the selected items
		const checkboxes = $(classSelector); 			
		for(var i = 0; i < checkboxes.length; i++) {
			const target = checkboxes[i];
			const inxStr = $(target).attr("data-indx");
			const index = parseInt(inxStr, 10);
			if (this._value.includes(index)) {
				$(target).prop('checked', true);
			}
			else {
				$(target).prop('checked', false);
			}
		}			
	}
	
	// get radio class 
	get groupClass() {
		return `enum_multi_for_${this.id}`;
	}
	
	// get radio (group) nsme 
	get groupName() {
		return `name_for_${this.id}`;
	}
	
	// get display html for the entire enum group in form of checkboxes
	get displayHtml() {
		const clssStr= this.groupClass;
		const name = this.groupName;	
		let htmlStrGroup = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			htmlStrGroup += q_template_enum_single
									.replace(replacementForClass, clssStr)
									.replace(replacementForName, name)
									.replace(replacementForIndex, i)
									.replace(new RegExp(replacementForValue, 'g'),theValue);	
		}
		let htmlStr = q_template_enum_multiple
									.replace(replacementQuestion, this._qText)
									.replace(replacementForCheckBoxGroup,htmlStrGroup); 
		return htmlStr; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret = '';
		if (this.onValidating()) {
			ret = `
<qa>
	<id>${this.id}</id>	
	{body}
</qa>`;
			let body = '';
			this._value.forEach(i => body += `<indx>${i}</indx>`);
			ret = ret.replace('{body}', body);
		}
		return ret;
	}
}  

export { UserEnumQuestionCheckbox };