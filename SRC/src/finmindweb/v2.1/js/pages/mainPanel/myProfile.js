import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'

const pageTemplate = `
<div>myProfile .</div>
`;

class MyProfile {
	#container;
	
    constructor(container) {
		this.#container = container;
		this.init();
	}
	
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
    	console.log('myProfile init');
	}


}

export {MyProfile}