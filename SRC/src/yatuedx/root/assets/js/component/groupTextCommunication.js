import {CommClient} 				from "../communication/commClient.js";
import {PTCC_COMMANDS}				from '../command/programmingClassCommand.js'
import {IncomingCommand} 			from '../command/incomingCommand.js';
import {OutgoingCommand} 			from 	'../command/outgoingCommand.js';
import {sysConstants, uiConstants}	from "../core/sysConst.js"
import {Net}			    		from "../core/net.js"
import {credMan}					from "../core/credMan.js"


/**
This class (CommunicationSpace) serves as utility class for web socket communication based text communication.	
 **/
class GroupWebSocket {  
	#groupSessionInfo /* groupSession.group_id, 
					     groupSession.subject_name, 
					     groupSession.session_id
						 groupSession.sequence_id */
	#messageHander
	#commClient;
	#me;
	
	/*
		GroupTextCommunication instance represents a communicaton socket for a specifc group.
		Parameters:
			groupId: id of a group
			roomName: a group session id
			messageHander: an action functor, its signature: 
			 (String groupName, IncomingCommand cmd) -> {})
	 */
	constructor(groupSessionInfo, messageHander) {
		this.#groupSessionInfo 	= groupSessionInfo;
		this.#messageHander     = messageHander;
		this.init(groupSessionInfo.session_id);
		
	}
	
	async init(room) {
		const token = credMan.credential.token;
		this.#me  = credMan.credential.name;
		
		// create the communication client to handle p2p commuinication
		this.#commClient = new CommClient(sysConstants.YATU_SOCKET_URL, token, this.#me, room); 
		
		this.#commClient.onReady = this.handleCommunicationReady.bind(this);

        this.#commClient.onPublicMsg = this.handleMessage.bind(this);

        this.#commClient.onPrivateMsg = this.handleMessage.bind(this);

        this.#commClient.onUserJoin = this.handleNewUser.bind(this);

        this.#commClient.onUserLeave = this.handleUserLeaving.bind(this);

        this.#commClient.onUserList = this.handleUserList.bind(this);
	}

	sendGroupTextMessage(message) {
		this.#commClient.sendPublicMsg(message);
	}
	
	/**	
		Handle p2p messages by interpretting it as command and do things accordingly
	**/
	handleMessage(sender, msg) {
		//const cmdObject = new IncomingCommand(msg, sender);
		
		// the derived class execute this command on UI
		this.#messageHander(msg);
	}
	
	/**
		Obtain current user list after we successfully joined the group
	 **/
	handleCommunicationReady() {
		const uList = this.#commClient.getUserList();
	}
	
	/*
	 */
	 handleNewUser(user) {
		// toto
		console.log('User joined: ' + user);
	 }
	 
	 /*
	 */
	 handleUserLeaving(user) {
		// todo:
		console.log('User left: ' + user);
	 }
	 
	 /*
	 */
	 handleUserList(userList) {
		// todo:
		console.log('User list: ' + userList.length);
		userList.forEach(u => console.log('user: ' + u.userName ) );
	 }
}


export { GroupWebSocket };