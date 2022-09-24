import {UserQuestionBase} 	from './q_base.js';
import {ArrayUtil, StringUtil} from './util.js';
import {MetaDataManager} 	from './metaDataManager.js';
import {FileUploadUtil} 	from './fileUploadUtil.js'
import {credMan} from "./credManFinMind.js";
import {Net} from "./net.js";

const replacementForId = '{id}';
const replacementForLabel = '{lb}';
const replacementForFileList = '{f_upld_lst}';

const q_resultIconSuccess = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="18" fill="#39C86A"/>
<path d="M12 17.5L16.1464 21.6464C16.3417 21.8417 16.6583 21.8417 16.8536 21.6464L25 13.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

const q_resultIconFailed = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="18" fill="#FF5722"/>
<path d="M18.019 22.9712C17.2566 22.9712 16.639 22.3881 16.639 21.6689C16.639 21.6689 15.7892 12.2991 15.7881 9.16449C15.7877 8.23711 16.7871 7.59961 18.0193 7.59961C19.1691 7.59961 20.2052 8.18161 20.2052 9.13749C20.2052 12.3227 19.3993 21.6689 19.3993 21.6689C19.399 22.3881 18.781 22.9712 18.019 22.9712Z" fill="white"/>
<path d="M16.1162 26.5254C16.1162 27.0227 16.3138 27.4996 16.6654 27.8512C17.017 28.2028 17.4939 28.4004 17.9912 28.4004C18.4885 28.4004 18.9654 28.2028 19.317 27.8512C19.6687 27.4996 19.8662 27.0227 19.8662 26.5254C19.8662 26.0281 19.6687 25.5512 19.317 25.1996C18.9654 24.8479 18.4885 24.6504 17.9912 24.6504C17.4939 24.6504 17.017 24.8479 16.6654 25.1996C16.3138 25.5512 16.1162 26.0281 16.1162 26.5254Z" fill="white"/>
</svg>
`;

const q_template_for_all_files = `
<div style="width: 100%; justify-content: center; display: flex;">
<div id="loader" class="loader"></div>
</div>
<div id="file_upload_list" style="display:none">
	{f_upld_lst}
</div>`
;
const q_template_for_one_file =
`
<div class="p-2 mb-2">
	<span class="form-label">{lb}</span>
	<button style="float:right;display:none" id="cancel_btn_{id}" type="button" class="btn btn-sm btn-primary">&#215; Cancel</button>
</div>
<div id="file_area_{id}" class="upload-drag-area p-2 mb-4 rounded-3 text-center" @dragover="fileDragover" @drop="fileDrop">
	<input type="file" id="fileInput_{id}" name="upfile" class="d-none">
	<img src="../img/ico-upload-file.svg">
	<div id="upload_button_{id}" class="fs-7 fw-bold text-body text-opacity-50">
		<a href="#" class="text-primary text-decoration-none">Browse</a>, or Drag& Drop your file here
	</div>
</div>
<div id=progress_div_{id} style="display:none">
  <div class="upload-drag-area p-4 mb-4 rounded-3 text-center d-flex align-items-center justify-content-between">
    <img src="../img/ico-file-pdf.svg">
	<div class="flex-grow-1 mx-3">
		<div class="d-flex justify-content-between fs-7 fw-bold mb-1">
			<b id="fileName_{id}" class="text-body text-opacity-50"></b>
			<span id=progress_num_{id} class="text-body text-opacity-25">100%</span>
		</div>
		<div class="progress" style="height: 6px;">
		<div id=progress_bar_{id} class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
		</div>
	</div>
	<div id="progress_result_icon_{id}">
	</div>
  </div>

