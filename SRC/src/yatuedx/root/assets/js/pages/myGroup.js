import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan}                         from '../core/credential.js'
import {uiMan}                           from '../core/uiManager.js';
import {Net}                             from '../core/net.js';
import {getGroupCardHtml}				 from '../dynamic/groupCard.js';
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
		const ret = await Net.getMyGroup(t);
		if (ret.code === 0) {
			for(let i = 0; i < ret.data.length; i++) {
				const g = ret.data[i];
				$(".myGroupRow").append(getGroupCardHtml({id: g.id, name: g.name, type: 102}));
				const bntId = `#card_btn_${g.id}`;
				
				// still a valid member?
				if (g.credit > 0) {
					$( bntId ).click(this.handleEntering);
				}
				else {
					$( bntId ).text("付费加入");
					$( bntId ).click(this.handleRefill);
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
				const bntId = `#card_btn_${g.id}`;
				$(".publicGroupRow").append(getGroupCardHtml({id: g.id, name: g.name, type: g.type}));
				$( bntId ).text("申请加入");
				$( bntId ).click(this.handleJoining);
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
		// 
		// go to login page
		const groupName = $(this).attr('data-grp-name');
		window.location.href = `./legacy/chat.html??group=${groupName}`;
	}
	
	handleJoining(e) {
		e.preventDefault();
		alert('Joining:' + $(this).attr('id'));
	}
}

let myGroupPageHandler = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	myGroupPageHandler = new MyGroupPageHandler(credMan);
});