import Listener from "./Listener"
import Match from "../Models/Match"
import { Client, VoiceChannel } from "discord.js"
import bot from "../bot"
import _ from "lodash"

export default class DeleteMatchVoiceChannels extends Listener {
    async handle({ match }: { match: Match }) {
        const client = <Client>bot.getClient()
        const guild = await client.guilds.find(
            guild => guild.id === match.guildId,
        )

        if (!guild) {
            console.log("Unable to find guild to create voice channels")
            return
        }

        const voiceChannels = guild.channels.filter(
            channel => channel.type === "voice",
        )
        const matchChannels = voiceChannels
            .filter(channel => _.includes(channel.name, `Match #${match.id}`))
            .array()

        matchChannels.forEach((matchChannel: VoiceChannel) => {
            const members = matchChannel.members.array()
            console.log("members", members)

            if (members.length) {
                console.log("Prevented not empty voice channel from removing")
                return
            }

            matchChannel.delete()
        })
    }
}
