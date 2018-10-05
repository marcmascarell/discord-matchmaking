import Event from "./Event"
import NotifyNewMatch from "../Listeners/NotifyNewMatch"

export default class MatchCreated extends Event {
    get listeners(): Array<any> {
        return [NotifyNewMatch]
    }
}
