import Listener from './Listener'
import MatchCard from '../Embeds/MatchCard'
import Match from "../Models/Match"
import discordUtils from "../Utilities/discordUtils";
import {Client} from "discord.js";
import bot from "../bot";
const moment = require('moment');

export default class CreateScheduledMatchTextChannel extends Listener {

	async handle({match} : {match: Match}) {
        if (!match.scheduledAt) {
            return
        }

        const embed = new MatchCard(match).render()

        embed.setTitle(`Scheduled match`)

        const dayDate = moment(match.scheduledAt).format("M-D-YY")
        const hourDate= moment(match.scheduledAt).format("H-mm")

        const client = <Client> bot.getClient()
        const guild = await client.guilds.find(guild => guild.id === match.guildId)

        if (!guild) {
            console.log('Unable to find guild to create voice channels')
            return
        }

        const category = await discordUtils.createCategory(guild, 'scheduled-matches')
        const userLimit = null

        const channel = await discordUtils.createTextChannel(guild, `📅${dayDate}⏰${hourDate}💠match-${match.id}`, {
            category,
            userLimit
        })

        embed.setColor('#00b5b6')

        channel.send(embed)
    }


}
