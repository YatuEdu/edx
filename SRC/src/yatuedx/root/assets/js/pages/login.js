import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'

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
	}
	
	handleSubmit(e) {
		debugger;
		e.preventDefault();
		
		const name = $("#user_name").val();
		const pw = $("#user_password" ).val();
		this.authenticate(name, pw);
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
 	console.log(credMan.credential.token);
});