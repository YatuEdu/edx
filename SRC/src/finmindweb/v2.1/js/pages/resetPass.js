import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {Net} from "../core/net.js";
import {ValidUtil} from "../core/util.js";

const page_template = `
<div class="container mb-5 mt-5 pt-5">
	<div class="row justify-content-center">
		<div class="col-12 col-lg-5 text-center">
			<h2 class="pb-3">Reset Password</h2>
		</div>
	</div>
	<div class="row justify-content-center mt-4">
		<div class="col-12 col-lg-5">
			<div class="mb-5">
				<label for="email" class="form-label fs-6p">Email</label>
				<div class="position-relative">
					<input type="email" class="form-control form-control-lg" id="email" placeholder="Please enter your email address">
					<a href="#" id="getCodeBtn" class="text-decoration-none fw-bold text-body position-absolute top-50 end-0 translate-middle">get code</a>
				</div>
			</div>
			<div class="mb-5">
				<label for="emailVerificationCode" class="form-label fs-6p">Email verification code</label>
				<input class="form-control form-control-lg" id="emailCode" placeholder="Please enter your email verification code">
			</div>
			<div class="mb-5">
				<label for="password" class="form-label fs-6p">New password</label>
				<div class="position-relative">
					<input id="newPassInput" type="password" class="form-control form-control-lg" placeholder="Enter new password">
					<a href="#" id="showNewPassBtn" class="text-decoration-none fw-bold text-body position-absolute top-50 end-0 translate-middle">show</a>
				</div>
			</div>
			<div class="mb-5">
				<label for="password" class="form-label fs-6p">Confirm Password</label>
				<div class="position-relative">
					<input id="confirmPassInput" type="password" class="form-control form-control-lg" placeholder="Confirm your password">
					<a href="#" id="showConfirmPassBtn" class="text-decoration-none fw-bold text-body position-absolute top-50 end-0 translate-middle">show</a>
				</div>
			</div>
			<div class="mb-5 fs-7 text-body text-opacity-75">
				<p>Password Requirement: </p>
				<ul class="mt-2">
					<li>Contain at least 8 Characters </li>
					<li>Contain at least one number </li>
					<li>Contain at least one lowercase letter and one uppercase letter </li>
					<li>Contain at least one special characters (~!@#$%^&*()_+=-;',./:"<>?)</li>
				</ul>
			</div>
			<div class="d-flex justify-content-center">
				<button id="confirmBtn" class="btn btn-primary btn-xl w-100" type="submit">
					Submit
				</button>
			</div>
		</div>
	</div>
</div>
`;

class ChangePassPageHandler {
	#credMan;

	constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}

	// hook up events
	async init() {
	    $('#getCodeBtn').click(this.handleGetCode.bind(this));

		$('#showNewPassBtn').click(e => {
			this.showPass($('#newPassInput'), $('#showNewPassBtn'));
		});
		$('#showConfirmPassBtn').click(e => {
			this.showPass($('#confirmPassInput'), $('#showConfirmPassBtn'));
		});
		$('#confirmBtn').click(this.confirm.bind(this));
	}

    async handleGetCode() {
        let email = $('#email').val();
        if (!ValidUtil.isEmailValid(email)) {
            alert('Email address is incorrect');
            return;
        }
        let ret = await Net.resetPwSendEmail(email);
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

	showPass(input, btn) {
		if (btn.text()==='show') {
			$(input).attr("type", "text");
			$(btn).text('hide');
		} else {
			$(input).attr("type", "password");
			$(btn).text('show');
		}
	}

	async confirm() {
        let email = $('#email').val();
        let emailCode = $('#emailCode').val();
		let newPw = $('#newPassInput').val();
		let confirmPw = $('#confirmPassInput').val();
		if (emailCode==='' || newPw==='' || confirmPw==='') {
			alert('Please fill in all fields');
			return;
		}
		if (newPw!==confirmPw) {
			alert('The new password entered twice is different');
			return;
		}
		let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
		if (!pwdRegex.test(newPw)) {
			alert("New password is too weak(Must be at least 8 characters and contain letters and numbers)!");
			return;
		}
		let ret = await Net.resetPwConfirm(email, emailCode, sha256(sha256(newPw)));
		if (ret.errCode!=0) {
			let errMsg = ret.err.msg;
			alert(errMsg);
			return;
		} else {
			window.location.href = '/changePassSuccess.html';
		}
	}

}

let changePassPageHandler = null;

$( document ).ready(function() {
	console.log( "change pass page ready!" );
	$("#pageContainer").html(page_template);
	changePassPageHandler = new ChangePassPageHandler(credMan);
});
