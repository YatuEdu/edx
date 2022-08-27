import {sysConstants} from './sysConst.js';
import {Net} 		  from './net.js';
import {credMan} 	  from './credManFinMind.js';
import {FileUtil} from "./fileUtil.js";

class FileUploadUtil {

	/**
		Open explorer and upload a stream from a local file
	**/
	static async handleUploadFile(fileInput, fileDesignatedName, refreshProgress, appId) {

		if (!fileInput || fileInput.value == "") {
			return ;
		}

		let file = fileInput.files[0];
		if (file.size <= 0 || file.size > (sysConstants.MAX_FILE_SIZE)) {
			refreshProgress(0, false, 'File size not meet the requirements');
			return ;
		}

		// start uploading
		refreshProgress(0, true, '');
		let ret = await FileUploadUtil.sendFileNameToServerBeforeUpload_priv(fileDesignatedName, appId);
		if (ret.code) {
			// encontered error, exit
			refreshProgress(0, false, ret.err);
			$(fileInput).val("");
			return ;
		}

		// got target url, upload to it
		let resUrl = ret.data.url;
		const fReader = new FileReader();
		const xhReq = FileUploadUtil.createHttpRequest_priv();

		xhReq.onreadystatechange = function () {
			if (xhReq.readyState == 4) {
				if (xhReq.status == 200) {
					refreshProgress(100, true, '');
				} else {
					var responseData = xhReq.responseText;
					refreshProgress(0, false, responseData);
					$(fileInput).val("");
				}
			}
		};

		let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
		let contentType = FileUtil.getContentType(suffix);

		fReader.onload = function (e) {
			console.log("try send to url:\n" + resUrl);
			xhReq.open("PUT", resUrl, true);

			//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
			// xhReq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
			xhReq.setRequestHeader("Content-Type", contentType);
		//	xhReq.setRequestHeader("Content-Length", file.size);     //文件大小
			xhReq.setRequestHeader("uploadfile_name", encodeURI(fileDesignatedName)); //兼容中文
			xhReq.send(fReader.result);
		};
		fReader.onprogress = function (e) {
			//	uploadProgress.value = e.loaded*100/e.total;
			let v = Math.round(e.loaded*100/e.total);
			if (v>=100) v=99;
			console.log("progress: " + v);
			refreshProgress(v, true, '');
		};

		// start reading and pushing to server...
		await fReader.readAsArrayBuffer(file);
	}

	/**
	 * 1 upload, 2 list, 3 download, 4 delete
	 */
	static async sendFileNameToServerBeforeUpload_priv(uploadFileName, appId) {
		const appKey =appId.toString();
		return Net.fileUpload(credMan.credential.token, uploadFileName, appKey, appKey, appKey);
	}

	static createHttpRequest_priv() {
		var xmlHttp = null;
		try {
			// Firefox, Opera 8.0+, Safari
			xmlHttp = new XMLHttpRequest();
		}
		catch (e) {
			// Internet Explorer
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					alert("Sorry, your browser does not support this function！");
				}
			}
		}
		return xmlHttp;
	}
}

export {FileUploadUtil};
