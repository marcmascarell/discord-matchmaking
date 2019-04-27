import { CommandMessage, CommandoClient } from "discord.js-commando"
import BaseCommand from "../BaseCommand"
import secrets from "../../secrets"

export default class StreamersCommand extends BaseCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: "streamers",
            memberName: "streamers",
            description: "COD streamers list.",
            group: "misc",
        })
    }

    async run(message: CommandMessage) {
        const streamers = secrets.streamers

        let reply = "The streamers are:\n\n"

        reply += streamers
            .map(streamer => {
                return `twitch.tv/**${streamer}**`
            })
            .join("\n")

        return message.reply(reply)
    }
}
