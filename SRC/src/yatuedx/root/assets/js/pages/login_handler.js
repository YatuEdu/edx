import {sysConstants, languageConstants, regexConstants} 	from '../core/sysConst.js'
import {credMan} 						from '../core/credMan.js'
import {uiMan} 							from '../core/uiManager.js';
import {PageUtil}						from '../core/util.js';
import {Net} 							from '../core/net.js';

const EMAIL_INPUT_CTRL = "#yt_inpt_email";
const PW_INPUT_CTRL = "#user_password";
/**
	This class manages both login and sigup workflow
**/
class LoginPageHandler {
	#credMan;
	#uiName;
	#uiPw;
	#forSignup;  // for signing up html if true
	#parmName;
	#parmEmail;
	#validators;
	
    constructor(credMan, forSignup) {
		this.#credMan = credMan;
		this.#forSignup = forSignup;
		this.#parmEmail = '';
		this.#parmName = '';
		this.init();
		this.#validators = [
			{fun: this.validateUserName.bind(this), field: '#user_name'},
			{fun: this.validatePw.bind(this), field: PW_INPUT_CTRL},
			{fun: this.validateTnA.bind(this), field: '#yt_lbl_tna'}
		];
	}
	
	// hook up events
	init() {
		$( "#yt_btn_send_email_code" ).prop('disabled', true);
		$( "#yt_btn_verify_code" ).prop('disabled', true);
		$( "#auth_button" ).prop('disabled', true);
		
		$( "#auth_button" ).click(this.handleSubmit.bind(this));
		$( "#signup_button" ).click(this.handleGotoSignup);
		$( "#ytu_ckb_tna" ).click(this.validateAll.bind(this));
		$( "#user_name" ).focusout(this.validateAll.bind(this));
		$( PW_INPUT_CTRL ).focusout(this.validateAll.bind(this));
		$( "#user_password2" ).focusout(this.validateAll.bind(this));
		$( EMAIL_INPUT_CTRL).keyup(this.checkEmailText);
		$( EMAIL_INPUT_CTRL).blur(this.checkEmailText);
		$( "#yt_inpt_email_code").keyup(this.checkEmailCodeText);
		$( "#yt_inpt_email_code").blur(this.checkEmailCodeText);
		$( "#yt_btn_send_email_code" ).click(this.requestEmailCode).bind(this);
		$( "#yt_btn_verify_code" ).click(this.validateEmailCode).bind(this);
		$( "#yt_btn_login" ).click(() => window.location.href = './login.html');
		
		if (this.#forSignup) {
			const paramMap = PageUtil.getUrlParameterMap();
			this.#parmName = paramMap.get(sysConstants.UPN_EMAIL);
			this.#parmEmail = paramMap.get(sysConstants.UPN_NAME);
		}
		this.clearField();
	}
	
	/**
		Maliciou brower (chrome, edge, and etc) always tries to autopopulate junk
		into the input field.  We use this clumsy but effective methods to remove the junk text
	 **/
	clearField() {
		const self = this;
        setTimeout( (() => {
			$( EMAIL_INPUT_CTRL ).val(self.#parmEmail);
			$( "#user_name" ).val(self.#parmName);
			$( "#yt_inpt_email_code").val('');
			$( PW_INPUT_CTRL ).val('');
			$( "#user_password2").val('');
		}), 10);
	}
	
	/**
		validate login name: it is important to have login name unique and without special chars,
		since we use it as alias for communication group.
	**/
	validateUserName() {
		let errId = "";
		const tgt = "#user_name";
		$(tgt).next('p').remove();
		const name = $(tgt).val();
		let dataId = '';
		let warning = '';
		if (!name) {	
			errId = $(tgt).attr('data-text-id');
		}
		else if (!(/^[a-z\d\_\s]+$/.test(name))) {
			errId = $(tgt).attr('data-validation-id');
		}
		
		return errId;
	}
	
	validatePw(e) {
		const tgt = PW_INPUT_CTRL;
		const tgt2 = "#user_password2";
		$(tgt).next('p').remove();
		let errId = ''
		if (!$( tgt ).val() || (this.#forSignup && !$( tgt2 ).val()) ) {
			errId = languageConstants.SIGNIN_PW_NEEDED;
		}
		else if ( this.#forSignup && $( tgt ).val() != $( tgt2 ).val()) {
			errId = languageConstants.SIGNIN_PW_NOT_IDENTICAL
		} 
		return errId;
	}
	
	validateTnA() {
		if (this.#forSignup) {
			$( "#yt_lbl_tna" ).next('p').remove();
			if ( !($('#ytu_ckb_tna').is(":checked")) ){
				return languageConstants.SIGNUP_TNA_NEEDED;
			}
		}
		return "";
	}
	
	validateAll(e) {
		let validated = true;
		for(let i = 0; i < this.#validators.length; i++) {
			const validator = this.#validators[i].fun;
			const fieldId = this.#validators[i].field;
			const errId = validator();
			if (errId) {
				validated = false;
				this.inputErrorDisplay(fieldId, errId);
				break;
			}
		}
		
		// enable or disable register button based on validation status
		if (validated) {
			$( "#auth_button" ).prop('disabled', false);
		} else {
			$( "#auth_button" ).prop('disabled', true);
		}
	}
	
	// handling input focus loss to check valid input
	// add error message <p> element if empty text for the necessary fields
	inputErrorDisplay(fieldId, errId) {
		if (errId) {
			const err = uiMan.getText(errId);
			$(fieldId).next('p').remove();
			$(fieldId).after( `<p style="color:yellow;">${err}</p>` );  
		} else {
			$(fieldId).next('p').remove();
		}
		
		
	}
	
	checkEmailText(e) {
		e.preventDefault();
		const emailEntered = $(this).val().trim();
		if (emailEntered && regexConstants.REG_FOR_EMAIL.test(emailEntered)) {
			$("#yt_btn_send_email_code").prop('disabled', false);
		}
		else {
			$("#yt_btn_send_email_code").prop('disabled', true);
		}
	}
	
	checkEmailCodeText(e) {
		e.preventDefault();
		const code = $( this ).val();
		if (code && code.length == 6) {
			$('#yt_btn_verify_code').prop('disabled', false);
		}
		else {
			$( "#yt_btn_verify_code" ).prop('disabled', true);
		}
	}
	
	/**
		Click this button we will send an email to your mail box with 6-digit
		validation code
	 **/
	async requestEmailCode(e) {
		e.preventDefault();
		
		// call Yatu to obtain the email validation code
		const emailAddr = $(EMAIL_INPUT_CTRL).val();
		const resp = await Net.sendCodeToEmail(emailAddr);
		if (resp.code == 0) {
			alert("Email with code sent. Please obtain the 6-digit verifcation code from your email, enter the code, and press 'Verify email' button!");
		} else {
			alert("Failed to send verifcation code to the email address. Please make sure you have the correct email address entered and try again!");
		}
	}
	
	/**
		Click this button we will send the email address together with the 6-digit
		validation code to the yatu server to validate email
	 **/
	async validateEmailCode(e) {
		// call Yatu to obtain the email validation code
		const emailAddr = $(EMAIL_INPUT_CTRL).val();
		const code = $("#yt_inpt_email_code").val();
		const resp = await Net.emailCodeCheck(emailAddr, code);
		if (resp.code == 0) {
			alert("Email validated, thank you!");
			//Now enable the name / pw part;
			$("#yt_div_post_email_vefication").show();
			$("#yt_div_pre_email_vefication").hide();
		}
		else {
			alert("Email validation failed. Please try again!");
		}
	}
	
	// go to sign up page
	handleGotoSignup() {
		window.location.href = "./register.html";
	}
	
	// signin submit request to server
	async handleSubmit(e) {
		e.preventDefault();
		
		// remove the error message if any
		$(e.target).next('p').remove();
		
		// retrieve data from UI
		const name = $("#user_name").val().trim();
		const pw = $( PW_INPUT_CTRL ).val().trim();
		if (!name || !pw) {
			return;
		}

		// for log in
		if (!this.#forSignup) {
			await this.#credMan.authenticate(name, pw);
			if (!this.#credMan.lastError) {
				// go to my page
				window.location.href = "./index.html";
			}
			else {
				// dispaly error message
				$(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` ); 
			}
		}
		// for sign up
		else
		{
			const email = $(EMAIL_INPUT_CTRL).val().trim();
			await this.#credMan.signUp(name, email, pw);
			if (!this.#credMan.lastError) {
				// go to login page to log in
				window.location.href = "./login.html";
			}	
			else {
				// dispaly error message
				$(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` ); 
			}			
		}
	}
}

export {LoginPageHandler};
