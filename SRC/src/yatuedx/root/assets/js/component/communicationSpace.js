import {CommClient} 		from "../communication/commClient.js";
import {IncomingCommand} 	from '../command/incomingCommand.js';
import {sysConstants}		from "../core/sysConst.js"
import {Net}			    from "../core/net.js"
import {credMan}			from "../core/credMan.js"

/**

	This class (CommunicationSpace) serves as the root class for the communication room, and specifically, 
	our	programming classroom.
	
	The concrete class room shall derive and inherit from it to obtain the communcation	basics this class offers.
	
 **/
class CommunicationSpace {  
	_cmdObject;
	_commClient;
	
	constructor(roomName) {
		this.init(roomName);
	}
	
	/**
		Initializing the socket client and get ready for communication between classmates and teacher
	 **/
	async init(roomName) {
		const token = credMan.credential.token;
		const name  = credMan.credential.name;
			
		// call API to get room
		const ret = await Net.groupMemberJoiningSession(token, roomName);
		if (ret.err) {
			alert('Failed to enter room');
			return;
		}
		
		// create the communication client to handle p2p commuinication
		const room = ret.data[0].session_id;
		this._commClient = new CommClient(sysConstants.YATU_SOCKET_URL, token, name, room); 
		
		this._commClient.onReady = () => {
            this._commClient.getUserList();
        };

        this._commClient.onPublicMsg = this.handleMessage.bind(this);

        this._commClient.onPrivateMsg = this.handleMessage.bind(this);

        this._commClient.onUserJoin = this.handleNewUser.bind(this);

        this._commClient.onUserLeave = this.handleUserLeaving.bind(this);

        this._commClient.onUserList = this.handleUserList.bind(this);
	}
	
	/**	
		Handle p2p messages by interpretting it as command and do things accordingly
	**/
	handleMessage(sender, msg) {
		const cmdObject = new IncomingCommand(msg, sender);
		
		// the derived class execute this command on UI
		this.v_execute(cmdObject);
	}

	/**	
		Handle the event that represents the arrival of a new user
	**/
	handleNewUser(user) {
		// todo:
		console.log('User joined: ' + user);
	}
	
	/**	
		Handle the event that represents the leaving of a joined user
	**/	
	handleUserLeaving(user) {
		// todo:
		console.log('User left: ' + user);
	}
	
	/**	
		Handle the event that represents the reveiving of a user list for all the users
		that are currently joined.
	**/
	handleUserList(userList) {
		// todo:
		console.log('User list: ' + userList.length);
	}
	
	/**	
		Execute command sent by peers. Derived class must override it.
	**/	
	v_exe(cmdObject) {
		throw new Error('v_exe: sub-class-should-overload-this method'); 
	}
}

export { CommunicationSpace };