import {CommClient} 				from "../communication/commClient.js";
import {VideoClient} 				from "../communication/videoClient.js"
import {PTCC_COMMANDS}				from '../command/programmingClassCommand.js'
import {IncomingCommand} 			from '../command/incomingCommand.js';
import {OutgoingCommand} 			from 	'../command/outgoingCommand.js';
import {sysConstants, uiConstants}	from "../core/sysConst.js"
import {Net}			    		from "../core/net.js"
import {credMan}					from "../core/credMan.js"
import {VideoUtil} 					from "../core/videoUtil.js";
import {StringUtil, UtilConst}		from '../core/util.js'

const REPLACE_PID = '{pid}';
const REPLACE_PID_TEMPLATE = '{pidtmplt}';

const VIDEO_TEMPLATE = `
<video class="yt-video-any yt-video" id="{pidtmplt}{pid}" autoplay playsinline>`;

/**

	This class (CommunicationSpace) serves as the root class for the communication room, and specifically,
	our	programming classroom.

	The concrete class room shall derive and inherit from it to obtain the communcation	basics this class offers.

 **/
class CommunicationSpace {
	#commClient;
	#videoClient;
	#videoTrack;
	#audioTrack;
	#userVideoIdTemplate
	#userMap;
	#videoDivId;
	#screenShareBtnId
	#me;

	constructor(videoDivId, screenShareBtnId) {
		this.#userVideoIdTemplate = uiConstants.VIDEO_ID_TEMPLATE;
		this.#videoDivId = videoDivId;
		this.#screenShareBtnId = screenShareBtnId;
		this.#userMap = new Map();
	}

	/**
		Initializing the socket client and get ready for communication between classmates and teacher
	 **/
	async init(liveSession) {
		const token = credMan.credential.token;
		this.#me  = credMan.credential.name;

		// call API to get room
		/* todo: revisit the logic for "scheduled class".  For now, we only deal with teacher started class,
		          whose room is known.

		const groupSession = await Net.groupMemberJoiningSession(token, roomName);
		if (groupSession.err) {
			alert('Failed to enter room');
			return;
		}
		*/

		// initialize video
		let tracks = null;
		try {
			tracks = await VideoUtil.getLocalMediaTracks(true, true);
			this.#audioTrack = tracks[0];
			this.#videoTrack = tracks[1];
			if(this.#videoTrack!=null) {
				this.handleRemoteVideoTrack(this.#me, this.#videoTrack);
			}
		} catch (e) {
			alert('Failed to initialize viedo tracks');
		}

		// create the communication client to handle p2p commuinication
		this.#commClient = new CommClient(sysConstants.YATU_SOCKET_URL, token, this.#me, liveSession.session_id);

		this.#commClient.onReady = this.handleCommunicationReady.bind(this);

        this.#commClient.onPublicMsg = this.handleMessage.bind(this);

        this.#commClient.onPrivateMsg = this.handleMessage.bind(this);

        this.#commClient.onUserJoin = this.handleNewUser.bind(this);

        this.#commClient.onUserLeave = this.handleUserLeaving.bind(this);

        this.#commClient.onUserList = this.handleUserList.bind(this);

		this.#commClient.onClose = this.handleClose.bind(this);
	}

	/**
		Initialize Video client after we successfully joined the group
	 **/
	handleCommunicationReady() {

		const uList = this.#commClient.getUserList();

		// If we do not need video for the communication board
		////if (!this.#videoDivId) {
		//	return;
		//}

		/*
			If we need video for the communication board, create video client
		*/
		if (this.#videoTrack || this.#audioTrack) {
			this.#videoClient = new VideoClient(this.#commClient, this.#audioTrack , this.#videoTrack);

			// 收到音频轨道或视频轨道，需要放在MediaStream对象中
			// 如果音视频轨道放在同一个MediaStream对象中，会进行音视频同步，否则独立播放
			// 这里展示独立播放
			this.#videoClient.onRemoteVideoTrack = this.handleRemoteVideoTrack.bind(this);
			this.#videoClient.onRemoteAudioTrack = this.handleRemoteAudioTrack.bind(this);
		}

        // 下面是屏幕共享的方法
		if (this.screenShareBtnId) {
			$(this.screenShareBtnId).click(async e => {
				let shareTrack = await VideoUtil.getScreenShareTrack();
				if (shareTrack!=null) {
					$(this.screenShareBtnId).disabled = true;
					this.#videoClient.setLocalVideoTrack(shareTrack);

					shareTrack.addEventListener('ended', () => {
						console.log('用户停止共享屏幕 这里切换回摄像头视频');
						this.#videoClient.setLocalVideoTrack(this.#videoTrack);
						$(this.screenShareBtnId).disabled = false;
					});
				}
			});
		}
	}

	/**
		Compose content update message based on how content is updated
	**/
	composeContentUpateMsg(codeUpdateObj) {
		let cmd = null;
		switch (codeUpdateObj.flag) {
			case UtilConst.STR_CHANGE_NON:
				// do nothing
				break;

			case UtilConst.STR_CHANGE_APPEND:
			case UtilConst.STR_CHANGE_PREPEND:
				cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE, 	// command id
										codeUpdateObj.flag,							// uopdate flag
										codeUpdateObj.delta);						// update content
				break;

			case UtilConst.STR_CHANGE_DELETE_END:
			case UtilConst.STR_CHANGE_DELETE_BEGIN:
				cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE, 	// command id
										codeUpdateObj.flag,							// uopdate flag
										codeUpdateObj.length); 						// update length
				break;

			case UtilConst.STR_CHANGE_MIDDLE:
				cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE, 	// command id
										codeUpdateObj.flag,							// uopdate flag
										codeUpdateObj.delta, 						// update content
										codeUpdateObj.begin,    					// update range: begin
										codeUpdateObj.end);							// update range: end
				break;

