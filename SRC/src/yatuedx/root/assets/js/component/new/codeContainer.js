import {ComponentBase}		from '../componentBase.js';
import {StringUtil}			from '../../core/util.js';
import {Net}			    from "../../core/net.js"
import {credMan} 			from '../../core/credMan.js'

//const CODE_LIST_TABLE_TEMPLATE = '

const MY_CODE_LIST_TEMPLATE = `
<div class="row mb-0 yt-list-element {codelstclssforall} {codelstclss}" id="{codelstDivId}">
  <div class="col-4 tool-tbtn-dimention-left">
	<button id="{codeLinkId}" class="textButton bigTextButton" data-tabindex="{tb}">{lb}</button>
  </div>
  <div class="col-8 tool-tbtn-dimention">
    <button class="textButton mediumTextButton upd-code" id="{codeInsId}" title="Copy the code from code depot and insert into practice console ut the cursor">Insert</button>
	<button class="textButton mediumTextButton upd-code" id="{codeUpdId}" title="Copy the code from the code practice console and update the selected code entry in code depot">Update</button>
	<button class="textButton mediumTextButton del-code" id="{codeDelId}" title="Delete the code">Delete</button>
  </div>
</div>
`;

const MY_CODE_LIST_SUBJECT_SEQUENCE_SELECT_TEMPLATE = `
	<option value="{sub_seq}">{sub:seq:name}</option>
`;

const CODE_CONTAINER_TEMPLETE = 
`<div class="row mb-0 yt-list-element">
	<div class="col-12 tool-tbtn-dimention-left">
		<select name="subject_sequences" id="{codesujslct}">
	  		<option value="{allsubs}" selected="selected">All subjects/sequences</option>
	  		{codesujslct-itms}
  		</select>
	</div>
</div>
<div id='yt_div_code_man' class="row mb-0">
 <div id="yt_col_code_list" class="col-11  yt-list-panel-right">
	{codeListHolder}
 </div>
</div>
`;

const MY_CSS = "codeManager.css";
const CSS_SELECTED_CODE_ENTRY = "textButton-seledcted";

const REPLACE_ALL_SUBJECTS_SEQUENCES ="{allsubs}"
const REPLACE_CODELIST_TAB = '{tb}';
const REPLACE_CODELIST_LABEL = '{lb}';
const REPLACE_CODELIST_DIV_ID = '{codelstDivId}';
const REPLACE_CODELIST_CLASS = "{codelstclss}";
const REPLACE_CODELIST_CLASS_FOR_ALL  = "{codelstclssforall}";
const REPLACE_CODE_SUBJECT_SEQUENCE_SELECT_ITEMS = "{codesujslct-itms}"
const REPLACE_SUBJECT_SEQUENCE_ID = "{sub_seq}";
const REPLACE_SUBJECT_SEQUENCE_NAME = "{sub:seq:name}";
const REPLACE_CODE_SUBJECT_SEQUENCE_SELECT = "{codesujslct}";
const REPLACE_CODE_LIST_LINK_ID = "{codeLinkId}";
const REPLACEMENT_CODE_LIST = '{codeListHolder}';
const REPLACEMENT_CODE_DEL = '{codeDelId}';
const REPLACEMENT_CODE_UPD = '{codeUpdId}';
const REPLACEMENT_CODE_INS = '{codeInsId}';

const CODE_LIST_DIV_PREFIX = 'yt_code_list_entry_';
const CODE_LIST_LINK_PREFIX = 'yt_code_list_link_';

/*
	This class handles code management functions inside student or teacher pages
*/
class CodeEntry {
	#name;
	#sequenceId;
	#sequenceName
	#subjectId
	#subjectName
	#text;
	#hash;
	
	constructor(name, hash, text, seqId, seqName, subId, subName) {
		this.#name = name;
		this.#hash = hash;
		this.#text = text;
		this.#sequenceId = seqId;
		this.#sequenceName = seqName;
		this.#subjectId = subId;
		this.#subjectName = subName;
		
	}
	
