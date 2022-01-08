import { sysConstants, languageConstants } 	from '../core/sysConst.js'
import { credMan } 							from '../core/credMan.js'
import { uiMan } 							from '../core/uiManager.js';
import { Net }              				from '../core/net.js';
import { getGroupCardHtml } 				from '../dynamic/groupCard.js';
import { StringUtil } 						from '../core/util.js';
import {Peer} 								from '../core/peer.js';

const SIGNALING_SERVER = "/";
// const SIGNALING_SERVER = "ws://localhost:8084/";
const USE_VIDEO = true;
const MUTE_AUDIO_BY_DEFAULT = false;
const MEDIA_BOX_MINE = `
<div class="mediaBox">
	<video id="videoTagMine" autoplay="" playsinline="" />
	<input id="mutedCamBtn" type="checkbox" checked="" />
	开启视频
	<input id="mutedMicBtn" type="checkbox" checked="" />
	开启音频
</div>
`;
/**
    MediaStream:
        包含多个MediaStreamTrack对象，代表来自不同输入设备的视频和音频

    MediaStreamTrack:
        可能包含多个信道(右声道和左声道)

    MediaStream输出：
        显示为视频或音频元素、或发送到RtcPeerConnection对象

    SocketIO: 
        信令服务器连接

    RTCPeerConnection:
        代表一个点对点的RTC连接，一个3人会议室，本地客户端将建立2个RTCPeerConnection对象

**/
class VideoChatHandler {
    #credMan;

    #signalingSocket; // 信令服务器连接
    #mediaStream; // 本地媒体流（包含音频轨道和视频轨道）
    #audioTrack; // 本地音频轨道
    #camTrack; // 本地视频轨道(摄像头)
    #videoTrack; // 本地视频轨道(当前的) 可能是摄像头，或屏幕共享
    #videoTagMine; // 本地视频标签<video>
    #peerMediaElements = {}; // 远端媒体显示组件

    #peers = {}; // Peer对象列表，key为peer_id 

    #group; // 房间号


    constructor(credMan, group) {
        this.#credMan = credMan;
        this.#group = group;
        this.init();
    }

