class LocalStoreAccess {
	#propName;
	
	constructor(propName) {
		this.#propName = propName;
	}
  
	// retrive store value by key
	getItem() {
		return localStorage.getItem(this.#propName);
	}
	
	// set store value by key
	setItem(str) {
		localStorage.setItem(this.#propName, str);
	}
	
	// remove value by key
	removeItem() {
		localStorage.removeItem(this.#propName);
	}
}

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

const sysConstants = {
	yatuCredStoreKey: "yatu_cred_8838",
};
const store = new LocalStoreAccess(sysConstants.yatuCredStoreKey);
const credMan = new CredentialManager(store);
credMan.login( {name: 'test001', email: 'unknown', token: 'abc123!' } );
print( localStorage.getItem("yatu_cred_8838"));
print (credMan.credential.token);