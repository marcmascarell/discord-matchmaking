import Listener from './Listener'
import bot from '../bot'
import Match from "../Models/Match"
import _ from "lodash"
import {Guild, GuildMember} from "discord.js"

export default class SendServerInfoToPlayers extends Listener {

	handle({match} : {match: Match}) {
        const minutes = 75 // minutes until match is declared ended
        const channel = match.getChannel()

        if (! match.isServerOnline()) {
            channel.send(`Something went wrong provisioning the server for match ${match.id}...`)

            return
        }

        const playersIds : string[] = match.playerIds()

        const players = bot.getClient()
            .guilds
            .find((guild : Guild) => guild.id === channel.guild.id)
            .members
            .filter((member : GuildMember) => {
                const found = _.find(playersIds, (id : string) => id === member.user.id)

                return found !== undefined
            })

        players.forEach((player : GuildMember) => {
            player.createDM().then(channel => {
                channel.send(
                    `Your match ${match.id} is ready:` +
                    `\r\n` +
                    '`' + `/connect ${match.server.ip}; password ${match.server.password}` + '`' +
                    `\r\n- Do not start the game until all players are ready (You won't be able to restart the map)` +
                    `\r\n- You are expected to behave and respect the common sense rules` +
                    `\r\nGood luck & Have fun! (Server will self-destroy after ${minutes} minutes)`
                )
            })
        })

        channel.send(`Server for match ${match.id} ready! DM sent to players!`)
	}

}
