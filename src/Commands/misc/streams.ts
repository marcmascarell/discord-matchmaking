import {CommandMessage, CommandoClient} from "discord.js-commando"
import BaseCommand from '../BaseCommand'
import utils from "../../Utilities/utils"
import NotifyStreams from "../../Listeners/NotifyStreams"

export default class StreamsCommand extends BaseCommand {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'streams',
            memberName: 'streams',
            description: 'COD streams.',
            group: 'misc',
            aliases: [
                'stream',
                'streaming',
                'streamings',
            ]
        });
    }

    async run(message : CommandMessage) {
        const streams : any = await utils.getStreams()
        const channel = message.channel

        if (!streams || streams.length === 0) {
            return message.reply('There are no streams right now.')
        }

        new NotifyStreams().handle(channel, streams)
    }
};
