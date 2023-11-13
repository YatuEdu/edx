import Crunker from "../crunker/crunker.esm.js";

export class VideoUtil {

    // 返回摄像头和麦克风轨道[audioTrack, videoTrack]，
    static async getLocalMediaTracks(useAudio, useVideo) {
        let audioTrack = null;
        let videoTrack = null;
        let mediaStream = await navigator.mediaDevices.getUserMedia({ "audio": useAudio, "video": useVideo });
        let audioTracks = mediaStream.getAudioTracks();
        let videoTracks = mediaStream.getVideoTracks();

        if (audioTracks.length>0) {
            audioTrack = audioTracks[0];
            console.log(audioTrack.label);
        }
        if (videoTracks.length>0) {
            videoTrack = videoTracks[0];
            console.log(videoTrack.label);
        }
        return [audioTrack, videoTrack];
    }

    // 返回屏幕共享轨道
    static async getScreenShareTrack() {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({video: true});
        let videoTrack = mediaStream.getVideoTracks()[0];
        return videoTrack;
    }

    static async merge() {
        const crunker = new Crunker();
        return crunker
            .fetchAudio('/assets/music/The_Skaters_Waltz_Rieu.mp3', '/assets/music/Legends_of_the_Fall_James_Horner.mp3')
            .then((buffers) => {
                // => [AudioBuffer, AudioBuffer]
                return crunker.mergeAudio(buffers);
            })
            .then((merged) => {
                // => AudioBuffer
                return crunker.export(merged, 'audio/mp3');
            })
    }

    static async convertAudioTrackToAudioBuffer(audioTrack) {
        const audioContext = new AudioContext();
        const audioBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                const audioData = reader.result;
                console.log('audioData.length: ', audioData.byteLength);
                audioContext.decodeAudioData(audioData, resolve, reject);
            };
            reader.onerror = reject;
            const blob = new Blob([audioTrack]);
            reader.readAsArrayBuffer(blob);
        });
        return audioBuffer;
    }

    static async merge(audioTrack1, audioTrack2) {
        const crunker = new Crunker();
        let buffers = [await this.convertAudioTrackToAudioBuffer(audioTrack1), await this.convertAudioTrackToAudioBuffer(audioTrack2)];
        return crunker.mergeAudio(buffers);
    }
}
