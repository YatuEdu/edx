import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {ValidUtil} from "../core/util.js";
import {Net} from "../core/net.js";

const page_template = `
<div class="container-fluid g-0">
    <div class="row g-0">
        <div class="col-12 col-md-6 joinus-side min-vh-100">
            <div class="joinus-side-bg h-100 position-relative">
                <article class="w-50 position-absolute top-50 start-50 translate-middle fs-5 text-white">
                    <p>Being a registered FinMind customer, you are able to:</p>
                    <p>- apply for insurance with easy-to-follow steps</p>
                    <p>- access to your policies and files at any time</p>
                    <p>- get assistance from FinMind agent</p>
                    <p>- receive notifications when there are important caveats</p>
                    <p>- no fees charged
                </article>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="row g-0">
                <div class="col-11 col-md-10 mx-auto pt-4 d-flex justify-content-between">
                    <div class="nav-back">
                        <a href="javascript:history.go(-1)" class="text-secondary text-decoration-none">Back</a>
                    </div>
                </div>
                <div class="col-11 col-md-8 mx-auto">
                    <h2 class="mt-5 mb-5">Register Customer Account</h2>
                    <div class="row">
                        <div class="col-4">
                            <label for="FirstName" class="form-label fs-6p">First Name*</label>
                            <input id="fm_rgstr_first_name" type="text" class="form-control form-control-lg" id="FirstName" placeholder="John">
                        </div>
                        <div class="col-4">
                            <label for="MiddleName" class="form-label fs-6p">Middle Name</label>
                            <input id="fm_rgstr_middle_name" type="text" class="form-control form-control-lg" id="MiddleName" placeholder="Willam">
                        </div>
                        <div class="col-4">
                            <label for="LastName" class="form-label fs-6p">Last Name*</label>
                            <input id="fm_rgstr_last_name" type="text" class="form-control form-control-lg" id="LastName" placeholder="Cooper">
                        </div>
                        <div class="col-12 mt-4">
                            <label for="Email" class="form-label fs-6p">Email address*</label>
                            <div class="position-relative">
                                <input id="fm_rgstr_email" type="email" class="form-control form-control-lg" id="Email" placeholder="Enter email address">
                                <a href="#" id="getCodeBtn" class="text-decoration-none fw-bold text-body position-absolute top-50 end-0 translate-middle">get code</a>
                            </div>
                        </div>
                        <div class="col-12 mt-4">
                            <label for="emailVerificationCode" class="form-label fs-6p">Email verification code*</label>
                            <input class="form-control form-control-lg" id="emailCode" placeholder="Please enter your email verification code">
                        </div>
                        <div class="col-12 mt-4">
                            <label for="password" class="form-label fs-6p">Create password*</label>
                            <div class="position-relative">
                                <input id="fm_rgstr_password" type="password" class="form-control form-control-lg" placeholder="Enter new password">
                            </div>
                        </div>
                        <div class="col-12 mt-4">
                            <div class="form-check">
                                <input id="fm_rgstr_agree" class="form-check-input" type="checkbox" value="" id="agree" checked>
                                <label class="form-check-label" for="agree">
                                    I agree to terms & conditions
                                </label>
                            </div>
                        </div>
                        <div class="col-12 mt-5">
                            <button id="fm_rgstr_submmit" class="btn btn-primary btn-xl w-100" type="button">Register Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const INDEX_PATH = "/index.html";
const REG_SUCCESS_PATH ="../prelogin/registerSuccess.html";

class RegisterCustomerPageHandler {
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

        $( "#fm_rgstr_submmit" ).click(this.handleRegisterNewUser.bind(this));
        $( "#fm_rgstr_email" ).focusout(this.validateEmail)
        $( "#fm_rgstr_password" ).focusout(this.validateInput);
        $( "#fm_rgstr_first_name" ).focusout(this.validateInput);
        $( "#fm_rgstr_last_name" ).focusout(this.validateInput);

        $('#getCodeBtn').click(this.handleGetCode.bind(this));
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

    async handleGetCode() {
        let email = $('#fm_rgstr_email').val();
        if (!ValidUtil.isEmailValid(email)) {
            alert('Email address is incorrect');
            return;
        }
        let ret = await Net.registerSendEmail(email);
        if (ret.errCode!=0) {
            let errMsg = ret.err.msg;
            alert(errMsg);
            return;
        } else {
            $('#getCodeBtn').text('send');
            $('#getCodeBtn').removeAttr('href');
            $('#getCodeBtn').off('click');
        }
    }

    validateEmail(e) {
        e.preventDefault();
        $(this).parent().next('p').remove();
        if (!$(this).val()) {
            const dataId = $(this).attr('data-text-id');
            const warning = "Email field cannot be empty"; //  uiMan.getText(dataId);
            $(this).parent().after( `<p style="color:red;">${warning}</p>` );
        } else {
            const email = $(this).val();
            const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailReg.test(email.toLowerCase())) {
                $(this).after( `<p style="color:red;">Invalid email format</p>` );
            }
        }
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
        let emailCode = $('#emailCode').val();

        if (!email || !pw || !emailCode) {
            $(e.target).after( `<p style="color:red;">Email, name, valid code and password cannot be empty</p>` );
            return;
        }
        if (!ValidUtil.isPasswordValid(pw)) {
            $(e.target).after( `<p style="color:red;">Password is not strong enough</p>` );
            return;
        }
        if (!$('#fm_rgstr_agree').is(':checked')) {
            $(e.target).after( `<p style="color:red;">You must agree to our terms & conditions</p>` );
            return;
        }

        // async call to register
        const ret = await this.#credMan.signUp(fname, mname, lname, email, pw, emailCode);
        if (ret.errCode!=0) {
            let errMsg = ret.err.msg;
            alert(errMsg);
            $(e.target).after( `<p style="color:red;">${ret.errCode}</p>` );
            return;
        } else {
            window.location.href = REG_SUCCESS_PATH + '#customer';;
        }
    }
}

let registerCustomerPageHandler = null;

$( document ).ready(function() {
    console.log( "registerCustomer page ready!" );
    $("#pageContainer").html(page_template);
    RegisterCustomerPageHandler = new RegisterCustomerPageHandler(credMan);

});
