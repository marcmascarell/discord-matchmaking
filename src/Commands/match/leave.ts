import { CommandMessage, CommandoClient } from "discord.js-commando"
import Match from "../../Models/Match"
import BaseCommand from "../BaseCommand"
import User from "../../Models/User"

export default class LeaveCommand extends BaseCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: "leave",
            memberName: "leave",
            description: "Leave match.",
            group: "match",
            guildOnly: true,

            args: [
                {
                    key: "id",
                    label: "Match ID",
                    prompt: "Match ID",
                    type: "integer",
                    default: false,
                },
            ],
        })
    }

    private async handleWithId(message, id) {
        const player: any = message.author

        if (typeof id === "string") {
            id = parseInt(id, 10)
        }

        const match = await Match.getFullMatchById(id)

        if (!match) {
            return message.reply("That match doesnt exist!")
        }

        const playerInMatch = Match.isPlayerInMatch(match, player)

        if (!playerInMatch) {
            return message.reply(`You are not in match ${id}!`)
        }

        const left = await match.leave(player)

        if (left) {
            return message.reply(`Left match ${match.id}`)
        } else {
            return message.reply(
                `Something went wrong leaving the match... Please, contact an administrator.`,
            )
        }
    }

    private async findOutId(message) {
        const player: any = message.author

        const userWithMatches = await User.getNotEndedMatches(player.id)

        if (userWithMatches.matches.length === 0) {
            return message.reply(`You are not in match!`)
        }

        if (userWithMatches.matches.length > 1) {
            return message.reply(
                `You are in more than one match! Write \`!leave <MatchNumber>\` (Matches you're in: ${userWithMatches.matches
                    .map(match => match.id)
                    .join(", ")})`,
            )
        }

        return userWithMatches.matches[0].id
    }

    async run(message: CommandMessage, { id }: { id: number }) {
        if (!id) {
            id = await this.findOutId(message)

            // Already failed
            if (!id) return null
        }

        return this.handleWithId(message, id)
    }
}
