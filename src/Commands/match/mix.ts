import {Command, CommandMessage, CommandoClient} from "discord.js-commando"
import Match from "../../Models/Match"

import MapType from '../../Types/MapArgumentType'

module.exports = class MixCommand extends Command {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'mix',
            memberName: 'mix',
            description: 'Start a mix.',
            group: 'match',

            // args: [
            //     {
            //         key: 'dank',
            //         label: 'dank',
            //         prompt: 'Say dank.',
            //         type: 'dank'
            //     }
            // ]
            args: [
                {
                    key: 'map',
                    label: 'map to play',
                    prompt: 'Map?',
                    type: 'map',
                    default: 'random'
                },
                {
                    key: 'playersPerTeam',
                    label: 'players per team',
                    prompt: 'How many players per team? [Minimum 3. Maximum 6]',
                    type: 'integer',
                    max: 6,
                    min: 0,
                    wait: 10,
                    default: 5
                }
            ]
        });
    }

    async run(message : CommandMessage, { playersPerTeam, map } : { playersPerTeam : string, map : string}) {
        const player = message.author
        const channel = message.channel
        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()
        const playerInMatch = Match.isPlayerInMatches(matchesWaitingForPlayers, player)

        if (playerInMatch) {
            return message.reply('You are already in a match ('+ playerInMatch.id +')! To leave write `!leave` to leave or `!list` to see all matches');
        }

        const maxPlayers = parseInt(playersPerTeam, 10) * 2

        if (maxPlayers % 2 !== 0) {
            return message.reply(`Players must be divisible by 2`);
        }

        if (!map || map.toLowerCase() === 'random') {
            map = MapType.getRandom()
        }

        const match = await Match.create(
            {
                channel,
                maxPlayers,
                maps: map,
                creator_id: player.id
            },
            player
        )

        if (!match) {
            return message.reply(`Could not create the mix... Please, contact an admin`);
        }

        return message.reply(`New mix created!`);
    }
};