	get name() { return this.#name; }
	
	get sequenceId() { return this.#sequenceId;}

	get sequenceName() { return this.#sequenceName }
	
	get subjectId() { return this.#subjectId }

	get subjectName() { return this.#subjectName }
	
	get text() { return this.#text; }
	
	set text(t) { this.#text = t; }
	
	get hash() { return this.#hash; }
	
	set hash(h) {
		this.#hash = h;
	}
}

/*
	This class handles code management functions inside student or teacher pages
*/
class CodeMan {
	#codeMapByName;
	
	// construct code manager using code list acquired from DB
	constructor(codeDataList) {
		// load existing code 
		this.#codeMapByName = new Map();
		codeDataList.forEach(e => {
			const ce = new CodeEntry(e.name, e.hash, e.text, e.sequence_id, e.sequence_name, e.subject_id, e.subject_name);
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

/*
	This class handles code management functions inside student or teacher pages
*/
class CodeContainer extends ComponentBase {
	#codeMan;	
	#selectedCodeName;
	#codeEditor;
	#groupId;
	#sequenceId;
	#sequenceMap

	constructor(parentId, codeEditor, groupId, sequenceId) {
		super("id", "CodeContainer", parentId, "", MY_CSS);
		this.#codeEditor = codeEditor;
		this.#groupId = groupId;
		this.#sequenceId = sequenceId
	}

    static async createCodeContainer(parentId, codeEditor, groupId, sequenceId) {
        const instance = new CodeContainer(parentId, codeEditor, groupId, sequenceId);
        await instance.initCodeDepot();
        return instance;
    }
	
    /*
		Load user code text from data base
	 */
	async initCodeDepot() {
		const codeDataList = [];
		this.#sequenceMap = new Map();
		const resp = await Net.memberListAllCode(credMan.credential.token);
		if (resp.data.length > 0) {
			let first = true;
			
			resp.data.forEach(codeHeader => {
				const codeEntry = {
					name: codeHeader.name, 
					hash: codeHeader.hash,
					sequence_id: codeHeader.sequence_id,
					sequence_name: codeHeader.sequence_name,
					subject_id: codeHeader.subject_id,
					subject_name: codeHeader.subject_name,
				};
				codeDataList.push(codeEntry);
				// map a sequence id to its subject and subject name (1-1 mapping)
				if (!this.#sequenceMap.get(codeHeader.sequence_id)) {
					this.#sequenceMap.set(codeHeader.sequence_id, [codeEntry.sequence_name, codeEntry.subject_id, codeEntry.subject_name])
				}
			});
		}

        this.#codeMan = new CodeMan(codeDataList);

        // create code container UI 
		const {codeListHtml, sequenceSelectHtml} = this.prv_buildCodeListHtml(codeDataList);
		const componentHtml = CODE_CONTAINER_TEMPLETE
						.replace(REPLACE_ALL_SUBJECTS_SEQUENCES, this.optionForAll)
						.replace(REPLACEMENT_CODE_LIST, codeListHtml)
						.replace(REPLACE_CODE_SUBJECT_SEQUENCE_SELECT, this.subjectSequenceSelectId)
						.replace(REPLACE_CODE_SUBJECT_SEQUENCE_SELECT_ITEMS, sequenceSelectHtml)
						
		
		// mount the component to the page
		this.mount(componentHtml);
		
		// add event handler for all the list entry
		codeDataList.forEach(codeHeader => $(this.eventHandlerForNewCode(codeHeader.name)));

		/*
		 * INITIALIZE subject-sequence selector control
		*/
	   $(this.subjectSequenceSelectSelector).selectmenu();
	   $(this.subjectSequenceSelectSelector).on("selectmenuchange", this.#handleSubjectSequenceChange.bind(this));

	}
	
	
	/*
		public methods
	*/
	
	addCodeEntry(codeName, codeText) {
		const codeHash = StringUtil.getMessageDigest(codeText);
		const sequenceInfo = this.#sequenceMap.get(this.#sequenceId)
		const codeEntry = new CodeEntry(codeName, codeHash, codeText, this.#sequenceId, sequenceInfo[0], sequenceInfo[1], sequenceInfo[2]);
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
		$(this.getCodeInsertSelector(codeName)).click(this.handleInsertCode.bind(this));
	}
	
	async handleInsertCode(e) {
		const name = StringUtil.getIdStrFromBtnId(e.target.id);
		let codeText = await this.prv_getCodeFor(name);
	
		const existingCode = this.#codeEditor.code;
		codeText = existingCode 
					? 
					codeText + `\n\n /* @ Code ${name} inserted before the following line! @ */ \n\n ` + existingCode 
					: 
					codeText;
		this.prv_toggleSelection(this.#selectedCodeName, name);
		this.#codeEditor.code = codeText;
		this.#selectedCodeName = name;
		
	}

	async handleUpdateCode(e) {
		const codeName = this.prv_getCodeNameFromEvent(e);
		// only react to selected code entry
		if (this.#selectedCodeName == codeName) {
			const uiText = this.#codeEditor.code;
			const depotText = (this.#codeMan.getCodeEntry(codeName)).text;
			if (uiText !== depotText) {
				const updateCode = confirm(`Are you sure you want to replace "${codeName}" in code depot with code from input consle?`);
				if (!updateCode) {
					return
				}
				// update depot DB
				const resp = await this.updateCodeToDb(codeName, uiText);
				if (resp.code) {
					alert("Error encountered during updating code to DB. Error code:" +  resp.code);
				} else {
					// update in-meomry code depot
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
			const result = await this.#deleteCodeFromDb(codeName);
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

    async #getCodeFor(codeName) {
		const respCodeText = await Net.memberGetCodeText(credMan.credential.token,
														 0, 
														 codeName);
		if (respCodeText.code === 0) {
			return StringUtil.decodeText(respCodeText.data[0].text);
		}
	}

	async #deleteCodeFromDb(codeName) {
		const resp = await Net.memberDeleteCode(credMan.credential.token,
												0, codeName);
	    return resp.code;
	}

    async updateCodeToDb(codeName, codeText) {
		// encode text for safety and viewbility
		const codeHash = StringUtil.getMessageDigest(codeText);
		const encodedCodeText = StringUtil.encodeText(codeText);
		const resp = await Net.memberAddCode(credMan.credential.token, 
											 this.#groupId,
											 this.#sequenceId,
											 codeName, 
											 encodedCodeText, 
											 codeHash);
		return resp;
	}

	/*
		Event handlers
	*/

	/*
	 * Handle drop down selection to show only subjects (or sequences) that are qualified.
	 *
	 * @param {*} e 
	 * @returns 
	 */
	#handleSubjectSequenceChange(e) {
		e.preventDefault(); 
		const selected = $(e.target).find(":selected").val()
		if (selected === this.optionForAll) {
			// show all items
			$(this.codeListClassForAllElementsSelector).show()
			return
		}
		const selectedSubSeq = selected.split("_")
		const sid = parseInt(selectedSubSeq[0])
		const qid = selectedSubSeq[1] ? parseInt(selectedSubSeq[1]) : 0
		const qualifierClassId = !qid ? this.getCodeClassForSubjectId(sid) : this.getCodeClassForSequenceId(qid)
		const allElements = $(this.codeListClassForAllElementsSelector).get()
		allElements.forEach(e => {
			if ($(e).hasClass(qualifierClassId)) {
				$(e).show()
			} else {
				$(e).hide()
			}
		})
	}
	
	/*
		private methods
	*/

	prv_getCodeNameFromEvent(e) {
		const id = $(e.target).attr("id");
		return StringUtil.getIdStrFromBtnId(id);
	}
			
	prv_buildCodeListHtml(codeDataList) {
		if (codeDataList.length == 0 ) {
			return 'No code in your code depot';
		}
		let htmlResult = '';
		let selectHtml = '';
		const addedSubjects = []
		const addedSequence = []
		for(let i = 0; i < codeDataList.length; i++) {
			const codeHeader = codeDataList[i];
			htmlResult += this.prv_generateNewEntryHtml(codeHeader);
			selectHtml += this.prv_generateNewOptionHtml(codeHeader, addedSubjects, addedSequence);
		}		
		
		return {codeListHtml: htmlResult, sequenceSelectHtml: selectHtml}
	}
	
	prv_generateNewEntryHtml(codeHeader) {
		return MY_CODE_LIST_TEMPLATE
								.replace(REPLACE_CODELIST_DIV_ID, this.getCodeListDivId(codeHeader.name))
								.replace(REPLACE_CODELIST_CLASS,  this.getCodeListClass(codeHeader))
								.replace(REPLACE_CODELIST_CLASS_FOR_ALL, this.codeListClassForAllElements)
								.replace(REPLACE_CODELIST_LABEL, codeHeader.name)
								.replace(REPLACE_CODE_LIST_LINK_ID, this.getCodeListLinkId(codeHeader.name))
								.replace(REPLACEMENT_CODE_DEL, this.getCodeDeleteId(codeHeader.name))
								.replace(REPLACEMENT_CODE_UPD, this.getCodeUpdateId(codeHeader.name))
								.replace(REPLACEMENT_CODE_INS, this.getCodeInsertId(codeHeader.name))
								.replace(REPLACE_CODELIST_TAB, 0);
							
	}
	
	prv_generateNewOptionHtml(codeHeader, addedSubjects, addedSequence) {
		const sid = codeHeader.subject_id;
		const qid = codeHeader.sequence_id;
		let optionHtml = ''
		if (!addedSubjects.includes(sid)) {
			// see a new subject, add an option for all of its sequences
			addedSubjects.push(sid)
			optionHtml = MY_CODE_LIST_SUBJECT_SEQUENCE_SELECT_TEMPLATE
				.replace(REPLACE_SUBJECT_SEQUENCE_ID, `${sid}_`)
				.replace(REPLACE_SUBJECT_SEQUENCE_NAME, `${codeHeader.subject_name}`);
		}
		if (!addedSequence.includes(qid)) {
			// see a new sequence, add an option for it
			addedSequence.push(qid)
			optionHtml += MY_CODE_LIST_SUBJECT_SEQUENCE_SELECT_TEMPLATE
					.replace(REPLACE_SUBJECT_SEQUENCE_ID, `${sid}_${qid}`)
					.replace(REPLACE_SUBJECT_SEQUENCE_NAME, `-- sequence: ${codeHeader.sequence_name}`);
		}
		return optionHtml;
							
	}

	// get code if the code link is clicked
	async handleGetCodeFor(e) {
		const name = StringUtil.getIdStrFromBtnId(e.target.id);
		const oldName = this.#selectedCodeName;

		let codeText = await this.prv_getCodeFor(name);
		
		/*
			complext logic to determine if we want to overwrite the code in the code console, using the
			code from code depod.  The key is to not implicitly erase the code user just entered.
		*/
		if (oldName != name) {
			const existingCode = this.#codeEditor.code
			const codeInDepod = oldName ?  this.prv_getCodeEntryForCode(oldName) : null;
			if (existingCode) {
				let askQuestion = true;
				if (codeInDepod && existingCode === codeInDepod.text) {
					askQuestion = false;
				}
				if(askQuestion) {
					const replace = confirm("Do you want to replace the ocde in the code console with the selected code from code depot? ");
					if (!replace) {
						return;
					}
				}
			}
			this.prv_toggleSelection(this.#selectedCodeName, name);
			this.#codeEditor.code = codeText;
			this.#selectedCodeName = name;
		}
	}
	
	// if we have the code, return it.  Otherwise, ask it from DB
	async prv_getCodeFor(name) {
		let codeEntry = this.prv_getCodeEntryForCode(name);
		if (!codeEntry.text) {
			codeEntry.text  = await this.#getCodeFor(name);
		}
		
		return codeEntry.text;
	}
	
	
	prv_getCodeEntryForCode(name) {
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

	get subjectSequenceSelectId() { return 'yt_opt_subject_sequence'}

	get subjectSequenceSelectSelector() { return `#${this.subjectSequenceSelectId}`;}

	get optionForAll() { return 'all' }

	get codeListClassForAllElements() { return 'yt_clss_code_list_item'}
	get codeListClassForAllElementsSelector() { return `.${this.codeListClassForAllElements}`}
	
	// id for code list div
	getCodeListDivId(name) {
		return `${CODE_LIST_DIV_PREFIX}${name}`;
	}

	getCodeClassForSubjectId(subjectId) { return `subject_${subjectId}`}

	getCodeClassForSequenceId(sequenceId) { return `sequence_${sequenceId}`}

	getCodeListClass(codeHeader) { 
		return `${this.getCodeClassForSubjectId(codeHeader.subject_id)} ${this.getCodeClassForSequenceId(codeHeader.sequence_id)}`
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

	// id for inserting code
	getCodeInsertId (name) {
		return `yt_btn_code_ins_${name}`;
	}
	
	// selector for button which insert code
	getCodeInsertSelector(name) {
		return `#${this.getCodeInsertId(name)}`;
	}

}

export { CodeContainer };


