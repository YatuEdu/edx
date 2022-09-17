import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {Pagination} from "../../core/pagination.js";
import {MetaDataManager} from "../../core/metaDataManager.js";
import {UIUtil} from "../../core/uiUtil.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">Clients</h5>
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
	<div id="table" class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
		<div class="event-table mx-4 position-relative overflow-auto">
			<table class="w-100">
				<thead>
					<tr>
						<th>NAME</th>
						<th>EMAIL</th>
						<th>PHONE</th>
						<th>ADDRESS</th>
						<th>BIRTHDAY</th>
						<th>LICENSE ISSUE STATE</th>
						<th>LICENSE EXPIRE DATE</th>
						<th>LICENSE NUMBER</th>
						<th>ROLE</th>
						<th>LICENSE STATUS</th>
						<th>REGISTER DATE</th>
						<th>QUICK NOTE</th>
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
<tr id="{id}">
	<td>{name}</td>
	<td>{email}</td>
	<td>{phone}</td>
	<td>{address}</td>
	<td>{birthday}</td>
	<td>{licenseIssueState}</td>
	<td class='licenseExpireDate'>{licenseExpireDate}</td>
	<td>{licenseNumber}</td>
	<td>{role}</td>
	<td class='licenseStatus'>{licenseStatus}</td>
	<td>{regDate}</td>
	<td class='quickNote'>{quickNote}</td>
	<td class="action">
		<button type="button" class="btn btn-sm border-0 btn-outline-primary btnEdit">Edit</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary" data-bs-toggle="modal" data-bs-target="#DeleteEventModal" disabled>Delete</button>
	</td>
</tr>
`;

const cancelTemplate = `
<button type="button" class="btn btn-sm border-0 btn-outline-primary btnCancel">Cancel</button>
`;

const pageSize = 10;

class People {
	#container;
	#searchBy = '';
	#licenseStatusMapRevert;

	constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
		this.#container.empty();
		this.#container.append(pageTemplate);

		let licenseStatusMap = MetaDataManager.licenseStatusMap;
		this.#licenseStatusMapRevert = new Map();
		for(let [key,value] of licenseStatusMap) {
			this.#licenseStatusMapRevert.set(value, key);
		}

		await this.requestList('', 1).then(maxRowNumber => {
			new Pagination($('#table'), pageSize, maxRowNumber, this.handlePage.bind(this));
		});

		$('#searchSubmit').click(this.handleSearchSubmit.bind(this));

	}

	async handlePage(page) {
		console.log(page);
		await this.requestList(this.#searchBy, page);
	}

	handleSearchSubmit(e) {
		this.#searchBy = $('#searchInput').val();
		this.requestList(this.#searchBy, 1);
		console.log();
	}

	async requestList(searchBy, pageNo) {

		let maxRowNumber;
		let res = await Net.getPeoples(credMan.credential.token, pageSize, pageNo, searchBy);
		$('#list').empty();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			maxRowNumber = row.maxRowNumber;
			$('#list').append(rowTemplate
				.replace('{id}', row.id)
				.replace('{name}', row.first_name + " " + row.middle_name + " " + row.last_name)
				.replace('{email}', row.email || '')
				.replace('{phone}', row.phone_number || '')
				.replace('{address}', '')
				.replace('{birthday}', '')
				.replace('{licenseIssueState}', row.license_issue_state || '')
				.replace('{licenseExpireDate}', row.license_expire_date || '')
				.replace('{licenseNumber}', row.license_number || '')
				.replace('{role}', row.role_name || '')
				.replace('{licenseStatus}', this.licenseStatus(row.license_status) || '')
				.replace('{regDate}', new Date(row.join_date).toLocaleString() || '')
				.replace('{quickNote}', '')
			);
		}

		let that = this;
		$('.btnEdit').off('click');
		$('.btnEdit').click(function (e) {

			let val = $(this).text();
			let row = $(this).parent().parent();

			if (val==='Edit') {
				that.editEnter(row);
			} else {
				that.editExit(row, true);
			}
			console.log();
		});

		return maxRowNumber;
	}

	editEnter(row) {
		$(row).addClass("edit");
		let licenseStatus = $(row).find(".licenseStatus");
		const licenseStatusMap = MetaDataManager.licenseStatusMap;
		UIUtil.uiEnterEdit(licenseStatus, 'selector', licenseStatusMap);
		let licenseExpireDate = $(row).find(".licenseExpireDate");
		UIUtil.uiEnterEdit(licenseExpireDate, 'date');
		let quickNote = $(row).find(".quickNote");
		UIUtil.uiEnterEdit(quickNote, 'text');
		$(row).find(".btnEdit").text("Save");
		$(row).find('.btnEdit').after($(cancelTemplate));
		let btnCancel = $(row).find('.btnCancel');
		btnCancel.off('click');
		btnCancel.click(this.editExit.bind(this, $(row), false));
	}

	async editExit(row, save) {
		let id = parseInt(row.attr('id'));
		let licenseStatus = $(row).find(".licenseStatus");
		let licenseStatusVal = UIUtil.uiExitEdit(licenseStatus, 'selector');
		let licenseExpireDate = $(row).find(".licenseExpireDate");
		let licenseExpireDateVal = UIUtil.uiExitEdit(licenseExpireDate, 'date');
		let quickNote = $(row).find(".quickNote");
		let quickNoteVal = UIUtil.uiExitEdit(quickNote, 'text');

		if (save) {
			let res = await Net.adminEditPeople(credMan.credential.token, id, parseInt(licenseStatusVal), licenseExpireDateVal, quickNoteVal);
			if (res.errCode!=0) {
				let errMsg = res.err.msg;
				alert(errMsg);
				return;
			}
		}

		$(row).removeClass("edit");
		$(row).find(".btnEdit").text("Edit");
		$(row).find('.btnCancel').remove();
	}

	licenseStatus(status) {
		let template = '<span class="event-status {type}">{note}</span>';
		let type = '';
		let note = this.#licenseStatusMapRevert.get(status);;
		switch (status) {
			case 1:
				type = 'status-warning';
				break;
			case 2:
				type = 'status-info';
				break;
			case 3:
			case 4:
			case 5:
				type = 'status-danger';
				break;
		}
		return note==null ? '' : template.replace('{type}', type).replace('{note}', note);
	}

}

export {People}
