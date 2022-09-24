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
			<button type="button" class="btn" id="event-export-btn">
				<svg class="me-1" width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.563 7.063l3.187-3.188L10.562.687M11.625 11.313H1.531a.531.531 0 0 1-.531-.53v-7.97" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.857 8.656a6.378 6.378 0 0 1 6.174-4.781h3.719" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Export
			</button>
		</div>
	</div>
	<div id="table" class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
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
		<button type="button" class="btn btn-sm border-0 btn-outline-primary viewButton" appId="{appId}">View</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary" data-bs-toggle="modal" data-bs-target="#DeleteEventModal" disabled>Delete</button>
	</td>
</tr>
`;

const pageSize = 10;

class MyApplication {
	#container;
	#searchBy = '';

    constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);

		await this.requestList(1).then(maxRowNumber => {
			new Pagination($('#table'), pageSize, maxRowNumber, this.handlePage.bind(this));
		});

		$('#searchSubmit').click(this.handleSearchSubmit.bind(this));
		$('.viewButton').click(this.handleView.bind(this));

		$('#searchInput').keypress(this.handleKeyPress.bind(this));
	}

	handleSearchSubmit(e) {
		this.#searchBy = $('#searchInput').val();
		this.requestList(1);
		console.log();
	}

	handleKeyPress(e) {
		if (e.which === 13) {
			this.handleSearchSubmit(e);
		}
	}

	handleView(e) {
		let row = $(e.target);
		let appId = row.attr("appId");
		window.location.href = "/user/pipeline.html?appId="+appId;
	}

	async requestList(pageNo) {

		let maxRowNumber;
		let res = await Net.getMyApplications(credMan.credential.token, pageSize, pageNo, this.#searchBy);
		$('#list').empty();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			maxRowNumber = row.maxRowNumber;
			$('#list').append(rowTemplate
				.replace('{product}', row.product_name || '')
				.replace('{insuredAmount}', row.insured_amount || '')
				.replace('{coverageAmount}', row.coverage_amount || '')
				.replace('{createDate}', new Date(row.start_date).toLocaleString() || '')
				.replace('{currentStage}', row.applicatio_status || '')
				.replace('{status}', '')
				.replace('{appId}', row.id)
			);
		}

		return maxRowNumber;
	}

	async handlePage(page) {
		console.log(page);
		await this.requestList(page);
	}

}

export {MyApplication}
