import {credMan} 							from './credMan.js'

/**
	Mother of all pages that requires authorization
 **/
class AuthPage {
	
	constructor(credMan) {
		this.authCheck();
	}
	
	/**
		Check if we are loggin in
	 **/
	 async authCheck() {
		const loggedIn = await credMan.hasLoggedIn();
		if (!loggedIn) {
			// go to login page
			window.location.href = "./login.html";
			return false;
		}
		
		this.v_init();
	 }
	
	/**
		Execute other initialization tasks
	**/
	v_init() {
		// child can override this
		return true;
	}
}

export {AuthPage};
