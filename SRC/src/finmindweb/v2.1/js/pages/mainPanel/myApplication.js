import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Pagination} from "../../core/pagination.js";
import {Net} from "../../core/net.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">My Applications</h5>
		<div class="ms-auto d-flex">
			<div class="input-group me-2" style="width: 16.25rem;">
				<input id="searchInput" type="text" class="form-control fs-7" placeholder="Search Name" style="border-color: rgba(217, 220, 230, 1);">
				<button id="searchSubmit" class="btn btn-outline-secondary bg-transparent" type="button" style="border-color: rgba(217, 220, 230, 1);">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 12a6 6 0 1 1 4.548-2.087l1.32 1.32a.447.447 0 0 1 .003.631l-.004.004a.454.454 0 0 1-.318.132.454.454 0 0 1-.318-.132L9.912 10.55A5.976 5.976 0 0 1 6 12zM6 .9a5.1 5.1 0 1 0 0 10.2A5.1 5.1 0 0 0 6 .9z" fill="#1F1534" fill-opacity=".2"/></svg>
				</button>
			</div>
			<button type="button" class="btn btn-outline-secondary ms-2" style="width: 5.125rem;border-color: rgba(217, 220, 230, 1);">
				Delete
			</button>
			<button type="button" class="btn btn-primary ms-2 me-3" style="width: 5.125rem;">
				Edit
			</button>
			<button type="button" class="btn" id="event-export-btn">
				<svg class="me-1" width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.563 7.063l3.187-3.188L10.562.687M11.625 11.313H1.531a.531.531 0 0 1-.531-.53v-7.97" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.857 8.656a6.378 6.378 0 0 1 6.174-4.781h3.719" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Export
			</button>
		</div>
	</div>
	<div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
		<div class="event-table mx-4 position-relative overflow-auto">
			<table class="w-100">
				<thead>
					<tr>
						<th>PRODUCT</th>
						<th>INSURED AMOUNT</th>
						<th>COVERAGE AMOUNT</th>
						<th>CREATE DATE</th>
						<th>CURRENT STAGE</th>
						<th>STATUS</th>
						<th>ACTION</th>
					</tr>
				</thead>
				<tbody id="list">
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
</div>
`;

const rowTemplate = `
<tr>
	<td>{product}</td>
	<td>{insuredAmount}</td>
	<td>{coverageAmount}</td>
	<td>{createDate}</td>
	<td>{currentStage}</td>
	<td>{status}</td>
	<td>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary" disabled>Edit</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary" data-bs-toggle="modal" data-bs-target="#DeleteEventModal" disabled>Delete</button>
	</td>
</tr>
`;

class MyApplication {
	#container;
	
    constructor(container) {
		this.#container = container;
		this.init();
	}
	
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);

		await this.requestList('');

		$('#searchSubmit').click(this.handleSearchSubmit.bind(this));
	}

	handleSearchSubmit(e) {
		let searchBy = $('#searchInput').val();
		this.requestList(searchBy);
		console.log();
	}

	async requestList(searchBy) {
		let pageSize = 10;
		let pageNo = 1;
		let maxRowNumber;
		let res = await Net.getMyApplications(credMan.credential.token, pageSize, pageNo, searchBy);
		$('#list').empty();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			maxRowNumber = row.maxRowNumber;
			$('#list').append(rowTemplate
				.replace('{product}', row.product_name)
				.replace('{insuredAmount}', row.insured_amount)
				.replace('{coverageAmount}', row.coverage_amount)
				.replace('{createDate}', new Date(row.start_date).toLocaleString())
				.replace('{currentStage}', row.applicatio_status)
				.replace('{status}', '')
			);
		}
		new Pagination($('#table'), pageSize, maxRowNumber);
	}


}

export {MyApplication}