import {ComponentBase}		from '../ComponentBase.js';
import {StringUtil}			from '../../core/util.js';

//const CODE_LIST_TABLE_TEMPLATE = '

const MY_CODE_LIST_TEMPLATE = `
<div class="row mb-0 yt-list-element" id={codelstDivId}>
  <div class="col-6 tool-tbtn-dimention-left">
	<button id="{codeLinkId}" class="textButton bigTextButton" data-tabindex="{tb}">{lb}</button>
  </div>
  <div class="col-6 tool-tbtn-dimention">
	<button class="textButton mediumTextButton upd-code" id="{codeUpdId}" title="Copy the code from the code practice console and update the selected code entry in code depot">Update</button>
	<button class="textButton mediumTextButton del-code" id="{codeDelId}" title="Delete the code">Delete</button>
  </div>
</div>
`;

/*
const TEMPLETE_2 = '
	<table id='yt_div_code_man'>
	</table>
';
*/

const TEMPLETE = 
`<div id='yt_div_code_man' class="row mb-0">
 <div id="yt_col_code_list" class="col-12  yt-list-panel-right">
	{codeListHolder}
 </div>
</div>
`;

const MY_CSS = "codeManager.css";
const CSS_SELECTED_CODE_ENTRY = "textButton-seledcted";

const REPLACE_CODELIST_TAB = '{tb}';
const REPLACE_CODELIST_LABEL = '{lb}';
const REPLACE_CODELIST_DIV_ID = '{codelstDivId}';
const REPLACE_CODE_LIST_LINK_ID = '{codeLinkId}';
const REPLACEMENT_CODE_LIST = '{codeListHolder}';
const REPLACEMENT_CODE_DEL = '{codeDelId}';
const REPLACEMENT_CODE_UPD = '{codeUpdId}';

const CODE_LIST_DIV_PREFIX = 'yt_code_list_entry_';
const CODE_LIST_LINK_PREFIX = 'yt_code_list_link_';

/**
	This class handles code management functions inside student or teacher pages
**/
class CodeEntry {
	#name;
	#sequenceId;
	#text;
	#hash;
	
	constructor(name, seqId, hash, text) {
		this.#name = name;
		this.#sequenceId = seqId;
		this.#hash = hash;
		this.#text =  text;
	}
	
	get name() {
		return this.#name;
	}
	
	get sequenceId() {
		return this.#sequenceId;
	}

	get text() {
		return this.#text;
	}
	
	set text(t) {
		this.#text = t;
	}
	
	get hash() {
		return this.#hash;
	}
	
	set hash(h) {
		this.#hash = h;
	}
}

/**
	This class handles code management functions inside student or teacher pages
**/
class CodeMan {
	#codeMapByName;
	#user;
	#group;
	
	// construct code manager using code list acquired from DB
	constructor(codeDataList, userName, group) {
		// load existing code 
		this.#codeMapByName = new Map();
		codeDataList.forEach(e => {
			const ce = new CodeEntry(e.name, e.hash, e.text);
			this.#codeMapByName.set(e.name, ce);
		});
	}

	
	// add new code or updating existing code hash or text
	addCodeEntry(codeEntry) {
		let isNew = false;
		const existing = this.getCodeEntry(codeEntry.name);
		if (existing) {
			// update the hash if changed
			existing.hash = codeEntry.hash;
			existing.text = codeEntry.text;
		} else {
			isNew = true;
			this.#codeMapByName.set(codeEntry.name, codeEntry);
		}
		return isNew;
	}
	
	// find code by name
	getCodeEntry(name) {
		return this.#codeMapByName.get(name);
	}
	
	// UPDATE code entry text/hash
	updateCodeEntry(name, txt, hsh) {
		const entry = this.#codeMapByName.get(name);
		if (entry) {
			entry.text = txt;
			entry.hash = hsh;
		}
	}

	// delete code entry
	deleteCodeEntry(name) {
		const entry = this.#codeMapByName.get(name);
		if (entry) {
			this.#codeMapByName.delete(name);
		}
	}
}

/**
	This class handles code management functions inside student or teacher pages
**/
class CodeManContainer extends ComponentBase {
	#codeMan;
	#getCodeFromDbMethod;
	#updateCodeToDbMethod;
	#deleteCodeFromDbMethod;		
	;
	#selectedCodeName;
	#codeInoputBoardId;
	
