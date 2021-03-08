import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'
import {uiMan} from '../core/uiManager.js';

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
		$( "#login_button" ).click(this.handleSubmit.bind(this));
		$( "#user_name" ).focusout(this.validateInput)
		$( "#user_password" ).focusout(this.validateInput);
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
		const name = $("#user_name").val().trim();
		const pw = $("#user_password" ).val().trim();
		if (!name || !pw) {
			return;
		}
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
	
	async authenticate(name, pw) {
		const loginData = {
			header: {
				token: "",
				api_id: 202102
			},
			data: {					
				name: name,
				pwh: sha256(sha256(pw))
			}
		};
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		};
    
		const response = await fetch(sysConstants.yatuAuthenticationUrl, requestOptions);
		
		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}
		
		const data = await response.json();
		console.log(data);
	}
}

let loginPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
	loginPageHandler = new LoginPageHandler(credMan);
});