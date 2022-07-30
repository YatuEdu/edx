import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {ValidUtil} from "../../core/util.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">My Profile</h5>
		<div id="tool" class="ms-auto d-flex align-items-center">
			<a {changeBtnHidden} href="" class="me-4" data-bs-toggle="modal" data-bs-target="#ProducerLicenseInformation">Change to Producer Account</a>
			<button id="editBtn" type="button" class="btn btn-outline-secondary ms-2" style="width: 8rem;border-color: rgba(217, 220, 230, 1);">
				Edit Profile
			</button>
		</div>
	</div>
	<div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
		<div class="row g-0 justify-content-center">
			<div class="col-10">
				<div id="form" class="row g-0 justify-content-between">
					<div class="col-5">
						<div class="row mb-4">
							<div class="col-4">
								<label for="FirstName" class="form-label">First Name*</label>
								<input id="first_name" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="John"> -->
							</div>
							<div class="col-4">
								<label for="MiddleName" class="form-label">Middle Name</label>
								<input id="middle_name" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="Willam"> -->
							</div>
							<div class="col-4">
								<label for="LastName" class="form-label">Last Name*</label>
								<input id="last_name" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="Cooper"> -->
							</div>
						</div>
						<div class="mb-4">
							<label for="DateofBirth" class="form-label">Date of Birth</label>
							<input id="birthday" type="date" readonly class="form-control form-control-lg"/>
							<!-- <div class="input-group">
								<input type="text" class="form-control form-control-lg border-end-0" placeholder="Please select"/>
								<span class="input-group-text bg-transparent">
									<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 3.004H2a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-20a1 1 0 0 0-1-1zM18 1.004v4M6 1.004v4M1 9.004h22" stroke="#1F1534" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</span>
							</div> -->
						</div>
						<div class="mb-4">
							<label for="Gender" class="form-label">Gender</label><p/>
<!--							<input id="gender" type="text" readonly class="form-control-plaintext form-control-lg" value="">-->
							<div class="form-check form-check-inline me-5">
								<input class="form-check-input" type="radio" readonly name="name_for_1" id="" value="Male">
								<label class="form-label fs-6p" for="">Male</label>
							</div>
							<div class="form-check form-check-inline me-5">
								<input class="form-check-input" type="radio" readonly name="name_for_1" id="" value="Female">
								<label class="form-label fs-6p" for="">Female</label>
							</div>
							<!-- <select class="form-select form-control-lg">
								<option selected="">Please select</option>
							</select> -->
						</div>
						<div class="mb-4">
							<label for="" class="form-label">Home Address</label>
							<input id="address1" type="text" readonly class="form-control-plaintext form-control-lg" value="">
							<input id="address2" type="text" readonly class="form-control-plaintext form-control-lg mt-2" value="">
							<!-- <input type="text" class="form-control form-control-lg" placeholder="Please enter home address">
							<input type="text" class="form-control form-control-lg mt-2" placeholder="Please enter home address"> -->
						</div>
						<div class="row mb-4">
							<div class="col-4">
								<label for="City" class="form-label">City</label>
								<input id="city" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="City"> -->
							</div>
							<div class="col-4">
								<label for="State" class="form-label">State</label>
								<input id="state" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="State"> -->
							</div>
							<div class="col-4">
								<label for="ZIP Code" class="form-label">Zip Code</label>
								<input id="zip_code" type="text" readonly class="form-control-plaintext form-control-lg" value="">
								<!-- <input type="text" class="form-control form-control-lg" placeholder="Zip Code"> -->
							</div>
						</div>
						
					</div>
					<div class="col-5">
						<div class="mb-4">
							<label for="Phone" class="form-label">Phone</label>
							<input id="phone_number" type="text" readonly class="form-control-plaintext form-control-lg" value="">
							<!-- <input type="tel" class="form-control form-control-lg" placeholder="Enter Phone"> -->
						</div>
						<div class="mb-4">
							<label for="Email" class="form-label">Email</label>
							<input id="email" type="text" readonly class="form-control-plaintext form-control-lg" value="">
							<!-- <input type="email" class="form-control form-control-lg" placeholder="Enter Email"> -->
						</div>
						
						
						<div class="mb-4" {producerInfoHidden}>
							<label for="LicenseCurrentState" class="form-label">License Current State</label>
							<div class="mt-2">
								<span class="event-status py-2 px-4 fs-7 status-warning">
									New License Under Review
								</span>
								<!-- <span class="event-status py-2 px-4 fs-7 status-info">
									License in Use
								</span>
								<span class="event-status py-2 px-4 fs-7 status-danger">
									License Update is Rejected
								</span>
								<span class="event-status py-2 px-4 fs-7 status-danger">
									License Expired
								</span>
								<span class="event-status py-2 px-4 fs-7 status-danger">
									License is Invalid
								</span> -->
							</div>
						</div>
						<div class="mb-4" {producerInfoHidden}>
							<label for="LicenseIssueState" class="form-label">License Issue State</label>
							<input id="license_issue_state" type="text" readonly class="form-control-plaintext form-control-lg" value="">
							<!-- <select class="form-select form-control-lg">
								<option selected="">Please select</option>
							</select> -->
						</div>
						<div class="mb-4" {producerInfoHidden}>
							<label for="ExpireDate" class="form-label">Expire Date</label>
							<input id="license_expire_date" type="date" readonly class="form-control form-control-lg"/>
							<!-- <div class="input-group">
								<input type="text" class="form-control form-control-lg border-end-0" id="ExpireDate" placeholder="Please select"/>
								<span class="input-group-text bg-transparent">
									<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 3.004H2a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-20a1 1 0 0 0-1-1zM18 1.004v4M6 1.004v4M1 9.004h22" stroke="#1F1534" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</span>
							</div> -->
						</div>
						<div class="mb-4" {producerInfoHidden}>
							<label for="LicenseNumber" class="form-label">License Number</label>
							<input id="license_number" type="text" readonly class="form-control-plaintext form-control-lg" value="">
							<!-- <input type="text" class="form-control form-control-lg" placeholder="Please enter"> -->
						</div>
						
					</div>
				</div>
			</div>
		</div>
						
	</div>
