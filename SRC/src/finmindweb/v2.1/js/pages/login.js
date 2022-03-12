import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const page_template = `
<div class="container mb-5 mt-5 pt-5">
    <div class="row justify-content-center">
        <div class="col-12 col-lg-5 text-center">
            <h5>Welcome back</h5>
            <h2 class=" pb-4">Login to your account</h2>
        </div>
    </div>
    <div class="row justify-content-center mt-4">
        <div class="col-12 col-lg-5">
            <div class="mb-4">
                <label for="email" class="form-label fs-6p">Email</label>
                <input type="email" class="form-control form-control-lg" id="fm_email" placeholder="Please enter your email address">
            </div>
            <div class="mb-4">
                <label for="password" class="form-label fs-6p">Password</label>
                <input type="password" class="form-control form-control-lg" id="fm_password" placeholder="*********">
            </div>
            <div class="d-flex">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="rememberme">
                    <label class="form-check-label text-body text-opacity-50 fw-bold" for="rememberme">
                        Remember me
                    </label>
                </div>
                <div class="ms-auto">
                    <a href="ForgetPassword.html" class="text-decoration-none fw-bold">Forgot password?</a>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-5 pt-3">
                <button id="fm_login_button" class="btn btn-primary btn-xl w-100" type="submit">
                    Sign In
                </button>
            </div>
            <div class="text-center mt-4 text-body text-opacity-75">
                Dont have an account? 
                <a id="fm_signup_link" href="#" class="text-decoration-none">Join free today</a>
            </div>
        </div>
    </div>
</div>
`;


const SIGNUP_PATH="./joinUs.html";
const USER_APPLICATION_PATH="../user/myApplication.html";
const INDEX_PATH="../index.html";

/**
 This class manages both login and sigup workflow
 **/
class LoginPageHandler {
    #credMan;
    #uiName;
    #uiPw;

    constructor(credMan) {
        this.#credMan = credMan;
        this.init();
    }

    // hook up events
    async init() {

        // 检查是否已经登录，如果已经登录，跳转到首页
        const loggedIn = await this.#credMan.hasLoggedIn();
        if (loggedIn) {
            window.location.href = INDEX_PATH;
        }

        $("#fm_login_button").click(this.handleLogin.bind(this));
        $(document).keyup(this.keyUp.bind(this));
        $("#fm_signup_link").click(this.handleGotoSignup);
        $("#fm_email").focusout(this.validateInput)
        $("#fm_password").focusout(this.validateInput);
    }

    keyUp(e) {
        if (e.keyCode == 13) {
            this.handleLogin(e);
        }
    }

    // handling input focus loss to check valid input
    // add error message <p> element if empty text for the necessary fields
    validateInput(e) {
        e.preventDefault();
        if (!$(this).val()) {
            $(this).next('p').remove();
            const dataId = $(this).attr('data-text-id');
            const warning = uiMan.getText(dataId);
            $(this).after( `<p style="color:red;">${warning}</p>` );
        } else {
            $(this).next('p').remove();
        }
    }

    // go to sign up page
    handleGotoSignup() {
        window.location.href = SIGNUP_PATH;
    }

    // signin submit request to server
    async handleLogin(e) {
        e.preventDefault();

        // remove the error message if any
        //$(e.target).next('p').remove();

        // retrieve data from UI
        const email = $("#fm_email").val().trim();
        const pw = $("#fm_password" ).val().trim();
        if (!email || !pw) {
            alert('need email and password!');
            return;
        }

        // for log in
        await this.#credMan.authenticate(email, pw);
        if (!this.#credMan.lastError) {
            // go to my page
            // window.location.href = INDEX_PATH;
            history.go(-1);
        }
        else {
            // dispaly error message
            $(e.target).after( `<p style="color:red;">${this.#credMan.lastError}</p>` );
        }
    }
}

let loginPageHandler = null;

$( document ).ready(function() {
    console.log( "login page ready!" );
    $("#pageContainer").html(page_template);
    loginPageHandler = new LoginPageHandler(credMan);

});
