import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'

const pageTemplate = `
<div>MyInsurancePolicies .</div>
`;

class MyInsurancePolicies {
	#container;
	
    constructor(container) {
		this.#container = container;
		this.init();
	}
	
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
    	console.log('MyApplication init');
	}


}

export {MyInsurancePolicies}