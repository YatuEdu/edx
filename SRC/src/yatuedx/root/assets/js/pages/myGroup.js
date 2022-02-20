import {sysConstants, languageConstants, groupTypeConstants} from '../core/sysConst.js'
import {credMan}                         from '../core/credMan.js'
import {uiMan}                           from '../core/uiManager.js';
import {Net}                             from '../core/net.js';
import {getGroupCardHtml}				 from '../component/groupCard.js';
import {StringUtil, PageUtil}			 from '../core/util.js';

/**
	This class manages both login and sigup workflow
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
		await this.retrieveNewGroups(t, 10);
	}	
	
	async retrieveMyGroups(t) {
		const ret = await Net.groupMemberGetMyGroups(t);
		if (ret.code === 0) {
			for(let i = 0; i < ret.data.length; i++) {
				const g = ret.data[i];
				const  {buttonId, html} = getGroupCardHtml(
							{id: g.id, 
							 name: g.name, 
							 type: g.type, 
							 owner: g.owner.trim(),
							 hasLiveSession: g.session_is_live
							});
				$(".myGroupRow").append(html);
				
				// still a valid member?
				if (g.credit > 0) {
					$( buttonId ).click(this.handleEntering);
				}
				else {
					$( buttonId ).text("付费加入");
					$( buttonId ).click(this.handleRefill);
				}
			}
		}
	}
	
	async retrieveNewGroups(t, top) {
		const ret = await Net.getNewGroups(t, top);
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
	
	handleRefill(e) {
		e.preventDefault();
		alert('entering:' + $(this).attr('data-grp-name') + ":" + $(this).attr('data-grp-type'));
	}
	
	/**
		Enter the video chat group if applicable
	**/
	handleEntering(e) {
		e.preventDefault();
		const groupId = $(this).attr('data-grp-id');
		const groupName = $(this).attr('data-grp-name');
		// go to class room
		const groupType = $(this).attr('data-grp-type');
		const groupOwner = $(this).attr('data-grp-owner');
		
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
			alert('申请已经发送， 待批准');
		}
		else{
			alert('错误码： ' + ret.code);
		}
	}
	
	
}

let myGroupPageHandler = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	myGroupPageHandler = new MyGroupPageHandler(credMan);
});