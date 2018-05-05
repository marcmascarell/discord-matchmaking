import Listener from './Listener'
import MatchCard from '../Embeds/MatchCard'
import Match from "../Models/Match"

export default class NotifyMatchReady extends Listener {

    handle({match} : {match: Match})
    {
        const embed = new MatchCard(match).render()
        const channel = match.getChannel()

        embed.setTitle('Match is ready')
        embed.setColor('#2db600')

        embed.addField('Randomizing teams...', '(Take it as a suggestion)')

        const randomPlayers = match.playerNames()

        const allies = randomPlayers.slice(0, match.playersPerTeam())
        const axis = randomPlayers.slice(match.playersPerTeam())

        if (allies.length) {
            embed.addField('Allies', allies.join(','))
        }

        if (axis.length) {
            embed.addField('Axis', axis.join(','))
        }

        embed.setFooter(`Preparing server... (~3min. aprox)`)

        channel.send(embed)
    }

}
