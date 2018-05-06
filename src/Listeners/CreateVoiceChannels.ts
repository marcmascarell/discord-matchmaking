import Listener from './Listener'
import Match from "../Models/Match"
import {Client, VoiceChannel} from "discord.js"
import bot from "../bot"

export default class CreateVoiceChannels extends Listener {

	async handle({match} : {match: Match}) {
        const client = <Client> bot.getClient()
        const guild = await client.guilds.find(guild => guild.id === match.guildId)

        if (!guild) {
            console.log('Unable to find guild to create voice channels')
            return
        }

        // const voiceWaitingCategory = await this.createVoiceCategory(guild, 'Waiting for players...')
        //
        // this.createWaitingChannel(guild, voiceWaitingCategory, match, `!join ${match.id} (${match.players.length}/${match.maxPlayers})`)

        const voiceMatchesCategory = await this.createVoiceCategory(guild, 'Matches')

        this.createTeamVoiceChannel(guild, voiceMatchesCategory, match, `Match #${match.id} | Blue`)
        this.createTeamVoiceChannel(guild, voiceMatchesCategory, match, `Match #${match.id} | Red`)
    }

    async createVoiceCategory(guild, name) {
	    const category = await guild.channels
            .filter(channel => channel.type === 'category')
            .find(channel => channel.name === name)

        if (category) {
	        return category
        }

        return guild.channels
            .filter(channel => channel.type === 'category')
            .first()
            .clone(name)
    }

    async createWaitingChannel(guild, voiceCategory, match, name) {
        const voiceChannels = guild.channels.filter(channel => channel.type === 'voice')

        const voiceChannel = <VoiceChannel> voiceChannels.first()

        const newChannel = await voiceChannel.clone(name)
        newChannel.setParent(voiceCategory)
        newChannel.edit({
            userLimit: 0
        })
        newChannel.createInvite().then(invite => {
            console.log('invite', invite)
        })
    }

    async createTeamVoiceChannel(guild, voiceCategory, match, name) {
        const voiceChannels = guild.channels.filter(channel => channel.type === 'voice')

        const voiceChannel = <VoiceChannel> voiceChannels.first()

        const newChannel = await voiceChannel.clone(name)
        newChannel.setParent(voiceCategory)
        newChannel.edit({
            userLimit: match.maxPlayers / 2
        })
        newChannel.createInvite().then(invite => {
            console.log('invite', invite)
        })
    }

}
