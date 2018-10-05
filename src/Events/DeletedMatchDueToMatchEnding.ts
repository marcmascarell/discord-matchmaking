import DeletedMatch from "./DeletedMatch"
import DestroyMatchServer from "../Listeners/DestroyMatchServer"
import DeleteVoiceChannels from "../Listeners/DeleteVoiceChannels"
import Match from "../Models/Match"

export default class DeletedMatchDueToMatchEnding extends DeletedMatch {
    constructor(match: Match) {
        match.getChannel().send(`Match #${match.id} finished...`)

        super({ match })
    }

    get listeners(): Array<any> {
        return [DestroyMatchServer, DeleteVoiceChannels]
    }
}
