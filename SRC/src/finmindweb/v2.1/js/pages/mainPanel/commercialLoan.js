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
	<div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		
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
<tr id="{id}">
	<td class="title">{title}</td>
	<td class="description">{description}</td>
	<td>
		<img src="../img/ico-file-jpg.svg" style="width: 1rem;"> 
	{imgName}
	</td>
	<td>{createdDatetime}</td>
	<td>
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
			);
		}

		let that = this;

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
