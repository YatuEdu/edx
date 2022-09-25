import {ComponentBase}		from '../ComponentBase.js';
import {StringUtil}			from '../../core/util.js';

const MY_CODE_LIST_TEMPLATE = `
<div class="row mb-0" id={codelstDivId}>
  <div class="col-8">
	<button id="{codeLinkId}" class="textButton bigTextButton" data-tabindex="{tb}">{lb}</button>
  </div>
  <div class="col-4">
	<button class="textButton smallTextButton" id="{codeInsId}" title="Insert the code at the beginning of the code console">Insert</button>
	<button class="textButton smallTextButton" id="{codeDelId}" title="Delete the code">Delete</button>
  </div>
</div>
`;

const TEMPLETE = 
`<div id='yt_div_code_man' class="row mb-0">
	<div id="yt_col_code_list" class="col-4">
	{codeListHolder}
	</div>
	<div id="yt_col_code_text" class="col-8">
		<textarea class="msg-board"
		  id="yt_ta_selected_code" 
		  spellcheck="false" 
		  placeholder="Load code from DB"
		  rows="40"></textarea>
	</div>
</div>
`;

const MY_CSS = "codeManager.css";

const REPLACE_CODELIST_TAB = '{tb}';
const REPLACE_CODELIST_LABEL = '{lb}';
const REPLACE_CODELIST_DIV_ID = '{codelstDivId}';
const REPLACE_CODE_LIST_LINK_ID = '{codeLinkId}';
const REPLACEMENT_CODE_LIST = '{codeListHolder}';
const REPLACEMENT_CODE_INS = '{codeInsId}';
const REPLACEMENT_CODE_DEL = '{codeDelId}';


const CODE_LIST_DIV_PREFIX = 'yt_code_list_entry_';
const CODE_LIST_LINK_PREFIX = 'yt_code_list_link_';

/**
	This class handles code management functions inside student or teacher pages
**/
class CodeEntry {
	#name;
	#text;
	#hash;
	
	constructor(name, hash, text) {
		this.#name = name;
		this.#hash = hash;
		this.#text =  text;
	}
	
	get name() {
		return this.#name;
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
}

/**
	This class handles code management functions inside student or teacher pages
**/
class CodeManContainer extends ComponentBase {
	#CodeMan;
	#getCodeFromDbMethod;
	#selectedCodeName;
	
	constructor(id, name, parentId, codeDataList, getCodeFromDbMethod, userName, group) {
		super(id, name, parentId, "", MY_CSS);
		
		this.#CodeMan = new CodeMan(codeDataList, userName, group);
		const codeListHtml = this.prv_buildCodeListHtml(codeDataList);
		const componentHtml = TEMPLETE
						.replace(REPLACEMENT_CODE_LIST, codeListHtml);
						
		
		// mount the component to UI
		this.mount(componentHtml);
		
		// add event handler for all the list entry
		codeDataList.forEach(codeHeader => $(this.getCodeListLinkSelector(codeHeader.name))
												.click(this.handleGetCodeFor.bind(this)));
					
		// call this function to get code by name
		this.#getCodeFromDbMethod = getCodeFromDbMethod;
	}
	
	/*
		public methods
	*/
	
	addCodeEntry(codeName, codeHash, codeText) {
		const codeEntry = new CodeEntry(codeName, codeHash, codeText);
		if (this.#CodeMan.addCodeEntry(codeEntry)) {
			// added a new code entry to the list
			const newEntryHtml = this.prv_generateNewEntryHtml(codeName);
			
			// append it to the end of the list
			$(this.codeListSelector).append(newEntryHtml);
			
			// hook up click event handler
			$(this.getCodeListLinkSelector(codeName)).click(this.handleGetCodeFor.bind(this))
		}
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
								.replace(REPLACEMENT_CODE_INS, this.getCodeInsertId(codeName))
								.replace(REPLACEMENT_CODE_DEL, this.getCodeDeleteId(codeName))
								.replace(REPLACE_CODELIST_TAB, 0);
	}
	
	// get code if the code link is clicked
	async handleGetCodeFor(e) {
		const name = StringUtil.getIdStrFromBtnId(e.target.id);
		const codeText = await this.prv_getCodeFor(name);
		//if (this.#selectedCodeName != name) {
		$(this.codeConsoleTaSelector).val(codeText);
		this.#selectedCodeName = name;
		//}
	}
	
	// if we have the code, return it.  Otherwise, ask it from DB
	async prv_getCodeFor(name) {
		const codeEntry = this.#CodeMan.getCodeEntry(name);
		if (!codeEntry) {
			throw new Error(`Code [${name}] not found!`);
		}
		
		let codeText = codeEntry.text;
		if (!codeText) {
			codeText  = await this.retireveCode(name);
			codeEntry.text = codeText;
		}
		
		return codeText;
	}
	
	async retireveCode(name) {
		return await this.#getCodeFromDbMethod(name);
	}
	
	/*
		accessor methods
	*/
	
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
	
	// id for deleting code
	getCodeDeleteId(name) {
		return `yt_btn_code_del_${name}}`;
	}
	
	// selector for button which deletes code
	getCodeDeleteSelector(name) {
		return `#${this.getCodeDeleteId(name)}`;
	}
}

export { CodeManContainer };


