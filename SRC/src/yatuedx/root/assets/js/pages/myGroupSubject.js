import {sysConstants, languageConstants, groupTypeConstants} from '../core/sysConst.js'
import {credMan}                         from '../core/credMan.js'
import {uiMan}                           from '../core/uiManager.js';
import {Net}                             from '../core/net.js';
import {getGroupCardHtml}				 from '../component/groupCard.js';
import {TimeUtil,StringUtil,PageUtil}	 from '../core/util.js';

const MY_CLASS_TEMPLATE_ROW = `
<div class="row mb-1">
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
  <button class="btn btn-rounded btn-outline-primary translatable" 
		  data-clss-id="{grpid}" 
		  data-seq-id="{seqid}">Start an on-line class now</button>
 </div>
</div>
`;

const REPLACEMENT_GROUP_ID = '{grpid}';
const REPLACEMENT_SEQUENCE_ID = '{seqid}';
const REPLACEMENT_CLASS_NAME = '{clss}';
const REPLACEMENT_SUBJECT_NAME = '{sub}';
const REPLACEMENT_SEQUENCE_NAME = '{seq}';

/**
	This class manages all classesd the user belongs to
**/
class MyGroupSubjectPageHandler {
	#credMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	async init() {
		// get top 10 groups that I can join
		// remote call to sign up
		const t = this.#credMan.credential.token;
		await this.retrieveMyClasses(t);
	}	
	
	/**
		retrieve the groups that I am registered with.
	 **/
	async retrieveMyClasses(t) {
		const ret = await Net.groupOwnerListClasses(t);
		if (ret.code === 0) {
			const myClasses = ret.data;
			for(let i = 0; i < myClasses.length; i++) {
				const clss = myClasses[i];
				const  html = MY_CLASS_TEMPLATE_ROW
								.replace(REPLACEMENT_GROUP_ID, clss.group_id)
								.replace(REPLACEMENT_SEQUENCE_ID, clss.sequence_id)
								.replace(REPLACEMENT_CLASS_NAME, clss.class_name)
								.replace(REPLACEMENT_SUBJECT_NAME, clss.class_subject)
								.replace(REPLACEMENT_SEQUENCE_NAME, clss.sequence_name);
								
				$(".mySubjectSequenceRow").append(html);
			}
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
	
	
}

let myGroupSubjectPageHandler = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	myGroupSubjectPageHandler = new MyGroupSubjectPageHandler(credMan);
});