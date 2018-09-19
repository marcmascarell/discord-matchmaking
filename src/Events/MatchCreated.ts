import Event from './Event'
import NotifyNewMatch from '../Listeners/NotifyNewMatch'
import CreateTextChannel from "../Listeners/CreateTextChannel";

export default class MatchCreated extends Event {

    get listeners() : Array<any> {
   		return [
            NotifyNewMatch,
            CreateTextChannel
        ]
	}

};
