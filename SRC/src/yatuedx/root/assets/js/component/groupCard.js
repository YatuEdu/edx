const CLASS_SCHEDULE_TEMPLATE_SECTION = `
	<div class="container">
			{subjects}
	</div>`;

const SUBJECT_TEMPLATE_ROW = `
	<div class="row mb-1" id="{subrowid}" >
		<div class="col-12 text-left text-black">
			<h3>{sub}</h3>
		</div>
	</div>
	{classes}`;

const CLASS_TEMPLATE_ROW = `
	<div class="row mb-1" id="{subrowid}">
		<div class="col-8 text-left text-black">
			<h3>{clss}</h3>
		</div>
		<div class="col-4 text-right text-black">
			<button class="btn btn-outline-primary translatable {gotoexerm}" 
				data-clss-id="{grpid}" 
				data-seq-id="{seqid}" 
				data-gtype-id="{gtypeid}" title="Show or hide class description details">Do exercise</button>
		</div>
	</div>
	{seqrows}
	`;

const CLASS_SEQUENCE_TEMPLATE_ROW = `
	<div class="row mb-1" id="{seqrowid}" >
		<div class="col-4 text-left text-black">
			<span>{seqname}</span>
		</div>
		<div class="col-1 text-right text-black">
			<button class="btn btn-rounded btn-outline-primary translatable {seqexpactclss}" 
				data-clss-id="{grpid}" 
				data-seq-id="{seqid}">{expbtntxt}</button>
		</div>
		<div class="col-4 text-left text-black">
			<span>{seqstrt}</span>
		</div>
		<div class="col-1 text-left text-black">
			<span>{seqlen}hr</span>
		</div>
		<div class="col-2 text-right text-black">
			<button class="btn btn-rounded btn-outline-primary translatable {gotoliveclss}" 
				data-clss-id="{grpid}" 
				data-seq-id="{seqid}" id="{btnid}">Go to classroom</button>
		</div>
	</div>
	<div class="row mb-1" id="{seqdescrptid}"  style="display:none">
		<div class="col-10 text-left text-black">
			<p>
			{seqdescrpt}
			</p>
		</div>
	</div>
`;

const REPLACEMENTSUBJECT_NAME = '{sub}';
const REPLACEMENT_CLASS_NAME = '{clss}';

const REPLACEMENT_GROUP_ID = '{grpid}';
const REPLACEMENT_GOTO_EXCERSICE_RM_BTN_CLASS = '{gotoexerm}';

const REPLACEMENT_SEQUENCE_ID = '{seqid}';
const REPLACEMENT_SEQUENCE_NAME = '{seqname}'
const REPLACEMENT_SEQUENCESTART = '{seqstrt}';
const REPLACEMENT_SEQUENCELEN = '{seqlen}';
const REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_BTN_TEXT = '{expbtntxt}';
const REPLACEMENT_SEQUENCE_DESCRPT_DIV = '{seqdescrptid}';
const REPLACEMENT_SEQUENCE_DESCRPT = '{seqdescrpt}';
const REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_CLASS = '{seqexpactclss}';
const REPLACEMENT_GOTO_LIVE_CLASS = '{gotoliveclss}';
const REPLACEMENT_SUBJECT_ROW_HTML = '{subjects}';
const REPLACEMENT_CLASS_ROW_HTML = '{classes}'
const REPLACE_GROUP_TYPE_ID = '{gtypeid}';
const REPLACEMENT_SEQUENCE_ROW_HTML = '{seqrows}';


const REPLACEMENT_SUBJECT_NAME = '{sub}';
const REPLACEMENT_SEQUENCE_ROW_ID = '{rowid}';
const REPLACEMENT_ROW_ID = '{rowid}';
const REPLACEMENT_BUTTON_ID = '{btnid}';

const YT_CLASS_SCHEDULE_LIVE = '.schedule-action';
const YT_CLASS_IS_LIVE = 'live-class';

const BTN_TEXT_START_SESSION = "Start class";
const BTN_TEXT_STOP_SESSION = "Stop class";

class MyClassTemplates {
	static get SECTION() { return CLASS_SCHEDULE_TEMPLATE_SECTION}
	static get SUBJECT() { return SUBJECT_TEMPLATE_ROW}
	static get CLASS () { return CLASS_TEMPLATE_ROW}
	static get SEQUENCE () { return CLASS_SEQUENCE_TEMPLATE_ROW}

	static get REPLACE_GROUP_ID () {return REPLACEMENT_GROUP_ID}
	static get REPLACE_GOTO_EXCERSICE_RM_BTN_CLASS () {return REPLACEMENT_GOTO_EXCERSICE_RM_BTN_CLASS}

	static get REPLACE_SUBJECT_ROWS() {return REPLACEMENT_SUBJECT_ROW_HTML}
	static get REPLACE_CLASS_ROWS() {return REPLACEMENT_CLASS_ROW_HTML}
	static get REPLACE_SEQUENCE_ROWS() {return REPLACEMENT_SEQUENCE_ROW_HTML}

	static get REPLACE_SEQUENCE_NAME() { return REPLACEMENT_SEQUENCE_NAME}
	static get REPLACE_SEQUENCE_ID() { return REPLACEMENT_SEQUENCE_ID}
	static get REPLACE_GROUP_TYPE_ID() { return REPLACE_GROUP_TYPE_ID}
	
	
	static get REPLACE_SEQUENCESTART() {return REPLACEMENT_SEQUENCESTART}
	static get REPLACE_SEQUENCELEN() { return REPLACEMENT_SEQUENCELEN}
	static get REPLACE_SEQUENCE_DESCRPT_DIV() { return REPLACEMENT_SEQUENCE_DESCRPT_DIV; }
	static get REPLACE_SEQUENCE_DESCRPT() { return REPLACEMENT_SEQUENCE_DESCRPT}
	static get REPLACE_SEQUENCE_DESCRPT_EXPAND_CLASS() { return REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_CLASS}
	static get REPLACE_GOTO_LIVE_CLASS() { return REPLACEMENT_GOTO_LIVE_CLASS}
	static get REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_BTN_TEXT() { return REPLACEMENT_SEQUENCE_DESCRPT_EXPAND_BTN_TEXT}
	static get REPLACE_SUBJECT_NAME() { return REPLACEMENTSUBJECT_NAME}
	static get REPLAC_CLASS_NAME() { return REPLACEMENT_CLASS_NAME; }
}

export {MyClassTemplates};
						
