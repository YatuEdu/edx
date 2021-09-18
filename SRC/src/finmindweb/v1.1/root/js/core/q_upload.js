import {UserQuestionBase} from './q_base.js';
import {StringUtil} from './util.js';
import {MetaDataManager} from './metaDataManager.js';
import {credMan} from '../core/credManFinMind.js';
import {Net} from '../core/net.js';
import {sysConstants} from '../core/sysConst.js';

const replacementForId = '{id}';

const q_template_text = `
 <div>
	 <a id="label{id}"></a>
	 <input type="file" id="fileInput{id}"/>
	 <button id="fileUpload{id}" type="button">Attach
	</button>
	<span id="fileTips{id}"/>
</div>`;

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
		const fileUpload = `#fileUpload${this._id}`;
		const fileInput = `#fileInput${this._id}`;
		const fileTips = `#fileTips${this._id}`;
		$(fileUpload).click(e => this.handleUploadFile(e, $(fileInput)[0], $(fileTips)));
	}

	async handleUploadFile(e, fileInput, tips) {
		e.preventDefault();
		if (fileInput.value == "") {
			tips.text("Please select a file");
		} else {
			let file = fileInput.files[0];
			if (file.size <= 0 || file.size > (40 * 1024 * 1024)) {
				tips.text("Not meet the requirements");
			} else {
				let ret = await this.sendFileNameToServerBeforeUpload(file.name);
				if (ret.code==null || ret.code==0) {
					let resUrl = ret.data.url;
					if (window.FileReader) {
						var fReader = new FileReader();
						var xhreq = this.createHttpRequest();
						xhreq.onreadystatechange = function () {
							if (xhreq.readyState == 4) {
								if (xhreq.status == 200) {
									tips.text("File upload successfully");
									alert("File upload successfully");
								} else {
									tips.text("File upload failed");
									var responseData = xhreq.responseText;
									alert("File upload failed" + responseData);
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
						}
						fReader.readAsArrayBuffer(file);
					}
				} else {
					tips.text("File upload failed" + ret.msg);
					alert("File upload failed"+ret.msg);
				}
			}
		}

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