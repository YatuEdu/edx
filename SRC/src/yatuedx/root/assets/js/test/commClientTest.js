import {Socket} from "../core/socket.js";
import {CommClient} from "../communication/commClient.js";

let socket = null;

let commClient = null;

$(document).ready(function () {
    console.log("socket page ready!");
    $("#startBtn").click(() => {
        $("#startBtn").prop('disabled', true);
        let name = $("#name").val();
        let room = $("#room").val();
        // commClient = new CommClient('wss://rtc.4thspace.cn/websocket', 'aasdfa', name, room);  // aasdfa IS TOKEN
        commClient = new CommClient('ws://localhost:7070/websocket', 'aasdfa', name, room);

        commClient.onReady = () => {
            commClient.getUserList();
        };

        commClient.onPublicMsg = (fromUser, msg) => {
            $("#recvArea").append(fromUser + ' say：' + msg + '\n');
        };

        commClient.onPrivateMsg = (fromUser, msg) => {
            $("#recvArea").append(fromUser + ' say to me：' + msg + '\n');
        };

        commClient.onUserJoin = (user) => {
            $("#recvArea").append(user + ' join' + '\n');
        };

        commClient.onUserLeave = (user) => {
            $("#recvArea").append(user + ' leave' + '\n');
        };

        commClient.onUserList = (userList) => {
            $("#recvArea").append('users in room: ' + '\n');
            for(let i in userList) {
                $("#recvArea").append(userList[i].userName + '\n');
            }
            $("#recvArea").append('\n');

        };

    });

    $("#sendPrivateBtn").click(() => {
        let message = $("#message").val();
        let toUser = $("#toUser").val();
        commClient.sendPrivateMsg(toUser, message);
    });

    $("#sendPublicBtn").click(() => {
        let message = $("#message").val();
        let toUser = $("#toUser").val();
        commClient.sendPublicMsg(message);
    });

});