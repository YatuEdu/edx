import {UserQuestionBase} 		from './q_base.js';
import {StringUtil} 			from './util.js';
import {UserCompositeControl}	from './q_composite_control.js'

const replacementForComponents = '{components_html}';
const replacementForId = '{id}';

const q_template_components = `
<div id="fm_composite_{id}">
{components_html}
</div>`;


class UserCompositeControlWithTwoDropdowns extends UserCompositeControl {  
    #defaultPrompt;
	
    constructor(qInfo, componentList, defaultPrompt){  
        super(qInfo, componentList, true);  
		this.#defaultPrompt = defaultPrompt;
    }  
	
	
	// pass the state down
	// if the first dropdown has the "prompt" value, show the second drop down
	// otherwise hide it.
	handlePeerStateChange(state) {
		if (state.sv1 === this.#defaultPrompt) {
			this._components[1].show();
		}
		else {
			this._components[1].hide();
		}
	}
}  

export { UserCompositeControlWithTwoDropdowns };