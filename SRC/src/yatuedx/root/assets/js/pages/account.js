import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan} from '../core/credMan.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class manages both login and sigup workflow
**/
class AccountPageHandler {
	
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
		
		// logout  Link
		$( "#yt_btn_logout" ).click(this.handleLogOut);
	}
	
	// going to home page
	async handleLogOut(e) {
		e.preventDefault();
		
		// clear out token 
		await credMan.signOut();
		
		// go to login page
		window.location.href = "./index.html";
	}
}

let accountPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "account page ready!" );
	accountPageHandler = new AccountPageHandler(credMan);
});

export {AccountPageHandler}
 