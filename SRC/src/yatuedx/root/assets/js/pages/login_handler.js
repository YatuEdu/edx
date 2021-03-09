import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class manages both login and sigup workflow
**/
class LoginPageHandler {
	#credMan;
	#uiName;
	#uiPw;
	#forSignup;  // for signing up html if true
	
    constructor(credMan, forSignup) {
		this.#credMan = credMan;
		this.#forSignup = forSignup;
		this.init();
	}
	
	// hook up events
	init() {
		$( "#auth_button" ).click(this.handleSubmit.bind(this));
		$( "#user_name" ).focusout(this.validateInput)
		$( "#user_password" ).focusout(this.validateInput);
		if (this.#forSignup) {
			$( "#user_email" ).focusout(this.validateInput);
		}
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
	
	// signin submit request to server
	async handleSubmit(e) {
		e.preventDefault();
		
		// remove the error message if any
		$(e.target).next('p').remove();
		
		// retrieve data from UI
		const name = $("#user_name").val().trim();
		const pw = $("#user_password" ).val().trim();
		if (!name || !pw) {
			return;
		}

		// for log in
		if (!this.#forSignup) {
			await this.#credMan.authenticate(name, pw);
			if (!this.#credMan.lastError) {
				// go to my page
				window.location.href = "./landing.html";
			}
			else {
				// dispaly error message
				$(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` ); 
			}
		}
		// for sign up
		else
		{
			const email = $("#user_email").val().trim();
			await this.#credMan.signUp(name, email, pw);
			if (!this.#credMan.lastError) {
				// go to login page to log in
				window.location.href = "./login.html";
			}	
			else {
				// dispaly error message
				$(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` ); 
			}			
		}
	}
}

export {LoginPageHandler};
