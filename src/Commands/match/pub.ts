import {CommandMessage, CommandoClient} from "discord.js-commando"
import BaseCommand from '../BaseCommand'
import MapType from "../../Types/MapArgumentType"
import utils from "../../Utilities/utils"
const Gamedig = require('gamedig');
const _ = require('lodash');
const Discord = require('discord.js');

export default class PubCommand extends BaseCommand {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'pub',
            memberName: 'pub',
            description: 'Recommended public server status.',
            group: 'match',
        });
    }

    async run(message : CommandMessage, {id} : {id: number}) {
        const channel = message.channel
        let gameState

        try {
            gameState = await Gamedig.query({
                type: 'cod',
                host: '37.59.49.193', // Mugs server
                port: '21980'
            })
        } catch (e) {
            return message.reply(`Couldn't fetch server info :(`);
        }

        const playersSortedByFrags = _.sortBy(gameState.players, 'frags').reverse()

        const mapImage = MapType.getMapImage(gameState.map)

        let embed = new Discord.RichEmbed()
            .setTitle(`${utils.prettifyMapName(gameState.map)} (${gameState.players.length}/${gameState.maxplayers}) - ${gameState.name}`,)
            .setFooter(`Recommended TDM Public server`)
            .setColor('#9B59B6');

        if (playersSortedByFrags.length) {
            embed.addField(
                'Players',
                _.map(playersSortedByFrags, (player) => {
                    return `${player.name.trim()} *(${player.frags})*`
                }).join("\n")
            )
        }

        embed.addField(
            'Address',
            '`/connect ' + `${gameState.query.host}:${gameState.query.port}` + '`'
        )

        if (mapImage) {
            embed.setThumbnail(mapImage)
        }

        channel.send(embed)
    }
};
