import Listener from './Listener'
import Match from "../Models/Match"

export default class NotifyDeletedMatch extends Listener {

	handle({match} : {match: Match}) {
        let message = `Deleting match #${match.id}...`

        if (match.players.length) {
            message += ' **Affected players: `' + match.playerNames().join(', ') + '` **'
        }

        match.getChannel().send(message)
	}

}
