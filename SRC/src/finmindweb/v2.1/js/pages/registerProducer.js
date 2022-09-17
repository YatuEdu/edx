import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {SessionStoreAccess} from '../core/sessionStorage.js'
import {ValidUtil, StringUtil} from "../core/util.js";
import {MetaDataManager} from "../core/metaDataManager.js";
import {Net} from "../core/net.js";

const page_step1 = `
<div class="container-fluid g-0">
    <div class="row g-0">
        <div class="col-12 col-md-6 joinus-side min-vh-100">
            <div class="joinus-side-bg h-100 position-relative">
                <article class="w-50 position-absolute top-50 start-50 translate-middle fs-5 text-white">
                    FinMind treats every producer's success as our own success.
                </article>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="row g-0">
                <div class="col-11 col-md-10 mx-auto pt-4 d-flex justify-content-between">
                    <div class="nav-back">
                        <a href="javascript:history.go(-1)" class="text-body text-opacity-50 text-decoration-none">Back</a>
                    </div>
                    <div class="text-end">
                        <div class="fw-light text-secondary text-opacity-25">STEP 01/03</div>
                        <div class="fw-bold text-body text-opacity-50">Personal Info.</div>
                    </div>
                </div>
                <div class="col-11 col-md-8 mx-auto">
                    <h2 class="mt-5 mb-5">Register Producer Account</h2>
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
                            <button id="fm_rgstr_step1_next" class="btn btn-primary btn-xl w-100" type="button">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const page_step2 = `
