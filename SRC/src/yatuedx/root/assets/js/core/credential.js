import {sysConstants, languageConstants} from './sysConst.js'
import {LocalStoreAccess} from './localStore.js';
import {uiMan} from './uiManager.js';
import {remoteCall} from './net.js';

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
		
		// clear previous auth info before new login request
		this.private_clear();
		
		// call remote API
		const ret = await remoteCall(sysConstants.YATU_AUTH_URL, requestOptions);
		
		// error?
		if (ret.err) {
			// TO DO: GO TO ERROR PAGE
			this.#authError = ret.err;
		}
		else {
			// got result in data:
			this.private_login({name: userName, token: ret[0].token, email: ''});
		}
		return this.#authError;
	}
	
	// call remote auth server to sign in a user
	async signUp(userName, email, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 202101
			},
			
			data: {					
				name: userName,
				email: email,
				fistName: userName,
				lastName: userName,
				pwh: sha256(sha256(userPassword))
			}
		};
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		};
		
		// clear previous auth info before new login request
		this.private_clear();

		// remote call
		const ret = await remoteCall(sysConstants.YATU_AUTH_URL, requestOptions);
		return ret.err;
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