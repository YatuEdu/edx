import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';

const replacementForComponents = '{components_html}';
const replacementForId = '{id}';

const q_template_components = `
<div>
{components_html}
</div>`;


class UserMultiControl extends UserQuestionBase {  
    _components;	// list of components
	
    constructor(qInfo, componentList){  
        super(qInfo);  
		this._components  = componentList
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		let validated = true;
		for(let i = 0; i < this._components.length; i++） {
			if ( this._components[i].onValidating) {
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
	
	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {
		let componentHtml ='';
		// combine sub-control html into an entire HTML
		this._components.forEach(
			c => componentHtml += c.displayHtml;
		);
		let htmlStr = q_template_components
								   .replace(replacementForComponents,componentHtml);
		
		return htmlStr; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret = 
`<qa>
<id>${this.id}</id>
<strv>${this._first}</strv>
<strv2>${this._middle}</strv2>
<strv3>${this._last}</strv3>
</qa>`;
		}
		return ret;
	}
}  

export { UserNameQuestion };