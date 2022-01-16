import {sysConstants} 				from '../core/sysConst.js'
import {SessionStoreAccess}			from '../core/sessionStorage.js'

const TABLE_BODY_ID = 'fm_tb_recommended_products';

const REPLACEMENT_FOR_PRODUCT_NAME = "{pn}";
const REPLACEMENT_FOR_MONTHLY_PREMIUM = "[{mp}]";
const REPLACEMENT_FOR_ID = "{id}";
const SELECTION_ID_PREFIX = "fm_product_selected_";

const TEMPLATE_PROD = `
<tr>
	<td class="text-primary">{pn}</td>
	<td>For most people that want to do</td>
	<td class="advantages"><a href="">Advantages</a>,<a href="">Advantages</a></td>
	<td class="price text-black">$[{mp}]/Month</td>
	<td class="text-end">
		<input id={id} type="radio" class="btn-check" name="product-select" autocomplete="off">
		<label class="btn btn-outline-primary fs-7" for="product-1">Select</label>
	</td>
</tr>
`;

/**
	This class manages both login and sigup workflow
**/
class ProductRecommended {
	
    constructor() {
		this.init();
	}
	
	// hook up events
	async init() {
	
		// retrieve recommendation list from session store
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_BEST_PREMIUM_STORE_KEY);
		const recommendItem = sessionStore.retrieveObj();
		const tableTrHtml = TEMPLATE_PROD
							.replace(REPLACEMENT_FOR_PRODUCT_NAME, recommendItem.insurer)
							.replace(REPLACEMENT_FOR_MONTHLY_PREMIUM, recommendItem.premium)
							.replace(REPLACEMENT_FOR_ID, this.getSelectionId(0));
							
		$(this.productTable).append(tableTrHtml);
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
	productRecommended = new ProductRecommended();
});