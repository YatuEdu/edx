import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {Pagination} from "../../core/pagination.js";

const pageTemplate = `
<div class="modal fade" id="loanDetail" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 750px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Create New</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div id="uploadToolbar"  class="modal-body px-4">
				<div class="mb-4">
					<label class="form-label">Title *</label>
					<input id="titleInput" type="text" class="form-control form-control-lg" placeholder="Please enter the name">
				</div>
				<div class="mb-4 position-relative" id="wordCount">
					<label class="form-label">Brief Description *</label>
					<textarea id="descriptionInput"  class="form-control form-control-lg" rows="3" placeholder="Please enter a brief description" maxlength="400"></textarea>
					<div class="position-absolute bottom-0 end-0 pb-1 pe-2 fs-8 text-body text-opacity-50">
						<span class="word">200</span>/400
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center">
					<h6 class="m-0 text-body text-opacity-75">Image</h6>
					<div>
						<button id="cancelBtn" style="display:none" type="button" class="btn btn-sm btn-primary">&#215; Cancel</button>
					</div>
				</div>
				<div id="fileUploadDiv">
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
				<button id="confirmBtn" type="button" class="btn btn-primary" style="min-width: 5.125rem;">Create</button>
				<button type="button" class="btn btn-outline-secondary ms-3" data-bs-dismiss="modal" style="min-width: 5.125rem;">Cancel</button>
			</div>
		</div>
	</div>
</div>
`;

const fileInputBlkTemplate = `
<div id="fileInputBlk" class="upload-drag-area p-3 my-2 rounded-3 text-center">
	<input id="fileInput" type="file" class="d-none">
	<img src="../img/ico-upload-file.svg">
	<div class="fs-7 fw-bold text-body text-opacity-50">
		<a href="#" onclick="$('#fileInput').click();" class="text-primary text-decoration-none">Browse</a>, or Drag& Drop your file here
	</div>
</div>
`;

const progressTemplate = `
<div id="progressBlk" >
	<div class="upload-drag-area p-4 my-3 rounded-3 text-center d-flex align-items-center justify-content-between">
		<input type="file" class="d-none">
		<img id="progressIco" src="../img/ico-file-pdf.svg">
		<div class="flex-grow-1 mx-3">
			<div class="d-flex justify-content-between fs-7 fw-bold mb-1">
				<b id="progressFileName" class="text-body text-opacity-50">Project_v01</b>
				<span id="progressTxt" class="text-body text-opacity-25">0%</span>
			</div>
			<div class="progress" style="height: 6px;">
			  <div id="progressBar" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="18" cy="18" r="18" fill="#39C86A"></circle>
			<path d="M12 17.5L16.1464 21.6464C16.3417 21.8417 16.6583 21.8417 16.8536 21.6464L25 13.5" stroke="white" stroke-width="3" stroke-linecap="round"></path>
		</svg>
	</div>
</div>

`;

