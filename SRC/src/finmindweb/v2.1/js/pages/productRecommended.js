import {sysConstants} 				from '../core/sysConst.js'
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from "../core/applicationPipelineManager.js";
import {Net} from "../core/net.js";
import {credMan} from "../core/credManFinMind.js";

const TABLE_BODY_ID = 'fm_tb_recommended_products';

const REPLACEMENT_FOR_PRODUCT_NAME = "{pn}";
const REPLACEMENT_FOR_MONTHLY_PREMIUM = "[{mp}]";
const REPLACEMENT_FOR_ID = "{id}";
const SELECTION_ID_PREFIX = "fm_product_selected_";

const page_template = `
<div id="wizard-steps" class="progress">
	<div class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-success" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-success" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-success" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-success" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-primary" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-primary" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
</div>

<div class="nav-back container mt-4 mt-md-5">
	<a href="Wizard5.html" class="text-body text-opacity-50 text-decoration-none">Back</a>
</div>

<div class="container mb-5">
	<div class="row justify-content-center">
		<div class="col-10">
			<h2 class="text-center mb-5">
				All available products for you:
			</h2>
			<table class="table table-borderless companies-table border-bottom" id="all-available-products"  data-list='{"valueNames":["advantages","price"]}'>
				<thead>
					<tr class="border-bottom">
						<th>PRODUCT NAME</th>
						<th>BRIEF</th>
						<th class="sort" data-sort="advantages">ADVANTAGES</th>
						<th class="sort" data-sort="price">PRICE</th>
						<th></th>
					</tr>
				</thead>
				<tbody id="fm_tb_recommended_products" class="list">
				</tbody>
			</table>
		</div>
		<div class="col-12">
			<div class="d-flex justify-content-center mt-5 pt-0 pt-lg-5">
				<button id="startAppSubmit" disabled class="btn btn-primary btn-xl px-5" type="submit">
					Start application with the selected product
				</button>
			</div>
		</div>
	</div>
</div>
`;

const TEMPLATE_PROD = `
<tr>
	<td class="text-primary">{pn}</td>
	<td>For most people that want to do</td>
	<td class="advantages"><a href="">Advantages</a>,<a href="">Advantages</a></td>
	<td class="price text-black">$[{mp}]/Month</td>
	<td class="text-end">
		<input id={id} type="radio" class="btn-check" name="product-select" value="{pn}" autocomplete="off">
		<label class="btn btn-outline-primary fs-7" for={id}>Select</label>
	</td>
</tr>
`;

const SIGNIN_PATH="/prelogin/login.html";

/**
	This class manages both login and sigup workflow
**/
class ProductRecommended {

	#credMan;
	#applicationMan;

    constructor(credMan) {
    	this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	async init() {
	
		// retrieve recommendation list from session store
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_BEST_PREMIUM_STORE_KEY);
		const recommendItem = sessionStore.retrieveObj();
		const tableTrHtml = TEMPLATE_PROD
							.replace(REPLACEMENT_FOR_MONTHLY_PREMIUM, recommendItem.premium)
							.replaceAll(REPLACEMENT_FOR_PRODUCT_NAME, recommendItem.insurer)
							.replaceAll(REPLACEMENT_FOR_ID, this.getSelectionId(0));
		$(this.productTable).append(tableTrHtml);
		$('input[name=product-select]').change(this.handleSelectProduct.bind(this));
		$('#startAppSubmit').click(this.handleStartApplication.bind(this));
	}

	async handleSelectProduct(e) {
		let selected = $('input[name=product-select]:checked').attr('value');
		$('#startAppSubmit').prop('disabled', false);
	}

	async handleStartApplication(e) {

		// 如果状态失效，跳转到登录页面
		const loggedIn = await this.#credMan.hasLoggedIn();
		if (!loggedIn) {
			window.location.href = SIGNIN_PATH;
			return;
		}


		//TODO 无法获取产品ID
		let prodId = 89898990;
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
		const appId = await this.startApplicationForProduct(prodId); //4008; //
		if (appId && appId > 0) {
			window.location.href = "/user/pipeline.html?appId="+appId;
		} else {
			alert('cannot start application');
			return;
		}
	}

	async startApplicationForProduct(pid) {
		const res = await Net.startAplication(pid, this.#credMan.credential.token);
		if (res.err) {
			alert(res.err);
			return;
		}
		return res.data[0].applicationId;
	}
	/**
		properties
	 **/
	 
	
	get productTable() {
		return `#${TABLE_BODY_ID}`;
	}
	
	getSelectionId(pid) {
		return `${SELECTION_ID_PREFIX}_${pid}`;
	}	
}

let productRecommended = null;

$( document ).ready(function() {
    console.log( "PRODUCT recommended page ready!" );
	$("#pageContainer").html(page_template);
	productRecommended = new ProductRecommended(credMan);
});