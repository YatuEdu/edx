import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'


/**
	This class manages both login and sigup workflow
**/
class IndexPageHandler {
	#loggedIn;
	#userName;
	
    constructor(credMan) {
		this.init();
	}
	
	// hook up events
	async init() {
		// get all the translatable elemnts
		
		// decide if I am logged in or not
		this.#loggedIn = await credMan.hasLoggedIn();

		// if logged in, change button to 'My account':
		let btnTxt = '';
		if (!this.#loggedIn) {
			// fix nav bar red button
			//btnTxt = uiMan.getText(languageConstants.SIGNIN);
			btnTxt = "Sign in";
			$( "#fm_login_or_account" ).click(this.handleLogin);
			
			// fix nav bar authenticated user onky items
			$( ".for-authenticated-only" ).hide();
		}
		else {
			
			//btnTxt = uiMan.getText(languageConstants.ACCOUNT);
			btnTxt = "My account";
			$( "#fm_login_or_account" ).click(this.handleAccount);
			
			// fix nav bar authenticated user onky items
			//$( ".for-authenticated-only" ).show();
		}
		$( "#fm_login_or_account" ).text(btnTxt);
	}
	
	// going to login page
	handleLogin(e) {
		e.preventDefault();
		// go to login page
		window.location.href = "./sign/sign-in.html";
	}
	
	// going to account page
	handleAccount(e) {
		e.preventDefault();
		
		// todo: go to account page
		window.location.href = "./group-man.html";
	}
}

let indexPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	indexPageHandler = new IndexPageHandler(credMan);
});