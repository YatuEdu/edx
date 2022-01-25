import {Socket} from "../core/socket.js";

/**
 *
 */
export class CommClient extends Socket {

    // 用户进入房间回调
    onUserJoin(user) {}
    // 用户离开房间回调
    onUserLeave(user) {}
    // 用户列表回调
    onUserList(userList) {}
    // 准备就绪回调
    onReady() {}

    // 收到私密消息回调
    onPrivateMsg(fromUser, msg) {}
    // 收到公共消息回调
    onPublicMsg(fromUser, msg) {}
    // 收到RTC通信消息回调
    onRtcMsg(fromUser, msg) {}

    // 发送私密消息
    sendPrivateMsg(toUser, msg) {
        let obj = {
            type: 'msgPrivate',
            data: {
                from: this.#name,
                to: toUser,
                content: msg
            }
        };
        let data = JSON.stringify(obj);
        super.send(data);
    }

    // 发送公共消息
    sendPublicMsg(msg) {
		console.log('sendPublicMsg: ' + msg);
        let obj = {
            type: 'msgPublic',
            data: {
                from: this.#name,
                content: msg
            }
        };
        let data = JSON.stringify(obj);
        super.send(data);
    }

    // 获取用户列表
    getUserList() {
        let obj = {
            type: 'userList',
            data: {
            }
        };
        let data = JSON.stringify(obj);
        super.send(data);
    }

    sendRtcMsg(toUser, msg) {
        let obj = {
            type: 'msgRtc',
            data: {
                from: this.#name,
                to: toUser,
                content: msg
            }
        };
        let data = JSON.stringify(obj);
        super.send(data);
    }

    #name;
    room;

    constructor(url, token, name, room) {
        let urlFinal = url + "?token="+token+"&room="+room+"&user="+name;
        super(urlFinal);
        this.#name = name;
        this.room = room;
    }

    onOpen(e) {
        console.log('onOpen');
        this.onReady();
    }

    onClose(event) {
        console.log('onClose');
    }

    onError(event) {
        console.log('onError');
    }

    onMessage(msg) {
        // console.log('onMessage ' + msg);
        let obj = JSON.parse(msg);
        let type = obj.type;
        let data = obj.data;
        switch (type) {
            case 'msgPrivate':
                this.onPrivateMsg(data.from, data.content);
                break;
            case 'msgPublic':
                this.onPublicMsg(data.from, data.content);
                break;
            case 'userStatus':
                if (data.status==='on') {
                    this.onUserJoin(data.userName);
                } else if (data.status==='off') {
                    this.onUserLeave(data.userName);
                }
                break;
            case 'userList':
                this.onUserList(data);
                break;
            case 'msgRtc':
                this.onRtcMsg(data.from, data.content);
                break;
        }
    }
}
