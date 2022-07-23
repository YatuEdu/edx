import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {MetaDataManager} from "../../core/metaDataManager.js";
import {Pagination} from "../../core/pagination.js";
import {PolicyFilePanel} from "./policyFilePanel.js";
import {UIUtil} from "../../core/uiUtil.js";
import {InsurancePolicyDetails} from "./insurancePolicyDetails.js";
import {SessionStoreAccess} from "../../core/sessionStorage.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">Insurance Policies</h5>
		<div class="ms-auto d-flex">
			<div class="input-group me-2" style="width: 16.25rem;">
				<input type="text" class="form-control fs-7" placeholder="Search Name" style="border-color: rgba(217, 220, 230, 1);">
				<button class="btn btn-outline-secondary bg-transparent" type="button" style="border-color: rgba(217, 220, 230, 1);">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 12a6 6 0 1 1 4.548-2.087l1.32 1.32a.447.447 0 0 1 .003.631l-.004.004a.454.454 0 0 1-.318.132.454.454 0 0 1-.318-.132L9.912 10.55A5.976 5.976 0 0 1 6 12zM6 .9a5.1 5.1 0 1 0 0 10.2A5.1 5.1 0 0 0 6 .9z" fill="#1F1534" fill-opacity=".2"/></svg>
				</button>
			</div>
			<button type="button" class="btn btn-outline-secondary ms-2" style="width: 5.125rem;border-color: rgba(217, 220, 230, 1);">
				Delete
			</button>
			<button type="button" class="btn btn-outline-secondary ms-2" style="width: 5.125rem;border-color: rgba(217, 220, 230, 1);">
				Edit
			</button>
			<button type="button" class="btn btn-primary ms-2 me-3" style="width: 8rem;" id="create-new-btn">
				Create New
			</button>
			<button type="button" class="btn" id="event-export-btn">
				<svg class="me-1" width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.563 7.063l3.187-3.188L10.562.687M11.625 11.313H1.531a.531.531 0 0 1-.531-.53v-7.97" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.857 8.656a6.378 6.378 0 0 1 6.174-4.781h3.719" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Export
			</button>
		</div>
	</div>
	<div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
		<div class="event-table mx-4 position-relative overflow-auto" id="event-table" data-list='{"valueNames":["effective-date"]}'>
			<table class="w-100">
				<thead>
					<tr>
						<th>CLIENT NAME</th>
						<th>CLIENT EMAIL</th>
						<th>PRODUCT</th>
						<th>INSURED NAME</th>
						<th>COVERAGE AMOUNT</th>
						<th class="sort" data-sort="effective-date">EFFECTIVE DATE</th>
						<th>DETAILS</th>
						<th>STATUS</th>
						<th>CURRENT OWNER</th>
						<th>ACTION</th>
					</tr>
				</thead>
				<tbody class="list" id="list">
				</tbody>
			</table>	
		</div>
		<div class="d-flex justify-content-between mt-3 mx-4 fs-8">
			<div class="text-secondary">
				showing 10 out of 9000
			</div>
			<div class="d-flex align-items-center">
				<span class="text-secondary">Page 01 of 56</span>
				<ul class="pagination pagination-sm justify-content-end my-0 ms-3 event-table-pagination">
					<li class="page-item"><a class="page-link" href="#">
					<svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.012 4.5l3.305 3.404a.653.653 0 0 1 0 .907.607.607 0 0 1-.881 0L.78 5.045A.636.636 0 0 1 .5 4.5a.662.662 0 0 1 .28-.546L4.436.188a.614.614 0 0 1 .88 0 .653.653 0 0 1 0 .907L2.013 4.5z" fill="#8D93A6"/></svg>
					</a></li>
					<li class="page-item"><a class="page-link" href="#">1</a></li>
					<li class="page-item active"><a class="page-link" href="#">2</a></li>
					<li class="page-item"><a class="page-link" href="#">3</a></li>
					<li class="page-item"><a class="page-link" href="#"><svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.988 4.5L.683 7.903a.653.653 0 0 0 0 .907.607.607 0 0 0 .881 0L5.22 5.045A.636.636 0 0 0 5.5 4.5a.662.662 0 0 0-.28-.546L1.564.188a.614.614 0 0 0-.88 0 .653.653 0 0 0 0 .907L3.987 4.5z" fill="#8D93A6"/></svg></a></li>
				</ul>
				<input class="form-control form-control-sm text-center position-relative" type="text" style="width: 43px;border-color: #dddfe5;">
			</div>
		</div>
							
	</div>
	<div id="testContainer"></div>
</div>

`;

const rowTemplate = `
<tr id="{id}">
	<td>{clientName}</td>
	<td>{clientEmail}</td>
	<td class="product">{product}</td>
	<td class="insuredName">{insuredName}</td>
	<td class="coverageAmount">{coverageAmount}</td>
	<td class="effective-date">{effectiveDate}</td>
	<td><a href="javascript:void(0);" class="viewDetailsBtn">View</a></td>
	<td class="status">{status}</td>
	<td>{currentOwner}</td>
	<td>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary btnEdit">Edit</button>
		<button type="button" disabled class="btn btn-sm border-0 btn-outline-primary" data-bs-toggle="modal" data-bs-target="#DeleteEventModal">Delete</button>
	</td>
