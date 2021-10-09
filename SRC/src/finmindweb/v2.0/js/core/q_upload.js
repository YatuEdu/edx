import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';
import {MetaDataManager} from './metaDataManager.js';
import {credMan} from '../core/credManFinMind.js';
import {Net} from '../core/net.js';
import {sysConstants} from '../core/sysConst.js';

const replacementForId = '{id}';

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

const q_template_text = `
<h6 id="label{id}" class="mb-3"></h6>
<div id="fileArea" class="upload-drag-area p-4 mb-4 rounded-3 text-center" @dragover="fileDragover" @drop="fileDrop">
	<input type="file" id="fileInput{id}" name="upfile" class="d-none">
	<img src="images/ico-upload-file.svg">
	<div id="uploadButton{id}" class="fs-7 fw-bold text-body text-opacity-50">
		<a href="#" class="text-primary text-decoration-none">Browse</a>, or Drag& Drop your file here
	</div>
</div>
<div id=progress{id}>
	<div class="upload-drag-area p-4 mb-4 rounded-3 text-center d-flex align-items-center justify-content-between">
	<img src="images/ico-file-pdf.svg">
	<div class="flex-grow-1 mx-3">
		<div class="d-flex justify-content-between fs-7 fw-bold mb-1">
			<b id="fileName{id}" class="text-body text-opacity-50"></b>
			<span id=progressNum{id} class="text-body text-opacity-25">100%</span>
		</div>
		<div class="progress" style="height: 6px;">
		<div id=progressBar{id} class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
		</div>
	</div>
	<div id="resultIcon{id}">
	</div>
</div>
</div>
`;

class FileUpload extends UserQuestionBase {  
	#credMan;
	_id;
	_label;
	_applicationKey;
	_pipelineKey;
	_conversationKey;
	
    constructor(credMan, label, applicationKey, pipelineKey, conversationKey) {
		super({});
		this.#credMan = credMan;
		// label 上传什么文件的提示
		this._label = label;
		this._applicationKey = applicationKey;
		this._pipelineKey = pipelineKey;
		this._conversationKey = conversationKey;
		this._id = Math.floor(Math.random() * 1000000);

    } 
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		if (this._value) {
			return true;
		}
		return false;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const self = this;
		const fileLabel = `#label${this._id}`;
		$(fileLabel).text(this._label);
		const fileName = `#fileName${this._id}`;
		$(fileName).html(this._label);
		const fileInput = `#fileInput${this._id}`;
		const uploadButton = `#uploadButton${this._id}`;
		const fileArea = `#fileArea`;
		let box = $(fileArea)[0];
		const progress = `#progress${this._id}`;
		$(progress).hide();

		$(uploadButton).click(e => {
			$(fileInput).click();
		});

		$(fileInput).change(() => {
			self.handleUploadFile($(fileInput)[0]);
		});

		$(function() { 
			//阻止浏览器默认行。 
			$(document).on({ 
				dragleave:function(e){ //拖离 
					e.preventDefault(); 
				}, 
				drop:function(e){  //拖后放 
					e.preventDefault(); 
				}, 
				dragenter:function(e){ //拖进 
					e.preventDefault(); 
				}, 
				dragover:function(e){ //拖来拖去 
					e.preventDefault(); 
				} 
			}); 
		}); 
		
		box.addEventListener("drop",function(e) {
			e.preventDefault();
			e.stopPropagation();
			let fileList = e.dataTransfer.files; //获取文件对象
			if (fileList.length != 1) {
				return false;
			}
			$(fileInput)[0].files=fileList;
			self.handleUploadFile($(fileInput)[0]);
		}, false);
	}

	async handleUploadFile(fileInput) {
		if (fileInput.value == "") {
			return;
		}
		let file = fileInput.files[0];
		if (file.size <= 0 || file.size > (40 * 1024 * 1024)) {
			this.refreshProgress(0, false, 'File size not meet the requirements');
		} else {
			this.refreshProgress(0, true, '');
			let ret = await this.sendFileNameToServerBeforeUpload(file.name);
			if (ret.code==null || ret.code==0) {
				let resUrl = ret.data.url;
				if (window.FileReader) {
					var fReader = new FileReader();
					var xhreq = this.createHttpRequest();
					let self = this;
					xhreq.onreadystatechange = function () {
						if (xhreq.readyState == 4) {
							if (xhreq.status == 200) {
								self.refreshProgress(100, true, '');
							} else {
								var responseData = xhreq.responseText;
								this.refreshProgress(0, false, responseData);
								$(fileInput).val("");
							}
						}
					}
					fReader.onload = function (e) {
						//xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
						console.log("try send to url:\n" + resUrl);
						xhreq.open("PUT", resUrl, true);

						//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
						xhreq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
					//	xhreq.setRequestHeader("Content-Length", file.size);     //文件大小
						xhreq.setRequestHeader("uploadfile_name", encodeURI(file.name)); //兼容中文
						xhreq.send(fReader.result);
					}
					fReader.onprogress = function (e) {
						//	uploadProgress.value = e.loaded*100/e.total;
						console.log("progress: " + e.loaded*100/e.total);
						self.refreshProgress(Math.round(e.loaded*100/e.total), true, '');
					}
					fReader.readAsArrayBuffer(file);
				}
			} else {
				this.refreshProgress(0, false, ret.err);
				$(fileInput).val("");
			}
		}


	}

	refreshProgress(progress, result, resultMsg) {
		const progressDiv = `#progress${this._id}`;
		const progressNum = `#progressNum${this._id}`;
		const progressBar = `#progressBar${this._id}`;
		$(progressNum).html(progress+'%');
		$(progressBar).css("width", progress+"%");
		const resultIcon = `#resultIcon${this._id}`;
		if (result==true) {
			if (progress==100) {
				$(resultIcon).html(q_resultIconSuccess);
			} else {
				$(resultIcon).html('');
			}
		} else {
			$(resultIcon).html(q_resultIconFailed);
			$(progressNum).html(resultMsg);
		}
		$(progressDiv).show();
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
		let htmlStr = q_template_text.replace(new RegExp(replacementForId, 'g') ,this._id);
		return htmlStr;
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		return ret;
	}

	/**
	 * 1 upload, 2 list, 3 download, 4 delete
	 */
	async sendFileNameToServerBeforeUpload(uploadFileName) {
		const requestData = {
			header: {
				token: this.#credMan.credential.token,
				api_id: 2021818
			},
			data: {
				pipelineKey: this._pipelineKey,
				applicationKey: this._applicationKey,
				conversationKey: this._conversationKey,
				fileName: uploadFileName,
				operationType: 1
			}
		};
		const requestBody =  {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
		const res = await Net.remoteCall(sysConstants.FINMIND_PORT, requestBody);
		return res;
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

export { FileUpload };