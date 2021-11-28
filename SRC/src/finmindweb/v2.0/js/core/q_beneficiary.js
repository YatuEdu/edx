import {UserQuestionBase} 			from './q_base.js';
import {UserDateQuestion}			from './q_date.js'
import {UserBeneficiaryComponent} 	from './q_beneficiary_component.js'

const replacementForComponents = '{components_html}';

const MAX_NO_BENEFICIARY = 20;
const DEFAULT_BENEFICIARY_RELATION = 'Child';
const DEFAULT_BENEFICIARY_PCT =  20;
const MAX_BENEFICIARY_PCT =  100;

const q_template_beneficiaries_list = `
<div id="fm_wz_div_bene_components_container">
{components_html}
</div>
<div class="row g-0 px-3 px-md-0">
  <div class="col">
	<a id="fm_wz_btn_add_more" class="btn btn-success btn-sm py-0 rounded-pill d-inline-flex ms-3">
	  <img src="img/ico-add-btn.svg" class="me-1">
		Add New
	</a>
  </div>
  <div class="col">
	<label>Number of beneficiaries to add</label>
    <input id="fm_wz_int_more" type="number" size="3" min="1"  max="10" step="1" value="1"/>
  </div>
 </div>
</div>`;

const q_template_beneficiaries_list_ro = `
<div id="fm_wz_div_bene_components_container">
{components_html}
</div>`;

class UserBeneficiaryControl extends UserQuestionBase {  
    _beneficiaryList;			// list of current beneficiaries
	_beneficiaryControlList;	// list of current beneficiaries
	#defaultNoOfBeneficiary;
	#minimumNoOfBeneficiary;
	 
    constructor(qInfo, beneficiaryList, defaultNoOfBeneficiary, minimum){  
        super(qInfo);  
		this.#defaultNoOfBeneficiary = defaultNoOfBeneficiary;
		this.#minimumNoOfBeneficiary = minimum;
		this._beneficiaryList  = beneficiaryList ? beneficiaryList : [];
		this._beneficiaryControlList = [];
		const len = this._beneficiaryList.length;
		
		// add control for existing beneficiaries
		let canRemove =  false;
		for (let i = 0; i < len; i++) {
			const component = new UserBeneficiaryComponent(this._beneficiaryList[i], qInfo.attr_id, i, canRemove);
			canRemove = true;
			this._beneficiaryControlList.push(component);
		}
		// add more if needed
		if (len === 0) {
			this.addMoreBeneficiaryComponents(this.#defaultNoOfBeneficiary);
		}
    }  
	
	/*
		Add ui compoenent for entering new beneficiaries
		
	*/
	addMoreBeneficiaryComponents(noBeneficiary, outList) {
		// simple calculation for the default PCT for each beneficiary
		const existingPct = this.getPCT();
		const leftPct = MAX_BENEFICIARY_PCT - existingPct;
		const eachPct = leftPct > 0 ? leftPct / noBeneficiary : 0;
		const existingCompNo = this._beneficiaryControlList.length;
		
		// for beneficiary, there need to be at least one
		// for contingent beneficiary, there is no minimum restriction
		let canRemove = false;
		if (this.#minimumNoOfBeneficiary == 0 || existingCompNo > 0 ) {
			canRemove = true;
		}
			
		for (let i = 0; i < noBeneficiary; i++) {
			const beneficiary = {name: '', 
					relation: DEFAULT_BENEFICIARY_RELATION,
					dob: '',
					ssn: '',
					pct: eachPct,
			};
			
			const component = new UserBeneficiaryComponent(beneficiary, this.qInfo.attr_id, existingCompNo+i, canRemove);
			canRemove = true;
			this._beneficiaryControlList.push(component);
			
			// also add to output list if provides
			if (outList) {
				outList.push(component);
			}
		}
	}
	
	getPCT() {
		let pct = 0;
		this._beneficiaryControlList.forEach( b => pct += b.pct);
		return pct;
	}
	
	/*
		Add ui compoenents for entering more beneficiaries
		
	*/
	handleAddMore(e) {
		e.preventDefault();
		
		// HAVE WE REACHED MAX allowed beneficiaries?
		const existing = this._beneficiaryControlList.length;
		if (existing >= MAX_NO_BENEFICIARY) {
			alert('Max number of beneficiary reached!');
			return;
		}
		const outList = [];
		const noBeneficiary = $('#fm_wz_int_more').val();
		this.addMoreBeneficiaryComponents(noBeneficiary, outList);
		
		// display newly added components:
		let blockHtml ='';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < outList.length; i++ ) {
			blockHtml += outList[i]
							.displayHtml;
		}
		
		// append html to the end of the div
		$('#fm_wz_div_bene_components_container').append(blockHtml);
		
		// hokk up events for added components
		this.onComponetChangeEvent(existing)
	}
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		let ret = true;
		for (let i = 0; i < this._beneficiaryControlList.length; i++) {
			if (!this._beneficiaryControlList[i].onValidating()) { 
				alert('Missing data!');
				return false;
			}
		}
		if (this.#minimumNoOfBeneficiary > 0 && this.getPCT() !== MAX_BENEFICIARY_PCT ) {
			alert('Total percentage should be 100');
			return false;
		}
		
