import {sysConstants} from './sysConst.js';
import {Net} 		  from './net.js';
import {credMan} 	  from './credManFinMind.js';

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
		}
				
		fReader.onload = function (e) {
			//xhreq.open("PUT","https://fdwebinsst-bkt1.s3.us-west-2.amazonaws.com/themiscellaneous/%E4%B8%ADpdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T060904Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=AKIA3O77ERYBPO3YO7XO%2F20210524%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3bb3238522ae7b4feadc48aaf56e036d719df7b4cc0652abba9573fa5436dc34",true);
			console.log("try send to url:\n" + resUrl);
			xhReq.open("PUT", resUrl, true);

			//xhreq.setRequestHeader("Content-Type", "application/octet-stream"); //流类型 ok
			xhReq.setRequestHeader("Content-Type", "application/pdf"); //pdf类型 ok
		//	xhReq.setRequestHeader("Content-Length", file.size);     //文件大小
			xhReq.setRequestHeader("uploadfile_name", encodeURI(fileDesignatedName)); //兼容中文
			xhReq.send(fReader.result);
		}
		fReader.onprogress = function (e) {
			//	uploadProgress.value = e.loaded*100/e.total;
			console.log("progress: " + e.loaded*100/e.total);
			refreshProgress(Math.round(e.loaded*100/e.total), true, '');
		}
		
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