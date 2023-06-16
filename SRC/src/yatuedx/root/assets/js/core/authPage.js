import {credMan} 							from './credMan.js'
import {Net}                    			from './net.js';
import {TimeUtil} 							from './util.js'
import {GroupWebSocket}						from '../component/groupTextCommunication.js';
import {LocalStoreAccess} 					from '../core/localStorage.js';
import {sysConstants, groupTypeConstants} 	from '../core/sysConst.js'

/**
	
	Mother of all Yatu pages for authentication purpose.
	
 **/
class AuthPage {
	#groupWebSocketMap;
	#loggedIn;
	#store
	#liveSession
	
	constructor(publicOk) {
		this.#store =  new LocalStoreAccess(sysConstants.YATU_OWNER_STORE_KEY);
	}
	
	/**
		Check if we are loggin in
	 **/
	 async init(publicOk) {
		this.#loggedIn = await credMan.hasLoggedIn();
		if (!this.#loggedIn && !publicOk) {
			// go to login page (todo: append target url): extract the file name
			window.location.href = "./login.html";
		}
		
		if (this.#loggedIn) {
			await this.initGroups();
		}
	 }
	
	/**
		Get all my live communication sessions
	**/
	async initGroups() {
		// need to go to the video chat window now?
		let willGotoLiveClass = true;
		let liveClass = this.liveSession;
			
		// live chat page can skip the following logic
		if (liveClass && this.v_isLiveChatPage() ) {
			return;
		}
		
		if (liveClass) {
			if (this.gotoLiveClass(liveClass)) {
				return;
			}
			willGotoLiveClass = false;
		}
			
		
		this.#groupWebSocketMap = new Map();
		const t = credMan.credential.token;
		
		const ret = await Net.groupMemberListLiveSessions(t);
		
		/* ret json format:
			string: 	session_id,
			string:		owner_name,
			string: 	subject_name,
			int:		group_id,
			int     	sequence_id,
			tinyint: 	group_type  
			Date:		creationTime
		*/
		
		if (ret.code === 0) {
			const myGroupSessions = ret.data;
		
			// find the live chat class
			liveClass = myGroupSessions.find(s => s.sequence_id != null);
			// save live class if there
			if (liveClass) {
				// also serialize the live session info for across page visibility
				liveClass.creationTime = Date.now();
				const liveClassStr = JSON.stringify(liveClass);
				this.#store.setItem(liveClassStr);
				// open another tab for live class
				if (willGotoLiveClass) {
					willGotoLiveClass = this.gotoLiveClass(liveClass);
				}
			} 
			
			if (!willGotoLiveClass) {
				// obtain non-live groups for group communication
				myGroupSessions.forEach(groupSession => {
					// Join WebSocket group one by one
					const groupWebSocket = new GroupWebSocket(groupSession,
															  this.groupMessageHandler.bind(this));
					this.#groupWebSocketMap.set(groupSession.group_id, groupWebSocket);
				});
			}
		}
	}
	
	/*
		virtual functions
	 */
	 
	/*
		is this page is live chat page, we don't need to call initGroups logic
	 */
	v_isLiveChatPage() {
		return false;
	}
	
	/*
		handleMessage from groupSessionInfo
	 */
	groupMessageHandler(groupSessionInfo, cmdObject) {
		alert ('get message from ' + groupSessionInfo.group_id);
	}
	
	deserializeLiveClassFromStore() {
	}
	
	gotoLiveClass(liveClass) {
		// go to the live class window
		console.log('go to live class ' + liveClass.group_id);
		const gotoClass = confirm('You have a live class going on. Do you want to go to the classroom?');
		if (gotoClass) {
			if (liveClass.group_type == groupTypeConstants.GPT_EDU_JSP) {
				if (this.credential.name.trim() === liveClass.owner_name.trim()) {
					// go to class room as teacher
					window.location.href =  `./class-room-teacher.html`;
				}
				else {
					// go to class room as student
					window.location.href =  `./class-room.html`;				
				}
			}
			else {
				// go to chat page
				window.location.href =  `./legacy/videoChat.html?group=${groupId}`; 
			};
		}
		
		return gotoClass;
	}
	
	/* Properties */
	
	get loggedIn() {
		return this.#loggedIn;
	}
	
	get credential() {
		return credMan.credential;
	}
	
	get liveSession() {
		const itemStr = this.#store.getItem();
		if (itemStr && itemStr != "null") {
			this.#liveSession = JSON.parse(this.#store.getItem());
			
			// check if the live class is stale (after 10 minutes)
			const diff = this.#liveSession.creationTime ? TimeUtil.diffMinutes(this.#liveSession.creationTime, Date.now())
						 :
						 sysConstants.YATU_TOKEN_VALID_IN_MIN + 1;
			if ( diff > sysConstants.YATU_TOKEN_VALID_IN_MIN) {
				this.#liveSession = null;
				this.#store.setItem(null)
			}
			
		} else {
			this.#liveSession = null;
		}
		
		return this.#liveSession;
	}
}

export {AuthPage};
