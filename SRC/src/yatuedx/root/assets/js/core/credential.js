import {sysConstants, languageConstants} from './sysConst.js'
import {LocalStoreAccess} from './localStore.js';
import {uiMan} from './uiManager.js';

class CredentialManager {
	#userCredInfo = {name: '', token: '', email: ''};
	#authError;
	#store;
	
	/**
		public methods
	**/
    constructor(store) {
		this.#store = store;
		
		if (this.#store.getItem()) {
			this.#userCredInfo  = JSON.parse(this.#store.getItem());
		}
	}
	
	// call remote auth server to sign in a user
	async authenticate(userName, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 202102
			},
			data: {					
				name: userName,
				pwh: sha256(sha256(userPassword))
			}
		};
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		};

		
		try {
			// clear previous auth info before new login request
			this.private_clear();
			
			const response = await fetch(sysConstants.YATU_AUTH_URL, requestOptions);
			
			if (!response.ok) {
				const message = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, response.status);
				throw new Error(message);
			}
			let authToken = null;
			const data = await response.json();
			if (data.result.code === 0) {
				authToken = data.data[0].token; 
				this.private_login({name: userName, token: authToken, email: ''});
			}
			else {
				this.#authError = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, data.result.code);
			}
			
		}
		catch (err) {
			this.#authError = err;
		}
		
		return this.#authError;
	}
	
	
	// Getter get credential info
	get credential() {
		return this.#userCredInfo;
	}
	
	// Getter last error
	get lastError() {
		return this.#authError;
	}
	
	/**
		private methods
	 **/
	 
	// after logged in successfully
	private_login(cred) {
		this.#userCredInfo = cred;
		const authStr = JSON.stringify(cred);
        this.#store.setItem(authStr);
	}
	
	// clear auth info prior to new login request
	private_clear() {
		this.#authError = null;
        this.#store.removeItem();
		this.#userCredInfo = {name: '', token: '', email: ''};
	}
	
}

const store = new LocalStoreAccess(sysConstants.YATU_CRED_STORE_KEY);
const credMan = new CredentialManager(store);
export { credMan };