import {CommClient} from "../communication/commClient.js";
import {VideoChatNew} from "../component/videoChatNew.js"
import {VideoUtil} from "../component/videoUtil.js";

let videoChatNew = null;
let myVideoTrack = null;
let myAudioTrack = null;

$(document).ready(async function () {
    let name = 'goofy' + randomString(4);
    console.log("videoChatNew page ready! I'm "+name);
    let room = 'abc';
    let tracks;
    try {
        tracks = await VideoUtil.getLocalMediaTracks(true, true);
    } catch (e) {
        console.error(e);
        return;
    }
    myAudioTrack = tracks[0];
    myVideoTrack = tracks[1];

    let videoTags = {};
    let audioTags = {};

    // let commClient = new CommClient('ws://localhost:7070/websocket', 'aasdfa', name, room);
    let commClient = new CommClient('wss://rtc.4thspace.cn/websocket', 'aasdfa', name, room);
    commClient.onReady = async () => {
        // 通信组件准备就绪，可以准备视频组件了
        console.log('onReady');
        videoChatNew = new VideoChatNew(commClient, myAudioTrack, myVideoTrack);

        // 收到音频轨道或视频轨道，需要放在MediaStream对象中
        // 如果音视频轨道放在同一个MediaStream对象中，会进行音视频同步，否则独立播放
        // 这里展示独立播放
        videoChatNew.onRemoteVideoTrack = (user, videoTrack) => {
            let mediaStream = new MediaStream();
            mediaStream.addTrack(videoTrack);

            let videoTag = $("<video autoplay playsinline>")[0];
            // videoTag.attr("autoplay", "autoplay");
            $('body').append(videoTag);
            videoTag.srcObject = mediaStream;

            // 这里保存标签，只是为了后面可以移除
            videoTags[user] = videoTag;
        };

        videoChatNew.onRemoteAudioTrack = (user, audioTrack) => {
            let mediaStream = new MediaStream();
            mediaStream.addTrack(audioTrack);

            let audioTag = $("<audio autoplay>")[0];
            // audioTag.attr("autoplay", "autoplay");
            $('body').append(audioTag);
            audioTag.srcObject = mediaStream;

            // 这里保存标签，只是为了后面可以移除
            audioTags[user] = audioTag;
        };

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

    };

    // 音视频会话必须规定一个发起者，一个接收者。
    // 这里采用这种方式：旧用户主动发起会话，新用户被动接受
    // 因此在用户加入房间时，主动共享自己的音视频轨道
    // 具体场景可以灵活安排
    commClient.onUserJoin = user => {
        // 共享本地音视频
        console.log('onUserJoin');

        videoChatNew.startShare(user, true);
    };

    commClient.onUserLeave = user => {
        // 停止共享本地音视频
        videoChatNew.stopShare(user);
        let videoTag = videoTags[user];
        if (videoTag!=null)
            videoTag.remove();

        let audioTag = audioTags[user];
        if (audioTag!=null)
            audioTag.remove();
    };

});





function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}