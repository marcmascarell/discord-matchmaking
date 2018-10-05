import DeletedMatch from './DeletedMatch'
import Match from "../Models/Match"

export default class DeletedMatchDueToScheduledMatchNotFilled extends DeletedMatch {
    constructor(match : Match) {
        match.sendToChannel(`Scheduled match #${match.id} was not fullfilled in time...`)

        super({match})
    }
};