const fileTemplate = `
<tr id={fileId} fileNameUn="{fileNameUn}" >
	<td>
		<img src="../img/ico-file-{fileType}.svg" style="width: 0.75rem;">
		<a class="fileViewBtn" href="javascript:void(0);">{fileName}</a>
	</td>
	<td>{fileSize}</td>
	<td>
<!--		<button type="button" class="btn btn-sm border-0 btn-outline-primary">Edit</button>-->
		<button type="button" class="btn btn-sm border-0 btn-outline-primary deleteBtn">Delete</button>
	</td>
</tr>
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

    #updatedHandler;

    #fileName;
    #fileNameUn;
    #fileSize;

    constructor() {
        this.init();
    }

    counter = 0;
    // hook up events
    async init() {
        if($("#loanDetail").length) {
            $('#loanDetail').remove();
        }

        $("body").append(pageTemplate);
        $("body").append(deleteConfirmTemplate);
        $('#fileUploadDiv').append(fileInputBlkTemplate);
        $('#fileUploadDiv').append(progressTemplate);

        $('#fileInput').change(e => {
            e.preventDefault();
            let fileList = e.target.files;
            this.handleUploadFile(fileList[0]);
        });
        $('#fileInputBlk').on('drop dragdrop', (e) => {
            console.log('drop');
            e.preventDefault();
            e.stopPropagation();
            const files = e.originalEvent.dataTransfer.files;
            this.handleUploadFile(files[0]);
        });
        $('#fileInputBlk').on('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
        });
        $('#fileInputBlk').on('dragenter', (e) => {
            e.preventDefault();
            console.log('dragenter');
            this.counter++;
            $('#fileInputBlk').addClass('is_active');
        });
        $('#fileInputBlk').on('dragleave', (e) => {
            e.preventDefault();
            console.log('dragleave');
            this.counter--;
            if (this.counter === 0) {
                $('#fileInputBlk').removeClass('is_active');
            }
        });
        $('#confirmBtn').click(this.handleConfirm.bind(this));

        $('#loanDetail').modal('show');
        this.statusInit();
    }

    setUpdatedListener(handler) {
        this.#updatedHandler = handler;
    }



    async statusInit() {
        console.log('statusInit');
        this.#fileName = null;
        this.#fileNameUn = null;
        this.#fileSize = null;
        $('#fileInputBlk').show();
        $('#progressBlk').hide();
        $('#fileList').empty();
        $('#cancelBtn').hide();

        await this.updateFileList();
    }

    updateFileList() {
        if (this.#updatedHandler!=null)
            this.#updatedHandler();
    }

    statusUploading() {
        console.log('statusUploading');
        $('#fileInputBlk').hide();
        $('#progressBlk').show();
    }

    statusUploaded() {
        console.log('statusUploaded');
        $('#fileInput').val('');
        $('#cancelBtn').show();
        $('#cancelBtn').off('click');
        $('#cancelBtn').click(this.statusInit.bind(this));
    }


    handleDelete(e) {
        let fileId = $(e.target).parent().parent().attr('id');
        let fileNameUn = $(e.target).parent().parent().attr('fileNameUn');
        $('#deleteEventModal').modal('show');
        $('#confirmDeleteBtn').off('click');
        $('#confirmDeleteBtn').removeAttr('disabled');
        $('#cancelDeleteBtn').removeAttr('disabled');

        $('#confirmDeleteBtn').click(async () => {
            console.log(fileId);
            $('#confirmDeleteBtn').attr('disabled','disabled');
            $('#cancelDeleteBtn').attr('disabled','disabled');
            // await Net.insurancePolicyFileDelete(credMan.credential.token, this.#policyId, fileId);
            await Net.deleteFile(credMan.credential.token, fileNameUn);
            $('#deleteEventModal').modal('hide');
            this.statusInit();
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

    async handleUploadFile(file, uploadProgress) {
        let tips = $('#tips');

        if (file.size <= 0 || file.size > (40 * 1024 * 1024)) {
            tips.text("File size cannot be larger than 40MB");
        } else {
            let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
            this.#fileNameUn = this.genFileName(suffix);
            this.#fileName = file.name;
            this.#fileSize = file.size;
            let icoType = suffix;
            if (icoType==='jpeg' || icoType==='bmp')
                icoType = 'jpg';
            $('#progressIco').attr('src', '../img/ico-file-'+icoType+'.svg');
            $('#progressFileName').text(this.#fileName);
            let ret = await Net.beforeUploadFile(credMan.credential.token, this.#fileNameUn);
            if (ret.code==null || ret.code==0) {
                let resUrl = ret.data.url;
                if (window.FileReader) {
                    this.statusUploading();
                    // $('#fileInputBlk').hide();
                    // $('#uploadToolbar').append(progressTemplate);
                    // $('#progressTxt').html(e.loaded*100/e.total+'%');
                    // $('#progressBar').width('0%');
                    let fReader = new FileReader();
                    let xhreq = this.createHttpRequest();
                    let that = this;
                    xhreq.onreadystatechange = function () {
                        if (xhreq.readyState == 4) {
                            if (xhreq.status == 200) {
                                // tips.text("文件上传成功");
                                // alert("文件上传成功");
                                that.statusUploaded();
                            } else {
                                let responseData = xhreq.responseText;
                                // alert("文件上传失败：" + responseData);
                                tips.text("file upload failed" + responseData);
                            }
                        }
                    };
                    fReader.onload = function (e) {
                        //xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
                        console.log("try send to url:\n" + resUrl);
                        xhreq.open("PUT", resUrl, true);

                        //xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
                        xhreq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
                        // xhreq.setRequestHeader("Content-Length", file.size);     //文件大小
                        xhreq.setRequestHeader("uploadfile_name", encodeURI(that.#fileNameUn)); //兼容中文
                        xhreq.send(fReader.result);
                    };
                    fReader.onprogress = function (e) {
                        //	uploadProgress.value = e.loaded*100/e.total;
                        $('#progressTxt').html(e.loaded*100/e.total+'%');
                        $('#progressBar').width(e.loaded*100/e.total+'%');
                    };
                    fReader.readAsArrayBuffer(file);
                }
            } else {
                tips.text("file upload failed" + ret.msg);
                // alert("文件上传失败"+ret.msg);
            }
        }
    }

    async handleConfirm() {
        let title = $('#titleInput').val();
        let description = $('#descriptionInput').val();

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
        $('#loanDetail').modal('hide');
    }

    genFileName(suffix) {
        let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
        for (let i = 0; i < 32; i++) n += t.charAt(Math.floor(Math.random() * a));
        let timestamp = new Date().getTime();
        return n + timestamp + '.' + suffix;
    }

    createHttpRequest() {
        var xmlHttp = null;
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("您的浏览器不支持AJAX！");
                }
            }
        }
        return xmlHttp;
    }

}

export {CommercialLoanDetailPanel}
