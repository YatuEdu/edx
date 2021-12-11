import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const SIGNUP_PATH="./register.html";
const USER_APPLICATION_PATH="../user/myApplication.html";

/**
	This class manages both login and sigup workflow
**/
class LoginPageHandler {
	#credMan;
	#uiName;
	#uiPw;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	init() {
		$( "#fm_login_button" ).click(this.handleLogin.bind(this));
		$( "#fm_signup_link" ).click(this.handleGotoSignup);
		$( "#fm_email" ).focusout(this.validateInput)
		$( "#fm_password" ).focusout(this.validateInput);
	}
	
	// handling input focus loss to check valid input
	// add error message <p> element if empty text for the necessary fields
	validateInput(e) {
		e.preventDefault();
		if (!$(this).val()) {
			$(this).next('p').remove();
			const dataId = $(this).attr('data-text-id');
			const warning = uiMan.getText(dataId);
			$(this).after( `<p style="color:red;">${warning}</p>` );  
		} else {
			$(this).next('p').remove();
		}
	}
	
	// go to sign up page
	handleGotoSignup() {
		window.location.href = SIGNUP_PATH;
	}
	
	// signin submit request to server
	async handleLogin(e) {
		e.preventDefault();
		
		// remove the error message if any
		//$(e.target).next('p').remove();
		
		// retrieve data from UI
		const email = $("#fm_email").val().trim();
		const pw = $("#fm_password" ).val().trim();
		if (!email || !pw) {
			alert('need email and password!');
			return;
		}

		// for log in
		await this.#credMan.authenticate(email, pw);
		if (!this.#credMan.lastError) {
			// go to my page
			window.location.href = USER_APPLICATION_PATH;
		}
		else {
			// dispaly error message
			$(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` ); 
		}
	}
}

export {LoginPageHandler};
