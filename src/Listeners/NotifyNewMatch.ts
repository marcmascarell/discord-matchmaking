import Listener from './Listener'
import MatchCard from '../Embeds/MatchCard'
import Match from "../Models/Match"

export default class NotifyNewMatch extends Listener {

	handle({match} : {match: Match}) {
	   const embed = new MatchCard(match).render()

        embed.setTitle('New match created')
             .setColor('#00b5b6')

        match.getChannel().send(embed)
    }

}
