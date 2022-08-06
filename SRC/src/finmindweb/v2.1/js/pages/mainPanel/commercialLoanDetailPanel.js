import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {FileUploadPanel} from "../../core/fileUploadPanel.js";

const pageTemplate = `
<div class="modal fade" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 750px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Create New</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body px-4">
				<div class="mb-4">
					<label class="form-label">Title *</label>
					<input type="text" class="form-control form-control-lg titleInput" placeholder="Please enter the name">
				</div>
				<div class="mb-4 position-relative">
					<label class="form-label">Brief Description *</label>
					<textarea class="form-control form-control-lg descriptionInput" rows="3" placeholder="Please enter a brief description" maxlength="400"></textarea>
					<div class="position-absolute bottom-0 end-0 pb-1 pe-2 fs-8 text-body text-opacity-50">
						<span class="word">200</span>/400
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center">
					<h6 class="m-0 text-body text-opacity-75">Image</h6>
					<div>
						<button  style="display:none" type="button" class="btn btn-sm btn-primary cancelBtn">&#215; Cancel</button>
					</div>
				</div>
				<div class="fileUploadDiv">
                </div>
                <table class="table w-100 fs-8">
                    <thead class="table-light">
                        <tr>
                            <th>FILE</th>
                            <th>SIZE</th>
                            <th class="w-25">ACTION</th>
                        </tr>
                    </thead>
                    <tbody id="fileList">
                    </tbody>
                </table>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary confirmBtn" style="min-width: 5.125rem;">Create</button>
				<button type="button" class="btn btn-outline-secondary ms-3" data-bs-dismiss="modal" style="min-width: 5.125rem;">Cancel</button>
			</div>
		</div>
	</div>
</div>
`;

const deleteConfirmTemplate = `
<div class="modal fade" id="deleteEventModal" tabindex="-1" aria-labelledby="DeleteEventModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" style="max-width: 620px;">
		<div class="modal-content">
			<div class="modal-header justify-content-center border-0">
				<h5 class="modal-title pt-4">Sure you want to delete this file?</h5>
			</div>
			<div class="modal-body px-3 py-0">
				<p class="text-center text-body text-opacity-75 px-4">
					Deleting this file is permanent. <br>
					 And we will not be able to recover this for you.
				</p>
				<div class="px-5 w-75 mx-auto">
					<img src="../img/bg-questions.png" class="img-fluid">
				</div>
			</div>
			<div class="modal-footer p-5 justify-content-between border-0">
				<button id="cancelDeleteBtn" type="button" class="btn fw-bold btn-outline-secondary m-0 ms-5" data-bs-dismiss="modal">Cancel</button>
				<button id="confirmDeleteBtn" type="button" class="btn fw-bold btn-primary m-0 me-5">Confirm</button>
			</div>
		</div>
	</div>
</div>
`;

class CommercialLoanDetailPanel {

    #page;
    #updatedHandler;

    #fileName;
    #fileNameUn;
    #fileSize;

    constructor() {
        this.init();
    }

    async init() {
        let loanDetail = $(pageTemplate);
        this.#page = loanDetail;
        $("body").append(loanDetail);
        $("body").append(deleteConfirmTemplate);

        loanDetail.find('.confirmBtn').click(this.handleConfirm.bind(this));
        loanDetail.find('.cancelBtn').click(this.initFilePanel.bind(this));
        loanDetail.modal('show');
        this.initFilePanel();
    }

    async fileUploaded(res) {
        this.#fileName = res.fileName;
        this.#fileNameUn = res.fileNameUn;
        this.#fileSize = res.fileSize;
        this.#page.find('.cancelBtn').show();
    }

    setUpdatedListener(handler) {
        this.#updatedHandler = handler;
    }

    async statusInit() {
        await this.updateFileList();
    }

    updateFileList() {
        if (this.#updatedHandler!=null)
            this.#updatedHandler();
    }

    async handleConfirm() {
        let title = this.#page.find('.titleInput').val();
        let description = this.#page.find('.descriptionInput').val();

        if (title==='' || description=='' || this.#fileName==null) {
            alert('Please fill in all fields');
            return;
        }
        let ret = await Net.adminCommercialLoanAdd(credMan.credential.token, title, description, this.#fileName, this.#fileSize, this.#fileNameUn);
        if (ret.code==null || ret.code==0) {

        } else {
            alert('file upload submit failed.');
        }
        await this.statusInit();
        this.#page.modal('hide');
    }

    initFilePanel() {
        this.#page.find('.fileUploadDiv').empty();
        this.#page.find('.cancelBtn').hide();
        new FileUploadPanel(this.#page.find('.fileUploadDiv'), this.fileUploaded.bind(this));
    }

}

export {CommercialLoanDetailPanel}
