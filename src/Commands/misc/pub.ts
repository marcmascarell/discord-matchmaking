import {CommandMessage, CommandoClient} from "discord.js-commando"

import BaseCommand from '../BaseCommand'
import MapType from "../../Types/MapArgumentType"
import utils from "../../Utilities/utils"
import {GuildResolvable} from "discord.js"
const Gamedig = require('gamedig');
const _ = require('lodash');
const Discord = require('discord.js');

export default class PubCommand extends BaseCommand {
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

    isEnabledIn(guild : GuildResolvable) {
        return true
    }

    async run(message : CommandMessage) {
        const channel = message.channel
        const servers : any = [
            {
                type: 'cod',
                host: '83.98.193.34', // NL Cracked server
                port: '28965',
                recommended: false,
                mods: true
            },
            {
                type: 'cod',
                host: '37.59.49.193', // Mugs server
                port: '21980',
                recommended: true,
                mods: false
            }
        ]

        message.say('Public servers:')

        try {
            await utils.forEachPromise(servers, server => {
                return new Promise(async (resolve, reject) => {
                    let gameState
                    let footer = ''

                    setTimeout(async () => {
                        try {
                            gameState = await Gamedig.query({
                                type: server.type,
                                host: server.host, // Mugs server
                                port: server.port
                            })
                        } catch (e) {
                            console.log('Server failed', server, e.message)
                            return reject('Unable to fetch server info')
                        }

                        const playersSortedByFrags = _.sortBy(gameState.players, 'frags').reverse()

                        const mapImage = MapType.getMapImage(gameState.map)

                        let embed = new Discord.RichEmbed()
                            .setTitle(`${utils.prettifyMapName(gameState.map)} (${gameState.players.length}/${gameState.maxplayers}) - ${gameState.name}`,)
                            .setColor('#9B59B6');

                        if (server.recommended) {
                            footer = 'Recommended public server'
                        }

                        if (server.mods) {
                            footer += server.mods ? ` * Modded` : ''
                        }

                        if (footer !== '') {
                            embed.setFooter(footer.trim())
                        }

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

                        channel.send(embed).then(resolve)
                    }, 200)
                })
            })
        } catch (e) {
            console.log('Error fetching server info', e.message)
        }

        return Promise.resolve(null)
    }

};