</tr>
`;

const filterSide = `
<div class="mask"></div>
<div class="filter-side" id="filter-side">
	<div class="card h-100 border-0 rounded-0">
		<div class="card-header bg-transparent d-flex justify-content-between align-items-center">
			<span class="fw-bold">Create New Policy</span>
			<button id="closeFilterSideBtnTop" type="button" class="btn"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4.92l3.076 3.075.92-.92L4.918 4 7.995.924l-.92-.92L4 3.082.924.005l-.92.92L3.082 4 .005 7.076l.92.92L4 4.918z" fill="#1F232E"/></svg></button>
		</div>
		<div class="card-body fs-7">
			<div class="mb-4">
				<label for="" class="form-label">Client Name</label>
				<input id="clientNameInput" type="text" readonly class="form-control form-control-lg" placeholder="">
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Client Email</label>
				<input type="email" id="clientEmailInput" class="form-control form-control-lg" placeholder="Please enter">
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Product</label>
				<select id="productSelect" class="form-select form-control-lg">
					<option selected="">Please select</option>
				</select>
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Coverage Amount</label>
				<select id="coverageAmountSelect" class="form-select form-control-lg">
				</select>
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Status</label>
				<select id="statusSelect" class="form-select form-control-lg">
					<option selected="">Please select</option>
				</select>
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Effective Date</label>
				<input id="effectiveDateInput" type="date" min="1922-04-30" name="dob" class="form-control form-control-lg date_for_3"/>
			</div>
		</div>
		<div class="card-footer bg-transparent">
			<button id="submitBtn" type="button" class="btn btn-primary" style="width: 5.125rem;">
				Create
			</button>
			<button id="closeFilterSideBtn" type="button" class="btn btn-outline-secondary ms-3" style="width: 5.125rem;">
				Cancel
			</button>
		</div>
	</div>
