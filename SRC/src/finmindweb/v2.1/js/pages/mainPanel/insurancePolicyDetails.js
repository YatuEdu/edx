import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {MetaDataManager} from "../../core/metaDataManager.js";
import {Pagination} from "../../core/pagination.js";
import {PolicyFilePanel} from "./policyFilePanel.js";
import {UIUtil} from "../../core/uiUtil.js";
import {SessionStoreAccess} from "../../core/sessionStorage.js";
import {PolicyFileUpload} from "./policyFileUpload.js";
import {PaginationSimple} from "../../core/paginationSimple.js";
import {DeleteConfirmPanel} from "../../core/DeleteConfirmPanel.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0 justify-content-between">
		<h6 class="m-0">
			<span class="fs-7 text-secondary">Insurance Policies</span> 
			<svg class="mx-2" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.667 1.333L5.333 6 .667 10.667" stroke="#C0C4CC"/></svg>
			<span class="fs-7 text-secondary">Policy Anniversary</span>
			<svg class="mx-2" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.667 1.333L5.333 6 .667 10.667" stroke="#C0C4CC"/></svg>
		    Policy Detail
		</h6>
		<h5>{insuredName}</h5>
		<div class="d-flex">
			<button type="button" class="btn ms-2 text-primary" id="ShowPolicyUpdateHistory">
			    Show Policy Update History
			</button>
			<button type="button" class="btn btn-primary ms-2" id="uploadNewFileBtn">
			    Upload New File
			</button>
		</div>
	</div>
	<div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
		<div class="row g-0 mb-5">
			<div class="col-12">
				<div class="event-table mx-4 position-relative overflow-auto">
					<table class="w-100">
						<thead>
							<tr>
								<th>DATE</th>
								<th>FILE</th>
								<th>SIZE</th>
								<th style="width: 8.5rem;">ACTION</th>
							</tr>
						</thead>
						<tbody id="fileList">
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="row g-0 mb-5">
			<div class="col-6" >
				<div class="d-flex justify-content-between mx-4 mb-3">
					<div class="fs-7">
						<div class="form-check form-check-inline">
						  <input class="form-check-input" type="radio" checked name="cashValue" id="cashValueCheck" value="">
						  <label class="form-check-label" for="">Cash Value Available</label>
						</div>
						<div class="form-check form-check-inline toast-NoCashValue-radio">
						  <input class="form-check-input" type="radio" name="cashValue" id="noCashValueCheck" value="">
						  <label class="form-check-label" for="">No Cash Value</label>
						</div>
					</div>
					<button id="cashValueAddBtn" type="button" class="btn btn-primary ms-2" >
					    Add
					</button>
				</div>
				<div class="event-table mx-4 position-relative overflow-auto">
					<table class="w-100" >
						<thead>
							<tr>
								<th>YEAR</th>
								<th>CASH VALUE</th>
								<th style="width: 6.5rem;">ACTION</th>
							</tr>
						</thead>
						<tbody id="cashValueList">
						</tbody>
					</table>
				</div>
				<div class="d-flex justify-content-end mt-3 mx-4 fs-8" id="cashValueTable" >
					
				</div>
			</div>
			<div class="col-6">
				<div class="d-flex justify-content-between mx-4 mb-3">
					<div class="fs-7">
						<div class="form-check form-check-inline">
						  <input class="form-check-input" type="radio" checked name="deathBenefit" id="deathBenefitCheck" value="">
						  <label class="form-check-label" for="">Calculated Death Benefit</label>
						</div>
						<div class="form-check form-check-inline toast-FlatDeathBenefit-radio">
						  <input class="form-check-input" type="radio" name="deathBenefit" id="noDeathBenefitCheck" value="">
						  <label class="form-check-label" for="">Flat Death Benefit</label>
						</div>
						<div class="btn bg-secondary bg-opacity-10 text-secondary border-secondary ms-2 opacity-50 fs-7">
							&#36; 50,000.00
						</div>
					</div>
					<button id="deathBenefitAddBtn" type="button" class="btn btn-primary ms-2">
					    Add
					</button>
				</div>
				<div class="event-table mx-4 position-relative overflow-auto">
					<table class="w-100">
						<thead>
							<tr>
								<th>YEAR</th>
								<th>CASH VALUE</th>
								<th style="width: 6.5rem;">ACTION</th>
							</tr>
						</thead>
						<tbody id="deathBenefitList">
						</tbody>
					</table>
				</div>
				<div class="d-flex justify-content-end mt-3 mx-4 fs-8" id="deathBenefitTable">
				
				</div>
			</div>
		
		</div>
		<div class="row g-0 mb-5">
			<div class="col-12">
				<div class="d-flex justify-content-between mx-4 mb-3">
					<h5>Reminder</h5>
					<button type="button" id="reminderAddBtn" class="btn btn-primary ms-2">
					    Add
					</button>
				</div>
				<div class="event-table mx-4 position-relative overflow-auto">
					<table class="w-100">
						<thead>
							<tr>
								<th>DATE</th>
								<th>CONTENT</th>
								<th>EMAIL</th>
								<th>
								    STATUS 
								<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.632 1h10.737a.5.5 0 0 1 .369.837l-4.106 4.52a.487.487 0 0 0-.132.337v3.537a.494.494 0 0 1-.225.419l-2 1.331a.498.498 0 0 1-.775-.412V6.694a.488.488 0 0 0-.13-.338L1.262 1.837A.5.5 0 0 1 1.632 1z" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody id="reminderList">
						</tbody>
					</table>
				</div>
				<div class="d-flex justify-content-between align-items-center mt-3 mx-4 fs-8" id="reminderTable">
				</div>
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

