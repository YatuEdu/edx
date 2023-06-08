import {sysConstants, languageConstants, groupTypeConstants} from '../core/sysConst.js'
import {credMan}                         from '../core/credMan.js'
import {LocalStoreAccess} 				 from '../core/localStorage.js';
import {uiMan}                           from '../core/uiManager.js';
import {Net}                             from '../core/net.js';
import {getGroupCardHtml}				 from '../component/groupCard.js';
import {TimeUtil,StringUtil,PageUtil}	 from '../core/util.js';

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
class MyGroupSubjectPageHandler {
	#credMan;
	#activeSessionInfo;
	#store
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#store =  new LocalStoreAccess(sysConstants.YATU_OWNER_STORE_KEY);
		if (this.#store.getItem()) {
			/* live session info struct is
			{ session_id: '1234567',
			  sequence_id: 23456,    // not from DB by managed by client
			    group_id: 123456,
				owner_id: 'ly8838',
			  group_type: 10
			}
			*/
			this.#activeSessionInfo = JSON.parse(this.#store.getItem());
		} else {
			this.#activeSessionInfo = {};
		}
		this.init();
	}
	
	// hook up events
	async init() {
		// get top 10 groups that I can join
		// remote call to sign up
		const t = this.#credMan.credential.token;
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
			
			if (this.#activeSessionInfo.group_id) {
				this.selectLiveClass({}, {classId: this.#activeSessionInfo.group_id, sequenceId: this.#activeSessionInfo.sequence_id} );
			}	
		} else {
			alert("Failed to retieve your classes!");
		}
	}
	
	/**
		retrieve the live session I started.
	 **/
	async retrieveMyLiveSession(t) {
		const ret = await Net.groupMemberListLiveSessions(t);
		if (ret.code === 0) {
			const mySessions = ret.data;
			
			// I am not allowed to be in different live sessons at the same time
			if (myClasses.length > 1) {
				alert("You cannot be in multiple sessions at the same time.  Stop all sessions but one!");
				return;
			}
			
			// no active sessions for this teacher, clear previous active session info
			if (myClasses.length === 0) {
				this.#store.setItem("");
				return;
			}
			
			const liveSession = myClasses[i];
			const authStr = JSON.stringify(liveSession);
			this.#store.setItem(authStr);
		} else {
			alert("Failed to retieve active sessions!");
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
		Enter the video chat group if applicable
	**/
	handleEntering(e) {
		e.preventDefault();
		
		// retrieve group meta data
		const groupId = $(this).attr('data-grp-id');
		const groupName = $(this).attr('data-grp-name');
		const groupType = $(this).attr('data-grp-type');
		const groupOwner = $(this).attr('data-grp-owner');
		const startTimeStr =  $(this).attr('data-grp-dt');
		if (startTimeStr) {
			const startTime =Number(startTimeStr);
			// only allowed to going 10 minutes before a class starts
			const diffInMinutes = TimeUtil.diffMinutes(Date.now(), startTime);
			if (diffInMinutes > 10) {
				alert("The group will be open 10 minutes before it starts");
				return;
			}
			if ( diffInMinutes < -20) {
				alert("You are too late to join this class! Try to be punctual next time.");
				return;
			}
		}
		// check 
		if (groupType == groupTypeConstants.GPT_EDU_JSP) {
			if ( (credMan.credential.role === sysConstants.YATU_ROLE_TEACHER || 
				  credMan.credential.role === sysConstants.YATU_ROLE_ADMIN ) && 
				  credMan.credential.name === groupOwner ) {
				// go to class room as teacher
				window.location.href =  `./class-room-teacher.html?group=${groupId}`;
			}
			else {
				// go to class room as student
				window.location.href =  `./class-room.html?group=${groupId}&teacher=${groupOwner}`;				
			}
		}
		else {
			// go to chat page
			window.location.href =  `./legacy/videoChat.html?group=${groupId}`; 
		}
								   //`./videoChat.html`;

		// `./legacy/chat.html??group=${groupId}`;
	}
	
	async handleJoining(e) {
		e.preventDefault();
		
		// call remote API to apply for the membership
		const t = this.#credMan.credential.token;
		const btnId = $(e.target).attr('id');
		const ret = await Net.applyForAGroup(t, StringUtil.getIdFromBtnId(btnId));
	
		if (ret.code == 0) {
			alert('Pending approval...');
		}
		else{
			alert('Error code： ' + ret.code);
		}
	}
	
	async startClass(clssId, seqId) {
		const newSelection = {classId: clssId, sequenceId: seqId};
		let oldSelection = {};
		// need to stop the active live session?
		if (!this.isActiveSession(clssId, seqId)) {
			const answer = confirm('You need to stop an active class session first. Do you want to do that?');
			if (!answer) {
				return;
			}
			oldSelection = {classId: this.#activeSessionInfo.group_id, sequenceId: this.#activeSessionInfo.sequence_id}
			await this.stopClass(this.#activeSessionInfo.group_id, this.#activeSessionInfo.sequence_id);	
		}
		
		// Start a new class
		const t = this.#credMan.credential.token;
		const ret = await Net.groupOwnerStartClass(t, clssId, seqId);
		if (ret.code === 0) {
			const mySessionInfo = ret.data[0];
			this.setActiveSessionInfo(mySessionInfo.session_id, clssId, seqId, mySessionInfo.group_type);
			
			// Switch UI Highlight
			this.selectLiveClass(oldSelection, newSelection);
		}
	}
	
	async stopClass(clssId, seqId) {
		const t = this.#credMan.credential.token;
		const ret = {code: 0}; // await Net.groupOwnerStopClass(t, clssId, seqId);
		if (ret.code === 0) {
			this.setActiveSessionInfo(null, 0, 0, 0)
		}
	}
	
	setActiveSessionInfo(sessionId, clssId, seqId, type) {
		this.#activeSessionInfo.session_id = sessionId;
		this.#activeSessionInfo.group_id = clssId;
		this.#activeSessionInfo.sequence_id = seqId;
		this.#activeSessionInfo.group_type = type;
		
		// save the live class info
		const sessionInfoStr = JSON.stringify(this.#activeSessionInfo);
		this.#store.setItem(sessionInfoStr);
	}
	
	isActiveSession(clssId, seqId) {
		return 	this.#activeSessionInfo.session_id &&
				this.#activeSessionInfo.group_id === clssId &&
				this.#activeSessionInfo.sequence_id === seqId;
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

			const newRowId = '#' + this.formRowId(newSelection.classId, newSelection.sequenceId);
			$(newRowId).addClass(YT_CLASS_IS_LIVE);
			const newBtnId = "#" + this.formButtonId(newSelection.classId, newSelection.sequenceId);
			$(newBtnId).html(BTN_TEXT_STOP_SESSION);
			
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

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	myGroupSubjectPageHandler = new MyGroupSubjectPageHandler(credMan);
});