<div class="container-fluid g-0">
    <div class="row g-0">
        <div class="col-12 col-md-6 joinus-side min-vh-100">
            <div class="joinus-side-bg h-100 position-relative">
                <article class="w-50 position-absolute top-50 start-50 translate-middle fs-5 text-white">
                    Finmind is seeking for the best technologies to improve your productivity. Please tell us how we can do better. 
                </article>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="row g-0">
                <div class="col-11 col-md-10 mx-auto pt-4 d-flex justify-content-between">
                    <div class="nav-back">
                        <a id="step2Back" href="#" class="text-body text-opacity-50 text-decoration-none">Back</a>
                    </div>
                    <div class="text-end">
                        <div class="fw-light text-secondary text-opacity-25">STEP 02/03</div>
                        <div class="fw-bold text-body text-opacity-50">Residency Info.</div>
                    </div>
                </div>
                <div class="col-12 col-md-8 mx-auto p-4 p-sm-0">
                    <h2 class="mt-5 mb-5">Register Producer Account</h2>
                    <div class="row">
                        <div class="col-12 mt-4">
                            <label for="Phonenumber" class="form-label fs-6p">Phone number*</label>
                            <input id="fm_rgstr_phone" type="text" class="form-control form-control-lg">
                        </div>
                        <div class="col-12 mt-4">
                            <label for="address" class="form-label fs-6p">Your address line 1*</label>
                            <input id="fm_rgstr_address1" type="text" class="form-control form-control-lg" id="address1" placeholder="Please enter address">
                        </div>
                        <div class="col-12 mt-4">
                            <label for="address" class="form-label fs-6p">Your address line 2</label>
                            <input id="fm_rgstr_address2" type="text" class="form-control form-control-lg" id="address2" placeholder="Please enter address">
                        </div>
                        <div class="col-4 mt-4">
                            <label for="City" class="form-label fs-6p">City*</label>
                            <input id="fm_rgstr_city" type="text" class="form-control form-control-lg" id="City" placeholder="City">
                        </div>
                        <div class="col-4 mt-4">
                            <label for="State" class="form-label fs-6p">State*</label>
                            <select class="form-select form-select-lg" id="fm_rgstr_state" placeholder="State">
                                <option value="" selected style="display:none">Please select</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                        </div>
                        <div class="col-4 mt-4">
                            <label for="ZIP Code" class="form-label fs-6p">ZIP Code*</label>
                            <input id="fm_rgstr_zip_code" type="text" class="form-control form-control-lg" id="ZIP Code" placeholder="Code">
                        </div>
                        <div class="col-12 mt-5">
                            <button id="fm_rgstr_step2_next" class="btn btn-primary btn-xl w-100" type="button">Continue</button>
                            <p class="text-center text-secondary mt-3 fs-7">
                                <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.83317 4.66667H9.49984C10.2332 4.66667 10.8332 5.26667 10.8332 6V12.6667C10.8332 13.4 10.2332 14 9.49984 14H1.49984C0.766504 14 0.166504 13.4 0.166504 12.6667V6C0.166504 5.26667 0.766504 4.66667 1.49984 4.66667H2.1665V3.33333C2.1665 1.49333 3.65984 0 5.49984 0C7.33984 0 8.83317 1.49333 8.83317 3.33333V4.66667ZM5.49981 1.33334C4.39315 1.33334 3.49981 2.22668 3.49981 3.33334V4.66668H7.49981V3.33334C7.49981 2.22668 6.60648 1.33334 5.49981 1.33334ZM1.49981 12.6667V6H9.49981V12.6667H1.49981ZM6.83317 9.33333C6.83317 10.0667 6.23317 10.6667 5.49984 10.6667C4.7665 10.6667 4.1665 10.0667 4.1665 9.33333C4.1665 8.6 4.7665 8 5.49984 8C6.23317 8 6.83317 8.6 6.83317 9.33333Z" fill="#1F1534" fill-opacity="0.5"/>
                                </svg>
                                <span class="ms-2 text-body text-opacity-50">Your Info is safely secured</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const page_step3 = `
<div class="container-fluid g-0">
    <div class="row g-0">
        <div class="col-12 col-md-6 joinus-side min-vh-100">
            <div class="joinus-side-bg h-100 position-relative">
                <article class="w-50 position-absolute top-50 start-50 translate-middle fs-5 text-white">
                    FinMind is hiring producers in all nations of US. Contact us now (hire@finmind.co) to know your benefits.  
                </article>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="row g-0">
                <div class="col-11 col-md-10 mx-auto pt-4 d-flex justify-content-between">
                    <div class="nav-back">
                        <a id="step3Back" href="#" class="text-body text-opacity-50 text-decoration-none">Back</a>
                    </div>
                    <div class="text-end">
                        <div class="fw-light text-secondary text-opacity-25">STEP 03/03</div>
                        <div class="fw-bold text-body text-opacity-50">License Info.</div>
                    </div>
                </div>
                <div class="col-12 col-md-8 mx-auto p-4 p-sm-0">
                    <h2 class="mt-5 mb-5">Register Producer Account</h2>
                    <div class="row">
                        <div class="col-12 mt-4">
                            <label for="Phonenumber" class="form-label fs-6p">License Home State*</label>
                            <select class="form-select form-select-lg" id="fm_rgstr_license_home">
                                <option selected style="display:none">Please select</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                        </div>
                        <div class="col-12 mt-4">
                            <label for="address" class="form-label fs-6p">License Number*</label>
                            <input id="fm_rgstr_license_number" type="text" class="form-control form-control-lg" placeholder="Please enter license number">
                        </div>
                        <div class="col-12 mt-4 position-relative">
                            <label for="Birthday" class="form-label fs-6p">License Expire Date*</label>
                            <input id="fm_rgstr_license_expire_date" type="date" class="form-control form-control-lg"/>
                        </div>
                        <div class="col-12 mt-5">
                            <button id="registerSubmit" class="btn btn-primary btn-xl w-100" type="button">Register</button>
                            <p class="text-center text-secondary mt-3 fs-7">
                                <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.83317 4.66667H9.49984C10.2332 4.66667 10.8332 5.26667 10.8332 6V12.6667C10.8332 13.4 10.2332 14 9.49984 14H1.49984C0.766504 14 0.166504 13.4 0.166504 12.6667V6C0.166504 5.26667 0.766504 4.66667 1.49984 4.66667H2.1665V3.33333C2.1665 1.49333 3.65984 0 5.49984 0C7.33984 0 8.83317 1.49333 8.83317 3.33333V4.66667ZM5.49981 1.33334C4.39315 1.33334 3.49981 2.22668 3.49981 3.33334V4.66668H7.49981V3.33334C7.49981 2.22668 6.60648 1.33334 5.49981 1.33334ZM1.49981 12.6667V6H9.49981V12.6667H1.49981ZM6.83317 9.33333C6.83317 10.0667 6.23317 10.6667 5.49984 10.6667C4.7665 10.6667 4.1665 10.0667 4.1665 9.33333C4.1665 8.6 4.7665 8 5.49984 8C6.23317 8 6.83317 8.6 6.83317 9.33333Z" fill="#1F1534" fill-opacity="0.5"/>
                                </svg>
                                <span class="ms-2 text-body text-opacity-50">Your Info is safely secured</span>
                            </p>
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

class RegisterProducerPageHandler {
    #credMan;
    #uiName;
    #uiPw;
    #step;

    #firstName;
    #middleName;
    #lastName;
    #email;
    #pw;
    #emailCode;

    #phone;
    #address1;
    #address2;
    #city;
    #state;
    #zipCode;

    #licenseHome;
    #licenseNumber;
    #licenseExpireDate;

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
        this.loadStep1();
        // $( "#fm_rgstr_submmit" ).click(this.handleRegisterNewUser.bind(this));
        // $( "#fm_rgstr_email" ).focusout(this.validateEmail)
        // $( "#fm_rgstr_password" ).focusout(this.validateInput);
        // $( "#fm_rgstr_first_name" ).focusout(this.validateInput);
        // $( "#fm_rgstr_last_name" ).focusout(this.validateInput);
    }


    loadStep1() {
        $("#pageContainer").html(page_step1);
        $( "#fm_rgstr_email" ).val(this.#email);
        $( "#fm_rgstr_password" ).val(this.#pw);
        $( "#fm_rgstr_first_name" ).val(this.#firstName);
        $( "#fm_rgstr_last_name" ).val(this.#lastName);

        $( "#fm_rgstr_email" ).focusout(this.validateEmail);
        $( "#fm_rgstr_password" ).focusout(this.validateInput);
        $( "#fm_rgstr_first_name" ).focusout(this.validateInput);
        $( "#fm_rgstr_last_name" ).focusout(this.validateInput);
        $( "#fm_rgstr_step1_next" ).click(this.nextStep.bind(this, 1));
        $('#getCodeBtn').click(this.handleGetCode.bind(this));

    }

    loadStep2() {
        $("#pageContainer").html(page_step2);
        $("#step2Back").click(this.loadStep1.bind(this));

        $( "#fm_rgstr_phone" ).val(this.#phone);
        $( "#fm_rgstr_address1" ).val(this.#address1);
        $( "#fm_rgstr_address2" ).val(this.#address2);
        $( "#fm_rgstr_city" ).val(this.#city);
        $( "#fm_rgstr_state" ).val(this.#state);
        $( "#fm_rgstr_zip_code" ).val(this.#zipCode);

        $( "#fm_rgstr_phone" ).keyup(this.validateFormatPhone);
        $( "#fm_rgstr_phone" ).focusout(this.validateFormatPhone);
        $( "#fm_rgstr_address1" ).focusout(this.validateInput);

        $( "#fm_rgstr_step2_next" ).click(this.nextStep.bind(this, 2));
    }

    loadStep3() {
        $("#pageContainer").html(page_step3);
        $("#step3Back").click(this.loadStep2.bind(this));

        $( "#fm_rgstr_license_home" ).val(this.#licenseHome);
        $( "#fm_rgstr_license_number" ).val(this.#licenseNumber);
        $( "#fm_rgstr_license_expire_date" ).val(this.#licenseExpireDate);

        $( "#fm_rgstr_license_number" ).focusout(this.validateLicenseNumber);

        $( "#registerSubmit" ).click(this.nextStep.bind(this, 3));
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
            if (!ValidUtil.isEmailValid(email)) {
                $(this).after( `<p style="color:red;">Invalid email format</p>` );
            }
        }
    }

    validateFormatPhone(e) {
        e.preventDefault();
        $(this).next('p').remove();
        if (!$(this).val()) {
            const warning = "Phone field cannot be empty";
            $(this).after( `<p style="color:red;">${warning}</p>` );
        } else {
            const obj = $(this).val();
            let regex = MetaDataManager.regForUSPhoneNumber;
            let formatter = StringUtil.formatUSPhoneNumber;
            const formetted = formatter(obj);
            $(this).val(formetted);
        }
    }

    validateLicenseNumber(e) {
        e.preventDefault();
        $(this).next('p').remove();
        if (!$(this).val()) {
            const warning = "License number field cannot be empty";
            $(this).after( `<p style="color:red;">${warning}</p>` );
        } else {
            const license = $(this).val();
            if (!ValidUtil.isLicenseNumberValid(license)) {
                $(this).after( `<p style="color:red;">Invalid license number format</p>` );
            }
        }
    }

    async nextStep(currStep, e) {
        if (currStep===1) {
            this.#firstName = $("#fm_rgstr_first_name").val().trim();
            this.#middleName = $("#fm_rgstr_middle_name").val().trim();
            this.#lastName = $("#fm_rgstr_last_name").val().trim();
            this.#email = $("#fm_rgstr_email").val().trim();
            this.#pw = $("#fm_rgstr_password" ).val().trim();
            let agree = $("#fm_rgstr_agree").is(':checked');
            this.#emailCode = $('#emailCode').val();
            if (!this.#firstName || !this.#lastName || !this.#email || !this.#pw  || !emailCode) {
                $(e.target).after( `<p style="color:red;">Email, name, and password cannot be empty</p>` );
                return;
            }
            if (!ValidUtil.isEmailValid(this.#email)) {
                $(e.target).after( `<p style="color:red;">Invalid email format</p>` );
                return;
            }
            if (!ValidUtil.isPasswordValid(this.#pw)) {
                $(e.target).after( `<p style="color:red;">Password is not strong enough</p>` );
                return;
            }
            if (!agree) {
                $(e.target).after( `<p style="color:red;">You must agree to our terms and conditions</p>` );
                return;
            }
            this.loadStep2();
        } else if (currStep===2) {
            this.#phone = $( "#fm_rgstr_phone" ).val().trim();
            this.#address1 = $( "#fm_rgstr_address1" ).val().trim();
            this.#address2 = $( "#fm_rgstr_address2" ).val().trim();
            this.#city = $( "#fm_rgstr_city" ).val().trim();
            this.#state = $( "#fm_rgstr_state" ).val().trim();
            this.#zipCode = $( "#fm_rgstr_zip_code" ).val().trim();
            if (!this.#phone || !this.#address1 || !this.#city || !this.#state || !this.#zipCode) {
                $(e.target).next('p').remove();
                $(e.target).after( `<p style="color:red;">Phone, Address line 1, City, State and Zip Code cannot be empty</p>` );
                return;
            }
            if (!ValidUtil.isPhoneValid(this.#phone)) {
                $(e.target).next('p').remove();
                $(e.target).after( `<p style="color:red;">Invalid phone format</p>` );
                return;
            }
            if (!ValidUtil.isZipCodeValid(this.#zipCode)) {
                $(e.target).after( `<p style="color:red;">Invalid zip code</p>` );
                return;
            }
            this.loadStep3();
        } else if (currStep===3) {
            this.#licenseHome = $( "#fm_rgstr_license_home" ).val().trim();
            this.#licenseNumber = $( "#fm_rgstr_license_number" ).val().trim();
            this.#licenseExpireDate = $( "#fm_rgstr_license_expire_date" ).val().trim();
            if (!this.#licenseHome || !this.#licenseNumber) {
                $(e.target).after( `<p style="color:red;">License home, and Address line 1 cannot be empty</p>` );
                return;
            }
            if (!ValidUtil.isLicenseNumberValid(this.#licenseNumber)) {
                $(e.target).after( `<p style="color:red;">Invalid phone format</p>` );
                return;
            }

            let ret = await Net.agentRegisterWithEmailAndPw(this.#email, this.#email, this.#emailCode, this.#firstName, this.#middleName,
                this.#lastName, sha256(sha256(this.#pw)), this.#phone, this.#address1, this.#address2, this.#city,
                this.#state, this.#zipCode, this.#licenseHome, this.#licenseNumber, this.#licenseExpireDate);

            if (ret.errCode!=0) {
                let errMsg = ret.err.msg;
                alert(errMsg);
                return;
            } else {
                window.location.href = '/prelogin/registerSuccess.html#agent';
            }
        }

        console.log(currStep);
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
            $(this).next('p').remove();
            $(e.target).after( `<p style="color:red;">Email, name, and password cannot be empty</p>` );
            return;
        }

        // async call to register
        const resp = await this.#credMan.signUp(fname, mname, lname, email, pw);
        if (resp.code === 0) {
            // go to my page
            window.location.href = REG_SUCCESS_PATH + '#customer';;
        }
        else {
            //const msg = "email is in use error"; // to do, return error message from server
            // dispaly error message
            $(e.target).after( `<p style="color:red;">${resp.code}</p>` );
        }
    }

}

let registerProducerPageHandler = null;

$( document ).ready(function() {
    console.log( "registerCustomer page ready!" );
    registerProducerPageHandler = new RegisterProducerPageHandler(credMan);

});
