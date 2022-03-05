import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const page_template = `
<div class="container mb-5 mt-5 pt-4">
    <div class="row justify-content-center">
        <div id="regSuccessTips" class="col-12 col-lg-5 text-center">
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-12 col-lg-6">
            <div class="mx-5">
                <img src="../img/passwordresetsuccessfully.png" class="img-fluid">
            </div>
            <div class="d-flex justify-content-center">
                <button onclick="location.href='/mainPanel/mainPanel.html#myProfile';" class="btn btn-primary btn-xl w-75" type="submit">
                    Set Up My Proflie
                </button>
            </div>
        </div>
    </div>
</div>
`;

class RegisterSuccessPageHandler {
    #credMan;
    #uiName;
    #uiPw;

    constructor(credMan) {
        this.#credMan = credMan;
        this.init();
    }

    // hook up events
    async init() {
        let hash = window.location && window.location.hash;
        if (hash!=null) {
            if (hash==='#customer') {
                $('#regSuccessTips').append(`<h2 class="pb-1">Registration Successful</h2>`);
            } else if (hash==='#agent') {
                $('#regSuccessTips').append(`<h2 class="pb-1">Registration Successful</h2>`);
                $('#regSuccessTips').append(`<p class="text-body text-opacity-75">Your registration has been received. Now you can sign in as a customer user.  Your producer account will be activated after we verify your license information.  You can check the status in account profile.</p>`);
            }
        }
    }
}

let registerSuccessPageHandler = null;

$( document ).ready(function() {
    console.log( "registerSuccess page ready!" );
    $("#pageContainer").html(page_template);
    registerSuccessPageHandler = new RegisterSuccessPageHandler(credMan);

});
