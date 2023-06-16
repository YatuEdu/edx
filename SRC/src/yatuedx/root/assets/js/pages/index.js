import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {uiMan} 								from '../core/uiManager.js';
import {AuthPage} 							from '../core/authPage.js'

/**
	This class manages both login and sigup workflow
**/
class IndexPageHandler extends AuthPage {
	#userName;
	
    constructor() {
		super(true); // true means index page is facing to public
		this.init();
	}
	
	// hook up events
	async init() {
		await super.init();
		// sign up Link
		$( "#yt_btn_redirect_to_signup" ).click(this.redirectToSignup);
		
		// get all the translatable elemnts
		
		$('.translatable').each((i, obj) => {
			console.log($(obj).text());
			$(obj).text(uiMan.getText($(obj).attr('data-txt-id')));
		});
		

		// if logged in, change button to 'My account':
		let btnTxt = '';
		if (!this.loggedIn) {
			// fix nav bar red button
			btnTxt = uiMan.getText(languageConstants.SIGNIN);
			$( "#yt_btn_login_signup" ).click(this.handleLogin);
			
			// fix nav bar authenticated user onky items
			$( ".for-authenticated-only" ).hide();
		}
		else {
			
			btnTxt = this.credential.name + ":" + uiMan.getText(languageConstants.ACCOUNT);
			//btnTxt = "我的账户";
			$( "#yt_btn_login_signup" ).click(this.handleAccount);
			
			// fix nav bar authenticated user onky items
			$( ".for-authenticated-only" ).show();
			$( ".for-unauthenticated-only" ).hide();
			
			// fix nav bar for teachers
			if (this.credential.role === sysConstants.YATU_ROLE_TEACHER ||
			    this.credential.role === sysConstants.YATU_ROLE_ADMIN) {
				$(".for-teachers-only").show();
			}
			else {
				$(".for-teachers-only").hide();
			}
		}
		$( "#yt_btn_login_signup" ).text(btnTxt);
	}
	
	// going to login page
	handleLogin(e) {
		e.preventDefault();
		// go to login page
		window.location.href = "./login.html";
	}
	
	// going to sign up directly
	redirectToSignup(e) {
		e.preventDefault();
		
		let emailId = $( "#yt_inpt_email").val();
		if (!emailId) {
			emailId = "enter_email";
		}
		let userName = $( "#yt_inpt_name").val();
		if (!userName) {
			userName = "enter_your_name";
		}
		// go to register page
		window.location.href = `./register.html?email=${emailId}&name=${userName}`;
	}
	
	// going to account page
	handleAccount(e) {
		e.preventDefault();
		
		// todo: go to account page
		window.location.href = "./my-account.html";
	}
}

let indexPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	indexPageHandler = new IndexPageHandler();
});

export {IndexPageHandler}
 