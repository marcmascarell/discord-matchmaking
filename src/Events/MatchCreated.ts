import Event from './Event'
import NotifyNewMatch from '../Listeners/NotifyNewMatch'
import CreateScheduledMatchTextChannel from "../Listeners/CreateScheduledMatchTextChannel";

export default class MatchCreated extends Event {

    get listeners() : Array<any> {
   		return [
            NotifyNewMatch,
            CreateScheduledMatchTextChannel
        ]
	}

};