const toastTemplate = `
<div class="toast toast-NoCashValue position-absolute top-50 start-50 translate-middle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header justify-content-between align-items-center">
        <h6 class="text-body m-0">
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.017 12.345l-6.483-11.21a1.77 1.77 0 0 0-3.068 0L.983 12.345A1.763 1.763 0 0 0 2.51 15h12.98a1.763 1.763 0 0 0 1.527-2.655zM8.41 6.15a.59.59 0 1 1 1.18 0V9.1a.59.59 0 1 1-1.18 0V6.15zM9 12.64a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z" fill="#F2994A"/></svg>
            No Cash Value?
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  <div class="toast-body">
    This operation will delete the cash value history. Do you want to proceed? 
    <div class="mt-2 pt-2 border-top text-end">
      <button type="button" class="btn btn-outline-secondary btn-sm" id="noCashValueConfirmBtn">Confirm</button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast" id="noCashValueCancelBtn">Cancel</button>
    </div>
  </div>
</div>

<div class="toast toast-FlatDeathBenefit position-absolute top-50 start-50 translate-middle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header justify-content-between align-items-center">
        <h6 class="text-body m-0">
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.017 12.345l-6.483-11.21a1.77 1.77 0 0 0-3.068 0L.983 12.345A1.763 1.763 0 0 0 2.51 15h12.98a1.763 1.763 0 0 0 1.527-2.655zM8.41 6.15a.59.59 0 1 1 1.18 0V9.1a.59.59 0 1 1-1.18 0V6.15zM9 12.64a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z" fill="#F2994A"/></svg>
            Flat Death Benefit?
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  <div class="toast-body">
    This operation will delete death benefit history. Do you want to proceed? 
    <div class="mt-2 pt-2 border-top text-end">
      <button type="button" class="btn btn-outline-secondary btn-sm" id="noDeathBenefitConfirmBtn">Confirm</button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast" id="noDeathBenefitCancelBtn">Cancel</button>
    </div>
  </div>
</div>

<div class="toast toast-AddNewCashValue position-absolute top-50 start-50 translate-middle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header justify-content-between align-items-center">
        <h6 class="text-body m-0">
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.017 12.345l-6.483-11.21a1.77 1.77 0 0 0-3.068 0L.983 12.345A1.763 1.763 0 0 0 2.51 15h12.98a1.763 1.763 0 0 0 1.527-2.655zM8.41 6.15a.59.59 0 1 1 1.18 0V9.1a.59.59 0 1 1-1.18 0V6.15zM9 12.64a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z" fill="#F2994A"/></svg>
            Sure to submit?
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  <div class="toast-body">
    This operation will delete the cash value history. Do you want to proceed? 
    <div class="mt-2 pt-2 border-top text-end">
      <button type="button" class="btn btn-outline-secondary btn-sm">Confirm</button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast">Cancel</button>
    </div>
  </div>
</div>

<div class="toast toast-AddNewDeathBenefit position-absolute top-50 start-50 translate-middle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header justify-content-between align-items-center">
        <h6 class="text-body m-0">
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.017 12.345l-6.483-11.21a1.77 1.77 0 0 0-3.068 0L.983 12.345A1.763 1.763 0 0 0 2.51 15h12.98a1.763 1.763 0 0 0 1.527-2.655zM8.41 6.15a.59.59 0 1 1 1.18 0V9.1a.59.59 0 1 1-1.18 0V6.15zM9 12.64a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z" fill="#F2994A"/></svg>
            Sure to submit?
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  <div class="toast-body">
    This operation will delete your death benefit history. Do you want to proceed? 
    <div class="mt-2 pt-2 border-top text-end">
      <button type="button" class="btn btn-outline-secondary btn-sm">Confirm</button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast">Cancel</button>
    </div>
  </div>
</div>

<div class="toast toast-Addtoupdatehistory position-absolute top-50 start-50 translate-middle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
    <div class="toast-header justify-content-between align-items-center">
        <h6 class="text-body m-0">
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.017 12.345l-6.483-11.21a1.77 1.77 0 0 0-3.068 0L.983 12.345A1.763 1.763 0 0 0 2.51 15h12.98a1.763 1.763 0 0 0 1.527-2.655zM8.41 6.15a.59.59 0 1 1 1.18 0V9.1a.59.59 0 1 1-1.18 0V6.15zM9 12.64a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z" fill="#F2994A"/></svg>
            Sure to submit?
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  <div class="toast-body">
    Please comfirm the update is correct. You will not be able to modify it after submission. Do you want to continue?
    <div class="mt-2 pt-2 border-top text-end">
      <button type="button" class="btn btn-outline-secondary btn-sm">Confirm</button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="toast">Cancel</button>
    </div>
  </div>
</div>

<!-- Add New Cash Value -->
<div class="modal fade" id="AddNewCashValue" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 580px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Cash Value</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body px-4">
                <div class="mb-4">
                    <label class="form-label">Year</label>
                    <div class="input-group">
                        <input type="text" class="form-control form-control-lg border-end-0" id="year" value="2022"/>
                        <span class="input-group-text bg-transparent">
                            <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 3.004H2a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-20a1 1 0 0 0-1-1zM18 1.004v4M6 1.004v4M1 9.004h22" stroke="#1F1534" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="form-label">Cash Value</label>
                    <div class="input-group mb-4">
                      <span class="input-group-text bg-transparent">&#36;</span>
                      <input type="text" class="form-control form-control-lg border-start-0 ps-2" id="cashValue" placeholder="Please enter">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="cashValueAddSubmitBtn" class="btn btn-primary toast-AddNewCashValue-submit" style="min-width: 5.125rem;">Submit</button>
                <button type="button" class="btn btn-outline-secondary ms-3" data-bs-dismiss="modal" style="min-width: 5.125rem;">Cancel</button>
            </div>
        </div>
    </div>
</div>

<!-- Add New Death Benefit -->
<div class="modal fade" id="AddNewDeathBenefit" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 580px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Death Benefit</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body px-4">
                <div class="mb-4">
                    <label class="form-label">Year</label>
                    <div class="input-group">
                        <input type="text" class="form-control form-control-lg border-end-0" id="dbYear" value="2022"/>
                        <span class="input-group-text bg-transparent">
                            <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 3.004H2a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-20a1 1 0 0 0-1-1zM18 1.004v4M6 1.004v4M1 9.004h22" stroke="#1F1534" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="form-label">Death Benefit</label>
                    <div class="input-group mb-4">
                      <span class="input-group-text bg-transparent">&#36;</span>
                      <input type="text" class="form-control form-control-lg border-start-0 ps-2" id="deathBenefit"  placeholder="Please enter">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="deathBenefitAddSubmitBtn"  class="btn btn-primary toast-AddNewDeathBenefit-submit" style="min-width: 5.125rem;">Submit</button>
                <button type="button" class="btn btn-outline-secondary ms-3" data-bs-dismiss="modal" style="min-width: 5.125rem;">Cancel</button>
            </div>
        </div>
    </div>
</div>


<!-- Add to update history -->
<div class="modal fade" id="Addtoupdatehistory" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 580px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add to update history</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body px-4">
                <div class="mb-4">
                    <label for="" class="form-label">Title</label>
                    <select class="form-select form-control-lg">
                        <option selected="">Please select</option>
                        <option>Policy is created</option>
                        <option>Policy cash value is updated</option>
                        <option>Death benefit is updated</option>
                        <option>Important policy change</option>
                    </select>
                </div>
                <div class="mb-4">
                    <textarea class="form-control form-control-lg" rows="8" placeholder="Describe what changed"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary toast-Addtoupdatehistory-submit" style="min-width: 5.125rem;">Add</button>
                <button type="button" class="btn btn-outline-secondary ms-3" data-bs-dismiss="modal" style="min-width: 5.125rem;">Cancel</button>
            </div>
        </div>
    </div>
</div>
`;

