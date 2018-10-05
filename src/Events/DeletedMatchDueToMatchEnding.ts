import DeletedMatch from './DeletedMatch'
import DestroyMatchServer from '../Listeners/DestroyMatchServer'
import DeleteMatchVoiceChannels from '../Listeners/DeleteMatchVoiceChannels'
import Match from "../Models/Match"

export default class DeletedMatchDueToMatchEnding extends DeletedMatch {
    constructor(match : Match) {
        match.sendToChannel(`Match #${match.id} finished...`)

        super({match})
    }

    get listeners() : Array<any> {
        return [
            DestroyMatchServer,
            DeleteMatchVoiceChannels
        ]
    }
};
