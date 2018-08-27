import {CommandMessage, CommandoClient} from "discord.js-commando"
import Match from "../../Models/Match"

import MapType from '../../Types/MapArgumentType'
import BaseCommand from "../BaseCommand";

export default class MatchCommand extends BaseCommand {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'match',
            memberName: 'match',
            description: 'Start a match.',
            group: 'match',
            guildOnly: true,
            aliases: ['mix'],
            args: [
                {
                    key: 'players',
                    label: 'Players',
                    prompt: 'How many players? (5 or 5v5 or 5vs5 ... NvsN)',
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
        // This works with 5, 5v5, 5vs5 formats
        const playersPerTeam = parseInt(players[0], 10)

        if (isNaN(playersPerTeam)) {
            return message.reply(`Invalid player number. Write it like this: 5 or 5v5 or 5vs5 (NvsN)`);
        }

        const maxPlayers = playersPerTeam * 2

        if (playersPerTeam < 2) {
            return message.reply(`2 players per team is the minmum`);
        }

        if (playersPerTeam > 6) {
            return message.reply(`6 players per team is the maximum`);
        }

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
            return message.reply(`Could not create the match... Please, contact an admin`);
        }

        return message.reply(`New match created!`);
    }
};
