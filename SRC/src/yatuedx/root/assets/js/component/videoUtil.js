
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
}