const deleteConfirmTemplate = `
<div class="modal fade" id="deleteEventModal" tabindex="-1" aria-labelledby="DeleteEventModal" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" style="max-width: 620px;">
		<div class="modal-content">
			<div class="modal-header justify-content-center border-0">
				<h5 class="modal-title pt-4">Sure you want to delete this {toDeleted}?</h5>
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

class DeleteConfirmPanel {
    #toDeleted;
    #deleteFunc;
    constructor(toDeleted, deleteFunc) {
        this.#toDeleted = toDeleted;
        this.#deleteFunc = deleteFunc;
    }

    show() {
        $('#deleteEventModal').remove();
        $('body').append(deleteConfirmTemplate.replace("{toDeleted}", this.#toDeleted));
        $('#deleteEventModal').modal('show');
        $('#confirmDeleteBtn').off('click');
        $('#confirmDeleteBtn').removeAttr('disabled');
        $('#cancelDeleteBtn').removeAttr('disabled');
        let that = this;
        $('#confirmDeleteBtn').click(() => {
            $('#confirmDeleteBtn').attr('disabled','disabled');
            $('#cancelDeleteBtn').attr('disabled','disabled');
            that.#deleteFunc();
            $('#deleteEventModal').modal('hide');
        });
    }

    hide() {
        $('#deleteEventModal').modal('hide');
    }
}

export {DeleteConfirmPanel}