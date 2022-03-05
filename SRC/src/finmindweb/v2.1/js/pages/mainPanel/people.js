import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'

const pageTemplate = `
<div>people .</div>
`;

class People {
	#container;
	
    constructor(container) {
		this.#container = container;
		this.init();
	}
	
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
    	console.log('people init');
	}


}

export {People}