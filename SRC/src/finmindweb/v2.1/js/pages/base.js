import {credMan} from '../core/credManFinMind.js'

const SIGNUP_PATH="./prelogin/join.html";
const SIGNIN_PATH="./prelogin/login.html";
const WIZARD_PATH="./prelogin/wizard.html";
const PIPELINE_PATH="";

const TEMPLATE_UN_LOGIN = `
<a class="btn btn-primary fw-bold px-4 rounded-pill" href="../../prelogin/login.html">
	Sign In
</a>
`;

const TEMPLATE_LOGIN = `
<div class="dropdown me-4">
<a href="" class="position-relative" data-bs-toggle="dropdown">
<svg width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg"><path d="M16 7A6 6 0 1 0 4 7c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a1.999 1.999 0 0 1-3.46 0" stroke="#000" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
<span class="position-absolute top-0 end-0 p-1 rounded-circle" style="transform: translate(-20%,-20%);background: #f00;"></span>
</a>
<ul class="dropdown-menu dropdown-menu-end">
<li><a class="dropdown-item" href="#">notification</a></li>
<li><a class="dropdown-item" href="#">notification</a></li>
<li><a class="dropdown-item" href="#">notification</a></li>
</ul>
</div>
<div class="dropdown">
<a href="#" class="fs-6p fw-bold text-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">{name}</a>
<ul class="dropdown-menu dropdown-menu-end">
<li><a class="dropdown-item" href="/mainPanel/mainPanel.html#myApplication">Main Panel</a></li>
<li><a class="dropdown-item" href="/mainPanel/mainPanel.html#myProfile">My Profile</a></li>
<li><a class="dropdown-item" href="/changePass.html">Change password</a></li>
<li><a class="dropdown-item" href="#" id="fm_logout">Log out</a></li>
</ul>
</div>
`;

/**
	This class manages both login and sigup workflow
**/
class BasePageHandler {
	#userName;
	#credMan;

    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
		// $('#fm-globalnav').hide();
		// $('#fm-globalft').hide();

	}

	// hook up events
	async init() {
		// decide if I am logged in or not
		const loggedIn = await this.#credMan.hasLoggedIn();

		// if logged in, change button to 'My account':
		let btnTxt = '';
		if (!loggedIn) {
			$("#navbarCollapse").append(TEMPLATE_UN_LOGIN);
			// this.initUnsignedIn();
			// handle wizard
			$('#fm_start_pipeline').click(this.handleStartPipeline.bind(this));
		} else {
			let userInfo = this.#credMan.credential;
			$("#navbarCollapse").append(TEMPLATE_LOGIN.replace('{name}', userInfo.name));
			// this.initSignedIn();
		}

		// 登出按钮
		$("#fm_logout").click(this.handleLogout.bind(this));


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

		// fix nav bar authenticated user only items
		$( ".for-authenticated-only" ).hide();

		$( "#index_login_or_logout" ).text(btnTxt);
	}

	// going to login page
	handleLogin(e) {
		e.preventDefault();
		// go to login page
		window.location.href = SIGNIN_PATH;
	}

	// going to account page
	async handleLogout(e) {
		e.preventDefault();

		// sign out and change UI accordingly
		await this.#credMan.signOut();
		// this.initUnsignedIn();
		window.location.reload();
	}

	handleStartPipeline(e) {
		e.preventDefault();

		// go to wizard page
		window.location.href = WIZARD_PATH;
	};
}

let basePageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "base page ready!" );
	basePageHandler = new BasePageHandler(credMan);
});
