import {Net} from "../core/net.js";
import {sysConstants} from '../core/sysConst.js'
import {credMan} from "../core/credMan.js";

export class Peer {

    #token;
    #peerConnection;
    #user;
    #commClient;
    #shouldCreateOffer;
    #localAudioTrack;
    #localVideoTrack;
    #iceCandidateList = []; // 用于暂存对方ice candidate

    // #mediaStream;

    constructor(commClient, user, shouldCreateOffer, localAudioTrack, localVideoTrack) {
        this.#token = credMan.credential.token;
        this.#commClient = commClient;
        this.#user = user;
        this.#localAudioTrack = localAudioTrack;
        this.#localVideoTrack = localVideoTrack;
        this.#shouldCreateOffer = shouldCreateOffer;
    }

    async init() {
        let res = await Net.getTurnAuth(this.#token);
        if (res.code!=0) {
            alert("Get video server auth info failed.");
            return;
        }
        let userPass = res.data;
        let iceServers = [{
            urls: sysConstants.YATU_TURN_URL,
            "username": userPass.user,
            "credential": userPass.pass,
            "credentialType": "password"
        }];
        this.#peerConnection = new RTCPeerConnection(
            { "iceServers": iceServers },
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

            if (this.#iceCandidateList.length>0) {
                for(let iceCandidate of this.#iceCandidateList) {
                    this.#peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
                }
                this.#iceCandidateList = [];
            }
        } catch(err) {
            console.log(err);
            this.errHandle(err);
        }
    }

    feedIceCandidate(iceCandidate) {
        if (this.#peerConnection) {
            this.#peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
        } else {
            this.#iceCandidateList.push(iceCandidate);
        }
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
