const Commando = require('discord.js-commando');
const Match = require('../../Models/Match')

module.exports = class JoinCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            memberName: 'leave',
            description: 'Leave match.',
            group: 'match',
        });
    }

    async run(message) {
        const player = message.author

        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()

        const playerInMatch = Match.isPlayerInMatches(matchesWaitingForPlayers, player)

        if (! playerInMatch) {
            return message.reply('You are not in a match!');
        }

        const left = await playerInMatch.leave(player)

        if (left) {
            return message.reply(`Left match ${playerInMatch.id}`);
        } else {
            return message.reply(`Something went wrong leaving the match... Please, contact an administrator.`);
        }
    }
};
