import {sysConstants} from './sysConst.js'
import {LocalStoreAccess} from './localStore.js';


class CredentialManager {
	#userCredInfo = {name: '', token: '', email: ''};
	#store;
	 
    constructor(store) {
		this.#store = store;
		
		if (this.#store.getItem()) {
			this.#userCredInfo  = JSON.parse(this.#store.getItem());
		}
	}
	
	// after logged in successfully
	login(cred) {
		this.#userCredInfo = cred;
		const authStr = JSON.stringify(cred);
        this.#store.setItem(authStr);
	}
	
	// when user decide to log out
	logout() {
        this.#store.removeItem();
		this.#userCredInfo = {name: '', token: '', email: ''};
	}
	
	// Getter get credential info
	get credential() {
		return this.#userCredInfo;
	}
}

const store = new LocalStoreAccess(sysConstants.yatuCredStoreKey);
const credMan = new CredentialManager(store);
export { credMan };