		return true;
	}
	
	// Method for hooking up event handler to handle individule conment events
	onComponetChangeEvent(start) {
		const list = this._beneficiaryControlList;
		for (let i = start; i < list.length; i++) {
			if (list[i].onChangeEvent) { 
				list[i].onChangeEvent();
			}
		}
		
		// hook up remove button with each row
		$('.fm_wz_btn_clss_remove_one_beneficiary').click(this.handleRemove.bind(this));
	}
	
	// Method for hooking up event handler to handle individule conment events
	onChangeEvent() {
		this.onComponetChangeEvent(0);
		
		// init event handler for "add more"
		$('#fm_wz_btn_add_more').click(this.handleAddMore.bind(this));
	}
	
	// Handle removal for one beneficiary
	handleRemove(e) {
		// cannot remove the last one
		if (this._beneficiaryControlList.length <= this.#minimumNoOfBeneficiary) {
			alert("You need at least " + this.#minimumNoOfBeneficiary + " beneficiary");
			return;
		}
		
		// find the control and remove it from our list as well
		const ctrl = this._beneficiaryControlList.find(b => b.removeButtonId === e.target.id);			
		const rowId = `#${ctrl.rowId}`;
		$(rowId).remove();
		
		// get a list without the removed one
		this._beneficiaryControlList =  this._beneficiaryControlList.filter(b => b.removeButtonId !== e.target.id);
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
		this._beneficiaryControlList.forEach(
			c => c.setDisplayValue());
	}
	
	// GET the 'index' component id
	getComponentDivId(index) {
		return `fm_comp_div_${this.id}_${index}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let blockHtml ='';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < this._beneficiaryControlList.length; i++ ) {
			blockHtml += this._beneficiaryControlList[i]
								.displayHtml;
		}
		let htmlStr = q_template_beneficiaries_list
									.replace(replacementForComponents,blockHtml);
		
		return htmlStr; 
	}
	
	/// get read-only display html for the beneficiary list
	get displayHtmlReadOnly() {
		let blockHtml ='';
		let htmlStr = '';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < this._beneficiaryControlList.length; i++ ) {
			blockHtml += this._beneficiaryControlList[i]
								.displayHtmlReadOnly;
		}
		if (blockHtml) {
			htmlStr = q_template_beneficiaries_list_ro
										.replace(replacementForComponents, blockHtml);
		}
		else {
			htmlStr = q_template_beneficiaries_list_ro
										.replace(replacementForComponents, 'None');
		}
		
		return htmlStr; 
	}
	
	// get the div id
	get myId() {
		return `fm_composite_${this.id}`;
	}
	
	// get question in xml format for saving to API server
	//  note: tag object of a control is : {tag: "str", obj: this._value};
	get serverXML() {
		const tagCounterMap = {};
		let ret =
			`<qa>
			<id>${this.id}</id>
			<list>`;	

		// get elements for all beneficiaries
		if (this._beneficiaryControlList.length > 0) {
			// append sub-element nodes
			this._beneficiaryControlList.forEach(
				c => ret += c.serverXML
			);
		}
		else {
			// empty sub-elements
			ret += '<e/>';
		}
		
		ret += '</list></qa>';
		return ret;
	}
}  

export { UserBeneficiaryControl };