</div>
`;

class InsurancePolicies {
	#container;
	#searchBy = '';
	#productList;
	#policiesMap;

    constructor(container) {
		this.#container = container;
		this.init();
	}

	pageSize = 10;
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
		$("body").append(filterSide);
    	console.log('insurancePolicies init');
		$('#create-new-btn').click(this.handleCreateNew.bind(this));
		$('#closeFilterSideBtn').click(this.closeFilterSide.bind(this));
		$('#closeFilterSideBtnTop').click(this.closeFilterSide.bind(this));

		$('#clientEmailInput').on('blur',async function() {
			let email = $('#clientEmailInput').val();
			let ret = await Net.findClient(credMan.credential.token, email);
			if (ret.code==null || ret.code==0) {
				let data = ret.data;
				if (data.length>=1) {
					$('#clientNameInput').val(data[0].name);
					$('#clientNameInput').attr('userId', data[0].id);
				}
			} else {

			}
		});

		// let res = await Net.listUploadFile(credMan.credential.token, 'GB_T 19056-2012.pdf');
		// console.log(res);
		//
		// res = await Net.downloadFile(credMan.credential.token, 'GB_T 19056-2012.pdf');
		// console.log(res);

		await this.requestList('', 1).then(maxRowNumber => {
			new Pagination($('#table'), this.pageSize, maxRowNumber, this.handlePage.bind(this));
		});

		$('.viewDetailsBtn').click(this.handleViewDetails.bind(this));
		let res = await Net.getProductList(credMan.credential.token);
		this.#productList = new Map();
		for(let item of res.data) {
			this.#productList.set(item.name, item.id);
		}
	}

	handleViewDetails(e) {
		let idStr = $(e.target).parents("tr").attr('id');
		let id = parseInt(idStr);
		let detail = this.#policiesMap.get(id);
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_POLICY_DETAIL);
		sessionStore.setItem(JSON.stringify(detail));
		window.location.href = '#insurancePolicyDetails';
	}

	async requestList(searchBy, pageNo) {
		let pageSize = 10;
		let maxRowNumber;
		let res = await Net.agentInsurancePolicyList(credMan.credential.token, pageSize, pageNo, searchBy);
		$('#list').empty();
		this.#policiesMap = new Map();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			this.#policiesMap.set(row.id, row);
			maxRowNumber = row.maxRowNumber;
			const amntMap = MetaDataManager.amountConvertionMap;
			let amountStr = '';
			amntMap.forEach(function(value, key) {
				if (value===row.coverage_amount) {
					amountStr = key;
				}
			});
			$('#list').append(rowTemplate
				.replace('{id}', row.id)
				.replace('{clientName}', row.client_name || '')
				.replace('{clientEmail}', row.client_email || '')
				.replace('{product}', row.product || '')
				.replace('{insuredName}', row.insured_name || '')
				.replace('{coverageAmount}', amountStr || '')
				.replace('{effectiveDate}', row.effective_date || '')
				.replace('{status}', row.status || '')
				.replace('{currentOwner}', row.current_owner || '')

			);
		}

		let that = this;
		$(".btnEdit").off('click');
		$(".btnEdit").click(function (e) {

			let val = $(this).text();
			let row = $(this).parent().parent();

			if (val==='Edit') {
				that.editEnter(row);
			} else {
				that.editExit(row);
			}
			console.log();
		});

		return maxRowNumber;
	}

	async handlePage(page) {
		console.log(page);
		await this.requestList(this.#searchBy, page);
	}

	editEnter(row) {
		$(row).addClass("edit");
		let product = $(row).find(".product");
		UIUtil.uiEnterEdit(product, 'selector', this.#productList);
		let insuredName = $(row).find(".insuredName");
		UIUtil.uiEnterEdit(insuredName, 'text');
		let coverageAmount = $(row).find(".coverageAmount");
		const amntMap = MetaDataManager.amountConvertionMap;
		UIUtil.uiEnterEdit(coverageAmount, 'selector', amntMap);
		let effectiveDate = $(row).find(".effective-date");
		UIUtil.uiEnterEdit(effectiveDate, 'date');
		let status = $(row).find(".status");
		const statusList = MetaDataManager.getPolicyStatus;
		UIUtil.uiEnterEdit(status, 'selector', statusList);
		$(row).find(".btnEdit").text("Save");
	}

	async editExit(row) {
		let id = parseInt(row.attr('id'));
		let clientId = row
		let product = $(row).find(".product");
		let productVal = UIUtil.uiExitEdit(product, 'selector');
		let insuredName = $(row).find(".insuredName");
		let insuredNameVal = UIUtil.uiExitEdit(insuredName, 'text');

		let coverageAmount = $(row).find(".coverageAmount");
		let coverageAmountVal = UIUtil.uiExitEdit(coverageAmount, 'selector');
		let effectiveDate = $(row).find(".effective-date");
		let effectiveDateVal = UIUtil.uiExitEdit(effectiveDate, 'date');
		let status = $(row).find(".status");
		let statusVal = UIUtil.uiExitEdit(status, 'selector');

		let res = await Net.insurancePolicyUpdate(credMan.credential.token, id, parseInt(productVal), 0,
			insuredNameVal, parseInt(coverageAmountVal), effectiveDateVal, statusVal);
		if (res.errCode!=0) {
			let errMsg = res.err.msg;
			alert(errMsg);
			return;
		}
		$(row).removeClass("edit");
		$(row).find(".btnEdit").text("Edit");
	}

	async handleCreateNew() {
    	let res = await Net.getProductList(credMan.credential.token);

		$('#productSelect').empty();
    	for(let i in res.data) {
    		let item = res.data[i];
			$('#productSelect').append($('<option>').val(item.id).text(item.name));
		}

    	$('#coverageAmountSelect').empty();
		const amntMap = MetaDataManager.amountConvertionMap;
		for(let item of amntMap) {
			$('#coverageAmountSelect').append($('<option>').val(item[1]).text(item[0]));
		}

		$('#statusSelect').empty();
		$('#statusSelect').append($('<option>').val('active').text('active'));
		$('#statusSelect').append($('<option>').val('fulfilled').text('fulfilled'));
		$('#statusSelect').append($('<option>').val('lapsed').text('lapsed'));
		$('#statusSelect').append($('<option>').val('surrendered').text('surrendered'));


		$("#filter-side").addClass("filter-side-enabled");
    	$("mask").eq(0).attr("style", "display: block;");

    	$('#submitBtn').click(this.handleSubmit.bind(this));

	}

	async handleSubmit() {
    	let clientName = $('#clientNameInput').val();
    	let clientEmail = $('#clientEmailInput').val();
    	let product = Number($('#productSelect').val());
		let coverageAmount = Number($('#coverageAmountSelect').val());
		let status = $('#statusSelect').val();
		let effectiveDate = $('#effectiveDateInput').val();
		let clientId = parseInt($('#clientNameInput').attr('userId'));
		if (clientName==='' || clientEmail==='' || product==='' || coverageAmount==='' || status==='' || effectiveDate==='') {
			alert('Please fill in completely');
			return;
		}

		let res = await Net.insurancePolicyAdd(credMan.credential.token, product, clientId, '', coverageAmount, effectiveDate, status);
		this.closeFilterSide();
		await this.requestList('', 1).then(maxRowNumber => {
			new Pagination($('#table'), this.pageSize, maxRowNumber, this.handlePage.bind(this));
		});
	}

	handleViewFiles(e) {
		let idStr = $(e.target).parents("tr").attr('id');
		let id = parseInt(idStr);
		let filePanel = new PolicyFilePanel(id, true);
	}

	closeFilterSide() {
		$("#filter-side").removeClass("filter-side-enabled");
		$("mask").eq(0).attr("style", "display: none;");
	}




}

export {InsurancePolicies}
