import Listener from "./Listener"
import FullMatchCard from "../Embeds/FullMatchCard"
import Match from "../Models/Match"

export default class NotifyNewMatch extends Listener {
    handle({ match }: { match: Match }) {
        const embed = new FullMatchCard(match).render()

        if (match.scheduledAt) {
            embed.setTitle(`📅 New scheduled match created`)
        } else {
            embed.setTitle(":fire: New match created")
        }

        embed.setColor("#00b5b6")

        match.sendToChannel(embed)
    }
}
