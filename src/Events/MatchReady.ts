import Event from "./Event"
import NotifyMatchReady from "../Listeners/NotifyMatchReady"
import CreateMatchServer from "../Listeners/CreateMatchServer"
import CreateMatchVoiceChannels from "../Listeners/CreateMatchVoiceChannels"

export default class MatchReady extends Event {
    get listeners(): Array<any> {
        return [CreateMatchServer, NotifyMatchReady, CreateMatchVoiceChannels]
    }
}
