import Event from './Event'
import NotifyMatchReady from '../Listeners/NotifyMatchReady'
import CreateMatchServer from '../Listeners/CreateMatchServer'

export default  class MatchReady extends Event{

    get listeners() : Array<any> {
        return [
            CreateMatchServer,
            NotifyMatchReady
        ]
    }
};
