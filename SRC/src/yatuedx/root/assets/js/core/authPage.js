import {credMan} 											from './credMan.js'
import {Net}                    							from './net.js';
import {TimeUtil} 											from './util.js'
import {GroupWebSocket}										from '../component/groupTextCommunication.js';
import {LocalStoreAccess} 									from '../core/localStorage.js';
import {sysConstants, sysConstStrings, groupTypeConstants} 	from '../core/sysConst.js'

const CLASS_ROOM_MAP = 
	new Map([
			 ['10_TEACHER', './class-room-owner.html'], 
			 ['13_TEACHER', './class-room-owner.html'], 
			 ['10_STUDENT', './class-room.html'], 
			 ['13_STUDENT', './class-room.html'],
			 ['100_TEACHER', './class-room-owner.html'],
			 ['100_STUDENT', './class-room-owner.html']	 
	]);

/**
	
	Mother of all Yatu pages for authentication purpose.
	
 **/
class AuthPage {
	#groupWebSocketMap;
	#loggedIn;
	#store
	#liveSession
	
	constructor() {
		this.#store =  new LocalStoreAccess(sysConstants.YATU_CHAT_GROUP_STORE_KEY);
		this.validateLiveSession();
	}
	
	/**
		Check if we are logged in
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
			
		// need to go to the live session if any?
		let willGotoLiveClass = true;

		// live chat page can skip the following logic
		if (this.v_isLiveChatPage() ) {
			return;
		}
		
		if (this.liveSession) {
			if (this.gotoLiveClass(this.liveSession)) {
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
			const liveClass = myGroupSessions.find(s => s.sequence_id != null);
			// save live class if there
			if (liveClass) {
				// also serialize the live session info for across page visibility
				this.setLiveSession(liveClass);

				// open another tab for live class
				if (willGotoLiveClass) {
					willGotoLiveClass = this.gotoLiveClass(liveClass);
				}
			} else {
				willGotoLiveClass = false;
				// clear up local storage for old session info
				this.setLiveSession( {session_id: null});
			} 
			
			if (!willGotoLiveClass) {
				// obtain non-live groups for group communication
				myGroupSessions.forEach(groupSession => {
					if (groupSession.sequence_id === null) {
						// Join WebSocket group one by one
						const groupWebSocket = new GroupWebSocket(groupSession,
																  this.groupMessageHandler.bind(this));
						this.#groupWebSocketMap.set(groupSession.group_id, groupWebSocket);
					}
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
	async groupMessageHandler(message) {
		console.log('Received message:' + message);
		if (message.includes(sysConstStrings.TEACHER_CLASS_STARTED)) {
			this.#liveSession = null;
			this.#store.setItem(null);
			await this.initGroups();
		} else {
			alert (message);
		}
	}
	
	gotoLiveClass(liveClass) {
		// go to the live class window
		console.log('go to live class ' + liveClass.group_id);
		const gotoClass = confirm('You have a live class going on. Do you want to go to the classroom?');
		if (gotoClass) {
			// map group type to different classrooms
			let role = this.credential.name === liveClass.owner_name ? 'TEACHER' : 'STUDENT';
			switch (liveClass.group_type) {
				case groupTypeConstants.GPT_EDU_JSP:
				case groupTypeConstants.GPT_EDU_JSP_NODE:
				case groupTypeConstants.GPT_EDU_GENERIC_PRESENTATION:
					const key = `${liveClass.group_type}_${role}`
					window.location.href = CLASS_ROOM_MAP.get(key);
					break;

				default:
					window.location.href = './legacy/videoChat.html';
			}
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
	
	
	validateLiveSession() {
		const itemStr = this.#store.getItem();
		if (itemStr && itemStr != "null") {
			this.#liveSession = JSON.parse(itemStr);
			
			// check if the live class is stale (after 3 minutes)
			const diff = this.#liveSession.creationTime ? TimeUtil.diffMinutes(this.#liveSession.creationTime, Date.now())
						 :
						 sysConstants.YATU_LIVE_SESSION_VALID_IN_MIN + 1;
			if ( diff > sysConstants.YATU_LIVE_SESSION_VALID_IN_MIN) {
				this.#liveSession = null;
				this.#store.setItem(null)
			}
			
		} else {
			this.#liveSession = null;
		}

		return this.#liveSession;
	}

	get liveSession() {
		return this.#liveSession;
	}

	setLiveSession(newSession) {
		if (newSession.session_id) {
			newSession.creationTime = Date.now();
			const liveClassStr = JSON.stringify(newSession);
			this.#store.setItem(liveClassStr);
			this.#liveSession = newSession;
		} else {
			this.#store.setItem(null);
			this.#liveSession = null;
		}
	}

	/**
	 * Group owner sends messages to the group memebers who are online.
	 * 
	 * @param {} groupId 
	 * @param {*} message 
	 */
	sendGroupTextMessage(groupId, message) {
		const groupWS = this.#groupWebSocketMap.get(groupId);
		if (groupWS) {
			groupWS.sendGroupTextMessage(message);
		}
	}
}

export {AuthPage};
