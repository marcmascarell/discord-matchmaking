import Event from "./Event"
import SendServerInfoToPlayers from "../Listeners/SendServerInfoToPlayers"

export default class ServerCreated extends Event {
    get listeners(): Array<any> {
        return [SendServerInfoToPlayers]
    }
}
