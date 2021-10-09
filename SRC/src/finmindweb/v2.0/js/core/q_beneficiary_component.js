import {UserQuestionBase} 		from './q_base.js';
import {UserDateQuestion}		from './q_date.js';
import {UserDropdownSelection}  from './q_dropDown.js';
import {MetaDataManager}		from './metaDataManager.js';
import {UIComponentFactory}		from './componentFactory.js';

const RELATIONSHIP_ENUM_ID =  50;

const replacementForId = '{id}';
const replacementForName = '{nm}';
const replacementForRelationship = '{rel_option}';
const replacementForDob = '{dob}';
const replacementForSSN = '{ssn}';
const replacementForPct = '{pct}';
const replacementForDelBtn = '{del-btn}';

/* The following is the template for all the info needed for a beneficiary:

   Note that DOB text field uses the same class format of that of 'UserDateQuestion' so that its event handler
   can be invoked when date text changes.
   
*/
const q_template_delete_button = `
<div class="text-end position-absolute top-0 end-0 translate-middle-y">
	<a id="fm_wz_btn_clss_remove_beneficiary_{id}" 
	   class="btn btn-danger btn-sm py-0 rounded-pill d-inline-flex fm_wz_btn_clss_remove_one_beneficiary">
		<img src="img/ico-delete-btn.svg" class="me-1">
		Delete
	</a>
</div>`;

const q_templete_beneficiary_component = `
<div id="beneficiary_row_{id}" class="row gx-5 gy-4 bg-white shadow my-4 p-4 position-relative">
	{del-btn}
  <div class="col-4">
    <label for="Name" class="form-label">Name</label>
	<input type="text" id="beneficiary_name_{id}" class="form-control form-control-lg" placeholder="Name" value="{nm}" size="16" maxlength="32"/>
  </div>
  <div class="col-4">
  <label for="Relationship" class="form-label">Relationship</label>
  {rel_option}
  </div>
  <div class="col-4">
    <label for="Dateofbirth" class="form-label">Date of birth</label>
	<input type="date" id="beneficiary_dob_{id}" name="dob"  class="form-control form-control-lg date_for_{id}" placeholder="Date of Birth" value="{dob}" size="10" maxlength="11"/>
  </div>
  <div class="col-4">
    <label for="SSN" class="form-label">SSN</label>
	<input type="text" name="ssn" id="tx_formatter_input_{id}" class="form-control form-control-lg" placeholder="SSN" value="{ssn}" size="11"  maxlength="11"/>
  </div>
  <div class="col-4">
    <label for="Percent" class="form-label">Percent</label>
	<input type="number" min="1"  max="100" step="1" size="3"  id="beneficiary_pct_{id}" class="form-control form-control-lg" value="{pct}"/>
  </div>
</div>
`;

class UserBeneficiaryComponent {
	_attrId;
	_componentId;
	_name;
	_relation;
	_dob;
	_ssn;
	_pct;
	_ssnRegex;
	#canRemove;
	
	/*
		beneficiaryInfo is an object like : 
		{name: 'ly", relation: "child", ssn: "123-34-3456", dob: '2003-6-23", pct: 33 }
	*/
	 constructor(beneficiaryInfo, attrId, componentId, canRemove){ 
		this._attrId 		= attrId;
		this._componentId 	= componentId;
		this._name 			= beneficiaryInfo.name;
		this.#canRemove		= canRemove;
		const id 			= this.controlId; 

		// use UserDateQuestion for date validation and formating
		const dateInfo = {attr_id: id, attr_label: "", sv1: beneficiaryInfo.dob};
		this._dob = new UserDateQuestion(dateInfo); 
		
		// use UserDropdownSelection for relationship
		const relationInfo = {attr_id: id, attr_label: "", sv1: beneficiaryInfo.relationship};
		this._relation = new UserDropdownSelection(relationInfo, MetaDataManager.enumMap.get(RELATIONSHIP_ENUM_ID), 0, true);
		
		// use 'UserFormatterText' for SSN field
		const ssnInfo = {attr_id: id, attr_name: "ssn", attr_label: "", sv1: beneficiaryInfo.ssn};
		this._ssn = UIComponentFactory.createTextField(ssnInfo);
		
		this._pct = beneficiaryInfo.percentage;		
    } 
		
	get controlId() {
		return `${this._attrId}_${this._componentId}`;
	}
	
	get removeButtonId() {
		return `fm_wz_btn_clss_remove_beneficiary_${this.controlId}`;
	}
	
	get nameTextId() {
		return `beneficiary_name_${this.controlId}`;
	}
	
	get pctTextId() {
		return `beneficiary_pct_${this.controlId}`;
	}
	
	set name(n) {
		this._name = n;
	}
		
	get pct() {
		return this._pct;
	}
	
	set pct(n) {
		this._pct= parseInt(n, 10);
	}
	
	get rowId() {
		return `beneficiary_row_${this.controlId}`;
	}
	
	// dob needs to handle change event for validation of date formating
	onChangeEvent() {
		this._dob.onChangeEvent();
		this._relation.onChangeEvent();
		this._ssn.onChangeEvent();
		
		// name blur event:
		const self = this;
		
		// pct blur event:
		const pctSelector = `#${this.pctTextId}`;
		$(pctSelector).blur(function() {
			self.pct = $(this).val();
		});
		
		//when text edit is done, set the value ffrom the text field:
		const nameSelector = `#${this.nameTextId}`;
		$(nameSelector).blur(function(e) {
			e.preventDefault();
			self.name = $(this).val();
		});
	}
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		return this._dob.onValidating() &&
			   this._name &&
			   this._ssn.onValidating() &&
			   this._relation.onValidating();
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let del = ''; 
		if (this.#canRemove) {
			del = q_template_delete_button
					.replace(replacementForId,this.controlId);
		}
		const htmlStr = q_templete_beneficiary_component
							.replace(replacementForDelBtn, del)
							.replace(new RegExp(replacementForId, 'g'),this.controlId)
							.replace(replacementForName, this._name)
							.replace(replacementForRelationship, this._relation.displayHtml)
							.replace(replacementForDob, this._dob.value)
							.replace(replacementForSSN, this._ssn.value)
							.replace(replacementForPct, this._pct);	
		return htmlStr; 
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		// set initial radio selection if selection value is presented:
		this._dob.setDisplayValue();
		this._ssn.setDisplayValue();
		this._relation.setDisplayValue();
	}
	
	// get the beneficiaries in xml format for sending to finMind 
	// API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret =  
`<e>
	<a1>${this._name}</a1>			
	<a2>${this._ssn.value}</a2>	
	<a3>${this._relation.value}</a3>			
	<a4>${this._dob.value}</a4>		
	<a5>${this._pct}</a5>				
</e>`;
		}
		return ret;
	}
}


export { UserBeneficiaryComponent };