</div>
`
;

class FileUpload extends UserQuestionBase {

	#applicationId;
	#resultMap;

    constructor(qInfo, applicationId) {
		super(qInfo);

		// label 上传什么文件的提示
		this.#applicationId = applicationId;
		this.#resultMap = new Map();

		this.init();

    }

	async init() {

		const token = credMan.credential.token;
		const key = this.#applicationId.toString();
		const ret = await Net.getUploadedFiles(token, key, key, key);

		let uploaded = new Set();
		for(let o of ret.data) {
			uploaded.add(o.file.split('.')[0].replaceAll('_', ' '));
		}
		const labels = this.label.split('*');
		for(let i = 0; i < labels.length; i++) {
			if (uploaded.has(labels[i])) {
				this.refreshProgress(i, 100, true, '');
			}
		}
		$('#file_upload_list').show();
		$('#loader').hide();
	}


	// Method for validating the result value upon moving away
	// from the page.
	onValidating() {
		const labels = this.label.split('*');
		let i = 0;
		for(; i < labels.length; i++) {
			if (!this.#resultMap.get(i)) {
				alert(`${labels[i]} not uploaded.`);
				return false;
			}
		}
		return true;
	}

	getFileInputSelector(indx) {
		return `#fileInput_${this.getIdPostfix(indx)}`;
	}

	getUploadButtonSelector(indx) {
		return `#upload_button_${this.getIdPostfix(indx)}`;
	}

	getFileAreaSelector(indx) {
		return `#file_area_${this.getIdPostfix(indx)}`;
	}

	getProgressDivSelector(indx) {
		return `#progress_div_${this.getIdPostfix(indx)}`;
	}

	getProgressNumSelector(indx) {
		return `#progress_num_${this.getIdPostfix(indx)}`;
	}

	getProgressBarSelector(indx) {
		return `#progress_bar_${this.getIdPostfix(indx)}`;
	}

	getProgressResultIconSelector(indx) {
		return `#progress_result_icon_${this.getIdPostfix(indx)}`;
	}

	getCancelBtnSelector(indx) {
		return `#cancel_btn_${this.getIdPostfix(indx)}`;
	}

	getIdPostfix(indx) {
		return `${this.qInfo.attr_id}_file${indx}`;
	}

	/*
		Generate anornymous event handlers for all the file buttons
		within the file button array for our applicaion. Each callback
		is a closure with all the information for showing progress and result.

		parameters:
			fileInput 	- the file input control
			indx		- id of the file input within the array
	*/
	createFileInputCallback(fileInput, fileDesignatedName, indx) {
		const self = this;
		const uploader = fileInput[0];
		return async () => {
			const refresh = (p, r, m) => self.refreshProgress(indx, p, r, m);
			self.#resultMap.set(indx, false);
			return await FileUploadUtil.handleUploadFile(uploader, fileDesignatedName, refresh, self.#applicationId);
		}
	}

	// Method for hooking up event handler to handle RADIO
	// selectioon change event
	onChangeEvent() {
		// create callback hanldes for all file input controls we have
		// for this file list control
		const labels = this.label.split('*');
		for(let indx = 0; indx < labels.length; indx++) {
			const fileInputSelector = this.getFileInputSelector(indx);
			const uploadButtonSelector = this.getUploadButtonSelector(indx);

			$(uploadButtonSelector).click(e => {
				$(fileInputSelector).click();
			});

			// hook up the main event handler for uploadng the a file when file button is clicked
			const fn = this.normalizeFileName(labels[indx]) + ".pdf";
			$(fileInputSelector).change(this.createFileInputCallback($(fileInputSelector), fn, indx));
		}
	}

	refreshProgress(indx, progress, result, resultMsg) {
		const progressDiv = this.getProgressDivSelector(indx);
		const progressNum = this.getProgressNumSelector(indx);
		const progressBar = this.getProgressBarSelector(indx);
		const resultIcon = this.getProgressResultIconSelector(indx);
		const fileInputAreaDiv = this.getFileAreaSelector(indx);
		const cancelBtn = this.getCancelBtnSelector(indx);

		$(progressNum).html(progress+'%');
		$(progressBar).css("width", progress+"%");

		if (result==true) {
			if (progress==100) {
				$(resultIcon).html(q_resultIconSuccess);
				this.#resultMap.set(indx, true);
				$(cancelBtn).off('click');
				$(cancelBtn).click(e => {
					$(progressDiv).hide();
					$(cancelBtn).hide();
					$(fileInputAreaDiv).show();
				});
				$(cancelBtn).show();
			} else {
				$(resultIcon).html('');
			}
		} else {
			$(resultIcon).html(q_resultIconFailed);
			$(progressNum).html(resultMsg);
		}
		$(progressDiv).show();
		$(fileInputAreaDiv).hide();
	}

	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
	}

	// This method is called after the UI is rendered to display its
	// input value (or selection fo check box and radio button and dropdown)
	setDisplayValue() {
	};

	// get display html for the entire enum group in form of radio buttons
	get displayHtml() {

		let uploadOne = '';

		const labels = this.label.split('*');
		for(let i = 0; i < labels.length; i++) {
			const id = this.getIdPostfix(i);
			uploadOne += q_template_for_one_file
							.replace(new RegExp(replacementForId, 'g'), id)
							.replace(replacementForLabel, labels[i]);
		};
		const htmlStr = q_template_for_all_files
							.replace(new RegExp(replacementForId, 'g') ,this.id)
							.replace(replacementForFileList, uploadOne);
		return htmlStr;
	}

	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';

		if (this.onValidating()) {
			const labels = this.label.split('*');
			let i = 0;
			for(; i < labels.length; i++) {
				ret += `<e>
					<a1>${labels[i]}</a1>
					<a2>${i}</a2>
				</e>`;
			}
			ret =
				`<qa>
				<id>${this.id}</id>
				<list>${ret}</list>
				</qa>`;
		}
		return ret;
	}

	/*
		Remove spaces within the file name and replace it with _
	*/
	normalizeFileName(fn) {
		return fn.replace(new RegExp(' ', 'g'), '_');
	}

}

export { FileUpload };
