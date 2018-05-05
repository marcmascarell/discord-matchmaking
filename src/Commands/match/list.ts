import {Command, CommandMessage, CommandoClient} from "discord.js-commando"
import Match from "../../Models/Match"
import ListPendingMatches from "../../Listeners/ListPendingMatches"
import {DMChannel, GroupDMChannel, TextChannel} from "discord.js"

module.exports = class ListCommand extends Command {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'list',
            memberName: 'list',
            description: 'List of current matches.',
            group: 'match',

            args: [
                {
                    key: 'showReadyMatches',
                    label: 'Show already full matches',
                    prompt: 'showReadyMatches?',
                    type: 'boolean',
                    default: false
                }
            ]
        });
    }

    async run(message : CommandMessage, { showReadyMatches } : { showReadyMatches : boolean}) {
        const channel : TextChannel|DMChannel|GroupDMChannel = message.channel
        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()

        // console.log('matchesWaitingForPlayers', matchesWaitingForPlayers)
        if (matchesWaitingForPlayers.length === 0) {
            message.reply('There are no matches looking for players right now.');
        } else {
            new ListPendingMatches(channel, matchesWaitingForPlayers)
        }

        // const pendingMatches = Match.getPendingMatches()
        // // const readyMatches = Match.getReadyMatches()
        //
        // if (pendingMatches.length === 0) {
        //     message.reply('There are no matches looking for players right now.');
        //     // embed.setImage('https://78.media.tumblr.com/62ac4b87b85c34e8dae2b29436f84d99/tumblr_inline_ndwwkp86kB1qll2si.png')
        // } else {
        //     new ListPendingMatches(Match.getPendingMatches())
        // }

        // if (showReadyMatches && readyMatches.length) {
        //     new ListPendingMatches(Match.getReadyMatches())
        // }

        return message.reply('Use `!match` or `!mix` to start a new one');
    }
};