    // hook up events
    async init() {

        // 连接信令服务器，注册事件处理函数
        const token = this.#credMan.credential.token;
        this.#signalingSocket = io(SIGNALING_SERVER, {query:"token="+token, transports: ['websocket'], upgrade: false});
        this.#signalingSocket.on('connect', this.signalOnConnect.bind(this));
        this.#signalingSocket.on('disconnect', this.signalOnDisconnect.bind(this));
        this.#signalingSocket.on('message', e => this.errHandle(e));
        this.#signalingSocket.on('addPeer', config => this.signalOnAddPeer(config));
        this.#signalingSocket.on('sessionDescription', config => this.signalOnSDP(config));
        this.#signalingSocket.on('iceCandidate', config => this.signalOnIceCandidate(config));
        this.#signalingSocket.on('removePeer', config => this.signalOnRemovePeer(config));
        this.#signalingSocket.on('txtMsg', msg => this.signalOnTxtMsg(msg));

        // 按钮事件处理
        $("#startShareButton").click(this.startShare.bind(this));
        $("#sendMsgButton").click(this.sendMsg.bind(this));

        // 有些设备不支持屏幕共享，屏蔽共享按钮功能
        if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
            $("#startShareButton").attr("disabled", false);
        } else {
            errHandle('getDisplayMedia is not supported');
        }
    }

    /**
     * 信令服务器连接成功处理流程
     */
    async signalOnConnect() {
        try {
            console.log('signalOnConnect');
            // 获取用户音视频设备
            await this.getLocalMedia(true, true);

            // 显示本地视频 TODO
            $('body').append(MEDIA_BOX_MINE);
            this.#videoTagMine = $("#videoTagMine");
            let mediaStream = new MediaStream();
            mediaStream.addTrack(this.#camTrack);
            this.#videoTagMine[0].srcObject = mediaStream;
            
            // 本地视频区域按钮事件
            $("#mutedCamBtn").click(e => this.switchMutedCam(e.target));
            $("#mutedMicBtn").click(e => this.switchMutedMic(e.target));
            // 进入房间
            await this.joinChatChannel(this.#group, {'whatever-you-want-here': 'stuff'});

            console.log('joined');

        } catch(e) {
            this.errHandle(e);
        }

    }

    /**
     * 信令服务器断开，需要释放相关资源
     */
    signalOnDisconnect() {
        console.log("Disconnected from signaling server");

    }

    async getLocalMedia(useAudio, useVideo) {
        try {
            this.#mediaStream = await navigator.mediaDevices.getUserMedia({ "audio": useAudio, "video": useVideo });
            let audioTracks = this.#mediaStream.getAudioTracks();
            let videoTracks = this.#mediaStream.getVideoTracks();
    
            if (audioTracks.length>0) {
                this.#audioTrack = audioTracks[0];
                console.log(this.#audioTrack.label);
            }
            if (videoTracks.length>0) {
                this.#camTrack = videoTracks[0];
                console.log(this.#camTrack.label);
                this.#videoTrack = this.#camTrack;
            }
        } catch (err) {
            this.errHandle(err);
        }
    }

    /**
     * 本地媒体区域。总是只有视频，不需要音频
     */
    createMediaBox(videoTrack) {
        let local_media_tag = $("<video autoplay playsinline>");

        let local_media_box = $("<div class='mediaBox'>");
        local_media_box.append(local_media_tag);
        local_media_box.append($("<input type='checkbox' checked onchange='mutedMyVideo(this.checked)'>开启视频</input>"));
        local_media_box.append($("<input type='checkbox' checked onchange='join(this.checked)'>上线</input>"));
        let mediaStream = new MediaStream();
        mediaStream.addTrack(videoTrack);
        local_media_tag[0].srcObject = mediaStream;
        $('body').append(local_media_box);
        return local_media_tag;
    }

    mutedMyVideo(muted) {
        console.log("checked: ", muted);
        var tracks = local_media_stream.getVideoTracks();
        for(i in tracks) {
            tracks[i].enabled = muted;
        }
    }

    joinChatChannel(channel, userdata) {
        return new Promise(async (resolve, reject) => {
            this.#signalingSocket.emit('join', {"channel": channel, "userdata": userdata}, res => {
                if (res.result!=null && res.result.code==0) {
                    resolve();
                } else {
                    this.errHandle(res.result.msg);
                    reject();
                }
            });
        });
    }
    
    async signalOnAddPeer(config) {
        console.log('Signaling server said to add peer:', config);
        var peer_id = config.peer_id;
        if (peer_id in this.#peers) {
            /* This could happen if the user joins multiple channels where the other peer is also in. */
            console.log("Already connected to peer ", peer_id);
            return;
        }

        // 有新成员加入，创建一个显示块给它
        var remote_media = document.getElementById(peer_id);
        if (remote_media == null) {
            remote_media = USE_VIDEO ? $("<video id='"+peer_id+"' autoplay playsinline>") : $("<audio>");
            remote_media.attr("autoplay", "autoplay");
            if (MUTE_AUDIO_BY_DEFAULT) {
                remote_media.attr("muted", "true");
            }
            remote_media.attr("controls", "");
            var remote_media_box = $("<div class='mediaBox'>");
            remote_media_box.append(remote_media);
            this.#peerMediaElements[peer_id] = remote_media_box;
            $('body').append(remote_media_box);
        }
        var peer = new Peer(this.#signalingSocket, peer_id, config.should_create_offer, this.#audioTrack, this.#videoTrack, remote_media);
        peer.init();
        this.#peers[peer_id] = peer;
        
        $("#textTarget").append("<option value='"+peer_id+"'>"+peer_id+"</option>");
    }

    async signalOnSDP(config) {
        console.log('Remote description received: ', config);
        var peer_id = config.peer_id;
        var peer = this.#peers[peer_id];
        peer.feedSDP(config.session_description);
    }

    signalOnIceCandidate(config) {
        var peer = this.#peers[config.peer_id];
        var ice_candidate = config.ice_candidate;
        peer.feedIceCandidate(ice_candidate);
    }

    signalOnRemovePeer(config) {
        console.log('Signaling server said to remove peer:', config);
        var peer_id = config.peer_id;
        if (peer_id in this.#peerMediaElements) {
            this.#peerMediaElements[peer_id].remove();
        }
        if (peer_id in this.#peers) {
            this.#peers[peer_id].close();
        }

        delete this.#peers[peer_id];
        delete this.#peerMediaElements[config.peer_id];

        $("#textTarget option[value='"+peer_id+"']").remove();
    }

    signalOnTxtMsg(message) {
        console.log('txtMsg: ', message);
       $("#textbox").val($("#textbox").val()+message+'\n');

    }

    errHandle(err) {
        alert(err);
        console.trace();
    }

    async startShare(e) {
        try {
            let mediaStream = await navigator.mediaDevices.getDisplayMedia({video: true});
            $("#startShareButton").disabled = true;
            let videoTrack = mediaStream.getVideoTracks()[0];
            videoTrack.addEventListener('ended', () => {
                console.log('用户停止共享屏幕');
                $("#startShareButton").disabled = false;
                let camStream = new MediaStream();
                camStream.addTrack(this.#camTrack);
                this.#videoTrack = this.#camTrack;
                this.#videoTagMine[0].srcObject = camStream;
                for(var peer_id in this.#peers) {
                    var peer = this.#peers[peer_id];
                    peer.switchVideoTrack(this.#camTrack);
                }
            });

            this.#videoTagMine[0].srcObject = mediaStream;
            this.#videoTrack = videoTrack;
            for(var peer_id in this.#peers) {
                var peer = this.#peers[peer_id];
                peer.switchVideoTrack(videoTrack);
            }
            
        } catch (err) {
            this.errHandle(err);
        }

    }

    sendMsg(e) {
        var msg = $("#tosend").val();
        if (msg=='') return;
        var target = $("#textTarget option:selected").val();
        console.log("sendMsg: ", $("#tosend").val(), "to ", target);
        this.#signalingSocket.emit('txtMsg', {'channel': this.#group, 'target': target, 'msg': msg});
        $("#tosend").val('');
    }

    switchMutedCam(cb) {
        this.#camTrack.enabled = cb.checked;
        this.#videoTrack.enabled = cb.checked;
    }

    switchMutedMic(cb) {
        this.#audioTrack.enabled = cb.checked;
    }

}

let videoChatPageHandler = null;

$(document).ready(function () {
    console.log("videoChat page ready!");
    let group = getUrlParameter('group');
    videoChatPageHandler = new VideoChatHandler(credMan, group);
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};