import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const page_template = `
<div class="container mb-5 mt-5 pt-4">
	<div class="row justify-content-center">
		<div class="col-12 col-lg-5 text-center">
			<h2 class="mb-1">Password Reset</h2>
			<p class="text-body text-opacity-75">Your password has been reset successfully!</p>
		</div>
	</div>
	<div class="row justify-content-center">
		<div class="col-12 col-lg-6">
			<div class="mx-5">
				<img src="img/passwordresetsuccessfully.png" class="img-fluid">
			</div>
		</div>
	</div>
</div>
`;

class ChangePassSuccessPageHandler {
    #credMan;
    #uiName;
    #uiPw;

    constructor(credMan) {
        this.#credMan = credMan;
        this.init();
    }

    // hook up events
    async init() {
    }
}

let changePassSuccessPageHandler = null;

$( document ).ready(function() {
    console.log( "changePassSuccess page ready!" );
    $("#pageContainer").html(page_template);
    changePassSuccessPageHandler = new ChangePassSuccessPageHandler(credMan);

});
