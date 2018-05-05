import {Command, CommandMessage, CommandoClient} from "discord.js-commando"
import Match from "../../Models/Match"

import MapType from '../../Types/MapArgumentType'

export default class MatchCommand extends Command {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'match',
            memberName: 'match',
            description: 'Start a match.',
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
                    key: 'players',
                    label: 'Players',
                    prompt: 'How many players? 5v5/5vs5 ...',
                    type: 'string',
                    wait: 15
                },
                {
                    key: 'map',
                    label: 'map to play',
                    prompt: 'Map? Random/' + MapType.maps.join('/'),
                    type: 'map',
                    default: 'random'
                }
            ]
        });
    }

    async run(message : CommandMessage, { players, map } : { players : string, map : string}) {
        const regex = /(\d)(v|vs|\svs\s|\sv\s)\d/gm;

        const regexMatch = regex.exec(players)

        if (regexMatch === null) {
            return message.reply(`Invalid syntax. Write it like this: 5v5 or 5vs5 (NvsN)`);
        }

        const playersPerTeam = parseInt(regexMatch[1], 10)
        const maxPlayers = playersPerTeam * 2

        if (maxPlayers % 2 !== 0) {
            return message.reply(`Players must be divisible by 2`);
        }

        const player = message.author
        const channel = message.channel
        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()
        const playerInMatch = Match.isPlayerInMatches(matchesWaitingForPlayers, player)

        if (playerInMatch) {
            return message.reply('You are already in a match ('+ playerInMatch.id +')! To leave write `!leave` to leave or `!list` to see all matches');
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
