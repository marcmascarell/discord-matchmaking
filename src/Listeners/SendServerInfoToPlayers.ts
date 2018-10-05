import Listener from "./Listener"
import bot from "../bot"
import Match from "../Models/Match"
import utils from "../Utilities/utils"
import { Guild, GuildMember } from "discord.js"
import MatchCard from "../Embeds/MatchCard"

export default class SendServerInfoToPlayers extends Listener {
    handle({ match }: { match: Match }) {
        const minutes = 75 // minutes until match is declared ended
        const channel = match.getChannel()

        if (!match.isServerOnline()) {
            channel.send(
                `Something went wrong provisioning the server for match ${
                    match.id
                }...`,
            )

            return
        }

        const playerDiscordIds: string[] = match.playerDiscordIds()

        const players = bot
            .getClient()
            .guilds.find((guild: Guild) => guild.id === channel.guild.id)
            .members.filter((member: GuildMember) => {
                return utils.includes(playerDiscordIds, member.user.id)
            })

        const embed = new MatchCard(match).render()

        embed.setColor("#37b600")
        embed.setTitle(`Your match is ready!`)

        embed.setDescription(
            `\r\n- Join your respective voice channel` +
                `\r\n- Do not start the game until all players are ready (You won't be able to restart the map)` +
                `\r\n- You are expected to behave and respect the common sense rules`,
        )

        embed.addField(
            `Server`,
            `/connect ${match.server.ip}; password ${match.server.password}`,
        )

        embed.addField(`Voice channel`, `Match #${match.id}`)

        embed.setFooter(
            `Good luck & Have fun! (Server will self-destroy after ${minutes} minutes)`,
        )

        players.forEach((player: GuildMember) => {
            player.createDM().then(channel => {
                channel.send(embed)
            })
        })

        channel.send(`Server for match ${match.id} ready! DM sent to players!`)
    }
}
