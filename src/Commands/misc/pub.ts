import {CommandMessage, CommandoClient} from "discord.js-commando"

import BaseCommand from '../BaseCommand'
import utils from "../../Utilities/utils"
import {GuildResolvable} from "discord.js"
import ServerStatusCard from "../../Embeds/ServerStatusCard"
import secrets from "../../secrets"

export default class PubCommand extends BaseCommand {

    public guildOnly: boolean = false;

    constructor(client : CommandoClient) {
        super(client, {
            name: 'pub',
            memberName: 'pub',
            description: 'Public servers status.',
            group: 'misc',
            aliases: [
                'pubs',
                'public',
                'publics',
            ]
        });
    }

    async run(message : CommandMessage) {
        const channel = message.channel

        const serversStatus = await utils.fetchServersStatus(secrets.publicServers)
        const embeds = []

        serversStatus.forEach(gameState => {
            embeds.push(new ServerStatusCard(gameState).render())
        })

        embeds.forEach(embed => {
            channel.send(embed)
        })

        return Promise.resolve(null)
    }

};
