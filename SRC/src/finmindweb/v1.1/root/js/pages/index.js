import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'


/**
	This class manages both login and sigup workflow
**/
class IndexPageHandler {
	#userName;
	#credMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	async init() {
		// get all the translatable elemnts
		
		// decide if I am logged in or not
		const loggedIn = await this.#credMan.hasLoggedIn();

		// if logged in, change button to 'My account':
		let btnTxt = '';
		if (!loggedIn) {
			this.initUnsignedIn();
		}
		else {
			this.initSignedIn();
		}
	}
	
	/*
	*
	*	When the user is Logged in, initialize UI one way
	*/
	initSignedIn() {
		//btnTxt = uiMan.getText(languageConstants.ACCOUNT);
		const btnTxt = "Sign out";
		$( "#index_login_or_logout" ).click(this.handleLogout.bind(this));
		
		// fix nav bar authenticated user onky items
		//$( ".for-authenticated-only" ).show();
		$( "#index_login_or_logout" ).text(btnTxt);
	}
	
	/*
	*
	*	When the user is not logged in, initialize UI one way
	*/
	initUnsignedIn() {
		// fix nav bar red button
		//btnTxt = uiMan.getText(languageConstants.SIGNIN);
		const btnTxt = "Sign in";
		$( "#index_login_or_logout" ).click(this.handleLogin.bind(this));
		
		// fix nav bar authenticated user onky items
		$( ".for-authenticated-only" ).hide();
		
		$( "#index_login_or_logout" ).text(btnTxt);
	}
	
	// going to login page
	handleLogin(e) {
		e.preventDefault();
		// go to login page
		window.location.href = "./sign/sign-in.html";
	}
	
	// going to account page
	handleLogout(e) {
		e.preventDefault();
		
		// sign out and change UI accordingly
		this.#credMan.signOut();
		this.initUnsignedIn();
	}
}

let indexPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	indexPageHandler = new IndexPageHandler(credMan);
});