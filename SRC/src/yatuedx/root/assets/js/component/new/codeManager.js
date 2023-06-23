import {ComponentBase}		from '../ComponentBase.js';
import {StringUtil}			from '../../core/util.js';

//const CODE_LIST_TABLE_TEMPLATE = '

const MY_CODE_LIST_TEMPLATE = `
<div class="row mb-0 yt-list-element" id={codelstDivId}>
  <div class="col-5 tool-tbtn-dimention-left">
	<button id="{codeLinkId}" class="textButton bigTextButton" data-tabindex="{tb}">{lb}</button>
  </div>
  <div class="col-5 tool-tbtn-dimention">
	<button class="textButton smallTextButton rpl-code" id="{codeRplId}" title="Replace the code in the code console with this code">Rpl</button>
	<button class="textButton smallTextButton ins-code" id="{codeInsId}" title="Insert the code at the beginning of the code console">Ins</button>
	<button class="textButton smallTextButton upd-code" id="{codeUpdId}" title="Update the code in the code depot">Upd</button>
	<button class="textButton smallTextButton del-code" id="{codeDelId}" title="Delete the code">Del</button>
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
 <div id="yt_col_code_text" class="col-6 tool-tbtn-dimention-left">
  <div class="ta-container ta-container-zorder-lower-left">
	<button title="Make it large" class="ta-btn-minmax ta-btn-minmax-zorder-lower-left">+</button>							
	<textarea class="msg-board"
		  id="yt_ta_selected_code" 
		  spellcheck="false" 
		  placeholder="Load code from DB"
		  rows="40"></textarea>
  </div>
 </div>
 <div id="yt_col_code_list" class="col-6 tool-tbtn-dimention yt-list-panel-right">
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
const REPLACEMENT_CODE_RPL = '{codeRplId}';
const REPLACEMENT_CODE_INS = '{codeInsId}';
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
	
	addCodeEntry(codeName, codeHash, codeText) {
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
		$(this.getCodeReplaceSelector(codeName)).click(this.handleReplaceCode.bind(this));
		$(this.getCodeInsertSelector(codeName)).click(this.handleInsertCode.bind(this));
		$(this.getCodeDeleteSelector(codeName)).click(this.handleDeleteCode.bind(this));
		$(this.getCodeUpdateSelector(codeName)).click(this.handleUpdateCode.bind(this));
	}
	
	// when clicked, replace the code board console the the selected code
	handleReplaceCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			const codeEntry = this.prv_getCodeEntryForFAromCodeMan(codeName);
			if (codeEntry) {
				// update board text with the selected code
				$(this.codeInputBoardSelector).val(codeEntry.text);
				$(this.codeInputBoardSelector).trigger('change');
			}		
		}
	}
	
	// get the code clicked and insert into code input console
	handleInsertCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			const codeEntry = this.prv_getCodeEntryForFAromCodeMan(codeName);
			if (codeEntry) {
				// insert to code console
				let existingCodeStr = $(this.codeInputBoardSelector).val();
				existingCodeStr = codeEntry.text + '\n' + existingCodeStr;
				// update UI
				$(this.codeInputBoardSelector).val(existingCodeStr);
			}
		}
	}
	
	async handleDeleteCode(e) {
		const deleteCode = confirm('Are you sure you want to delete the code permanantly from code depot?');
		if (!deleteCode) {
			return
		}

		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			// delete code from depot and DB
			await this.#deleteCodeFromDbMethod(codeName);

			// delete code entry from UI
			$(this.getCodeListLinkSelector(codeName)).remove();
		}
	}
	
	async handleUpdateCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			const uiText = $(this.codeConsoleTaSelector).val();
			const depotText = (this.#codeMan.getCodeEntry(codeName)).text;
			if (uiText != depotText) {
				// update depot DB
				const resp = await this.#updateCodeToDbMethod(codeName, uiText);
				if (resp.err) {
					alert("Error encountered during updating code to DB. Error code:" +  resp.err);
				} else {
					// updater manager
					this.#codeMan.updateCodeEntry(codeName, uiText, StringUtil.getMessageDigest(uiText));
					alert(`Code "${codeName}" successfully updated!`);
				}
			}
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
								.replace(REPLACEMENT_CODE_RPL, this.getCodeReplaceId(codeName))
								.replace(REPLACEMENT_CODE_INS, this.getCodeInsertId(codeName))
								.replace(REPLACEMENT_CODE_DEL, this.getCodeDeleteId(codeName))
								.replace(REPLACEMENT_CODE_UPD, this.getCodeUpdateId(codeName))
								.replace(REPLACE_CODELIST_TAB, 0);
	}
	
	// get code if the code link is clicked
	async handleGetCodeFor(e) {
		const name = StringUtil.getIdStrFromBtnId(e.target.id);
		const codeText = await this.prv_getCodeFor(name);
		
		if (this.#selectedCodeName != name) {
			this.prv_toggleSelection(this.#selectedCodeName, name);
			$(this.codeConsoleTaSelector).val(codeText);
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
	
	// code text console selectot
	get codeConsoleTaSelector() {
		return `#yt_ta_selected_code`;
	}
	
	// id for inserting code
	getCodeInsertId(name) {
		return `yt_btn_code_insert_${name}`;
	}
	
	// code insert button selector
	getCodeInsertSelector(name) {
		return `#${this.getCodeInsertId(name)}`;
	}
	
	// id for replacing code
	getCodeReplaceId(name) {
		return `yt_btn_code_replace_${name}`;
	}
	
	// code replace button selector
	getCodeReplaceSelector(name) {
		return `#${this.getCodeReplaceId(name)}`;
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