const fileRowTemplate = `
<tr id={fileId} fileNameUn="{fileNameUn}">
	<td>{createdDatetime}</td>
	<td>
		<img src="../img/ico-file-{fileType}.svg" style="width: 1rem;"> 
	    {fileName}
	</td>
	<td>{fileSize}</td>
	<td>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary fileViewBtn">View</button>
		<button type="button" class="btn btn-sm border-0 btn-outline-primary fileDeleteBtn" >Delete</button>
	</td>
</tr>
`;

const cashValueRowTemplate = `
<tr>
    <td class="cashValueYear">{year}</td>
    <td>{amount}</td>
    <td>
        <button type="button" class="btn btn-sm border-0 btn-outline-primary cashValueDeleteBtn" >Delete</button>
    </td>
</tr>
`;

const deathBenefitRowTemplate = `
<tr>
    <td class="deathBenefitYear">{year}</td>
    <td>{amount}</td>
    <td>
        <button type="button" class="btn btn-sm border-0 btn-outline-primary deathBenefitDeleteBtn" >Delete</button>
    </td>
</tr>
`;

const reminderRowTemplate = `
<tr id="{id}">
    <td class="date">{date}</td>
    <td class="remindContent">{remindContent}</td>
    <td class="email">{email}</td>
    <td class="status">{status}</td>
    <td>
        <button type="button" class="btn btn-sm border-0 btn-outline-primary reminderEditBtn">Edit</button>
        <button type="button" class="btn btn-sm border-0 btn-outline-primary reminderDeleteBtn">Delete</button>
    </td>
</tr>
`;

