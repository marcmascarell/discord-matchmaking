import Listener from './Listener'
import Match from "../Models/Match"
import {Client} from "discord.js"
import bot from "../bot"
import discordUtils from "../Utilities/discordUtils";

export default class CreateVoiceChannels extends Listener {

	async handle({match} : {match: Match}) {
        const client = <Client> bot.getClient()
        const guild = await client.guilds.find(guild => guild.id === match.guildId)

        if (!guild) {
            console.log('Unable to find guild to create voice channels')
            return
        }

        const category = await discordUtils.createCategory(guild, 'Matches')
        const userLimit = match.maxPlayers / 2

        discordUtils.createVoiceChannel(guild, `Match #${match.id} | Blue`, {
            category,
            userLimit
        })

        discordUtils.createVoiceChannel(guild, `Match #${match.id} | Red`, {
            category,
            userLimit
        })
    }

}
