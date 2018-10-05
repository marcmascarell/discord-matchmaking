import Listener from "./Listener"
import MatchCard from "../Embeds/MatchCard"
import Match from "../Models/Match"

export default class NotifyNewMatch extends Listener {
    handle({ match }: { match: Match }) {
        const embed = new MatchCard(match).render()

        if (match.scheduledAt) {
            embed.setTitle(`New scheduled match created`)
        } else {
            embed.setTitle("New match created")
        }

        embed.setColor("#00b5b6")

        match.sendToChannel(embed)
    }
}
