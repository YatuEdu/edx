import {Peer} 	from "./peer.js";

/**
	VideoPeer class represents an RTC Video peer on an application page.	
 **/
export class VideoClient {
 
    #commClient;
    #audioTrack;
    #videoTrack;

	// Peer对象列表，key为user
    #peers = {}; 

	/**
		Constructs a VideoPeer object using text, audio, and video tracks.	
	**/   
	constructor(commClient, audioTrack, videoTrack) {
        this.#commClient = commClient;
        this.#audioTrack = audioTrack;
        this.#videoTrack = videoTrack;

		// hook up commClient'r RTC control messages handler here
        this.#commClient.onRtcMsg = (user, msg) => this.onRtcMsg(user, msg);
    }

	/**
		Start screen sharing (???)	
	**/ 
    async startShare(user, shouldCreateOffer = true) {
        let peer = this.#peers[user];
        if (peer == null) {
            peer = new Peer(this.#commClient, user, shouldCreateOffer, this.#audioTrack, this.#videoTrack);
            peer.onTrack = track => {
                if (track.kind==='audio') {
                    this.onRemoteAudioTrack(user, track);
                } else if (track.kind==='video') {
                    this.onRemoteVideoTrack(user, track);
                }
            };
            await peer.init();
            this.#peers[user] = peer;
        }
    }
 // 错误回调
    onError(errMsg) {}
    // 来自远端的视频轨道
    onRemoteVideoTrack(user, videoTrack) {}
    // 来自远端的音频轨道
    onRemoteAudioTrack(user, audioTrack) {}

    setLocalVideoTrack(videoTrack) {
        this.#videoTrack = videoTrack;
        for(let peer_id in this.#peers) {
            let peer = this.#peers[peer_id];
            peer.switchVideoTrack(videoTrack);
        }
    }

    stopShare(user) {
        let peer = this.#peers[user];
        if (peer!=null) {
            peer.close();
            delete this.#peers[user];
        }
    }

    async onRtcMsg(fromUser, msg) {
        console.log('onRtcMsg' + msg);
        let peer = this.#peers[fromUser];
        switch (msg.type) {
            case 'sessionDescription':
                if (peer == null) {
                    await this.startShare(fromUser, false);
                    peer = this.#peers[fromUser];
                }
                await peer.feedSDP(msg.content);
                break;
            case 'iceCandidate':
                peer = this.#peers[fromUser];
                if (peer != null) {
                    await peer.feedIceCandidate(msg.content);
                }
                break;
        }
    }
}
