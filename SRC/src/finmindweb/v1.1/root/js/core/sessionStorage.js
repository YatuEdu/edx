export class SessionStoreAccess {
	#propName;
	
	constructor(propName) {
		this.#propName = propName;
	}
  
	// retrive store value by key
	getItem() {
		return sessionStorage.getItem(this.#propName);
	}
	
	// set store value by key
	setItem(str) {
		sessionStorage.setItem(this.#propName, str);
	}
	
	// remove value by key
	removeItem() {
		sessionStorage.removeItem(this.#propName);
	}
}
