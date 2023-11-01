import {CommClient} from "../communication/commClient.js";
import {VideoClient} from "../communication/VideoClient.js"
import {VideoUtil} from "../core/videoUtil.js";

let videoClient = null;
let myVideoTrack = null;
let myAudioTrack = null;

$(document).ready(async function () {
    console.log("ScreenRecord page ready!");

    let mediaRecorder; // webrtc的MediaRecorder
    let buffer = []; // 数据块
    $("#startBtn").click(async e => {
        $("#startBtn").hide();
        $("#stopBtn").show();

        let tracks;
        try {
            myVideoTrack = await VideoUtil.getScreenShareTrack();
            tracks = await VideoUtil.getLocalMediaTracks(true, false);
        } catch (e) {
            console.error(e);
            return;
        }
        myAudioTrack = tracks[0];

        // 下面是录制的过程
        // 录制的对象是 mediaStream，需要创建一个，并把需要的音频轨或视频轨加进去
        const mediaStream = new MediaStream();
        // 将音频轨道添加到 MediaStream
        mediaStream.addTrack(myAudioTrack);
        // 将视频轨道添加到 MediaStream
        mediaStream.addTrack(myVideoTrack);

        mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm'
        });
        mediaRecorder.ondataavailable = (e) => {
            buffer.push(e.data);
        };
        mediaRecorder.start(100); // 每 100ms保存一次数据
    });

    $('#stopBtn').click(async e => {
        $("#stopBtn").hide();

        // 下面是下载过程

        mediaRecorder.stop(); //先停止录制
        const blob = new Blob(buffer, {type: 'video/webm'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

    });


});

