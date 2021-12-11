import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const LOGIN_PATH="login.html";
const ERR_DUPLICATE_USER = 400010;
const ERR_DUPLICATE_USER_MSG = 'This email is already rigistered!';
/**
	This class manages  sigup workflow
**/
class RegisterPageHandler {
	#credMan;
	#uiName;
	#uiPw;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	init() {		
		$( "#fm_rgstr_submmit" ).click(this.handleRegisterNewUser.bind(this));
		$( "#signup_button" ).click(this.handleGotoSignup);
		$( "#fm_rgstr_email" ).focusout(this.validateEmail)
		$( "#fm_rgstr_password" ).focusout(this.validateInput);
		$( "#fm_rgstr_first_name" ).focusout(this.validateInput);
		$( "#fm_rgstr_last_name" ).focusout(this.validateInput);
	}
	
	// handling input focus loss to check valid input
	// add error message <p> element if empty text for the necessary fields
	validateInput(e) {
		e.preventDefault();
		$(this).next('p').remove();
		if (!$(this).val()) {
			const dataId = $(this).attr('data-text-id');
			const warning = "cannot be empty"; //  uiMan.getText(dataId);
			$(this).after( `<p style="color:red;">${warning}</p>` );  
		} else {
			$(this).next('p').remove();
		}
	}
	
	validateEmail(e) {
		e.preventDefault();
		$(this).next('p').remove();
		if (!$(this).val()) {
			const dataId = $(this).attr('data-text-id');
			const warning = "Email field cannot be empty"; //  uiMan.getText(dataId);
			$(this).after( `<p style="color:red;">${warning}</p>` );  
		} else {
			const email = $(this).val();
			const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!emailReg.test(email.toLowerCase())) {
				$(this).after( `<p style="color:red;">Invalid email format</p>` ); 
			}
		}
	}
	
	// go to sign up page
	handleGotoSignup() {
		window.location.href = "./register.html";
	}
	
	// signin submit request to server
	async handleRegisterNewUser(e) {
		e.preventDefault();
		
		// remove the error message if any
		$(e.target).next('p').remove();
		
		// retrieve data from UI
		const fname = $("#fm_rgstr_first_name").val().trim();
		const mname = $("#fm_rgstr_middle_name").val().trim();
		const lname = $("#fm_rgstr_last_name").val().trim();
		const email = $("#fm_rgstr_email").val().trim();
		const pw = $("#fm_rgstr_password" ).val().trim();
		if (!email || !pw) {
			$(e.target).after( `<p style="color:red;">Email, name, and password cannot be empty</p>` ); 
			return;
		}

		// async call to register
		const resp = await this.#credMan.signUp(fname, mname, lname, email, pw);
		if (resp.code === 0) {
			// go to my page
			window.location.href = LOGIN_PATH;
		}
		else {
			//const msg = "email is in use error"; // to do, return error message from server
			// dispaly error message
			$(e.target).after( `<p style="color:red;">${resp.code}</p>` ); 
		}
	}
}

let registerPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "register page ready!" );
	registerPageHandler = new RegisterPageHandler(credMan);
});