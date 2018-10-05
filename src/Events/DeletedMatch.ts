import Event from "./Event"
import NotifyDeletedMatch from "../Listeners/NotifyDeletedMatch"

export default class DeletedMatch extends Event {
    get listeners(): Array<any> {
        return [NotifyDeletedMatch]
    }
}
