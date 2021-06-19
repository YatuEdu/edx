import {sysConstants} 		from './sysConst.js'
import {credMan}      		from './credManFinMind.js'
import {Net}          		from './net.js';
import {MetaDataManager}	from './metaDataManager.js';
import {UserEnumQuestionRadio} 		from './q_enum.js'
import {UserEnumQuestionCheckbox} 	from './q_enum_checkbox.js'
import {UserIntegerQuestionText} 	from './q_integer.js'
import {UserIntegerPairQuestion}   	from './q_integer_pair.js'
import {UserDateQuestion}			from './q_date.js'

const temp_attr_cats = [
{id: -1, name: 'none'},
{id: 0, name: 'all'},
{id: 1, name: 'general'},
{id: 2, name: 'health habit'},
{id: 3, name: 'health status'},
{id: 4, name: 'docmental'},
{id: 5, name: 'special info'},
];

const temp_attr_list =  MetaDataManager.attrList;
const enumMap = MetaDataManager.enumMap;

const integer_op_option_html = `
<select id="operator_choice">
	<option value="eq">equal to</option>
	<option value="gr">greater than</option>
	<option value="ge">greater than or equal to</option>
	<option value="ls">less than</option>
	<option value="le">less than or equal to</option>
</select>
`;

const enum_op_option_html = `
<select id="operator_choice">
	<option value="eq">equal to</option>
</select>
`;
			
