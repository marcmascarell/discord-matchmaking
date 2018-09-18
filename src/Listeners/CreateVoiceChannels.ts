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

        const voiceMatchesCategory = await discordUtils.createCategory(guild, 'Matches')
        const userLimit = match.maxPlayers / 2

        discordUtils.createVoiceChannel(guild, voiceMatchesCategory, userLimit, `Match #${match.id} | Blue`)
        discordUtils.createVoiceChannel(guild, voiceMatchesCategory, userLimit, `Match #${match.id} | Red`)
    }

}
