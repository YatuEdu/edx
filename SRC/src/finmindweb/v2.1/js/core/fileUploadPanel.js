import {Net} from "./net.js";
import {credMan} from "./credManFinMind.js";
import {FileUtil} from "./fileUtil.js";

const fileInputBlkTemplate = `
<div id="fileInputBlk" class="upload-drag-area p-3 my-2 rounded-3 text-center">
	<input type="file" class="d-none fileInput">
	<img src="../img/ico-upload-file.svg">
	<div class="fs-7 fw-bold text-body text-opacity-50">
		<a href="javascript:void(0);" onclick="$(this).parent().parent().find('.fileInput').click();" class="text-primary text-decoration-none">Browse</a>, or Drag& Drop your file here
	</div>
</div>
`;

const progressTemplate = `
<div id="progressBlk" >
	<div class="upload-drag-area p-4 my-3 rounded-3 text-center d-flex align-items-center justify-content-between">
		<input type="file" class="d-none">
		<img class="progressIco" src="../img/ico-file-pdf.svg">
		<div class="flex-grow-1 mx-3">
			<div class="d-flex justify-content-between fs-7 fw-bold mb-1">
				<b class="text-body text-opacity-50 progressFileName">Project_v011</b>
				<span class="text-body text-opacity-25 progressTxt">0%</span>
			</div>
			<div class="progress" style="height: 6px;">
			  <div class="progress-bar progressBar" role="progressbar" style="width: 0%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
		</div>
		<svg class="uploadedIco" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="18" cy="18" r="18" fill="#39C86A"></circle>
			<path d="M12 17.5L16.1464 21.6464C16.3417 21.8417 16.6583 21.8417 16.8536 21.6464L25 13.5" stroke="white" stroke-width="3" stroke-linecap="round"></path>
		</svg>
	</div>
</div>
`;

class FileUploadPanel {

    #fileName;
    #fileNameUn;
    #fileSize;

    #fileInputBlk;
    #progressBlk;

    #uploadedHandle;

    counter = 0;

    constructor(container, uploadedHandle) {
        let fileInputBlk = $(fileInputBlkTemplate);
        let progressBlk = $(progressTemplate);
        container.append(fileInputBlk);
        container.append(progressBlk);

        let fileInput = fileInputBlk.find('.fileInput');
        fileInput.change(this.fileInputChange.bind(this));
        fileInputBlk.on('drop dragdrop', this.fileDragdrop.bind(this));
        fileInputBlk.on('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
        });
        fileInputBlk.on('dragenter', (e) => {
            e.preventDefault();
            console.log('dragenter');
            this.counter++;
            $('#fileInputBlk').addClass('is_active');
        });
        fileInputBlk.on('dragleave', (e) => {
            e.preventDefault();
            console.log('dragleave');
            this.counter--;
            if (this.counter === 0) {
                $('#fileInputBlk').removeClass('is_active');
            }
        });
        this.#fileInputBlk = fileInputBlk;
        this.#progressBlk = progressBlk;
        this.statusInit();
        this.#uploadedHandle = uploadedHandle;
    }

    async fileInputChange(e) {
        e.preventDefault();
        let fileList = e.target.files;
        await this.uploadFile(fileList[0]);
    }

    async fileDragdrop(e) {
        console.log('drop');
        e.preventDefault();
        e.stopPropagation();
        const fileList = e.originalEvent.dataTransfer.files;
        await this.uploadFile(fileList[0]);
    }

    async uploadFile(file) {
        let that = this;
        let res = await FileUtil.uploadFile(credMan.credential.token, file, (progress, msg) => {
            console.log("progress: " + progress + ", msg: " + msg);
            if (progress==100) {
                this.#fileName = res.fileName;
                this.#fileNameUn = res.fileNameUn;
                this.#fileSize = res.fileSize;
                that.statusUploaded();

                if (this.#uploadedHandle!=null)
                    this.#uploadedHandle({
                        fileName: this.#fileName,
                        fileNameUn: this.#fileNameUn,
                        fileSize: this.#fileSize
                    });
            } else if (progress<0) {
                alert('file upload failed ' + msg);
            } else {
                that.statusUploading(progress);
            }
        });
        let icoType = res.suffix;

        if (icoType==='jpeg' || icoType==='bmp') icoType = 'jpg';
        this.#progressBlk.find('.progressIco').attr('src', '../img/ico-file-'+icoType+'.svg');
        this.#progressBlk.find('.progressFileName').text(res.fileName);
    }

    statusInit() {
        console.log('statusInit');
        this.#fileName = null;
        this.#fileNameUn = null;
        this.#fileSize = null;
        this.#fileInputBlk.show();
        this.#progressBlk.hide();
        this.#progressBlk.find('.uploadedIco').hide();
    }

    statusUploading(progress) {
        console.log('statusUploading');
        this.#fileInputBlk.hide();
        this.#progressBlk.show();
        this.#progressBlk.find('.progressTxt').html(progress+'%');
        this.#progressBlk.find('.progressBar').width(progress+'%');
    }

    statusUploaded() {
        console.log('statusUploaded');
        this.#progressBlk.find('.progressTxt').html(100+'%');
        this.#progressBlk.find('.progressBar').width(100+'%');
        this.#fileInputBlk.find('.fileInput').val('');
        this.#progressBlk.find('.uploadedIco').show();
        //
        // $('#cancelBtn').show();
        // $('#cancelBtn').off('click');
        // $('#cancelBtn').click(this.statusInit.bind(this));
    }

}


export {FileUploadPanel}
