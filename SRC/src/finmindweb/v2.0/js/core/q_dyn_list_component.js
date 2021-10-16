
const replacementForElementColumn  = '{elem_clmn_html}';
const replacementForId = '{id}';
const replacementForRemoveBtnClass = '{rmbtnclss}';
const REMOVE_BTN_CLASS = 'fm_wz_btn_clss_remove_one_component';

const q_templete_dyn_list_column = `
<div id="dynlist_element_row_{id}" class="row g-0 px-3 px-md-0">
	{elem_clmn_html}
</div>
`;

class DynamicListElement {
	_attrId;
	_componentId;
	
	 constructor(attrId, componentId){ 
		this._attrId 		= attrId;
		this._componentId 	= componentId;	
    } 
	
	/*
		Abstract methods that need to be overriden
	*/
		
	// get html text 
	v_getHtml() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	// get the components in xml format for sending to finMind 
	// API server
	get serverXML() {
		throw new Error('signature: sub-class-should-overload-this');
	}
	
	/*
	   protected methods
	*/
	
	get controlId() {
		return `${this._attrId}_${this._componentId}`;
	}
	
	get removeButtonId() {
		return `fm_wz_btn_remove_element_${this.controlId}`;
	}
	
	get rowId() {
		return `dynlist_element_row_${this.controlId}`;
	}
	
	subElementId(n) {
		return `sub_element_${n}_${this.controlId}`;
	}
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		const htmlStr = q_templete_dyn_list_column
							.replace(new RegExp(replacementForId, 'g'),this.controlId)
							.replace(replacementForRemoveBtnClass, REMOVE_BTN_CLASS)
							.replace(replacementForElementColumn, this.v_getHtml());
		return htmlStr; 
	}	
}


export { DynamicListElement, REMOVE_BTN_CLASS };