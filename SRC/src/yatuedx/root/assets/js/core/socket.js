import {Heart} from "./heart.js";

const MAX_RECONNECT_TIMES = -1;

export class Socket extends Heart {

    #url;
    #reConnectTimer = null; // 重连计时器
    #reConnectCount = MAX_RECONNECT_TIMES; // 变量保存，防止丢失
    #ws;
    #isDestroy = false; // 是否销毁
    #reconnectTime = 5000; // 重连时间间隔

    onOpen(event) {}
    onClose(event) {}
    onError(event) {}
    onMessage(event) {}

    constructor(url) {
        super();
        this.#url = url;
        this.create();
    }

    /**
     * 建立连接
     */
    create() {
        if (!('WebSocket' in window)) {
            throw new Error('The current browser does not support websocket and cannot be used');
        }
        if (!this.#url) {
            throw new Error('The address does not exist, the channel cannot be established');
        }
        // delete this.#ws;
        this.#ws = new WebSocket(this.#url);
        this.#ws.onopen = (event) => {
            clearTimeout(this.#reConnectTimer); // 清除重连定时器
            this.#reConnectCount = MAX_RECONNECT_TIMES; // 计数器重置
            // 建立心跳机制
            super.reset().start(() => {
                this.send('ping')
            });
            if (this.onOpen!=null && typeof this.onOpen === 'function') {
                this.onOpen(event);
            }
        };

        this.#ws.onclose = (event) => {
            super.reset();
            if (!this.#isDestroy) {
                this.#onReconnect();
            }
            if (this.onClose!=null && typeof this.onClose === 'function') {
                this.onClose(event);
            }
            if (event.code==1008) {
                this.destroy();
            }
        };

        this.#ws.onerror = (event) => {
            if (this.onError!=null && typeof this.onError === 'function') {
                this.onError(event);
            }
        };

        this.#ws.onmessage = (event) => {
            // 收到任何消息，重新开始倒计时心跳检测
            super.reset().start(() => {
                this.send('ping');
            });
            if (event.data.startsWith('pong')) return;

            if (this.onMessage!=null && typeof this.onMessage === 'function') {
                this.onMessage(event.data);
            }
        };
    }

    /**
     * 自定义发送消息事件
     * @param {String} data 发送的文本
     */
    send(data) {
        if (this.#ws.readyState !== this.#ws.OPEN) {
            throw new Error('Not connected to the server, unable to send');
        }
        this.#ws.send(data);
    }
    /**
     * 连接事件
     */
    #onReconnect() {
        if (this.#reConnectCount > 0 || this.#reConnectCount === -1) {
            this.#reConnectTimer = setTimeout(() => {
                this.create();
                if (this.#reConnectCount !== -1) this.#reConnectCount--
            }, this.#reconnectTime)
        } else {
            clearTimeout(this.#reConnectTimer)
            this.#reConnectCount = MAX_RECONNECT_TIMES
        }
    }

    /**
     * 销毁
     */
    destroy () {
        super.reset();
        clearTimeout(this.#reConnectTimer); // 清除重连定时器
        this.#isDestroy = true;
        this.#ws.close();
    }

}
