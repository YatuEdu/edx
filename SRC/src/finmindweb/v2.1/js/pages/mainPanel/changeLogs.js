import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'

const pageTemplate = `
<div>changeLogs .</div>
`;

class ChangeLogs {
	#container;
	
    constructor(container) {
		this.#container = container;
		this.init();
	}
	
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
    	console.log('changeLogs init');
	}


}

export {ChangeLogs}