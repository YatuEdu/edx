import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'


/**
	This class handles event for Start page
**/
class StartPageHandler {
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
			window.location.href = "../sign/sign-in.html";
		}
		else {
		}
		
	}
}

let startPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	startPageHandler = new StartPageHandler(credMan);
});