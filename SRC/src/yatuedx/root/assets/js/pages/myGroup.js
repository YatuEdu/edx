import {sysConstants, languageConstants, groupTypeConstants} from '../core/sysConst.js'
import {credMan}                         from '../core/credMan.js'
import {uiMan}                           from '../core/uiManager.js';
import {Net}                             from '../core/net.js';
import {getGroupCardHtml}				 from '../component/groupCard.js';
import {TimeUtil,StringUtil,PageUtil}	 from '../core/util.js';

/**
	This class manages all classesd the user belongs to
**/
class MyGroupPageHandler {
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
		await this.retrieveMyGroups(t);
		//await this.retrieveNewGroups(t, 10);
	}	
	
	/**
		retrieve the groups that I am registered with.
	 **/
	async retrieveMyGroups(t) {
		const ret = await Net.groupMemberGetMyGroups(t);
		if (ret.code === 0) {
			const myGroup = ret.data;
			this.sortGroupByTime(myGroup);
			for(let i = 0; i < myGroup.length; i++) {
				const g = myGroup[i];
				const  {joinBtnId, exeBtnId, html} = getGroupCardHtml(
							{id: g.id, 
							 name: g.name, 
							 type: g.type, 
							 owner: g.owner.trim(),
							 hasLiveSession: g.session_is_live,
							 dt: g.dt,
							 displayDate: g.displayDate,
							 displayTime: g.displayTime,
							});
				$(".myGroupRow").append(html);
				
				$( exeBtnId ).click(this.handleExercize);
				// still a valid member?
				if (g.s_credit || g.g_credit) {
					$( joinBtnId ).click(this.handleEntering);
				}
				else {
					$( buttonId ).text("Sign up for the group");
					$( buttonId ).click(this.handleRefill);
				}
			}
		}
	}
	
	sortGroupByTime(group) {
		if (group.length < 1) {
			return;
		}
		
		// sort by time in descending order
		group.sort( (g1, g2) => {
			if (!g1.begin_date && !g2.begin_date) {
				return 0;
			}
			if (g1.begin_date && !g2.begin_date) {
				return -1;
			}
			if (g2.begin_date && !g2.begin_date) {
				return 1;
			}
			
			// comparing date_time
			const t1 = Date.parse(g1.begin_date + ' ' + g1.begin_time);
			const t2 = Date.parse(g2.begin_date + ' ' + g2.begin_time);
			const tnorm1 = new Date(t1);
			const tmorm2 = new Date(t2);
			// side effect by setting displayable time format for the group member
			g1.dt = t1.toString();
			g2.dt = t2.toString();
			g1.displayDate = tnorm1.toDateString();
			g2.displayDate = tmorm2.toDateString();
			g1.displayTime = tnorm1.toLocaleTimeString();
			g2.displayTime = tmorm2.toLocaleTimeString();

			// comparing (early first)
			if (t1 < t2) {
				return -1;
			}
			return 1;
		});
	}
	
	/*
	async retrieveMyGroups(t, top) {
		const ret = await Net.getAllMyGroups(t, top);
		// append new groups
		if (ret.code === 0) {
			for(let i = 0; i < ret.data.length; i++) {
				const g = ret.data[i];
				const bntId = `#card_btn_${g.secId}`;
				$(".publicGroupRow").append(getGroupCardHtml({id: g.secId, name: g.name, type: g.type}));
				$( bntId ).text("申请加入");
				$( bntId ).click(this.handleJoining.bind(this));
			}
		}
	}
	*/
	
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

let myGroupPageHandler = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	myGroupPageHandler = new MyGroupPageHandler(credMan);
});