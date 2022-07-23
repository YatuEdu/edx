import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {Net} from "../core/net.js";

const page_template = `
<div class="container mb-5 mt-5 pt-5">
	<div class="row justify-content-center">
		<div class="col-12 col-lg-5 text-center">
			<h2 class="pb-3">Change Password</h2>
		</div>
	</div>
	<div class="row justify-content-center mt-4">
		<div class="col-12 col-lg-5">
			<div class="mb-5">
				<label for="password" class="form-label fs-6p">Old Password</label>
				<div class="position-relative">
					<input id="oldPassInput" type="password" class="form-control form-control-lg" placeholder="Enter old password">
					<a href="#" id="showOldPassBtn" class="text-decoration-none fw-bold text-body position-absolute top-50 end-0 translate-middle">show</a>
				</div>
			</div>
			<div class="mb-5">
				<label for="password" class="form-label fs-6p">New Password</label>
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
				<p>In order to protect your account, make sure your password:</p>
				<ul class="mt-2">
					<li>Contain at least 8 Characters </li>
					<li>Contain at least one number </li>
					<li>Contain at least one lowercase letter and one uppercase letter </li>
					<li>Contain at least one special characters (~!@#$%^&*()_+=-;',./:"<>?)</li>
				</ul>
			</div>
			<div class="d-flex justify-content-center">
				<button class="btn btn-primary btn-xl w-100" type="submit" id="confirmBtn">
					Change Password
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
		$('#showOldPassBtn').click(e => {
			this.showPass($('#oldPassInput'), $('#showOldPassBtn'));
		});
		$('#showNewPassBtn').click(e => {
			this.showPass($('#newPassInput'), $('#showNewPassBtn'));
		});
		$('#showConfirmPassBtn').click(e => {
			this.showPass($('#confirmPassInput'), $('#showConfirmPassBtn'));
		});
		$('#confirmBtn').click(this.confirm.bind(this));

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
		let oldPw = $('#oldPassInput').val();
		let newPw = $('#newPassInput').val();
		let confirmPw = $('#confirmPassInput').val();
		if (oldPw==='' || newPw==='' || confirmPw==='') {
			alert('Please fill in all fields');
			return;
		}
		if (newPw!==confirmPw) {
			alert('The new password entered twice is different');
			return;
		}
		let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
		if (!pwdRegex.test(newPw)) {
			alert("Your password is too weak(Must be at least 8 characters and contain letters and numbers)!");
			return;
		}
		let ret = await Net.userChangePwWithOldPw(credMan.credential.token, sha256(sha256(oldPw)), sha256(sha256(newPw)));
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