const filterSideReminder = `
<div class="mask-reminder"></div>
<div class="filter-side" id="filter-side-reminder">
	<div class="card h-100 border-0 rounded-0">
		<div class="card-header bg-transparent d-flex justify-content-between align-items-center">
			<span class="fw-bold">Create New Reminder</span>
			<button id="closeFilterSideBtnTop" type="button" class="btn"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4.92l3.076 3.075.92-.92L4.918 4 7.995.924l-.92-.92L4 3.082.924.005l-.92.92L3.082 4 .005 7.076l.92.92L4 4.918z" fill="#1F232E"/></svg></button>
		</div>
		<div class="card-body fs-7">
			<div class="mb-4">
				<label for="" class="form-label">Date</label>
				<input id="dateInput" type="date" min="2022-06-01" name="dob" class="form-control form-control-lg date_for_3"/>
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Content</label>
				<input type="text" id="contentInput" class="form-control form-control-lg" placeholder="Please enter">
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Email</label>
				<input type="email" id="emailInput" class="form-control form-control-lg" placeholder="Please enter">
			</div>
			<div class="mb-4">
				<label for="" class="form-label">Status</label>
				<select id="statusSelect" class="form-select form-control-lg">
				    <option>Scheduled</option>
				    <option>Overdue</option>
				    <option>Completed</option>
				    <option>Cancelled</option>
				</select>
			</div>
		</div>
		<div class="card-footer bg-transparent">
			<button id="reminderSubmitBtn" type="button" class="btn btn-primary" style="width: 5.125rem;">
				Create
			</button>
			<button id="closeFilterSideBtn" type="button" class="btn btn-outline-secondary ms-3" style="width: 5.125rem;">
				Cancel
			</button>
		</div>
	</div>
</div>
`;

