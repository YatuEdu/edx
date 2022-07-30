import {sysConstants} 				from '../core/sysConst.js'
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from "../core/applicationPipelineManager.js";
import {Net} from "../core/net.js";
import {credMan} from "../core/credManFinMind.js";
import {ApplicationQAndAManager} from "../core/applicationQAndAManager.js";

const page_template = `
<div class="container my-5">
	<div class="row justify-content-center mb-5">
		<div class="col-11 col-md-6 mb-5 pb-4">
			<h1 class="mb-5">
				<div class="d-inline-block">
					FINANCING FOR INVESTMENT PROPERTIES <br/>
					<span class="d-inline-block border-3 border-bottom border-primary px-4"></span>
				</div>
			</h1>
			<div class="pt-2">
				<h5 class="mb-3">
					Do you need to purchase or refinance commercial purpose real estates?
				</h5>
				<p class="text-body text-opacity-75">
					We provide the most competitive commercial purpose mortgage loan in 40 US states which:<br/>
					- Loan-to-Value (LTV) ratio is up to 90%<br/>
					- No tax returns / No income required<br/>
					- Fico score as low as 620<br/>
					- interest Only available<br/>
					- Loas sizes $250K to $8M<br/>
					- No limit on number of properties to own/owned<br/>
					- No limit on units of target property<br/>
					- Unlimited cash-out for refinances<br/>
					- No limit on property types (single family, condos, apartment buildings, stores, Airbnb ...)<br/>
				</p>
			</div>
		</div>
		<div class="col-11 col-md-10">
			<div class="mb-5">
				<img src="../img/FinancingforInvestmentProperties-map.png" class="img-fluid" >
			</div>
			<div class="bg-white mt-6 py-3 p-md-5" style="border-radius: 0.75rem;box-shadow: 0 0 3.125rem rgba(229, 233, 246, 0.6);">
				<h5 class="text-center mt-3 mt-md-0">
					Take one easy step below. Our representative will contact you within 48 hours.
				</h5>
				<div class="row g-2 g-md-5 mt-1 px-3 fs-7">
					<div class="col-12 col-md-6">
						<div class="row mb-4">
							<div class="col-4">
								<label for="FirstName" class="form-label">First Name*</label>
								<input type="text" class="form-control form-control-lg" id="FirstName" placeholder="First Name">
							</div>
							<div class="col-4">
								<label for="MiddleName" class="form-label">Middle Name</label>
								<input type="text" class="form-control form-control-lg" id="MiddleName" placeholder="Middle Name">
							</div>
							<div class="col-4">
								<label for="LastName" class="form-label">Last Name*</label>
								<input type="text" class="form-control form-control-lg" id="LastName" placeholder="Last Name">
							</div>
						</div>
						<div class="mb-4">
							<label for="Phone" class="form-label">Phone*</label>
							<input type="tel" class="form-control form-control-lg" placeholder="Please enter">
						</div>
						<div class="mb-4">
							<label for="Email" class="form-label">Email*</label>
							<input type="email" class="form-control form-control-lg" placeholder="Please enter">
						</div>
					</div>
					<div class="col-12 col-md-6">
						<div class="mb-4">
							<label for="" class="form-label">Target loan amount*</label>
							<div class="row g-0">
								<div class="col-5">
									<input type="number" class="form-control form-control-lg" placeholder="Min">
								</div>
								<div class="col-2 d-flex justify-content-center align-items-center">
									&mdash;&mdash;
								</div>
								<div class="col-5">
									<input type="number" class="form-control form-control-lg" placeholder="Max">
								</div>
							</div>
							
						</div>
						<div class="mb-4">
							<label for="" class="form-label">Property address</label>
							<input type="text" class="form-control form-control-lg" placeholder="Please enter address">
							<input type="text" class="form-control form-control-lg mt-3" placeholder="Please enter address">
						</div>
					</div>
				</div>
				<div class="col-12 mt-0 mt-md-4">
					<button type="button" class="btn btn-primary btn-lg py-3 fs-6 w-50 d-block mx-auto">Send</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="row justify-content-center container-fluid my-5 py-5 px-0">
	<div class="mb-2 mb-md-5" style="padding-left: 11%;">
		<h5>Recently Financed</h5>
	</div>
	<div class="swiper py-3 RecentlyFinancedSwiper">
	    <div class="swiper-wrapper" id="loansDiv">
	        <div class="swiper-slide" style="margin-left: 11%;">
				<img src="../img/bg-questions.png" class="img-fluid">
				<h6 class="p-4 pb-3 m-0">Name</h6>
				<p class="px-4 pb-2 fs-8 lh-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnqjih...</p>
			</div>
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>
`;

const loanItemTemplate = `
<div class="swiper-slide" style="margin-left: 11%;">
    <img src="{url}" class="img-fluid">
    <h6 class="p-4 pb-3 m-0">{title}</h6>
    <p class="px-4 pb-2 fs-8 lh-sm">{description}</p>
</div>
`;

class ProductCommercialLoan {

	#credMan;

    constructor(credMan) {
    	this.#credMan = credMan;
		this.init();
	}

	// hook up events
	async init() {

    	let ret = await Net.anonymousCommercialLoanList();
		if (ret.errCode!=0) {
			return;
		}

		for(let item of ret.data) {
			let res = await Net.downloadFile(credMan.credential.token, item.file_name_un);
			$('#loansDiv').append(
				loanItemTemplate.replace('{title}', item.title)
					.replace('{description}', item.description)
					.replace('{url}', res.data.url)
			);
		}


		let mySwiper = new Swiper('.swiper',{
			slidesPerView: "auto",
			spaceBetween: 30,

			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		})
	}

}

let productCommercialLoan = null;

$( document ).ready(function() {
    console.log( "productCommercialLoan page ready!" );
	$("#pageContainer").html(page_template);
	productCommercialLoan = new ProductCommercialLoan(credMan);
});
