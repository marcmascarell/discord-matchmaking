import DeletedMatch from "./DeletedMatch"
import Match from "../Models/Match"

export default class DeletedMatchDueToInactivity extends DeletedMatch {
    constructor(match: Match) {
        match.sendToChannel(`Match #${match.id} is inactive...`)

        super({ match })
    }
}