	constructor(id, 
				name, 
				parentId, 
				codeInoputBoardId,
				codeDataList, 
				getCodeFromDbMethod,
				updateCodeToDbMethod,	
				deleteCodeFromDbMethod,			
				userName, group) {
		super(id, name, parentId, "", MY_CSS);
		this.#codeInoputBoardId = codeInoputBoardId;
		this.#codeMan = new CodeMan(codeDataList, userName, group);
		const codeListHtml = this.prv_buildCodeListHtml(codeDataList);
		const componentHtml = TEMPLETE
						.replace(REPLACEMENT_CODE_LIST, codeListHtml);
						
		
		// mount the component to UI
		this.mount(componentHtml);
		
		// add event handler for all the list entry
		codeDataList.forEach(codeHeader => $(this.eventHandlerForNewCode(codeHeader.name)));
					
		// call this function to get code by name
		this.#getCodeFromDbMethod = getCodeFromDbMethod;
		
		// call this function to update code by name
		this.#updateCodeToDbMethod = updateCodeToDbMethod;

		// call this function to delete code by name
		this.#deleteCodeFromDbMethod = deleteCodeFromDbMethod;
	}
	
	
	/*
		public methods
	*/
	
	addCodeEntry(codeName, codeText) {
		const codeHash = StringUtil.getMessageDigest(codeText);
		const codeEntry = new CodeEntry(codeName, codeHash, codeText);
		if (this.#codeMan.addCodeEntry(codeEntry)) {
			// added a new code entry to the list
			const newEntryHtml = this.prv_generateNewEntryHtml(codeName);
			
			// append it to the end of the list
			$(this.codeListSelector).append(newEntryHtml);
			
			// hook up click event handler
			this.eventHandlerForNewCode(codeName);
		}
	}
	
