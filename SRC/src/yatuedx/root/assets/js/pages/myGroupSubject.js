import {Net}                             from '../core/net.js';
import {AuthPage} 						 from '../core/authPage.js'
import {sysConstStrings } 				 from '../core/sysConst.js';

const MY_CLASS_TEMPLATE_ROW = `
<div class="row mb-1" id="{rowid}" >
 <div class="col-3 text-right text-black">
  <label for="classname">{clss}</label>
 </div>
 <div class="col-3 text-right text-black">
  <label for="subject">{sub}</label>
 </div>
 <div class="col-3 text-right text-black">
  <label for="sequnece">{seq}</label>
 </div>
 <div class="col-3 text-right text-white">
  <button class="btn btn-rounded btn-outline-primary translatable schedule-action" 
		  data-clss-id="{grpid}" 
		  data-seq-id="{seqid}" id="{btnid}">Start class</button>
 </div>
</div>
`;

const REPLACEMENT_GROUP_ID = '{grpid}';
const REPLACEMENT_SEQUENCE_ID = '{seqid}';
const REPLACEMENT_CLASS_NAME = '{clss}';
const REPLACEMENT_SUBJECT_NAME = '{sub}';
const REPLACEMENT_SEQUENCE_ROW_ID = '{rowid}';
const REPLACEMENT_ROW_ID = '{rowid}';
const REPLACEMENT_BUTTON_ID = '{btnid}';
const REPLACEMENT_SEQUENCE_NAME = '{seq}';

const YT_CLASS_SCHEDULE_LIVE = '.schedule-action';
const YT_CLASS_IS_LIVE = 'live-class';

const BTN_TEXT_START_SESSION = "Start class";
const BTN_TEXT_STOP_SESSION = "Stop class";

/**
	This class manages all classesd the user belongs to
**/
class MyGroupSubjectPageHandler extends AuthPage {

	/* 
	 static facotry method for MyGroupSubjectPageHandler to assure that it calls its
	 async init method.
	 */
	static async createMyGroupSubjectPageHandler() {
		const myInstance = new MyGroupSubjectPageHandler();
		await myInstance.init();
		return myInstance;
	}
	
    constructor() {
		super();
	}
	
	// hook up events
	async init() {
		// important: must call AuthPage init asynchronously
		await super.init();
		// get all the classes I created 
		const t = this.credential.token;
		await this.retrieveMyClasses(t);
		
		// schedule a live class
		$(YT_CLASS_SCHEDULE_LIVE).click(this.handleLiveSchedule.bind(this))
	}	
	
	async handleLiveSchedule(e) {
		e.preventDefault();
		const target = e.target;
		
		
		const clssId = parseInt($(target).attr('data-clss-id'));
		const seqId  = parseInt($(target).attr('data-seq-id'));
		const btnTxt = $(target).html();
		
		// handle start seesion
		if (btnTxt == BTN_TEXT_START_SESSION) {
			await this.startClass(clssId, seqId);
		} else {
			await this.stopClass(clssId, seqId);
		}
	}
	
	/**
		retrieve the groups that I am registered with.
	 **/
	async retrieveMyClasses(t) {
		const ret = await Net.groupOwnerListClasses(t);
		if (ret.code === 0) {
			let htmlForClasses = "";
			const myClasses = ret.data;
			for(let i = 0; i < myClasses.length; i++) {
				const clss = myClasses[i];
				htmlForClasses = MY_CLASS_TEMPLATE_ROW
								.replace(REPLACEMENT_ROW_ID, this.formRowId(clss.group_id, clss.sequence_id)) 
								.replace(REPLACEMENT_GROUP_ID, clss.group_id)
								.replace(REPLACEMENT_SEQUENCE_ID, clss.sequence_id)
								.replace(REPLACEMENT_CLASS_NAME, clss.class_name)
								.replace(REPLACEMENT_SUBJECT_NAME, clss.class_subject)
								.replace(REPLACEMENT_SEQUENCE_NAME, clss.sequence_name)
								.replace(REPLACEMENT_BUTTON_ID, this.formButtonId(clss.group_id, clss.sequence_id));
								
				$(".mySubjectSequenceRow").append(htmlForClasses);
			}
			
			if (this.liveSession && this.liveSession.group_id) {
				this.selectLiveClass({}, {classId: this.liveSession.group_id, sequenceId: this.liveSession.sequence_id} );
			}	
		} else {
			alert("Failed to retieve your classes!");
		}
	}
	
	
	handleRefill(e) {
		e.preventDefault();
		alert('entering:' + $(this).attr('data-grp-name') + ":" + $(this).attr('data-grp-type'));
	}
	
	
	/**
		Enter the exercize room if applicable
	**/
	handleExercize(e) {
		e.preventDefault();
		
		// go to exercize room as student
		const groupId = $(this).attr('data-grp-id');
		const groupOwner = $(this).attr('data-grp-owner');
		window.location.href =  `./class-room.html?group=${groupId}&teacher=${groupOwner}&mode=1`;
	}
	
