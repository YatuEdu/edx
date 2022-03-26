import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';

/**
	This class manages both login and sigup workflow
**/
class Attachment {
	credMan;
	applicationId = "1021";
	pipeline = "101";

    constructor(credMan) {
		this.credMan = credMan;
		this.init();
	}
	
	// hook up events
	async init() {
		// when button is clicked
		$('#void_check_btn').click(e => this.handleUploadFile(e, $('#void_check_file')[0], $('#void_check_file_tips')));
		$('#driver_license_btn').click(e => this.handleUploadFile(e, $('#driver_license_file')[0], $('#driver_license_file_tips')));
		$('#green_card_btn').click(e => this.handleUploadFile(e, $('#green_card_file')[0], $('#green_card_file_tips')));

	}

	async handleUploadFile(e, fileInput, tips) {
		e.preventDefault();
		if (fileInput.value == "") {
			tips.innerText = "请选择一个文件";
		} else {
			let file = fileInput.files[0];
			if (file.size <= 0 || file.size > (40 * 1024 * 1024)) {
				tips.innerText = "文件不符合要求";
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
									tips.innerText = "文件上传成功";
									alert("文件上传成功");
								} else {
									tips.innerText = "文件上传失败了";
									var responseData = xhreq.responseText;
									alert("文件上传失败：" + responseData);
								}
							}
						}
						fReader.onload = function (e) {
							//xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
							console.log("try send to url:\n" + resUrl);
							xhreq.open("PUT", resUrl, true);

							//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
							xhreq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
							xhreq.setRequestHeader("Content-Length", file.size);     //文件大小
							xhreq.setRequestHeader("uploadfile_name", encodeURI(file.name)); //兼容中文
							xhreq.send(fReader.result);
						}
						fReader.onprogress = function (e) {
							//	uploadProgress.value = e.loaded*100/e.total;
						}
						fReader.readAsArrayBuffer(file);
					}
				} else {
					tips.innerText = "文件上传失败" + ret.msg;
					alert("文件上传失败"+ret.msg);
				}
			}
		}

	}

	/**
	 * 1 upload, 2 list, 3 download, 4 delete
	 */
	async sendFileNameToServerBeforeUpload(uploadFileName) {
		const requestData = {
			header: {
				token: this.credMan.credential.token,
				api_id: 2021818
			},
			data: {
				pipelineKey: this.pipeline,
				applicationKey: this.applicationId,
				conversationKey: "",
				fileName: uploadFileName,
				operationType: 1,
				userOpSelfFile: 0,
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

	async listFiles() {
		const requestData = {
			header: {
				token: this.credMan.credential.token,
				api_id: 2021818
			},
			data: {
				pipelineKey: this.pipeline,
				applicationKey: this.applicationId,
				conversationKey: "",
				fileName: "",
				operationType: 2,
				userOpSelfFile: 0,
			}
		};
		const requestBody =  {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
		const res = await Net.remoteCall(sysConstants.FINMIND_PORT, requestBody);
		if (res.error) {
			return {error: res.error};
		}
		else {
			for (var i in res.data) {
				console.log(res.data[i]);
				var fileListDiv = document.getElementById('fileList');
				var input = document.createElement("input");
				input.setAttribute('type', 'text');
				input.setAttribute('width', '400px');
				input.setAttribute('class', 'file_list_item');
				input.setAttribute('ReadOnly', 'True');  //设置文本为只读类型
				input.value = res.data[i];
				fileListDiv.appendChild(input);
				//换行
				var br = document.createElement("br");
				fileListDiv.appendChild(br);

			}
		}
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

let attachment = null;

$( document ).ready(function() {
	attachment = new Attachment(credMan);
	attachment.listFiles();
});