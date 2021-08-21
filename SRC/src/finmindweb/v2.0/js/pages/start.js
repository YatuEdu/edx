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
		// initialize ui elements by its login status
	}
}

let startPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	startPageHandler = new StartPageHandler(credMan);
});