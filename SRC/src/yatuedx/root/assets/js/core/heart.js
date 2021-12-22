/**
 * 心跳基类
 */
export class Heart {
    heartTimeout = null// 心跳计时器
    serverHeartTimeout = null// 心跳计时器

    constructor () {
        this.timeout = 5000
    }
    // 重置
    reset () {
        clearTimeout(this.heartTimeout)
        clearTimeout(this.serverHeartTimeout)
        return this
    }
    /**
     * 启动心跳
     * @param {Function} cb 回调函数
     */
    start (cb) {
        this.heartTimeout = setTimeout(() => {
            cb()
            this.serverHeartTimeout = setTimeout(() => {
                cb()
                // 重新开始检测
                this.reset().start(cb())
            }, this.timeout)
        }, this.timeout)
    }
}