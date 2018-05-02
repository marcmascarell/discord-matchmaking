const Commando = require('discord.js-commando');
const Match = require('../../Models/Match');
const MapType = require('../../types/map');
const MatchIsReady = require('../../Events/MatchIsReady');
const AnnounceNewMatch = require('../../Events/AnnounceNewMatch');

module.exports = class MixCommand extends Commando.Command {
    constructor(client) {
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

    async run(message, { playersPerTeam, map }) {
        const player = message.author
        const channel = message.channel
        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()
        const playerInMatch = Match.isPlayerInMatches(matchesWaitingForPlayers, player)

        if (playerInMatch) {
            return message.reply('You are already in a match ('+ playerInMatch.id +')! To leave write `!leave` to leave or `!list` to see all matches');
        }

        if (map.toLowerCase() === 'random') {
            map = MapType.getRandom()
        }

        const match = await Match.create(
            {
                channel,
                playersPerTeam,
                maps: map,
                creator_id: player.id
            },
            player
        )

        if (!match) {
            return message.reply(`Could not create the mix... Please, contact an admin`);
        }

        new AnnounceNewMatch(channel, match)

        return message.reply(`New mix created!`);
    }
};
