import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Pagination} from "../../core/pagination.js";

const pageTemplate = `
<div id="myApplicationRoot">MyApplication .</div>
`;

class MyApplication {
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

export {MyApplication}