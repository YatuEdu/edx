import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan} from '../core/credMan.js'
import {uiMan} from '../core/uiManager.js';

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
		
		$('.translatable').each((i, obj) => {
			console.log($(obj).text());
			$(obj).text(uiMan.getText($(obj).attr('data-txt-id')));
		});
		
		// decide if I am logged in or not
		this.#loggedIn = await credMan.hasLoggedIn();

		// if logged in, change button to 'My account':
		let btnTxt = '';
		if (!this.#loggedIn) {
			// fix nav bar red button
			//btnTxt = uiMan.getText(languageConstants.SIGNIN);
			btnTxt = "登录/注册";
			$( "#index_login_or_account" ).click(this.handleLogin);
			
			// fix nav bar authenticated user onky items
			$( ".for-authenticated-only" ).hide();
		}
		else {
			
			//btnTxt = uiMan.getText(languageConstants.ACCOUNT);
			btnTxt = "我的账户";
			$( "#index_login_or_account" ).click(this.handleAccount);
			
			// fix nav bar authenticated user onky items
			$( ".for-authenticated-only" ).show();
		}
		$( "#index_login_or_account" ).text(btnTxt);
	}
	
	// going to login page
	handleLogin(e) {
		e.preventDefault();
		// go to login page
		window.location.href = "./login.html";
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