/*
	This class manages both login and sigup workflow
**/
class BlockBranchingManager {
	#credMan;
	#branches;         /* list of branchInfo: 
									[  
										{gotoBlockId: 100, 
										  lines: [
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ],
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ]
											]
										},
										{gotoBlockId: 101, 
										  lines: [
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ],
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ]
											]
										},
									]
										
					    */
	#rightValueField;
	#blockId;			/* current block to branch from */
	#lineId;			/* line id with a branch */
	#gotoBlockId;		/* goto block id */
	#hasBranch;			/* do we need to specify branching? */
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#blockId = 0;
		this.#gotoBlockId = 0;
		this.#hasBranch = false;
		this.#branches = [];
		this.#rightValueField = null;
		this.#lineId = 0;
		
		// todo: obtain attributes from finMind
		
		this.init();
	}
	
	// hook up events
	init() {
		// select different attribute category
		$('#attribute_cat_choice').change(this.handleAttrCatSelection.bind(this));
		
		// add a new condition line to an existing branch
		$(' #add_line_button').click(this.handleNewConditionLine.bind(this));
		
		// append a new condition to an existing condition branch at a line
		$(' #append_cond_button').click(this.handleAppendToConditionLine.bind(this));
		
		// add a new branch
		$(' #add_branch_button').click(this.handleNewBranch.bind(this));
		
		// handle current block change event
		$(' #curr_block_id').blur(this.handleCurrentBlockChange.bind(this));
		
		// handle goto block change
		$(' #goto_block_id').blur(this.handleGotoBlockChange.bind(this));
		
		// handle line number change
		$(' #line_id').blur(this.handleLineNumberChange.bind(this));
		
		// handle saving all branch info for the current block to finMind API
		$(' #save_cond_button').click(this.handleSaveBranchInfo.bind(this));
	}	
	
	// selected an attribut category and populate attributes foir this category
	handleAttrCatSelection(e) {
		e.preventDefault();
		const cat = $( "#attribute_cat_choice" ).val();
		const catInt = parseInt (cat);
		
		// No selection (we don't need branching, directly specify 'goto block':
		if (catInt === -1) {
			this.#hasBranch = false;
			$( "#attr_selection").html('');
			$(' #opp_selection').html('');
			$( '#attr_right_value' ).html('');
			return;
		}
		this.#hasBranch = true;
		
		// select value input and operator
		const selHtml = this.formSelectionOptions(temp_attr_list.filter(e => cat == 0 || e.cat == catInt));
		$( "#attr_selection").html(selHtml);
		
		// dynamic event handler
		$('#attribute_choice').change(this.handleAttrSelection.bind(this));
	}
	
	// login as test user 
	handleAttrSelection(e) {
		e.preventDefault();
		// select value input and operator
		const attr = $( "#attribute_choice" ).val();
		// numeric operator or eq operator
		const attrObj = temp_attr_list.find (e => e.id == attr);
		if (attrObj.type === 1) {
			$(' #opp_selection').html(integer_op_option_html);
		} else {
			$(' #opp_selection').html(enum_op_option_html);
		}
		
		// form right value field (the target value)
		this.formRightValuField({ attr_id: attrObj.id, 
							 question_text: attrObj.question_text, 
							 attr_type: attrObj.type });
	}
	
	/*
		Start dealing with a new block and its branching. Need to make
		sure that user saved the old block branching info or agree to proceed w/o
		saving.
	*/
	async handleCurrentBlockChange(e) {
		let newBlockId = $('#curr_block_id').val();
		if (this.#blockId > 0 && newBlockId) {
			const yes = window.confirm("You have not saved the current block branching info.  Proceed without saving?");
			if (!yes) {
				$('#curr_block_id').val(this.#blockId)
				return;
			}
		}
		if (newBlockId) {
			this.#blockId  = parseInt(newBlockId);
			
			// get the block brnching info from finMind service (TODO):
			const data = {order: 0, condition: "[attr_id] = 1 AND [str_v1] = 'Female' OR [attr_id] = 2 AND [int_v1] > 45",
			subCondition: 2, nextBlock: 301 };
			this.prv_insertLine(data);
			
		}
	}
	
	/*
		Add a new branching by first speficy a go to bloack
	*/
	handleGotoBlockChange(e) {
		let gotoBlockVal = $('#goto_block_id').val();
		if (gotoBlockVal) {
			this.#gotoBlockId  = parseInt(gotoBlockVal);
		}
	}
	
	/*
		Specify the line id at where we put the new condition
	*/	
	handleLineNumberChange(e) {
		let lineVal = $('#line_id').val();
		if (lineVal) {
			this.#lineId  = parseInt(lineVal);
		}	
	}
	
	/*
		Add a new branch for the current block
	*/
	handleNewBranch(e) {
		e.preventDefault();
		
		// get current block or new block ids
		if (this.#blockId === 0) {
			alert('no block for branching');
			return;
		}
		
		// get goto block id
		if (this.#gotoBlockId === 0) {
			alert('no goto block for branching');
			return;
		}
		
		// branch searching ...
		let gotoCond = this.#branches.find (b=>b.gotoBlockId === this.#gotoBlockId);
		if (gotoCond) {
			alert('goto branch already existing.  You could add a new condition to it.');
			return;
		}
		
		const newBranch = {gotoBlockId: this.#gotoBlockId, 
						   lines: []
		};
		this.#branches.push(newBranch);
		
		// display current conditions
		this.displayBranchingInfo();
	}
	
	/*
		Add a new condition line for the current branch.
		{gotoBlockId: 100, 
										  lines: [
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ],
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ]
											]
										},
	*/
	handleNewConditionLine(e) {
		e.preventDefault();
		
		// get current block or new block ids
		if (this.#blockId === 0) {
			alert('no block for branching');
			return;
		}
		
		// get goto block id
		if (this.#gotoBlockId === 0) {
			alert('no goto block for branching');
			return;
		}
		
		// add a new line
		let gotoCond = this.#branches.find (b=>b.gotoBlockId === this.#gotoBlockId);
		if (!gotoCond) {
			alert('goto block not existing.  Add a new branch first.');
			return;
		}
		const newEmptyCond = {qInfo1: null, op: null};
		const newLine = [];
		newLine.push (newEmptyCond);
		gotoCond.lines.push(newLine);
		
		// display current conditions
		this.displayBranchingInfo();
	}
	
	/*
		Append a new condition for the given branch at a given line
	*/
	handleAppendToConditionLine(e) {
		e.preventDefault();
		
		// line no not specified
		if (this.#lineId === 0) {
			const yes = window.confirm("You have not specified the line number. Use line 0?");
			if (!yes) {
				return;
			}
		}
		
		// get goto block id
		if (this.#gotoBlockId === 0) {
			alert('no goto block for branching');
			return;
		}
		
		// need attribute id
		if (!this.#rightValueField) {
			alert('no attribute is given for condition');
			return;
		}
		
		// need to set the right value
		if (!this.#rightValueField.onValidating()) {
			alert('no attribute value is given for condition');
			return;
		}
		
		let gotoCond = this.#branches.find (b=>b.gotoBlockId === this.#gotoBlockId);
		if (!gotoCond) {
			alert('no branch existing this block. create the branch first.');
			return;
		}
		
		// line no not specified
		if (this.#lineId >= gotoCond.lines.lenght) {
			alert('line number out of range');
			return;
		}
		const line = gotoCond.lines[this.#lineId];
		
		// save rv to qInfo
		this.#rightValueField.serialize();
		const qInfo = this.#rightValueField.qInfo;
		
		// same attr exists?
		let cond = line.find(c => c.qInfo == null || c.qInfo.attr_id === qInfo.attr_id);
		if (!cond) {
			cond = {};
			line.push(cond);
		}
		cond.qInfo = this.#rightValueField.qInfo;
		cond.op = $('#operator_choice').val();

		// display current conditions
		this.displayBranchingInfo();	
	}
	
	/*
		Save all branching info to finMind API
	*/
	async handleSaveBranchInfo(e) {
		e.preventDefault();
		// any thing to save?
		if (this.#blockId === 0) {
			alert('no current block id');
		}
		
		// if no branching, save the goto block as the next block
		if (!this.#hasBranch || this.#branches.length === 0) {
			// save goto block
		}
		
		// save branchings and its conditions
		const xml = this.formXml();
		const res = await Net.agentUpdateBlockBranchingConditions(this.#credMan.credential.token,this.#blockId, xml);
	}
	
	formSelectionOptions(opts) {
		let selOptions = `<select id="attribute_choice"><option value="0">---</option>`;
		opts.forEach(a => selOptions += `<option value="${a.id}">${a.question_text}</option>`);
		selOptions += `</select>`;
		return selOptions;
	}
	
	/**
		To create question class instance by json format from.
		qInfo is an object coming from method 'handleAttrSelection':
		{attr_id, question_text, attr_type, iv1, iv2, sv1, sv2, dv1, dv2}
	**/
	formRightValuField(qInfo) {
		switch(qInfo.attr_type) {
			case 1:
				this.#rightValueField = new UserIntegerQuestionText(qInfo, 1, 80); 
				break;
			case 3:
			case 4:
				this.#rightValueField = new UserIntegerPairQuestion(qInfo, 1, 100, 1, 100); 
				break;
			case 11:
				this.#rightValueField = new UserDateQuestion(qInfo); 
				break;
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
				this.#rightValueField = new UserEnumQuestionRadio(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
			case 18:
				this.#rightValueField = new UserEnumQuestionCheckbox(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
			default:
				throw new Error("Invalid attr_type");
		}
		// add html to UI
		$( '#attr_right_value' ).html(this.#rightValueField.displayHtml);
		
		// hook up event handler
		this.#rightValueField.onChangeEvent();	
	}
	
	/* THE FOLLOWING IS THE XML FORMAT For API: 2021815
	<block_flow>
	  <branching>
	    <goto>123</goto>   		// goto block 123 if condition meets 
		<cond>					// age > 45 
			<attrId>2</attrId>
			<op>ge</op>
			<rv>45</rv>
		</cond>
		<cond>					// married 
			<attrId>11</attrId>
			<rv>Married</rv>
		</cond>
	*/
	formXml() {
		let xml = '<block_flow>';
		for(let i = 0; i < this.#branches.length; ++i) {
			const nextBlock = this.#branches[i].gotoBlockId;
			const lines =  this.#branches[i].lines;
			if (lines.length === 0) {
				// for uncondtional branching (usually last branch)
				xml += `<branching><goto>${nextBlock}</goto></branching>`;
				break;
			}
			for(let j = 0; j < lines.length; ++j) {
				xml += `<branching><goto>${nextBlock}</goto>`;
				const line = lines[j];
				for (let k = 0; k < line.length; ++ k)
				{
					xml += this.formOneConditionXml(line[k]);
				}
				xml += '</branching>'
			}
		}
		xml += '</block_flow>';
		return xml;
	}
	
	set blockId(bid) {
		this.#blockId = bid;
	}
	
	/* display current branching info as soon as it is changed
	   for debugginh purpose only
	   [  
										{gotoBlockId: 100, 
										  lines: [
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ],
											  [
												{qInfo1, op},
												{qInfo2, op2}
											  ]
											]
										}
	]
	*/
	displayBranchingInfo() {
		let html = '';
		for(let i = 0; i < this.#branches.length; ++i) {
			const nextBlock = this.#branches[i].gotoBlockId;
			html += `<h3>next block: ${nextBlock} </h3>`;
			const lines =  this.#branches[i].lines;
			for(let j = 0; j < lines.length; ++j) {
				const line =  lines[j];
				html += `#### `;
				for (let k = 0; k < line.length; ++k)
				{
					html += this.formOneLine(line[k], j);
				}
				html += '<br>'
			}
		}
		$('#condition_list').html(html);
	}
	
	formRV(qInfo) {
		let rv = "";
		switch (qInfo.attr_type) {
			case 1:
			case 18:
				rv = qInfo.iv1;
				break;
			default:
				rv = qInfo.sv1;
				break;
		}
		return rv;
	}
	
	/*
		Form condtiona expression for one attribute, for example: attr = 2 AND v >= 40
	*/
	formOneLine(line, lineNo) {
		let expression = `line_${lineNo}:`;
		if (line.qInfo) {
			expression +=`attr_id = ${line.qInfo.attr_id} AND value `;
			let rv = this.formRV(line.qInfo);
			expression += ` ${line.op} ${rv} `;
		}
		return expression;
	}
	
	/*
		Form condtiona expression for one attribute in XML format for
		finMind service API :
		<cond>					
			<attrId>11</attrId>
			<rv>Married</rv>
		</cond>
	*/
	formOneConditionXml(condition) {
		let condXml = '<cond>';
		condXml += `<attrId>${condition.qInfo.attr_id}</attrId>`;
		condXml += `<op>${condition.op}</op>`;
		condXml +=  `<rv>${this.formRV(condition.qInfo)}</rv>`;
		condXml += '</cond>';
		return condXml;
	}
	/*
	data = {order: 0, condition: "[attr_id] = 1 AND [str_v1] = 'Female' OR [attr_id] = 2 AND [int_v1] > 45",
			subCondition: 2, nextBlock: 301 };
			this.insertLine(data);
	*/
	prv_insertLine(data) {
		// add ord update a branch 
		let branch = this.#branches.find (b=>b.gotoBlockId === data.nextBlock);
		if (!branch) {
			branch = { gotoBlockId: data.nextBlock, 
					   lines: []
			}；
			this.#branches.push （newBranch）；
		}
		const condList = this.prv_extractQinfoAndOperator(data.condition);
		branch.lines.push (condList);
	}
	
	/*
		EXTRACT qinfo from sql conditional phrase
		for example: [attr_id] = 1 AND [str_v1] = 'Female' OR [attr_id] = 2 AND [int_v1] > 45
		would be: [
			{qInfo: {attri_id: 1, sv1: 'Female'}, op: eq},
			{qInfo: {attri_id: 2, iv1: 45}, op: ge},
		]
	*/
	prv_extractQinfoAndOperator(orCondition) {
	}
}

let blockBranchingManager = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	blockBranchingManager = new BlockBranchingManager(credMan);
});