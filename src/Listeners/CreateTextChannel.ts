import Listener from './Listener'
import MatchCard from '../Embeds/MatchCard'
import Match from "../Models/Match"
import discordUtils from "../Utilities/discordUtils";
import {Client} from "discord.js";
import bot from "../bot";

export default class CreateTextChannel extends Listener {

	async handle({match} : {match: Match}) {
	   const embed = new MatchCard(match).render()

        if (match.scheduledAt) {
            embed.setTitle(`New scheduled match created`)

            const client = <Client> bot.getClient()
            const guild = await client.guilds.find(guild => guild.id === match.guildId)

            if (!guild) {
                console.log('Unable to find guild to create voice channels')
                return
            }

            const category = await discordUtils.createCategory(guild, 'Matches')
            const userLimit = null

            discordUtils.createTextChannel(guild, ``, {
                category,
                userLimit
            })
        } else {}

        embed.setColor('#00b5b6')

        match.getChannel().send(embed)
    }

}