	/**
	 * handle starting a new class event.
	 * 
	 * @param {*} clssId  	- new class id
	 * @param {*} seqId 	- new sequence id
	 * @returns 			- none
	 */
	async startClass(clssId, seqId) {
		const newSelection = {classId: clssId, sequenceId: seqId};
		let oldSelection = {};

		// Stop the existing class and then start a new class?	
		let startNewSession = false;
		if (this.liveSession) {
			if (!this.isActiveSession(clssId, seqId)) {
				// Stop the currently active live session?
				const answer = confirm('You need to stop an active class session first. Do you want to do that?');
				if (!answer) {
					return;
				}

				// stop current live session
				await this.stopClass(this.liveSession.group_id,  this.liveSession.sequence_id);	

				// then to start a new session
				startNewSession = true;
			}
		} else {
			startNewSession = true;
		}
		
		// Start a new class 
		if (startNewSession) {
			const t = this.credential.token;
			const ret = await Net.groupOwnerStartClass(t, clssId, seqId);
			if (ret.code === 0) {
				const newSessionInfo = ret.data[0];
				// save the live class info
				newSessionInfo.group_id = clssId;
				this.setLiveSession(newSessionInfo);
				// Switch UI Highlight
				this.selectLiveClass(oldSelection, newSelection);
				// send messages to students
				this.sendGroupTextMessage(clssId, `Teacher "${this.credential.name} "${sysConstStrings.TEACHER_CLASS_STARTED}`);
			}
		}
	}
	
	async stopClass(clssId, seqId) {
		if (this.liveSession.session_id && 
			this.liveSession.group_id === clssId &&
			this.liveSession.sequence_id === seqId ) {
			const t = this.credential.token;
			const ret = await Net.groupOwnerStopClass(t, this.liveSession.session_id);
			if (ret.code === 0) {
				this.selectLiveClass({classId: clssId, sequenceId: seqId}, {});
				this.setLiveSession( {session_id: null});
			}
		}
	}
	

	isActiveSession(clssId, seqId) {
		return 	this.liveSession &&
				this.liveSession.group_id === clssId &&
				this.liveSession.sequence_id === seqId;
	}
	
	formRowId(groupId, sequenceId) {
		return this.formClassElementId("yt_clssrow", groupId, sequenceId)
	}
	
	formButtonId(groupId, sequenceId) {
		return this.formClassElementId("yt_btn", groupId, sequenceId)
	}
	
	formClassElementId(type, groupId, sequenceId) {
		return `${type}_${groupId.toString()}_${sequenceId ? sequenceId.toString() :  ""}`;
	}
	
	/*
		if a session is alive for a class/sequence, high-light it 
		and change the button text to "stop this class".
	 */
	selectLiveClass(oldSelection, newSelection) {
		if (oldSelection.classId !== newSelection.classId ||
			oldSelection.sequenceId !== newSelection.sequenceId) {

			if (newSelection.classId) {
				const newRowId = '#' + this.formRowId(newSelection.classId, newSelection.sequenceId);
				$(newRowId).addClass(YT_CLASS_IS_LIVE);
				const newBtnId = "#" + this.formButtonId(newSelection.classId, newSelection.sequenceId);
				$(newBtnId).html(BTN_TEXT_STOP_SESSION);
			}
			
			if (oldSelection.classId) {
				const oldRowId = '#' + this.formRowId(oldSelection.classId, oldSelection.sequenceId);
				$(oldRowId).removeClass(YT_CLASS_IS_LIVE);
				
				const oldBtnId = "#" + this.formButtonId(oldSelection.classId, oldSelection.sequenceId);
				$(oldBtnId).html(BTN_TEXT_START_SESSION);
		
			}
		}
	}
}

let myGroupSubjectPageHandler = null;

$( document ).ready(async function() {
    console.log( "MyGroupSubject page ready!" );
	myGroupSubjectPageHandler = await MyGroupSubjectPageHandler.createMyGroupSubjectPageHandler()
});