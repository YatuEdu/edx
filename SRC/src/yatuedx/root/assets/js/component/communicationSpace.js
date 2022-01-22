import {CommClient} 		from "../communication/commClient.js";
import {VideoClient} 		from "../communication/videoClient.js"
import {IncomingCommand} 	from '../command/incomingCommand.js';
import {sysConstants}		from "../core/sysConst.js"
import {Net}			    from "../core/net.js"
import {credMan}			from "../core/credMan.js"
import {VideoUtil} 			from "../core/videoUtil.js";

const REPLACE_PID = '{pid}';
const VIDEO_TEMPLATE = `
<video class="yt_video" id="yt_vido_{pid}" autoplay playsinline>"`;

/**

	This class (CommunicationSpace) serves as the root class for the communication room, and specifically, 
	our	programming classroom.
	
	The concrete class room shall derive and inherit from it to obtain the communcation	basics this class offers.
	
 **/
class CommunicationSpace {  
	_cmdObject;
	_commClient;
	_videoClient;
	_videoTrack;
	_audioTrack;
	
	_userMap;
	_videoDivId;
	
	constructor(roomName, videoDivId) {
		this.init(roomName);
		this._videoDivId = videoDivId;
		this._userMap = new Map();
	}
	
	/**
		Initializing the socket client and get ready for communication between classmates and teacher
	 **/
	async init(roomName) {
		const token = credMan.credential.token;
		const name  = credMan.credential.name;
			
		// call API to get room
		const groupSession = await Net.groupMemberJoiningSession(token, roomName);
		if (groupSession.err) {
			alert('Failed to enter room');
			return;
		}
		
		// initialize video
		let tracks = null;
		try {
			tracks = await VideoUtil.getLocalMediaTracks(true, true);
			this._audioTrack = tracks[0];
			this._videoTrack = tracks[1];
			this.handleRemoteVideoTrack(name, this._videoTrack);
		} catch (e) {
			alert('Failed to initialize viedo tracks');
		}
		
		// create the communication client to handle p2p commuinication
		const room = groupSession.data[0].session_id;
		this._commClient = new CommClient(sysConstants.YATU_SOCKET_URL, token, name, room); 
		
		this._commClient.onReady = this.handleCommunicationReady.bind(this);

        this._commClient.onPublicMsg = this.handleMessage.bind(this);

        this._commClient.onPrivateMsg = this.handleMessage.bind(this);

        this._commClient.onUserJoin = this.handleNewUser.bind(this);

        this._commClient.onUserLeave = this.handleUserLeaving.bind(this);

        this._commClient.onUserList = this.handleUserList.bind(this);
	}
	
	/**
		Initialize Video client after we successfully joined the group
	 **/
	handleCommunicationReady() {
	
		const uList = this._commClient.getUserList();
		
		// If we do not need video for the communication board
		////if (!this._videoDivId) {
		//	return;
		//}
		
		/*
			If we need video for the communication board, create video client
		*/
		if (this._videoTrack && this._audioTrack) {
			this._videoClient = new VideoClient(this._commClient, this._audioTrack , this._videoTrack);
		
			// 收到音频轨道或视频轨道，需要放在MediaStream对象中
			// 如果音视频轨道放在同一个MediaStream对象中，会进行音视频同步，否则独立播放
			// 这里展示独立播放
			this._videoClient.onRemoteVideoTrack = this.handleRemoteVideoTrack.bind(this);
			this._videoClient.onRemoteAudioTrack = this.handleRemoteAudioTrack.bind(this);
		}
		
        // 下面是屏幕共享的方法
        $("#screenShareBtn").click(async e => {
            let shareTrack = await VideoUtil.getScreenShareTrack();
            if (shareTrack!=null) {
                $("#screenShareBtn").disabled = true;
                videoChatNew.setLocalVideoTrack(shareTrack);

                shareTrack.addEventListener('ended', () => {
                    console.log('用户停止共享屏幕 这里切换回摄像头视频');
                    videoChatNew.setLocalVideoTrack(myVideoTrack);
                    $("#screenShareBtn").disabled = false;
                });
            }
        });

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
		const mediaStream = new MediaStream();
		mediaStream.addTrack(videoTrack);

		const videTagStr = VIDEO_TEMPLATE
							.replace(REPLACE_PID, user);
		const videoElement = $(videTagStr)[0];
		$(this.videoAreaDiv).append(videoElement);
		videoElement.srcObject = mediaStream;

		// 这里保存标签，只是为了后面可以移除
		let userObj = this._userMap.get(user);
		if (userObj != null ) {
			userObj.videoTag = videoElement;
		}
		else {
			this._userMap.set(user, {videoTag: videoElement});
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
		let userObj = this._userMap.get(user);
		if (userObj != null ) {
			userObj.audioTag = audioCtrlId;
		}
		else {
			this._userMap.set(user, {audioTag: audioCtrlId});
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
		if (this._videoClient) {
			this._videoClient.startShare(user, true);
		}
	}
	
	/**	
		Handle the event that represents the leaving of a joined user.
		Remove its video / autio tracks
	**/	
	handleUserLeaving(user) {
		// todo:
		console.log('User left: ' + user);
		
		// 停止共享本地音视频
		if (this._videoClient) {
			this._videoClient.stopShare(user);
		}
        let userObj = this._userMap.get(user);
		if (userObj != null) {
			if (userObj.videoTag !=null) {
				userObj.videoTag.remove();
			
			}	
			if (userObj.audioTag !=null) {
				userObj.audioTag.remove();
				
			}
			this._userMap.delete(user);
		}
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
	}
	
	/**	
		Execute command sent by peers. Derived class must override it.
	**/	
	v_exe(cmdObject) {
		throw new Error('v_exe: sub-class-should-overload-this method'); 
	}
	
	/**
		Properties
	 **/
	 
	 get videoAreaDiv() {
		return this._videoDivId;
	}
}

export { CommunicationSpace };