			default:
				break;
		}

		if (cmd && codeUpdateObj.digest) {
			// also append message digest if any
			cmd.pushData(codeUpdateObj.digest);
		}

		return cmd;
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
		Handle a new peer viedo added remotely
	**/
	handleRemoteVideoTrack(user, videoTrack) {
		// let child class control the visibility of this user
		if (!this.v_isUserVisible(user)) {
			return;
		}

		const mediaStream = new MediaStream();
		mediaStream.addTrack(videoTrack);

		const videoTagStr = VIDEO_TEMPLATE
							.replace(REPLACE_PID_TEMPLATE, this.#userVideoIdTemplate)
							.replace(REPLACE_PID, user);
		const videoElement = $(videoTagStr)[0];

		//
		// If user has a video area, use it, otherwise add a new one
		// this is to prevent multiple video areaq in the situation of
		// user's reconnection after loss of connection
		//
		const userSelector = `#${this.#userVideoIdTemplate}${user}`;
		if ($(this.videoAreaDiv).find(userSelector).length === 0) {
			$(this.videoAreaDiv).append(videoElement);
		}
		videoElement.srcObject = mediaStream;

		// Keep tract of all user and its video/audio tags
		let userObj = this.#userMap.get(user);
		if (userObj != null ) {
			userObj.videoTag = videoElement;
		}
		else {
			this.#userMap.set(user, {videoTag: videoElement});
		}
	}

	/**
		Handle a new peer audio added remotely
	**/
	handleRemoteAudioTrack(user, audioTrack) {
		let mediaStream = new MediaStream();
		mediaStream.addTrack(audioTrack);

		const audioCtrlId = $("<audio autoplay>")[0];
		// audioTag.attr("autoplay", "autoplay");
		$('body').append(audioCtrlId);
		audioCtrlId.srcObject = mediaStream;

		// 这里保存标签，只是为了后面可以移除
		let userObj = this.#userMap.get(user);
		if (userObj != null ) {
			userObj.audioTag = audioCtrlId;
		}
		else {
			this.#userMap.set(user, {audioTag: audioCtrlId});
		}
	}

	/**
		Handle the event that represents the arrival of a new user:
		音视频会话必须规定一个发起者，一个接收者。
		这里采用这种方式：旧用户主动发起会话，新用户被动接受
		因此在用户加入房间时，主动共享自己的音视频轨道
		具体场景可以灵活安排
	**/
	handleNewUser(user) {
		console.log('User joined: ' + user);
		// Start receiving a new user's video (if the user is a teacher)
		// TODO: decide if the user is teacher
		if (this.#videoClient) {
			this.#videoClient.startShare(user, true);
		}

		// Child component needs to handle new user arrival event
		const cmdObject = new OutgoingCommand(PTCC_COMMANDS.PTC_STUDENT_ARRIVAL, user);
		this.v_execute(cmdObject);
	}

	/**
		Handle the event that represents the leaving of a joined user.
		Remove its video / autio tracks
	**/
	handleUserLeaving(user) {
		// todo:
		console.log('User left: ' + user);

		// 停止共享本地音视频
		if (this.#videoClient) {
			this.#videoClient.stopShare(user);
		}
        let userObj = this.#userMap.get(user);
		if (userObj != null) {
			if (userObj.videoTag !=null) {
				userObj.videoTag.remove();

			}
			if (userObj.audioTag !=null) {
				userObj.audioTag.remove();

			}
			this.#userMap.delete(user);
		}

		// Child component needs to handle user leaving event
		const cmdObject = new OutgoingCommand(PTCC_COMMANDS.PTC_STUDENT_LEAVE, user);
		this.v_execute(cmdObject);
	}

	/**
		Send message to entire group
	**/
	sendMessageToGroup(msgStr) {
		this.#commClient.sendPublicMsg(msgStr);
	}

	/**
		Send message to a user
	**/
	sendMessageToUser(user, msgStr) {
		if (msgStr) {
			this.#commClient.sendPrivateMsg(user, msgStr);
			return true;
		}
		return false;
	}

	/**
		Handle the event when the user closing this window: close the videom/ausio sharing
	**/
	closeWinodw() {
		this.handleUserLeaving(credMan.credential.name);
	}

	/**
		Handle the event that represents the reveiving of a user list for all the users
		that are currently joined.
	**/
	handleUserList(userList) {
		// todo:
		console.log('User list: ' + userList.length);
		// handle all existing user
		// Child component needs to handle new user arrival event
		const cmdObject = new OutgoingCommand(PTCC_COMMANDS.PTC_USER_LIST, userList);
		this.v_execute(cmdObject);
	}

	/**
	 The network is disconnected, wu should disconnect all users,
	 connect again and establish new connections one by one
	 **/
	handleClose() {
		console.log('Communication close');
		for(let item of this.#userMap) {
			let user = item[0];
			if (user!=this.#me) {
				this.handleUserLeaving(user);
			}
		}
	}

	/**
	  ask for a user to re-syncronize message with me
	 **/
	askReSync(user) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_RE_SYNC, 	// command id
										0);										    // uopdate flag
		this.sendMessageToUser(user, cmd.str);
	}

	/**
		Send code sample to one person who requested for it, whose code is out of sync.
		Update thereceiver's board by replacing the entire board content.
	 **/
	syncCodeWithRequester(codeStr, targetUser) {
		const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_DISPLAY_BOARD_UPDATE,
										UtilConst.STR_CHANGE_ALL,
										codeStr,
										'');		// no digest needed in this case
		this.sendMessageToUser(targetUser, cmd.str);
		console.log('send re-syned code:' + codeStr + ' to: ' + targetUser);
	}

	/**
		Send private message to my peer.
	 **/
	sendPrivateMsg(msg, targetUser) {
		if (msg) {
			const cmd = new OutgoingCommand(PTCC_COMMANDS.PTC_PRIVATE_MSG,
											msg);
			this.sendMessageToUser(targetUser, cmd.str);
			console.log('send private msg:' + msg + ' to: ' + targetUser);
			return true;
		}

		return false;
	}

	/**
		Execute command sent by peers. Derived class must override it.
	**/
	v_execute(cmdObject) {
		throw new Error('v_exe: sub-class-should-overload-this method');
	}

	/**
		Control visibility of a user for video. Derived class "could" override it.
	**/
	v_isUserVisible(user) {
		return true;
	}

	/**
		Properties
	 **/

	get videoAreaDiv() {
		return this.#videoDivId;
	}

	get screenShareBtnId() {
		return this.#screenShareBtnId;
	}

	get me() {
		return this.#me;
	}

	get commClient () {
		return this.#commClient;
	}

}

export { CommunicationSpace };
