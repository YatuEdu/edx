import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForComponents = '{components_html}';
const replacementForId = '{id}';
const replacementFordDivId = '{divid}';

const q_template_components = `
<div id="fm_composite_{id}">
{components_html}
</div>`;


class UserCompositeControl extends UserQuestionBase {  
    _components;	// list of components
	_tagList;
	_handleLowerEvent;
	
    constructor(qInfo, componentList, handleLowerEvent){  
        super(qInfo);  
		this._components  = componentList;
		this._handleLowerEvent = handleLowerEvent;
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		let validated = true;
		for(let i = 0; i < this._components.length; i++) {
			if ( !this._components[i].onValidating() ) {
				validated = false;
				break;
			}
		}
		return validated;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		this._components.forEach(
			c => c.onChangeEvent());
			
		// we can also listen to the "firt component"'s change event and do things 
		// format the text and reset the display
		if (this._handleLowerEvent) {
			const self = this;
			const selector = `#${this.myId}`;
			$(selector).change(function(e) {
				// we are at the top of the food chain
				e.stopPropagation();  
				
				// get the state from the first component and pass it to the reset of the component.
				// other components could choose to handle the state change event of the 1st component.
				self._components[0].serialize();
				const state = self._components[0].qInfo;
				
				// pass the state down
				self.handlePeerStateChange(state);			
			});
		}
	}
	
	// Handle state-change event triggered by peer component FOR those classes
	// which derives from this class.
	handlePeerStateChange(state) {
		throw new Error('handlePeerStateChange: sub-class-should-overload-this');
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
		this._components.forEach(
			c => c.setDisplayValue());
	}
	
	// GET the 'index' component id
	getComponentDivId(index) {
		return `fm_comp_div_${this.id}_${index}`;
	}
	
	// get display html for the copomsite control
	get displayHtml() {
		let componentHtml ='';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < this._components.length; i++ ) {
			componentHtml += this._components[i]
									.displayHtml;
		}
		let htmlStr = q_template_components
									.replace(replacementForId, this.id)
									.replace(replacementForComponents,componentHtml);
		
		return htmlStr; 
	}
	
	// get read-only display html for the copomsite control
	get displayHtmlReadOnly() {
		let componentHtml ='';
		// combine sub-control html into an entire HTML
		for (let i = 0; i < this._components.length; i++ ) {
			componentHtml += this._components[i]
									.displayHtmlReadOnly;
		}
		let htmlStr = q_template_components
									.replace(replacementForId, this.id)
									.replace(replacementForComponents,componentHtml);
		
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
<id>${this.id}</id>`;	

		// get subcontrol tag
		for(let i = 0; i < this._components.length; i++) {
			const tagObj = this._components[i].xmlElement;
			let element = tagObj.tag;
			if (!tagCounterMap[tagObj.tag]) {
				tagCounterMap[tagObj.tag] = 1;
			}
			else {
				tagCounterMap[tagObj.tag] = tagCounterMap[tagObj.tag] + 1;
				element = element + tagCounterMap[tagObj.tag];
			}		
			ret += `<${element}>${tagObj.obj}</${element}>`;
		}

		ret += '</qa>';
		return ret;
	}
}  

export { UserCompositeControl };