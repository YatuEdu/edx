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

    onPrivateMsg(fromUser, msg) {}
    onPublicMsg(fromUser, msg) {}

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

    sendPublicMsg(msg) {
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

    getUserList() {
        let obj = {
            type: 'userList',
            data: {
            }
        };
        let data = JSON.stringify(obj);
        super.send(data);
    }

    #name;

    constructor(url, token, name, room) {
        let urlFinal = url + "?token="+token+"&room="+room+"&user="+name;
        super(urlFinal);
        this.#name = name;
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
        console.log('onMessage ' + msg);
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
        }
    }
}
