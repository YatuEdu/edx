import {InsuranceInfoComponent} from './q_insuranceInfo_component.js';
import {ComponentListControl} 	from './q_component_dynamic_list.js'

class  InsuranceInfoComponentDynList extends ComponentListControl {  
	#labelList;
	
    constructor(qInfo, componentList, defNoComp, minimumElem, labelList){  
        super(qInfo, componentList, defNoComp, minimumElem); 
		this.#labelList = labelList;		
	}	
	
	/*
		Abstract methods that need to be overriden
	*/
		
	// get Label text for nth component
	v_getHeaderLable(n) {
		return this.#labelList[n];
	}
	
	// get the header length
	get v_numberOfHeaders() {
		return this.#labelList.length;
	}
	
	// create a new element object
	v_createDefaultElement(element, attr_id, n) {
		return {};
	}
	
	// create a new element control
	v_createElementControl(element, attr_id, n) {
		return new InsuranceInfoComponent(element, attr_id, n);
	}
	
	// validation error message
	v_getErrorMsg() {
		return '';
	}
	
}


export { InsuranceInfoComponentDynList };
