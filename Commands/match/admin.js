const Commando = require('discord.js-commando');
const utils = require('../../Utilities/utils')
const secrets = require('../../secrets')
const Match = require('../../Models/Match')
const Discord = require('discord.js');

module.exports = class JoinCommand extends Commando.Command {
    constructor(client) {
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

    hasPermission(message) {
        return secrets.discordAdmins.includes(message.author.id)
    }

    run(message, {id}) {
        // const match = Match.getFull...(id)
        //
        // if (!match) {
        //     return message.reply('No match with given ID ('+ id +')!');
        // }
        //
        // const embed = new Discord.RichEmbed().setColor('#ffffff');
        //
        // embed.addField(
        //     `Match ID`,
        //     match.id
        // )
        //
        // embed.addField(
        //     `Hostname`,
        //     match.getServerName()
        // )
        //
        // embed.addField(
        //     `Players (${match.players.length}/${match.maxPlayers})`,
        //     match.getPlayerNames().join(', ')
        // )
        //
        // embed.addField(
        //     `Map`,
        //     match.map
        // )
        //
        // if (match.isServerOnline()) {
        //     embed.addField(
        //         `Ip`,
        //         match.server.serverIP
        //     )
        //
        //     embed.addField(
        //         `Password`,
        //         match.server.password
        //     )
        //
        //     embed.addField(
        //         `Rcon`,
        //         utils.getRconForServer(match.getServerName())
        //     )
        // }
        //
        // message.author.createDM().then(channel => {
        //     channel.send(embed)
        // })
    }
};