</div>
`;

const editButtons = `
<button id="btnCancel" type="button" class="btn btn-outline-secondary ms-2" style="width: 5.125rem;border-color: rgba(217, 220, 230, 1);">
	Cancel
</button>
<button id="btnSave" type="button" class="btn btn-primary ms-2" style="width: 5.125rem;">
	Save
</button>
`;

class MyProfile {
	#container;

    constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
    	this.#container.empty();

		let userInfo = credMan.credential;
		let role = userInfo.role;
		let page;
		if (role==='agent') {
			page = pageTemplate
				.replace('{changeBtnHidden}', 'hidden')
				.replaceAll('{producerInfoHidden}', '');
		} else {
			page = pageTemplate
				.replace('{changeBtnHidden}', '')
				.replaceAll('{producerInfoHidden}', 'hidden');
		}
		this.#container.append(page);

		$('#birthday').attr("max", moment(new Date()).format("YYYY-MM-DD"));

    	this.requestProfile();
		$('#editBtn').click(this.handelEditBtn.bind(this));

		console.log('myProfile init');
	}

	async requestProfile() {
		let res = await Net.getMyProfile(credMan.credential.token);
		if (res.code===0 && res.data.length>=1) {
			let row = res.data[0];
			$('#email').val(row.email);
			$('#phone_number').val(row.phone_number);
			$('#first_name').val(row.first_name);
			$('#middle_name').val(row.middle_name);
			$('#last_name').val(row.last_name);
			$('#birthday').val(row.birthday);
			// $('#gender').val(row.gender);
			$(":radio[name='name_for_1'][value='" + row.gender + "']").prop("checked", "checked");
			$('#address1').val(row.address1);
			$('#address2').val(row.address2);
			$('#city').val(row.city);
			$('#state').val(row.state);
			$('#zip_code').val(row.zip_code);
			$('#license_issue_state').val(row.license_issue_state);
			$('#license_expire_date').val(row.license_expire_date);
			$('#license_number').val(row.license_number);
		}
		console.log();
	}

	handelEditBtn(e) {
		$('#form').find('input').removeAttr('readonly');
		$('#tool').find('button').remove();
		$('#tool').append(editButtons);
		$('#btnCancel').click(this.cancelEdit.bind(this));
		$('#btnSave').click(this.saveEdit.bind(this));
		// $("#form").find("input").attr('readonly', 'readonly');

	}

	cancelEdit() {
		this.init();
	}

	async saveEdit() {

		const email = $("#email").val().trim();
		const firstName = $("#first_name" ).val().trim();
		const lastName = $('#last_name').val();
		const zipCode = $('#zip_code').val();
		const phone = $('#phone_number').val();

		if (!email || !firstName || !lastName) {
			alert('Email, first name and last name cannot be empty');
			return;
		}

		if (!ValidUtil.isEmailValid(email)) {
			alert('Email format is incorrect');
			return;
		}

		if (!ValidUtil.isPhoneValid(phone)) {
			alert('Phone format is incorrect');
			return;
		}

		if (!ValidUtil.isZipCodeValid(zipCode)) {
			alert('ZipCode must be 5 digits');
			return;
		}


    	let gender = $('input[type=radio][name=name_for_1]:checked').attr('value');
		let res = await Net.updateMyProfile(credMan.credential.token,
			$('#email').val(),
			$('#phone_number').val(),
			$('#first_name').val(),
			$('#middle_name').val(),
			$('#last_name').val(),
			$('#birthday').val(),
			gender,
			$('#address1').val(),
			$('#address2').val(),
			$('#city').val(),
			$('#state').val(),
			$('#zip_code').val(),
			$('#license_issue_state').val(),
			$('#license_expire_date').val(),
			$('#license_number').val()
			);
		if (res.code!=0) {
			alert('update profile error');
		}
		this.init();
	}


}

export {MyProfile}
