import {CommandMessage, CommandoClient} from "discord.js-commando"
import BaseCommand from '../BaseCommand'
import MapType from '../../Types/MapArgumentType'

export default class MapsCommand extends BaseCommand {
    constructor(client : CommandoClient) {
        super(client, {
            name: 'maps',
            memberName: 'maps',
            description: 'Show the active service maps (The maps that will be choosable in competitions). Will change over time.',
            group: 'misc',
        });
    }

    async run(message : CommandMessage) {
        return message.reply(`Active service maps are: ${MapType.maps.join(', ')}`);
    }
};
