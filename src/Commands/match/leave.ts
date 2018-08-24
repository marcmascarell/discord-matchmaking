import {CommandMessage, CommandoClient} from "discord.js-commando"
import Match from "../../Models/Match"
import GuildCommand from '../GuildCommand'

export default class JoinCommand extends GuildCommand {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'leave',
            memberName: 'leave',
            description: 'Leave match.',
            group: 'match',
        });
    }

    async run(message : CommandMessage) {
        const player : any = message.author

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
