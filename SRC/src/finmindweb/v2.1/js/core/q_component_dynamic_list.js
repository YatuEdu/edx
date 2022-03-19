import {UserQuestionBase} 			from './q_base.js';
import {REMOVE_BTN_CLASS} 			from './q_dyn_list_component.js';

const replacementForComponents = '{components_html}';
const replacementForHeaderLabel  = '{hdrlb}';
const replacementForHeaders  = '{headers}';

const DEFAULT_NO_COMPONENT = 2;
const MAX_NO_COMPONENT = 20;

const  q_template_header =`
	<div class="col">
	<label>{hdrlb}</label>
  </div>
  `;
 
  
const q_template_component_list = `
<div class="row gx-5 gy-4 bg-white shadow my-5 p-4 position-relative" id="fm_wz_div_component_list">
   {components_html}
</div>
<div class="row g-0 px-3 px-md-0">
  <div class="col">
	<a id="fm_wz_btn_add_more" class="btn btn-success btn-sm py-0 rounded-pill d-inline-flex ms-3">
		<img src="../img/ico-add-btn.svg" class="me-1">
		Add New
	</a>											
  </div>
</div>
`;

class ComponentListControl extends UserQuestionBase {  
 	#elementControlList;	// list of current components
	#defaultNoComponents;
	#minimumElement;
	
    constructor(qInfo, components, defaultNumberOfElement, minimumElem){  
        super(qInfo);
		this.#minimumElement = minimumElem;	
		this.#defaultNoComponents = defaultNumberOfElement ? defaultNumberOfElement:DEFAULT_NO_COMPONENT; 
		const componentList = components ? components : [];
		this.#elementControlList = [];
		const len = componentList.length;
		
		// add control for existing beneficiaries
		for (let i = 0; i < len; i++) {
			const control = this.v_createElementControl(componentList[i], qInfo.attr_id, i);
			this.#elementControlList.push(control);
		}
		// add more if needed
		if (len === 0) {
			this.addMoreComponents(this.#defaultNoComponents);
		}
    }  
	
	/*
		Abstract methods that need to be overriden
	*/
		
	// get Label text for nth component
	v_getHeaderLable(n) {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// get the header length
	get v_numberOfHeaders() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// create a new element object
	v_createDefaultElement(n) {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// create a new element control
	v_createElementControl(n) {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// validation error message
	v_getErrorMsg() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	/*
		Add ui compoenent for entering new components	
	*/
	addMoreComponents(noElement, outList) {
		const existingCompNo = this.#elementControlList.length;
		for (let i = 0; i < noElement; i++) {
			const element = this.v_createDefaultElement(i);
			const component = this.v_createElementControl(element, this.qInfo.attr_id, existingCompNo+i);
			this.#elementControlList.push(component);
			
			// also add to output list if provides
			if (outList) {
				outList.push(component);
			}
		}
	}

	
	/*
		Add ui compoenents for entering more beneficiaries
		
	*/
	handleAddMore(e) {
		e.preventDefault();
		
		// HAVE WE REACHED MAX allowed beneficiaries?
		const existing = this.#elementControlList.length;
		if (existing >= MAX_NO_COMPONENT) {
			alert('Max number of beneficiary reached!');
			return;
		}
		const outList = [];
		const noAdd = 1;
		this.addMoreComponents(noAdd, outList);
		
		// display newly added components:
		let blockHtml ='';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < outList.length; i++ ) {
			blockHtml += outList[i]
							.displayHtml;
		}
		
		// append html to the end of the div
		$('#fm_wz_div_component_list').append(blockHtml);
		
		// hokk up events for added components
		this.onComponetChangeEvent(existing)
	}
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		let ret = true;
		for (let i = 0; i < this.#elementControlList.length; i++) {
			if (!this.#elementControlList[i].onValidating()) { 
				alert('Missing data!');
				ret = false;
				break;
			}
		}
		
		const err = this.v_getErrorMsg();
		if ( err) {
			alert(err);
			return false;
		}
		
		return true;
	}
	
	// Method for hooking up event handler to handle individule conment events
	onComponetChangeEvent(start) {
		const list = this.#elementControlList;
		for (let i = start; i < list.length; i++) {
			if (list[i].onChangeEvent) { 
				list[i].onChangeEvent();
			}
		}
		
		// hook up remove button with each row
		const selector = `.${REMOVE_BTN_CLASS}`;
		$(selector).click(this.handleRemove.bind(this));
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
		if (this.#elementControlList.length <= this.#minimumElement) {
			alert("You need at least " + this.#minimumElement + " element");
			return;
		}
		
		// find the control and remove it from our list as well
		const ctrl = this.#elementControlList.find(b => b.removeButtonId === e.target.id);			
		const rowId = `#${ctrl.rowId}`;
		$(rowId).remove();
		
		// get a list without the removed one
		this.#elementControlList =  this.#elementControlList.filter(b => b.removeButtonId !== e.target.id);
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
		this.#elementControlList.forEach(
			c => c.setDisplayValue());
	}
	
	// GET the 'index' component id
	getComponentDivId(index) {
		return `fm_comp_div_${this.id}_${index}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let blockHtml ='';
		let headersHtml ='';
		
		// combine sub-control html into an entire HTML
		for (let i = 0; i < this.#elementControlList.length; i++ ) {
			blockHtml += this.#elementControlList[i]
								.displayHtml;
		}
		let htmlStr = q_template_component_list
								.replace(replacementForComponents,blockHtml);
		
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
		if (this.#elementControlList.length > 0) {
			// append sub-element nodes
			this.#elementControlList.forEach(
				e => ret += e.serverXML
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

export { ComponentListControl };