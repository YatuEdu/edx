
const ICE_SERVERS = [
    {urls:"turn:8.135.100.85:3478",
        "username": "webrtc_user",
        "credential": "zRk6i2fhrllloZXq",
        "credentialType": "password"
    }
];

export class Peer {

    #peerConnection; 
    #user;
    #commClient;
    #shouldCreateOffer;
    #localAudioTrack;
    #localVideoTrack;
	
    // #mediaStream;

    constructor(commClient, user, shouldCreateOffer, localAudioTrack, localVideoTrack) {
        this.#commClient = commClient;
        this.#user = user;
        this.#localAudioTrack = localAudioTrack;
        this.#localVideoTrack = localVideoTrack;
        this.#shouldCreateOffer = shouldCreateOffer;
    }

    async init() {
        this.#peerConnection = new RTCPeerConnection(
            { "iceServers": ICE_SERVERS },
            { "optional": [{ "DtlsSrtpKeyAgreement": true }] } /* this will no longer be needed by chrome
																* eventually (supposedly), but is necessary
																* for now to get firefox to talk to chrome */
        );

        // 注册处理函数
        this.#peerConnection.onicecandidate = e => this.onIceCandidate(e);
        this.#peerConnection.ontrack = e => this.onTrack(e.track);

        /* Add our local stream */
        if(this.#localAudioTrack!=null)
            this.#peerConnection.addTrack(this.#localAudioTrack);
        if (this.#localVideoTrack!=null)
            this.#peerConnection.addTrack(this.#localVideoTrack);

        /* Only one side of the peer connection should create the
            * offer, the signaling server picks one to be the offerer.
            * The other user will get a 'sessionDescription' event and will
            * create an offer, then send back an answer 'sessionDescription' to us
            */
        console.log("shouldCreateOffer: ", this.#shouldCreateOffer);
        if (this.#shouldCreateOffer) {
            console.log("Creating RTC offer to ", this.#user);
            this.createOffer();
        }
    }

    async createOffer() {
        try {
            const localDescription = await this.#peerConnection.createOffer();
            console.log("Local offer description is: ", localDescription);
            await this.#peerConnection.setLocalDescription(localDescription);
            this.#commClient.sendRtcMsg(this.#user, {'type': 'sessionDescription', 'content': localDescription});
        } catch(err) {
            console.log(err);
            this.errHandle(err);
        }
    }

	onTrack(track) {
        console.log("onTrack", track);
        // this.#mediaStream.addTrack(event.track);
        // this.#displayElement[0].srcObject = this.#mediaStream;
    }
	
    onIceCandidate(event) {
        if (event.candidate) {
                this.#commClient.sendRtcMsg(this.#user,
                    {
                        'type': 'iceCandidate',
                        'content': {
                            'sdpMLineIndex': event.candidate.sdpMLineIndex,
                            'candidate': event.candidate.candidate
                        }
                    });
        }
    }


    async feedSDP(remote_description) {
        try {
            let desc = new RTCSessionDescription(remote_description);
            await this.#peerConnection.setRemoteDescription(desc);

            console.log("setRemoteDescription succeeded");

            if (remote_description.type === "offer") {
                console.log("Creating answer");
                let local_description = await this.#peerConnection.createAnswer();
                console.log("Answer description is: ", local_description);
                await this.#peerConnection.setLocalDescription(local_description);

                this.#commClient.sendRtcMsg(this.#user, {'type': 'sessionDescription', 'content': local_description});

                console.log("Answer setLocalDescription succeeded", this.#user);
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