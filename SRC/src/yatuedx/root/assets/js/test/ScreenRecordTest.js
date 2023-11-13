import {VideoUtil} from "../core/videoUtil.js";

let myVideoTrack = null;
let myAudioTrack1 = null;
let myAudioTrack2 = null;

async function audioFile2Track(filePath) {
    const audioContext = new AudioContext();
    const response = await fetch(filePath);
    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    let dest = audioContext.createMediaStreamDestination();
    source.connect(dest);
    source.start();
    let stream = dest.stream;
    let audioTrack = stream.getAudioTracks()[0];
    return audioTrack;
}

function printAudioTrackInfo(audioTrack) {
    console.log('Audio Track Details:');
    console.log('ID: ' + audioTrack.id);
    console.log('Label: ' + audioTrack.label);
    console.log('Kind: ' + audioTrack.kind);
    console.log('Muted: ' + audioTrack.muted);
    console.log('Enabled: ' + audioTrack.enabled);
    console.log('Ready State: ' + audioTrack.readyState);
}

$(document).ready(async function () {
    console.log("ScreenRecord page ready!");

    let mediaRecorder; // webrtc的MediaRecorder
    let buffer = []; // 数据块
    $("#startBtn").click(async e => {
        $("#startBtn").hide();
        $("#stopBtn").show();
        //await VideoUtil.merge();
        let tracks;
        try {
            myVideoTrack = await VideoUtil.getScreenShareTrack();
            // tracks = await VideoUtil.getLocalMediaTracks(true, true);
            // myAudioTrack = tracks[0];
            // printAudioTrackInfo(myAudioTrack);
            let audioFile1 = "/assets/music/The_Skaters_Waltz_Rieu.mp3";
            myAudioTrack1 = await audioFile2Track(audioFile1);
            let audioFile2 = "/assets/music/Legends_of_the_Fall_James_Horner.mp3";
            myAudioTrack2 = await audioFile2Track(audioFile1);
        } catch (e) {
            console.error(e);
            return;
        }
        //myAudioTrack = tracks[0];

        // 下面是录制的过程
        // 录制的对象是 mediaStream，需要创建一个，并把需要的音频轨或视频轨加进去
        const mediaStream = new MediaStream();
        // 将音频轨道添加到 MediaStream
        mediaStream.addTrack(myAudioTrack1);
        mediaStream.addTrack(myAudioTrack2);
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

