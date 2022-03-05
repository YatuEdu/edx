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
	
	// Store Object
	storeObj(obj) {
		const str = JSON.stringify(obj);
		this.setItem(str);
	}
	
	// Retrieve Object from saved string
	retrieveObj() {
		const str = this.getItem();
		return JSON.parse(str);
	}
	
	// remove value by key
	removeItem() {
		sessionStorage.removeItem(this.#propName);
	}
}
