import { CommandMessage, CommandoClient } from "discord.js-commando"

import BaseCommand from "../BaseCommand"
import utils from "../../Utilities/utils"
import FullServerStatusCard from "../../Embeds/FullServerStatusCard"
import secrets from "../../secrets"
import MinimalServersStatusCard from "../../Embeds/MinimalServersStatusCard"

export default class PubCommand extends BaseCommand {
    public guildOnly: boolean = false

    constructor(client: CommandoClient) {
        super(client, {
            name: "pub",
            memberName: "pub",
            description: "Public servers status.",
            group: "misc",
            aliases: ["pubs", "public", "publics"],
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

    async run(message: CommandMessage, { id }: { id: number }) {
        const channel = message.channel

        let servers = secrets.publicServers
        let embed

        if (typeof id === "string") {
            id = parseInt(id, 10)
        }

        if (id) {
            const server = servers[id - 1]
            if (!server) {
                return message.reply("That server doesnt exist!")
            }

            const serverStatus = await utils.fetchServersStatus([server])

            if (serverStatus.length === 0) {
                return message.reply("Unable to fetch server info!")
            }

            embed = new FullServerStatusCard(serverStatus[0]).render()
        } else {
            const serversStatus = await utils.fetchServersStatus(servers)

            embed = new MinimalServersStatusCard(serversStatus).render()
        }

        channel.send(embed)

        return Promise.resolve(null)
    }
}
