import {DynamicListElement} 	from './q_dyn_list_component.js';
import {UserDropdownSelection} 	from './q_dropDown.js';
import {MetaDataManager} 		from './metaDataManager.js';

const INSURANCE_ENUM_ID =  60;
const YESNO_ENUM_ID = 13;

const replacementForSubElementIdName  = '{sbelemidn}';
const replacementForSubElementIdPolicy  = '{sbelemidp}';
const replacementForInsElement  = '{rel_option_ins_company}';
const replacementForReplaceElement  = '{rel_option_replace}';
const replacementForPolNoElement  = '{polno}';
const replacementForInsNameElement  = '{insname}';
const replacementForDelBtn = '{del-btn}';
const replacementForId = '{id}';

const INSNAME = 1;
const POLICY = 2;
const REPLACE = 3;
const YES = 'Yes';
const NO = 'No';

const q_template_delete_button = `
<div class="text-end position-absolute top-0 end-0 translate-middle-y">
	<a id="fm_wz_btn_remove_element_{id}" 
	   class="btn btn-danger btn-sm py-0 rounded-pill d-inline-flex fm_wz_btn_clss_remove_one_component">
		<img src="img/ico-delete-btn.svg" class="me-1">
		Delete
	</a>
</div>`;


const q_templete_dyn_list_column = `
<div id="dynlist_element_row_{id}" class="row gx-5 gy-4 bg-white shadow my-4 p-4 position-relative">
  {del-btn}
 <div class="col-4">
  <label for="CompanyName" class="form-label">Company Name</label>
  <input type="text" id="{sbelemidn}" class="form-control form-control-lg" placeholder="Please enter" value="{insname}" size="16" maxlength="32"/>
 </div>
 <div class="col-4">
    <label for="PolicyNumber" class="form-label">Policy Number</label>
	<input type="text" id="{sbelemidp}" class="form-control form-control-lg" placeholder="Please enter" value="{polno}" size="16" maxlength="32"/>
 </div>
 <div class="col-4">
  <label for="Replaced" class="form-label">Replaced</label>
  {rel_option_replace}
 </div>
</div>
 `;
 
 const q_templete_dyn_list_column_ro = `
<div id="dynlist_element_row_{id}" class="row gx-5 gy-4 bg-white shadow my-4 p-4 position-relative">
 <div class="col-4">
   <label for="CompanyName" class="form-label">Company Name</label>
   <span class="form-control form-control-lg">{insname}</span>
 </div>
 <div class="col-4">
    <label for="PolicyNumber" class="form-label">Policy Number</label>
	<span class="form-control form-control-lg">{polno}</span>
 </div>
 <div class="col-4">
  <label for="Replaced" class="form-label">Replaced</label>
  <span class="form-control form-control-lg">{rel_option_replace}</span>
 </div>
</div>
 `;
 
class InsuranceInfoComponent extends DynamicListElement {  
	#name;
	#policyNo;
	#replace;
	#replaceStr;
	
	 constructor(insData, attrId, compId){  
        super(attrId, compId); 

		// use UserDropdownSelection for insurance companies
		this.#name = insData.name ? insData.name : '';
		this.#policyNo = insData.policy ? insData.policy: '';
		
		// use 'DROP DOWN LIST FOR YES/NO' for REPLACE control
		const id3 = this.subElementId(REPLACE);
		const replaceStr = insData.replace? YES : NO;
		const replaceInfo = {attr_id: id3, attr_name: "ssn", attr_label: "", sv1: replaceStr};
		this.#replace = new UserDropdownSelection(replaceInfo, MetaDataManager.enumMap.get(YESNO_ENUM_ID), 0, true);
	}	
	
	/*
		Abstract methods that need to be overriden
	*/
	
	v_getHtml() {
		let del = q_template_delete_button
					.replace(replacementForId,this.controlId);
		
		return q_templete_dyn_list_column
					.replace(replacementForDelBtn, del)
					.replace(replacementForSubElementIdName, this.subElementId(INSNAME))
					.replace(replacementForSubElementIdPolicy, this.subElementId(POLICY))
					.replace(replacementForReplaceElement, this.#replace.displayHtml)
					.replace(replacementForInsNameElement, this.#name)
					.replace(replacementForPolNoElement, this.#policyNo);
	}
	
	v_getHtmlReadOnly() {
		return q_templete_dyn_list_column_ro
					.replace(replacementForSubElementIdName, this.subElementId(INSNAME))
					.replace(replacementForSubElementIdPolicy, this.subElementId(POLICY))
					.replace(replacementForReplaceElement, this.#replace.value)
					.replace(replacementForInsNameElement, this.#name)
					.replace(replacementForPolNoElement, this.#policyNo);
	}
	
	// validating before saving
	onValidating() {
		if (!this.#policyNo) {
			alert('Missing policy number');
			return false;
		}
		
		if (!this.#name) {
			alert('Missing insurance company name');
			return false;
		}
		
		if (!this.#replace.onValidating()) {
			alert('Missing replace flag');
			return false;
		}
		
		return true;
	}
	
	// Hook up event handler with the UI element
	onChangeEvent() {
		const self = this;
		// policy change
		const selectorPolicy = `#${this.subElementId(POLICY)}`;
		$(selectorPolicy).blur(function() {
			self.policyNo = $(this).val();
		});
		
		// name change
		const selectorName = `#${this.subElementId(INSNAME)}`;
		$(selectorName).blur(function() {
			self.insuranceName = $(this).val();
		});
		
		// replace change
		this.#replace.onChangeEvent();
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		
		// replace change
		this.#replace.setDisplayValue();
	}
	
	// set insurance name
	set insuranceName(insn) {
		this.#name = insn;
	}
	
	// set policy number
	set policyNo(pn) {
		this.#policyNo = pn;
	}

	// get the components in xml format for sending to finMind 
	// API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			const doReplace = this.#replace.value === YES ? 1 : 0;
			ret =  
`<e>
	<a1>${this.#name}</a1>			
	<a2>${this.#policyNo}</a2>	
	<a3>${doReplace}</a3>							
</e>`;
		}
		return ret;
	}
}

export {InsuranceInfoComponent};


