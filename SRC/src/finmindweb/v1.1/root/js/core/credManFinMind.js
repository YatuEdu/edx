import {sysConstants} from './sysConst.js'
import {LocalStoreAccess} from './localStorage.js';
import {Net} from './net.js';
import {TimeUtil} from './util.js'

class CredentialManager {
	#userCredInfo = {name: '', token: '', email: '', creationTime: null};
	#authError;
	#store;
	
	/**
		public methods
	**/
    constructor(store) {
		this.#store = store;
		
		try {
			if (this.#store.getItem()) {
				this.#userCredInfo  = JSON.parse(this.#store.getItem());
			}
		}
		catch(err) {
			this.#authError = err;
		}
	}
	
	// call remote auth server to sign in a user
	async authenticate(userName, userPassword) {
		// clear previous auth info before new login request
		this.private_clear();
		
		// call remote API
		const ret = await Net.login(userName, userPassword);
		
		// error?
		if (ret.err) {
			// TO DO: GO TO ERROR PAGE
			this.#authError = ret.err;
		}
		else {
			// got result in data:
			this.update_cred({name: userName, token: ret.data[0].token, email: ''});
		}
		return this.#authError;
	}
	
	// call remote auth server to sign in a user
	async signUp(userFirstName, userMiddleName, userLastName, email, userPassword) {
		// clear previous auth info before new login request
		this.private_clear();

		// remote call to sign up
		const ret = await Net.signUp(userFirstName, userMiddleName, userLastName, email, userPassword);
		return ret.err;
	}
	
	// call remote auth server to sign-out user
	async signOut() {
		// remote call to sign out if we are signed-in
		if (this.#userCredInfo.token) {
			const ret = await Net.signOut(this.#userCredInfo.token);
			if (!ret.err) {
				// clear previous auth info before new login request
				this.private_clear();
			}
		}
	}
	
	// test if we have a valid token
	async hasLoggedIn() {
		const t = this.#userCredInfo.token;
		const tt = this.#userCredInfo.creationTime;
		if (t) {
			// yatu token still valid?
			const diff = TimeUtil.diffMinutes(tt, Date.now());
			if (diff < sysConstants.FINMIND_TOKEN_VALID_IN_MIN) {
				return true;
			}
			
			// remote call
			const ret = await Net.tokenCheck(t);
			if ( ret.code == 0 ) {
				this.update_cred(this.#userCredInfo);
				return true;
			}
			return false;
		}
		else {
			return false;
		}
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
	update_cred(cred) {
		this.#userCredInfo = cred;
		this.#userCredInfo.creationTime = Date.now();
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

const store = new LocalStoreAccess(sysConstants.FINMIND_CRED_STORE_KEY);
const credMan = new CredentialManager(store);
export { credMan };