	// hook up click event handler for new code entry
	eventHandlerForNewCode(codeName) {	
		// click to select the code
		$(this.getCodeListLinkSelector(codeName)).click(this.handleGetCodeFor.bind(this));
		
		// handle insert code to code console by name
		// code insert button selector
		$(this.getCodeDeleteSelector(codeName)).click(this.handleDeleteCode.bind(this));
		$(this.getCodeUpdateSelector(codeName)).click(this.handleUpdateCode.bind(this));
	}
	
	
	async handleUpdateCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			const uiText = $(this.codeInputBoardSelector).val();
			const depotText = (this.#codeMan.getCodeEntry(codeName)).text;
			if (uiText !== depotText) {
				const updateCode = confirm(`Are you sure you want to replace "${codeName}" in code depot with code from input consle?`);
				if (!updateCode) {
					return
				}
				// update depot DB
				const resp = await this.#updateCodeToDbMethod(codeName, uiText);
				if (resp.code) {
					alert("Error encountered during updating code to DB. Error code:" +  resp.code);
				} else {
					// updater manager
					this.#codeMan.updateCodeEntry(codeName, uiText, StringUtil.getMessageDigest(uiText));
					alert(`Code "${codeName}" successfully updated!`);
				}
			} else {
				alert(`Code "${codeName}" has not been changed.`);
			}
		}
	}

	async handleDeleteCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		const deleteCode = confirm(`Are you sure you want to delete "${codeName}" code block permanantly from your code depot?`);
		if (!deleteCode) {
			return
		}

		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			// delete code from depot and DB
			const result = await this.#deleteCodeFromDbMethod(codeName);
			if (result === 0) {
				alert(`Code block with name "${codeName}" has been deleted!`)
			} else {
				alert(`Deleting code block "${codeName}" has failed!`)
			}

			// delete code entry from UI
			$(this.getCodeListLinkSelector(codeName)).empty();
			$(this.getCodeListLinkSelector(codeName)).remove();
		}
	}
	
	prv_getCodeNameFromEvent(e) {
		const id = $(e.target).attr("id");
		return StringUtil.getIdStrFromBtnId(id);
	}
	
	/*
		private methods
	*/
			
	prv_buildCodeListHtml(codeDataList) {
		if (codeDataList.length == 0 ) {
			return 'No code in your code depot';
		}
		let htmlResult = '';
		for(let i =0; i < codeDataList.length; i++) {
			const codeHeader = codeDataList[i];
			htmlResult += this.prv_generateNewEntryHtml(codeHeader.name);
		}		
		
		return htmlResult;
	}
	
	prv_generateNewEntryHtml(codeName) {
		return MY_CODE_LIST_TEMPLATE
								.replace(REPLACE_CODELIST_DIV_ID, this.getCodeListDivId(codeName))
								.replace(REPLACE_CODELIST_LABEL, codeName)
								.replace(REPLACE_CODE_LIST_LINK_ID, this.getCodeListLinkId(codeName))
								.replace(REPLACEMENT_CODE_DEL, this.getCodeDeleteId(codeName))
								.replace(REPLACEMENT_CODE_UPD, this.getCodeUpdateId(codeName))
								.replace(REPLACE_CODELIST_TAB, 0);
							
	}
	
	// get code if the code link is clicked
	async handleGetCodeFor(e) {
		const name = StringUtil.getIdStrFromBtnId(e.target.id);
		let codeText = await this.prv_getCodeFor(name);
		
		if (this.#selectedCodeName != name) {
			const existingCode = $(this.codeInputBoardSelector).val();
			codeText = existingCode 
						? 
						codeText + `\n\n /* @ Code ${name} inserted before the following line! @ */ \n\n ` + existingCode 
						: 
						codeText;

			this.prv_toggleSelection(this.#selectedCodeName, name);
			$(this.codeInputBoardSelector).val(codeText);
			this.#selectedCodeName = name;
		}
	}
	
	// if we have the code, return it.  Otherwise, ask it from DB
	async prv_getCodeFor(name) {
		let codeEntry = this.prv_getCodeEntryForFAromCodeMan(name);
		if (!codeEntry.text) {
			codeEntry.text  = await this.retireveCode(name);
		}
		
		return codeEntry.text;
	}
	
	async retireveCode(name) {
		return await this.#getCodeFromDbMethod(name);
	}
	
	prv_getCodeEntryForFAromCodeMan(name) {
		const codeEntry = this.#codeMan.getCodeEntry(name);
		if (!codeEntry) {
			throw new Error(`Code [${name}] not found!`);
		}
		
		return codeEntry;
	}
	
	/*
		Keep track of code selection by high-lighting code entry
	 */
	prv_toggleSelection(oldCodeName, newCodeName) {
		// change selection high-lighting
		this.prv_toggleSelectionClass(oldCodeName, false);
		this.prv_toggleSelectionClass(newCodeName, true);
	}
	
	prv_toggleSelectionClass(codeName, selected) {
		if (selected) {
			$(this.getCodeListLinkSelector(codeName)).addClass(CSS_SELECTED_CODE_ENTRY);
		} else {
			$(this.getCodeListLinkSelector(codeName)).removeClass(CSS_SELECTED_CODE_ENTRY);
		}
	}
	
	/*
		accessor methods
	*/
	
	getCodeEntry(codeName) {
		return this.#codeMan.getCodeEntry(codeName);
	}
	
	get currentSelection() {
		return this.#selectedCodeName;
	}
	
	// selector for list div
	get codeListSelector() {
		return `#yt_col_code_list`;
	}
	
	// id for code list div
	getCodeListDivId(name) {
		return `${CODE_LIST_DIV_PREFIX}${name}`;
	}
	
	// selector for each code entry div
	getCodeListLinkSelector(name) {
		return `#${this.getCodeListDivId(name)}`;
	}
	
	// id for each code entry link
	getCodeListLinkId(name) {
		return `${CODE_LIST_LINK_PREFIX}${name}`;
	}
	
	// selector for each code entry
	getCodeListLinkSelector(name) {
		return `#${this.getCodeListLinkId(name)}`;
	}
	
	// id for deleting code
	getCodeDeleteId(name) {
		return `yt_btn_code_del_${name}`;
	}
	
	// selector for button which deletes code
	getCodeDeleteSelector(name) {
		return `#${this.getCodeDeleteId(name)}`;
	}
	
	// id for updating code
	getCodeUpdateId(name) {
		return `yt_btn_code_upd_${name}`;
	}
	
	// selector for button which update code
	getCodeUpdateSelector(name) {
		return `#${this.getCodeUpdateId(name)}`;
	}
	
	// slector for code input board outside of this component
	get codeInputBoardSelector() {
		return `#${this.#codeInoputBoardId}`;
	}
}

export { CodeManContainer };


