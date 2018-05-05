import {Command, CommandMessage, CommandoClient} from "discord.js-commando"
const Discord = require("discord.js")

import _ from 'lodash'
import secrets from '../../secrets'
import utils from '../../Utilities/utils'
import Match from '../../Models/Match'

export default class JoinCommand extends Command {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'admin',
            memberName: 'admin',
            description: 'Admin match info.',
            group: 'match',

            args: [
                {
                    key: 'id',
                    label: 'Match ID',
                    prompt: 'Match ID',
                    type: 'integer',
                }
            ]
        });
    }

    hasPermission(message : CommandMessage) {
        const found = _.find(secrets.discordAdmins, id => id === message.author.id)

        return found !== undefined
    }

    async run(message : CommandMessage, {id} : {id: number}) {
        const match = await Match.getFullMatchById(id)

        if (!match) {
            return message.reply('No match with given ID ('+ id +')!');
        }

        const embed = new Discord.RichEmbed().setColor('#ffffff');

        embed.addField(
            `Match ID`,
            match.id
        )

        embed.addField(
            `Hostname`,
            match.getServerName()
        )

        embed.addField(
            `Players (${match.players.length}/${match.maxPlayers})`,
            match.playerNames().join(', ')
        )

        embed.addField(
            `Map`,
            match.mapNames().join(', ')
        )

        if (match.isServerOnline()) {
            embed.addField(
                `Ip`,
                match.server.serverIP
            )

            embed.addField(
                `Password`,
                match.server.password
            )

            embed.addField(
                `Rcon`,
                utils.getRconForServer(match.getServerName())
            )
        }

        message.author.createDM().then(channel => {
            channel.send(embed)
        })
    }
};