const pageSize = 3;

class InsurancePolicyDetails {
	#container;
	#detail;
	#canEdit = true;
	#searchBy = '';

    constructor(container) {
		this.#container = container;
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_POLICY_DETAIL);
		this.#detail = JSON.parse(sessionStore.getItem());
		this.init();
	}

	pageSize = 3;
	// hook up events
	async init() {
    	this.#container.empty();
    	this.#container.append(pageTemplate);
		$("body").append(deleteConfirmTemplate);
		$("body").append(toastTemplate);
		$("body").append(filterSideReminder);
    	console.log('InsurancePolicyDetails init');
        $('#uploadNewFileBtn').click(this.handleUploadNewFile.bind(this));
        await this.updateFileList();

        $('input[type=radio][name=cashValue]').change(this.handleCashValueChange.bind(this));
        this.updateCashValueList(1).then(maxRowNumber => {
            new PaginationSimple($('#cashValueTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
        });
        $('#cashValueAddBtn').click(this.handleCashValueAdd.bind(this));

        $('input[type=radio][name=deathBenefit]').change(this.handleDeathBenefitChange.bind(this));
        this.updateDeathBenefitList(1).then(maxRowNumber => {
            new PaginationSimple($('#deathBenefitTable'), this.pageSize, maxRowNumber, this.handleDeathBenefitPage.bind(this));
        });
        $('#deathBenefitAddBtn').click(this.handleDeathBenefitAdd.bind(this));

        this.updateReminderList(1).then(maxRowNumber => {
            new PaginationSimple($('#reminderTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
        });
        $('#reminderAddBtn').click(this.handleCreateNewReminder.bind(this));
	}

	async updateFileList() {
		let ret = await Net.insurancePolicyFileList(credMan.credential.token, this.#detail.id);
		if (ret.code==null || ret.code==0) {
			ret.data;
			$('#fileList').empty();
			for(let row of ret.data) {
				let fileName = row.file_name;
				let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
				if (fileType==='jpeg') {
					fileType = 'jpg';
				}
				let fileSize = row.file_size;
				let fileId = row.id;
				let fileNameUn = row.file_name_un;
				let createdDatetime = row.created_datetime;
				$('#fileList').append(
					fileRowTemplate
						.replace('{fileType}', fileType)
						.replace('{fileName}', fileName)
						.replace('{fileSize}', fileSize)
						.replace('{fileId}', fileId)
						.replace('{fileNameUn}', fileNameUn)
						.replace('{createdDatetime}', createdDatetime)
				);
			}
			$('.fileViewBtn').off('click');
			$('.fileViewBtn').click(this.handleFileView.bind(this));

			$('.fileDeleteBtn').off('click');
			$('.fileDeleteBtn').click(this.handleFileDelete.bind(this));

		} else {
			alert('require file list failed.');
		}
	}


    async handleUploadNewFile() {
        let fileUpload = new PolicyFileUpload(this.#detail.id, true);
        fileUpload.setUpdatedListener(async () => {
            await this.updateFileList();
        });
    }

    async handleFileView(e) {
        let fileId = $(e.target).parent().parent().attr('id');
        let fileNameUn = $(e.target).parent().parent().attr('fileNameUn');
        let ret = await Net.downloadFile(credMan.credential.token, fileNameUn);
        if (ret.code==null || ret.code==0) {
            let url = ret.data.url;
            window.open(url);
        }
        console.log();
    }

    handleFileDelete(e) {
        let fileId = $(e.target).parent().parent().attr('id');
        let fileNameUn = $(e.target).parent().parent().attr('fileNameUn');
        $('#deleteEventModal').modal('show');
        $('#confirmDeleteBtn').off('click');
        $('#confirmDeleteBtn').removeAttr('disabled');
        $('#cancelDeleteBtn').removeAttr('disabled');

        let that = this;
        $('#confirmDeleteBtn').click(async () => {
            $('#confirmDeleteBtn').attr('disabled','disabled');
            $('#cancelDeleteBtn').attr('disabled','disabled');
            await Net.insurancePolicyFileDelete(credMan.credential.token, that.#detail.id, fileId);
            await Net.deleteFile(credMan.credential.token, fileNameUn);
            $('#deleteEventModal').modal('hide');
            await that.init();
        });
    }


    async handleCashValuePage(page) {
        console.log(page);
        await this.updateCashValueList(page);
    }

	async updateCashValueList(pageNo) {
        let maxRowNumber = 0;
        let ret = await Net.insurancePolicyCashValueList(credMan.credential.token, this.#detail.id, pageSize, pageNo);
        if (ret.code==null || ret.code==0) {
            ret.data;
            $('#cashValueList').empty();
            for(let row of ret.data) {
                let year = row.year;
                let amount = row.cash_value;
                maxRowNumber = row.maxRowNumber;
                if (amount!=null) {
                    $('#cashValueList').append(
                        cashValueRowTemplate
                            .replace('{year}', year)
                            .replace('{amount}', amount)
                    );
                }

            }
            // $('.fileViewBtn').off('click');
            // $('.fileViewBtn').click(this.handleFileView.bind(this));
            //
            // $('.fileDeleteBtn').off('click');
            // $('.fileDeleteBtn').click(this.handleFileDelete.bind(this));
            $('.cashValueDeleteBtn').off('click');
            $('.cashValueDeleteBtn').click(this.handleCashValueDelete.bind(this));
        } else {
            alert('require file list failed.');
        }
        return maxRowNumber;
    }

    handleCashValueChange(e) {
        if ($('#noCashValueCheck').is(":checked")) {
            // try to switch to noCashValue
            $('.toast-NoCashValue').toast('show');
            $('#noCashValueConfirmBtn').off('click');
            $('#noCashValueConfirmBtn').click(async e => {
                console.log("Confirm");
                let ret = await Net.insurancePolicyCashValueRemoveAll(credMan.credential.token, this.#detail.id);
                if (ret.err) {
                    alert(ret.err.msg);
                }
                this.updateCashValueList(1).then(maxRowNumber => {
                    new PaginationSimple($('#cashValueTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
                });
                $('.toast-NoCashValue').toast('hide');
            });
            $('#noCashValueCancelBtn').off('click');
            $('#noCashValueCancelBtn').click(e => {
                console.log("Cancel");
                $('.toast-NoCashValue').toast('hide');
                $('#cashValueCheck').prop('checked', true);
            });
        } else {

        }
    }

	handleCashValueAdd(e) {
        console.log('handleCashValueAdd');
        $('#AddNewCashValue').modal('show');
        // data-bs-toggle="modal" data-bs-target="#AddNewCashValue"
        $('#cashValueAddSubmitBtn').off('click');
        $('#cashValueAddSubmitBtn').click(async () => {
            let year = parseInt($('#year').val());
            let cashValue = $('#cashValue').val();
            console.log('cashValueAddSubmitBtn');
            let ret = await Net.insurancePolicyCashValueAdd(credMan.credential.token, this.#detail.id, year, cashValue);
            if (ret.err) {
                alert(ret.err.msg);
            } else {
                $('#AddNewCashValue').modal('hide');
                this.updateCashValueList(1).then(maxRowNumber => {
                    new PaginationSimple($('#cashValueTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
                });
            }
        });
    }

    handleCashValueDelete(e) {
        let cashValueYear = $(e.target).parent().parent().children('.cashValueYear');
        let year = parseInt(cashValueYear.text());
        // $('#deleteEventModal').show();
        let that = this;
        new DeleteConfirmPanel('cash value', async () => {
            console.log('cash value delete');
            let ret = await Net.insurancePolicyCashValueRemove(credMan.credential.token, that.#detail.id, year);
            if (ret.err) {
                alert(ret.err.msg);
            }
            this.updateCashValueList(1).then(maxRowNumber => {
                new PaginationSimple($('#cashValueTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
            });
        }).show();
    }




    async handleDeathBenefitPage(page) {
        console.log(page);
        await this.updateDeathBenefitList(page);
    }

    async updateDeathBenefitList(pageNo) {
        let maxRowNumber = 0;
        let ret = await Net.insurancePolicyDeathBenefitList(credMan.credential.token, this.#detail.id, pageSize, pageNo);
        if (ret.code==null || ret.code==0) {
            ret.data;
            $('#deathBenefitList').empty();
            for(let row of ret.data) {
                let year = row.year;
                let amount = row.death_benefit;
                maxRowNumber = row.maxRowNumber;
                if (amount!=null) {
                    $('#deathBenefitList').append(
                        deathBenefitRowTemplate
                            .replace('{year}', year)
                            .replace('{amount}', amount)
                    );
                }

            }
            // $('.fileViewBtn').off('click');
            // $('.fileViewBtn').click(this.handleFileView.bind(this));
            //
            // $('.fileDeleteBtn').off('click');
            // $('.fileDeleteBtn').click(this.handleFileDelete.bind(this));
            $('.deathBenefitDeleteBtn').off('click');
            $('.deathBenefitDeleteBtn').click(this.handleDeathBenefitDelete.bind(this));
        } else {
            alert(ret.err.msg);
        }
        return maxRowNumber;
    }

    handleDeathBenefitChange(e) {
        if ($('#noDeathBenefitCheck').is(":checked")) {
            // try to switch to noCashValue
            $('.toast-FlatDeathBenefit').toast('show');
            $('#noDeathBenefitConfirmBtn').off('click');
            $('#noDeathBenefitConfirmBtn').click(async e => {
                console.log("No DeathBenefit Confirm");
                let ret = await Net.insurancePolicyDeathBenefitRemoveAll(credMan.credential.token, this.#detail.id);
                if (ret.err) {
                    alert(ret.err.msg);
                }
                this.updateDeathBenefitList(1).then(maxRowNumber => {
                    new PaginationSimple($('#deathBenefitTable'), this.pageSize, maxRowNumber, this.handleDeathBenefitPage.bind(this));
                });
                $('.toast-FlatDeathBenefit').toast('hide');
            });
            $('#noDeathBenefitCancelBtn').off('click');
            $('#noDeathBenefitCancelBtn').click(e => {
                console.log("Cancel");
                $('.toast-FlatDeathBenefit').toast('hide');
                $('#deathBenefitCheck').prop('checked', true);
            });
        } else {

        }
    }

    handleDeathBenefitAdd(e) {
        console.log('handleDeathBenefitAdd');
        $('#AddNewDeathBenefit').modal('show');
        // data-bs-toggle="modal" data-bs-target="#AddNewCashValue"
        $('#deathBenefitAddSubmitBtn').off('click');
        $('#deathBenefitAddSubmitBtn').click(async () => {
            let year = parseInt($('#dbYear').val());
            let deathBenefit = $('#deathBenefit').val();
            console.log('DeathBenefitAddSubmitBtn');
            let ret = await Net.insurancePolicyDeathBenefitAdd(credMan.credential.token, this.#detail.id, year, deathBenefit);
            if (ret.err) {
                alert(ret.err.msg);
            } else {
                $('#AddNewDeathBenefit').modal('hide');
                this.updateDeathBenefitList(1).then(maxRowNumber => {
                    new PaginationSimple($('#deathBenefitTable'), this.pageSize, maxRowNumber, this.handleDeathBenefitPage.bind(this));
                });
            }
        });
    }

    handleDeathBenefitDelete(e) {
        let deathBenefitYear = $(e.target).parent().parent().children('.deathBenefitYear');
        let year = parseInt(deathBenefitYear.text());
        // $('#deleteEventModal').show();
        let that = this;
        new DeleteConfirmPanel('death benefit', async () => {
            console.log('death benefit delete');
            let ret = await Net.insurancePolicyDeathBenefitRemove(credMan.credential.token, that.#detail.id, year);
            if (ret.err) {
                alert(ret.err.msg);
            }
            this.updateDeathBenefitList(1).then(maxRowNumber => {
                new PaginationSimple($('#deathBenefitTable'), this.pageSize, maxRowNumber, this.handleDeathBenefitPage.bind(this));
            });
        }).show();
    }

    async updateReminderList(pageNo) {
        let maxRowNumber = 0;
        let ret = await Net.insurancePolicyReminderList(credMan.credential.token, this.#detail.id, pageSize, pageNo);
        if (ret.code==null || ret.code==0) {
            ret.data;
            $('#reminderList').empty();
            for(let row of ret.data) {
                maxRowNumber = row.maxRowNumber;

                $('#reminderList').append(
                    reminderRowTemplate
                        .replace('{id}', row.id)
                        .replace('{date}', row.date)
                        .replace('{remindContent}', row.remind_content)
                        .replace('{email}', row.email)
                        .replace('{status}', row.status)
                );
            }

            let that = this;
            $(".reminderEditBtn").click(function (e) {

                let val = $(this).text();
                let row = $(this).parent().parent();

                if (val==='Edit') {
                    that.editEnter(row);
                } else {
                    that.editExit(row);
                }
                console.log();
            });

            $('.reminderDeleteBtn').off('click');
            $('.reminderDeleteBtn').click(this.handleReminderDelete.bind(this));
        } else {
            alert('require file list failed.');
        }
        return maxRowNumber;
    }

    async handleCreateNewReminder() {

        $("#filter-side-reminder").addClass("filter-side-enabled");
        $("mask-reminder").eq(0).attr("style", "display: block;");

        $('#reminderSubmitBtn').click(this.handleReminderSubmit.bind(this));

    }

    editEnter(row) {
        $(row).addClass("edit");
        let date = $(row).find(".date");
        UIUtil.uiEnterEdit(date, 'date');
        let remindContent = $(row).find(".remindContent");
        UIUtil.uiEnterEdit(remindContent, 'text');
        let email = $(row).find(".email");
        UIUtil.uiEnterEdit(email, 'text');

        const amntMap = MetaDataManager.amountConvertionMap;

        let status = $(row).find(".status");
        const statusList = MetaDataManager.getPolicyReminderStatus;
        UIUtil.uiEnterEdit(status, 'selector', statusList);
        $(row).find(".reminderEditBtn").text("Save");
    }

    async editExit(row) {
        let id = parseInt(row.attr('id'));
        let date = $(row).find(".date");
        let dateVal = UIUtil.uiExitEdit(date, 'date');
        let remindContent = $(row).find(".remindContent");
        let remindContentVal = UIUtil.uiExitEdit(remindContent, 'text');
        let email = $(row).find(".email");
        let emailVal = UIUtil.uiExitEdit(email, 'text');
        let status = $(row).find(".status");
        let statusVal = UIUtil.uiExitEdit(status, 'selector');

        let res = await Net.insurancePolicyReminderEdit(credMan.credential.token, id, this.#detail.id, remindContentVal, dateVal, emailVal, statusVal);
        if (res.errCode!=0) {
            let errMsg = res.err.msg;
            alert(errMsg);
        }
        $(row).removeClass("edit");
        $(row).find(".reminderEditBtn").text("Edit");
    }

    async handleReminderDelete(e) {
        let row = $(e.target).parent().parent();
        let id = parseInt(row.attr('id'));
        new DeleteConfirmPanel('reminder', async () => {
            console.log('delete id: ' + id);
            let ret = await Net.insurancePolicyReminderRemove(credMan.credential.token, id);
            if (ret.errCode!=0) {
                let errMsg = ret.err.msg;
                alert(errMsg);
            }
            await this.updateReminderList(1).then(maxRowNumber => {
                new PaginationSimple($('#reminderTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
            });
        }).show();
    }

    async handleReminderSubmit() {
        let date = $('#dateInput').val();
        let content = $('#contentInput').val();
        let email = $('#emailInput').val();
        let status = $('#statusSelect').val();
        if (date==='' || content==='' || email==='' || status==='') {
            alert('Please fill in completely');
            return;
        }

        let ret = await Net.insurancePolicyReminderAdd(credMan.credential.token, this.#detail.id, content, date, email, status);
        if (ret.err) {
            alert(ret.err.msg);
            return;
        }

        $("#filter-side-reminder").removeClass("filter-side-enabled");
        $("mask-reminder").eq(0).attr("style", "display: none;");

        await this.updateReminderList(1).then(maxRowNumber => {
            new PaginationSimple($('#reminderTable'), this.pageSize, maxRowNumber, this.handleCashValuePage.bind(this));
        });
    }
}

export {InsurancePolicyDetails}