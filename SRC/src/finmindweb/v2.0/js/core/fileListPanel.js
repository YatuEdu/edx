import {credMan} 		from './credManFinMind.js';
import {Net} 			from './net.js'
import {ArrayUtil}		from './util.js'

const template_for_file_element = `
<li id="{id}" class="list-group-item justify-content-between align-items-center d-flex px-1">
  <div class="d-flex align-items-start">
	<img src="img/ico-file-zip.svg" >
	<div class="ms-3 me-2">
		<h6 class="fs-7 mb-0">{fn}</h6>
		<span class="fs-8">3 min ago</span>
	</div>
  </div>
  <div class="position-relative">
	<b class="fs-8 border p-1 rounded fw-bold px-2">
		1.46MB
	</b>
	<aside class="position-absolute end-0 top-50 translate-middle-y">
		<a id="{id}_delete"  class="btn-file-delete" title="Delete"></a>
		<a id="{id}_download"  class="btn-file-download ms-2" title="Download"></a>
	</aside>
  </div>
</li>
`
;

const replacementForFileName = '{fn}';
const replacementForId = '{id}';


class UploadedFileListPanel { 
 
	#applicationId;
	#fileList;
	
	constructor(appId) { 
		this.#applicationId = appId;
	}
	
	elmentId(indx) {
		return `uploaded_file${indx}`;
	}
	
	deleteSelector(indx) {
		return `#${this.elmentId(indx)}_delete`;
	}
	
	downloadSelector(indx) {
		return `#${this.elmentId(indx)}_download`;
	}
	
	/*
		Obtain the html representation for a list of messages
	*/
	displayHtml(list) {
		let html = '';
		for (let i = 0; i < list.length; i++) {
			const f = list[i];
			
			html += template_for_file_element
					   .replace(replacementForFileName, f)
					   .replace(new RegExp(replacementForId, 'g'), this.elmentId(i));
		}
		
		// hook up event handler
		
		return html;
	}
	
	/**
		handle delete button to delete the file from server and then
		remove the file icon from UI
	**/
	createDeleteHandler(parentId, fileInfo) {
		const key = this.#applicationId.toString();
		const elelement = `#${parentId}`;
		const token = credMan.credential.token;
		return async (e) => 
		{
			e.preventDefault();
			const res = await Net.deleteUploadedFiles(token, 
												      fileInfo, 
													  key, key, key);
			// if succeeded
			if (res) {
				$(elelement).remove();
			}
		}
	}
	
	/**
		handle down-load file button to download the file from server.
	**/
	createDownloadHandler(fileInfo) {
		const key = this.#applicationId.toString();
		const token = credMan.credential.token;		
		return async (e) => 
		{
			e.preventDefault();
			const res = await Net.downloadUploadedFiles(token, 
												        fileInfo, 
													    key, key, key);
			// if succeeded
			if (!res.err) {
				const strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
				const URL = res.data.url
				window.open(URL, "_blank", strWindowFeatures);
			}
		}
	}
	
	/*
		Obtain the html representation for a list of messages
	*/
	changeEvent() {
		for (let i = 0; i < this.#fileList.length; i++) {
			const fileInfo = this.#fileList[i];
			const delSelector = this.deleteSelector(i);
			const dwnldSelector = this.downloadSelector(i);
			
			$(delSelector).click(this.createDeleteHandler(this.elmentId(i), fileInfo));
			$(dwnldSelector).click(this.createDownloadHandler(fileInfo));
		}
	}
	
	async getUploadedFiles() {
		const token = credMan.credential.token;
		const key = this.#applicationId.toString();
		const ret = await Net.getUploadedFiles(token, key, key, key);
		this.#fileList = [];
		if (!ArrayUtil.isEmpty(ret.data)) {
			this.#fileList = ret.data;
			return this.displayHtml(ret.data);
		}
		
		return '';
	}
}

export { UploadedFileListPanel };