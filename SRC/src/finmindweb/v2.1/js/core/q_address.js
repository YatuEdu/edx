import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';
import {MetaDataManager} from './metaDataManager.js'

const replacementForClass = '{clss}';
const replacementForName = '{nm}';
const replacementForAddr = '{addr}';
const replacementForCity = '{cty}';
const replacementForZip = '{zp}';
const replacementForId = '{id}';
const replacementForSt = '{st}';
const replacementForState = '{st_name}';
const replacementForStates = '{states}';
const replacementForStateSelect = '{state_selects}';

const state_select_html_template = `
<select class="form-select form-control-lg" id="select_state_{id}">
	{states}
</select>
`;

const state_option_item_template = `
<option value="{st}">{st_name}</option>
`;

const q_template_text = `
<div class="row mb-4">
	<div class="col">	
		<label class="form-label" for="address">Adress</label>
		<input type="text" id="address_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{addr}" maxlength="32"/>
	</div>
</div>
<div class="row mb-4">
	<div class="col">
		<label class="form-label" for="city">City</label>
		<input type="text" id="city_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{cty}" maxlength="32"/>	
	</div>
	<div class="col">
		<label class="form-label" for="state">State</label>
		{state_selects}
	</div>
	<div class="col">	
		<label class="form-label"  for="Zip code">ZipCode</label>
		<input type="text" id="zip_{id}" class="form-control form-control-lg user_name_input" data-seq="1" value="{zp}" maxlength="32"/>
	</div>
</div>`;

const q_template_text_ro = `
<div class="row mb-4">
	<div class="col">	
		<label class="form-label" for="address">Adress:</label>
		<span class="form-control form-control-lg">{addr}</span>
	</div>
</div>
<div class="row mb-4">
	<div class="col">
		<label class="form-label" for="city">City:</label>
		<span class="form-control form-control-lg">{cty}</span>
	</div>
	<div class="col">
		<label class="form-label" for="state">State</label>
		<span class="form-control form-control-lg">{st}</span>
	</div>
	<div class="col">	
		<label class="form-label"  for="Zip code">ZipCode</label>
		<span class="form-control form-control-lg">{zp}</span>
	</div>
</div>`;

class UserAdressQuestion extends UserQuestionBase {  
	_address;
	_city;
	_state;
	_zip;
	
    constructor(qInfo){  
        super(qInfo);  
		this._address = qInfo.sv1;
		this._city = qInfo.sv2;
		this._state = qInfo.sv3;
		this._zip = qInfo.sv4;
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._address && this._city && this._state && this._zip) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		
		//when text edit is done, set the value ffrom the text field:
		const addrSelector = `#${this.addressInputId}`;
		$(addrSelector).blur(function() {
			self.setAddress($(addrSelector).val());
		});
		
		const citySelector = `#${this.cityInputId}`;
		$(citySelector).blur(function() {
			self.setCity($(citySelector).val());
		});
		
		const stateSelector = `#${this.stateSelectId}`;
		$(stateSelector).change(function() {
			self.setState($(stateSelector).val());
		});
		
		const zipSelector = `#${this.zipInputId}`;
		$(zipSelector).blur(function() {
			self.setZip($(zipSelector).val());
		});

		$(zipSelector).on('input', function (e) {
			let obj = $(zipSelector).val();

			if(obj.length>5)
				obj = obj.slice(0,5);
			$(zipSelector).val(obj);
		});
		$(zipSelector).on('keypress', function (e) {
			return e.keyCode>=48 && e.keyCode<=57;
		});
	}
	
	// Setting address value
	setAddress(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._address = obj;
	}
	
	// Setting city value
	setCity(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._city = obj;
	}
	
	// Setting state value
	setState(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._state = obj;
	}
	
	// Setting zip value
	setZip(obj) {
		if (typeof obj !== 'string') {
			throw new Error('invalid value for question: ' + this.id);
		}
		this._zip = obj;
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._address;
		this.qInfo.sv2 = this._city;
		this.qInfo.sv3 = this._state;
		this.qInfo.sv4 = this._zip;
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		
		// set initial input value for addresas
		if (this._address) {
			const selector = `#${this.addressInputId}`;
			$(selector).val(this._address);
		} else {
			const selector = `#${this.addressInputId}`;
			$(selector).val('');
		}
		
		// set initial input value for city 
		if (this._city) {
			const selector = `#${this.cityInputId}`;
			$(selector).val(this._city);
		} else {
			const selector = `#${this.cityInputId}`;
			$(selector).val('');
		}
		
		// set initial state option if present
		if (this._state) {
			const selector = `#${this.stateSelectId}`;
			$(selector).val(this._state);
		}
		
		// set initial input value for zip 
		if (this._zip) {
			const selector = `#${this.zipInputId}`;
			$(selector).val(this._zip);
		} else {
			const selector = `#${this.zipInputId}`;
			$(selector).val('');
		}
	};
	
	// get address input id
	get addressInputId() {
		return `address_${this.id}`;
	}
	
	// get city input id
	get cityInputId() {
		return `city_${this.id}`;
	}
	
	// get state seledct id
	get stateSelectId() {
		return `select_state_${this.id}`;
	}
	
	// get zip input id
	get zipInputId() {
		return `zip_${this.id}`;
	}
	
	// get display html for the address combination
	get displayHtml() {
		const stateList  = MetaDataManager.enumMap.get(26); // todo: use const variable
		let stateOptions = '';
		let i = 0;
		stateList.forEach(st =>
			stateOptions += state_option_item_template
											.replace(replacementForSt, st)
											.replace(replacementForState, st)
		);
		let stateSelect = state_select_html_template
											.replace(replacementForId, this.id)
											.replace(replacementForStates, stateOptions);
		
		let htmlStr = q_template_text
											.replace(new RegExp(replacementForId, 'g') ,this.id)
											.replace(replacementForAddr, this._address)
											.replace(replacementForCity, this._city)
											.replace(replacementForZip, this._zip)
											.replace(replacementForStateSelect,stateSelect)
		
		return htmlStr; 
	}
	
	// get read-only display html for the address combination
	get displayHtmlReadOnly() {
		let htmlStr = q_template_text_ro
											.replace(new RegExp(replacementForId, 'g') ,this.id)
											.replace(replacementForAddr, this._address)
											.replace(replacementForCity, this._city)
											.replace(replacementForZip,  this._zip)
											.replace(replacementForSt,   this._state)
		
		return htmlStr; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {		
			ret = 
`<qa>
<id>${this.id}</id>
<strv>${this._address}</strv>
<strv2>${this._city}</strv2>
<strv3>${this._state}</strv3>
<strv4>${this._zip}</strv4>
</qa>`;
		}
		return ret;
	}
}  

export { UserAdressQuestion };