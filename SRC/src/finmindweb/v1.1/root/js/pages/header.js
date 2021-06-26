import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';

/**
	This class manages both login and sigup workflow
**/
class HomeAndWizardHeader {
	#credMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init_prv();
	}
	
	// hook up events
	async init_prv() {
		// decide if I am logged in or not
		const loggedIn = await credMan.hasLoggedIn();
		
		// if logged in
	}
	
	get credMan() { 
		return this.#credMan; 
	}
}


export { HomeAndWizardHeader };
