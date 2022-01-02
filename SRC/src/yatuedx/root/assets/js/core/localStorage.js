export class LocalStoreAccess {
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
