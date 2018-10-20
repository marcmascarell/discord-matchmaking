import { CommandMessage, CommandoClient } from "discord.js-commando"
import Match from "../../Models/Match"
import MatchReady from "../../Events/MatchReady"
import BaseCommand from "../BaseCommand"
import utils from "../../Utilities/utils"
import { RichEmbed, User } from "discord.js"
import bot from "../../bot"
import FullMatchCard from "../../Embeds/FullMatchCard"
import discordUtils from "../../Utilities/discordUtils"

export default class JoinCommand extends BaseCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: "join",
            memberName: "join",
            description: "Join match.",
            group: "match",
            guildOnly: true,

            args: [
                {
                    key: "id",
                    label: "Match ID",
                    prompt: "Match ID",
                    type: "integer",
                },
            ],
        })
    }

    async run(message: CommandMessage, { id }: { id: number }) {
        const channel = message.channel

        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()

        const match = matchesWaitingForPlayers.find(match => match.id === id)

        if (!match) {
            return message.reply(
                `That match is not waiting for players. Ensure that the ID is correct.`,
            )
        }

        const player = message.author

        if (typeof id === "string") {
            id = parseInt(id, 10)
        }

        const collidingMatch = await Match.hasCollidingMatch(
            player.id,
            match.scheduledAt,
        )

        if (collidingMatch) {
            return message.reply(
                "You are in a match that collides with the one you want to join (Colliding match: " +
                    collidingMatch.id +
                    ")! To leave write `!leave` to leave or `!list` to see all matches",
            )
        }

        const joinedMatch = await match.join(player)

        if (!joinedMatch) {
            return message.reply(`Could not join match ${match.id}`)
        }

        if (joinedMatch.isFull() && !joinedMatch.isScheduled()) {
            new MatchReady({
                channel,
                match: joinedMatch,
            })
        }

        if (joinedMatch.isScheduled()) {
            const embed = new FullMatchCard(joinedMatch).render()

            try {
                const channel = await discordUtils.getScheduledTextChannel(
                    joinedMatch,
                )

                channel.send(embed)
            } catch (e) {
                console.log(e.stack)
            }
        }

        return message.reply(`Joined match ${match.id}`)
    }
}
