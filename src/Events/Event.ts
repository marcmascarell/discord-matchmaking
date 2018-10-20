export default abstract class Event {
    abstract get listeners(): Array<any>

    constructor(data = {}) {
        this.sendToListeners(data)
    }

    sendToListeners(data) {
        this.listeners.forEach((listener: any) => {
            new listener().handle(data)
        })
    }
}
