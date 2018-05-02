const Commando = require('discord.js-commando');
const Match = require('../../Models/Match')
const MatchIsReady = require('../../Events/MatchIsReady');

module.exports = class JoinCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'join',
            memberName: 'join',
            description: 'Join match.',
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

    async run(message, {id}) {
        const channel = message.channel

        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()

        const match = matchesWaitingForPlayers.find(match => match.id === id)

        if (!match) {
            return message.reply(`That match is not waiting for players. Ensure that the ID is correct.`);
        }

        const player = message.author
        id = parseInt(id, 10)

        const playerInMatch = Match.isPlayerInMatches(matchesWaitingForPlayers, player)

        if (playerInMatch) {
            return message.reply('You are already in a match ('+ playerInMatch.id +')! To leave write `!leave` to leave or `!list` to see all matches');
        }

        const joinedMatch = await match.join(player)

        if (!joinedMatch) {
            return message.reply(`Could not join match ${match.id}`);
        }

        if (joinedMatch.isReady()) {
            new MatchIsReady(channel, joinedMatch)
        }

        return message.reply(`Joined match ${match.id}`);
    }
};
