import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {Pagination} from "../../core/pagination.js";
import {UIUtil} from "../../core/uiUtil.js";
import {MetaDataManager} from "../../core/metaDataManager.js";

const pageTemplate = `
	<div class="card h-100 border-0 rounded-0">
		<div class="card-header d-flex align-items-center bg-white p-4 border-0">
			<h5 class="m-0">Applications</h5>
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
		<div id="table" class="card-body p-0 position-relative overflow-auto" style="height: 0;">
			
			<div class="event-table mx-4 position-relative overflow-auto" id="event-table" data-list='{"valueNames":["create-date","last-update-time","idle-time"]}'>
				<table class="w-100">
					<thead>
						<tr>
							<th>
								<input class="form-check-input" type="checkbox" id="th-checkbox">
							</th>
							<th>PRODUCT</th>
							<th>CLIENT NAME</th>
							<th>CLIENT EMAIL</th>
							<th>INSURED NAME</th>
							<th>COVERAGE AMOUNT</th>
							<th class="sort" data-sort="create-date">CREATE DATE</th>
							<th class="sort" data-sort="last-update-time">LAST UPDATE TIME</th>
							<th>STATUS</th>
							<th class="sort" data-sort="idle-time">IDLE TIME</th>
							<th>DELIGATE PRODUCER</th>
							<th>ACTION</th>
						</tr>
					</thead>
					<tbody class="list" id="list">
					</tbody>
				</table>
			</div>
			
								
		</div>
	</div>
</div>
`;

const rowTemplate = `			
<tr id="{appId}">
	<td>
		<input class="form-check-input" type="checkbox">
	</td>
	<td>{pn}</td>
	<td>{cn}</td>
	<td>{ce}</td>
	<td>{in}</td>
	<td>{ca}</td>
	<td class="create-date">{cd}</td>
	<td class="last-update-time">{ut}</td>
	<td class="status">{s}</td>
	<td class="idle-time">{it}</td>
	<td>{dp}</td>
	<td>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary viewButton" appId="{appId}">View</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary editButton" appId="{appId}">Edit</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary" data-bs-toggle="modal" data-bs-target="#DeleteEventModal" disabled>Delete</button>
	</td>
</tr>
`;
const pageSize = 10;

class Applications {
	#container;
	#searchBy = '';
	#appStatusMapRevert;

    constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);


		let appStatusMap = MetaDataManager.appStatusMap;
		this.#appStatusMapRevert = new Map();
		for(let [key,value] of appStatusMap) {
			this.#appStatusMapRevert.set(value, key);
		}

		await this.requestList('', 1).then(maxRowNumber => {
			new Pagination($('#table'), pageSize, maxRowNumber, this.handlePage.bind(this));
		});

		let options = {
			valueNames: [ 'create-date','last-update-time','idle-time' ]
		};

		let userList = new List('event-table', options);

		$('#searchSubmit').click(this.handleSearchSubmit.bind(this));
		$('.viewButton').click(this.handleView.bind(this));
		$('.editButton').click(this.handleEdit.bind(this));

	}

	async handlePage(page) {
		console.log(page);
		await this.requestList(this.#searchBy, page);
	}

	async requestList(searchBy, pageNo) {
		let pageSize = 10;
		let maxRowNumber;
		let res = await Net.getApplications(credMan.credential.token, null, pageSize, pageNo, searchBy, 'start_date desc');
		$('#list').empty();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			maxRowNumber = row.maxRowNumber;
			$('#list').append(rowTemplate
				.replace('{pn}', row.prod_name || '')
				.replace('{cn}', row.first_name + " " + row.middle_name + " " + row.last_name)
				.replace('{ce}', row.email || '')
				.replace('{in}', row.insured_first_name + " " + row.insured_middle_name + " " + row.insured_last_name)
				.replace('{ca}', row.coverage_amount || '')
				.replace('{cd}', new Date(row.start_date).toLocaleString() || '')
				.replace('{ut}', new Date(row.last_update).toLocaleString() || '')
				.replace('{s}', this.appStatus(row.status) || '')
				.replace('{it}', '')
				.replace('{dp}', row.agent_first_name + " " + row.agent_middle_name + " " + row.agent_last_name)
				.replaceAll('{appId}', row.id)
			);
		}
		return maxRowNumber;
	}

	handleView(e) {
		let row = $(e.target);
		let appId = row.attr("appId");
		window.location.href = "/user/pipeline.html?appId="+appId;
	}

	handleEdit(e) {
		let val = $(e.target).text();
		let row = $(e.target).parent().parent();

		if (val==='Edit') {
			this.editEnter(row);
		} else {
			this.editExit(row);
		}
	}

	editEnter(row) {
		$(row).addClass("edit");
		let status = $(row).find(".status");
		const appStatusMap = MetaDataManager.appStatusMap;
		UIUtil.uiEnterEdit(status, 'selector', appStatusMap);
		$(row).find(".editButton").text("Save");
	}

	async editExit(row) {
		let id = parseInt(row.attr('id'));
		let status = $(row).find(".status");
		let statusVal = UIUtil.uiExitEdit(status, 'selector');

		let res = await Net.updateApplicationStatus(credMan.credential.token, id, parseInt(statusVal));
		if (res.errCode!=0) {
			let errMsg = res.err.msg;
			alert(errMsg);
			return;
		}
		$(row).removeClass("edit");
		$(row).find(".editButton").text("Edit");
	}

	appStatus(status) {
    	return this.#appStatusMapRevert.get(status);
	}

	handleSearchSubmit(e) {
    	this.#searchBy = $('#searchInput').val();
		this.requestList(this.#searchBy, 1);
		console.log();
	}

	handleSort(e) {
		let dataSort = $(e.target).attr('data-sort');
		let cls = $(e.target).attr('class');
		e.preventDefault();
    	console.log(e);
	}
}

export {Applications}
