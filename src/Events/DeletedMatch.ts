import Event from "./Event"
import NotifyDeletedMatch from "../Listeners/NotifyDeletedMatch"
import DestroyScheduledMatchTextChannel from "../Listeners/DesctroycheduledMatchTextChannel"

export default class DeletedMatch extends Event {
    get listeners(): Array<any> {
        return [NotifyDeletedMatch, DestroyScheduledMatchTextChannel]
    }
}
