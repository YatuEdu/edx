import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Pagination} from "../../core/pagination.js";
import {Net} from "../../core/net.js";
import {SessionStoreAccess} from "../../core/sessionStorage.js";
import {UIUtil} from "../../core/uiUtil.js";
import {MetaDataManager} from "../../core/metaDataManager.js";
import {CommercialLoanDetailPanel} from "./commercialLoanDetailPanel.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">Commercial Loan</h5>
		<div class="ms-auto d-flex">
			<button type="button" class="btn btn-primary ms-2" id="createBtn">
				New Loan
			</button>
		</div>
	</div>
	<div id="table" class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
		<div class="event-table mx-4 position-relative overflow-auto">
			<table class="w-100">
				<thead>
					<tr>
						<th>TITLE</th>
						<th>DESCRIPTION</th>
						<th>IMAGE</th>
						<th>CREATE TIME</th>
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
<tr id="{id}" file_name_un="{file_name_un}">
	<td class="title">{title}</td>
	<td class="description">{description}</td>
	<td>
		<img src="../img/ico-file-jpg.svg" style="width: 1rem;"> 
	{imgName}
	</td>
	<td>{createdDatetime}</td>
	<td>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary viewBtn">View</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary editBtn">Edit</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary delBtn">Delete</button>
	</td>
</tr>
`;

const deleteEventModalTemplate = `
<!-- delete event -->
<div class="modal fade" id="DeleteEventModal" tabindex="-1" aria-labelledby="DeleteEventModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" style="max-width: 620px;">
		<div class="modal-content">
			<div class="modal-header justify-content-center border-0">
				<h5 class="modal-title pt-4">Sure you want to delete this event?</h5>
			</div>
			<div class="modal-body px-3 py-0">
				<p class="text-center text-body text-opacity-75 px-4">
				\tDeleting this event will permanently delete all related data. <br>
					 We will not be able to recover this for you once deleted.
				</p>
				<div class="px-5 w-75 mx-auto">
					<img src="../img/bg-questions.png" class="img-fluid">
				</div>
			</div>
			<div class="modal-footer p-5 justify-content-between border-0">
				<button type="button" class="btn fw-bold btn-outline-secondary m-0 ms-5" data-bs-dismiss="modal">Cancel</button>
				<button type="button" id="delConfirmBtn" class="btn fw-bold btn-primary m-0 me-5">Confirm</button>
			</div>
		</div>
	</div>
</div>
`;

const pageSize = 10;

class CommercialLoan {
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
    	$('body').append(deleteEventModalTemplate);

		await this.requestList(1).then(maxRowNumber => {
			new Pagination($('#table'), pageSize, maxRowNumber, this.handlePage.bind(this));
		});

		$('#createBtn').click(this.handleCreateNewLoan.bind(this));
	}

	async handleView(e) {
		let row = $(e.target).parent().parent();
		let fileUn = row.attr('file_name_un');

		let res = await Net.downloadFile(credMan.credential.token, fileUn);
		window.open(res.data.url);
	}

	handleCreateNewLoan(e) {
		let createPanel = new CommercialLoanDetailPanel(false);
		createPanel.setUpdatedListener(async () => {
			await this.requestList(1);
		});
	}

	handleDel(e) {
		let row = $(e.target).parent().parent();
		let id = parseInt(row.attr('id'));
		$('#DeleteEventModal').modal('show');
		$('#delConfirmBtn').off('click');
		$('#delConfirmBtn').click(async e => {
			let res = await Net.adminCommercialLoanRemove(credMan.credential.token, id);
			if (res.errCode!=0) {
				alert('error occur');
				return;
			}
			$('#DeleteEventModal').modal('hide');
			await this.requestList(1);
		});
	}

    async requestList(pageNo) {

		let maxRowNumber;
		let res = await Net.adminCommercialLoanList(credMan.credential.token, this.#searchBy, pageSize, pageNo);
		$('#list').empty();
		for (let i = 0; i < res.data.length; i++) {
			let row = res.data[i];
			maxRowNumber = row.maxRowNumber;

			$('#list').append(rowTemplate
				.replace('{id}', row.id)
				.replace('{title}', row.title)
				.replace('{description}', row.description || '')
				.replace('{imgName}', row.file_name || '')
				.replace('{createdDatetime}', new Date(row.created_datetime).toLocaleString() || '')
				.replace('{file_name_un}', row.file_name_un)
			);
		}

		let that = this;

		$('.viewBtn').off('click');
		$('.viewBtn').click(this.handleView.bind(this));

		$('.editBtn').off('click');
		$(".editBtn").click(function (e) {

			let val = $(this).text();
			let row = $(this).parent().parent();

			if (val==='Edit') {
				that.editEnter(row);
			} else {
				that.editExit(row);
			}
			console.log();
		});

		$('.delBtn').off('click');
		$('.delBtn').click(this.handleDel.bind(this));

		return maxRowNumber;
	}

	editEnter(row) {
		$(row).addClass("edit");
		let title = $(row).find(".title");
		UIUtil.uiEnterEdit(title, 'text');
		let description = $(row).find(".description");
		UIUtil.uiEnterEdit(description, 'text');
		$(row).find(".editBtn").text("Save");
	}

	async editExit(row) {
		let id = parseInt(row.attr('id'));
		let title = $(row).find(".title");
		let titleVal = title.find(".form-control").val();
		let description = $(row).find(".description");
		let descriptionVal = description.find(".form-control").val();
		let res = await Net.adminCommercialLoanEdit(credMan.credential.token, id, titleVal, descriptionVal, '', 0, '');
		if (res.errCode!=0) {
			let errMsg = res.err.msg;
			alert(errMsg);
			return;
		}
		UIUtil.uiExitEdit(title, 'text');
		UIUtil.uiExitEdit(description, 'text');
		$(row).removeClass("edit");
		$(row).find(".editBtn").text("Edit");
	}

	async handlePage(page) {
		console.log(page);
		await this.requestList(page);
	}

}

export {CommercialLoan}
