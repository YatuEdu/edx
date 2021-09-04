
const SIGNALING_SERVER = "/";
const ICE_SERVERS = [
    {url:"turn:8.135.100.85:3478",
    "username": "webrtc_user",
    "credential": "zRk6i2fhrllloZXq",
    "credentialType": "password"
    }
];
const USE_VIDEO = true;
const MUTE_AUDIO_BY_DEFAULT = false;

class Peer {

	#peerConnection; // RTCPeerConnection对象
	#peerId; // 对方ID
	#signalingSocket;
	#shouldCreateOffer;
	#localAudioTrack;
	#localVideoTrack;
	#mediaStream;
	#displayElement; // video标签，用于显示远端音视频


	constructor(signalingSocket, peerId, shouldCreateOffer, localAudioTrack, localVideoTrack, displayElement) {
		this.#signalingSocket = signalingSocket;
		this.#peerId = peerId;
		this.#localAudioTrack = localAudioTrack;
		this.#localVideoTrack = localVideoTrack;
		this.#shouldCreateOffer = shouldCreateOffer;
		this.#displayElement = displayElement;
		this.#mediaStream = new MediaStream();
	}

	async init() {
		this.#peerConnection = new RTCPeerConnection(
			{ "iceServers": ICE_SERVERS },
			{ "optional": [{ "DtlsSrtpKeyAgreement": true }] } /* this will no longer be needed by chrome
                                                            * eventually (supposedly), but is necessary 
                                                            * for now to get firefox to talk to chrome */
		);

		// 注册处理函数
		this.#peerConnection.onicecandidate = e => this.onIcecandidate(e);
		this.#peerConnection.ontrack = e => this.onTrack(e); 

		/* Add our local stream */
		this.#peerConnection.addTrack(this.#localAudioTrack);
		this.#peerConnection.addTrack(this.#localVideoTrack);

		/* Only one side of the peer connection should create the
			* offer, the signaling server picks one to be the offerer. 
			* The other user will get a 'sessionDescription' event and will
			* create an offer, then send back an answer 'sessionDescription' to us
			*/
		console.log("shouldCreateOffer: ", this.#shouldCreateOffer);
		if (this.#shouldCreateOffer) {
			console.log("Creating RTC offer to ", this.#peerId);
			this.createOffer();
		}
	}

	async createOffer() {
		try {
			const localDescription = await this.#peerConnection.createOffer();
			console.log("Local offer description is: ", localDescription);
			await this.#peerConnection.setLocalDescription(localDescription);
			this.#signalingSocket.emit('relaySessionDescription',
					{ 'peer_id': this.#peerId, 'session_description': localDescription});
		} catch(err) {
			console.log(err);
			this.errHandle(err);
		}
	}

	onIcecandidate(event) {
		if (event.candidate) {
			this.#signalingSocket.emit('relayICECandidate', {
				'peer_id': this.#peerId,
				'ice_candidate': {
					'sdpMLineIndex': event.candidate.sdpMLineIndex,
					'candidate': event.candidate.candidate
				}
			});
		}
	}

	onTrack(event) {
		console.log("onTrack", event);
		this.#mediaStream.addTrack(event.track);
		this.#displayElement[0].srcObject = this.#mediaStream;
	}

	async feedSDP(remote_description) {
		try {
			var desc = new RTCSessionDescription(remote_description);
			await this.#peerConnection.setRemoteDescription(desc);

			console.log("setRemoteDescription succeeded");
		
			if (remote_description.type == "offer") {
				console.log("Creating answer");
				let local_description = await this.#peerConnection.createAnswer();
				console.log("Answer description is: ", local_description);
				await this.#peerConnection.setLocalDescription(local_description);
				this.#signalingSocket.emit('relaySessionDescription', 
							{'peer_id': this.#peerId, 'session_description': local_description});
				console.log("Answer setLocalDescription succeeded", this.#peerId);
				
			}
		} catch(err) {
			console.log(err);
			this.errHandle(err);
		}
	}

	feedIceCandidate(iceCandidate) {
		this.#peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
	}

	switchVideoTrack(newVideoTrack) {
		let senderList = this.#peerConnection.getSenders();
		senderList.forEach(sender => {
			let track = sender.track;
			if (track.kind === 'video') {
				sender.replaceTrack(newVideoTrack);
			}
		});
	}

	close() {
		this.#peerConnection.close();
	}

	errHandle(err) {
        alert(err);
        console.trace();
    }
}

export { Peer };