const Commando = require('discord.js-commando');
const path = require('path');
import secrets from './secrets'
import utils from './Utilities/utils'

const client = new Commando.Client({
    owner: secrets.discordOwner,
    unknownCommandResponse: utils.isDevelopment()
});

const getClient = () => client

const init = () => {
    client.on('ready', async () => {
        client.registry
        // Registers your custom command groups
            .registerGroups([
                ['match', 'Matchmaking commands'],
                // ['some', 'Some group'],
                // ['other', 'Some other group']
            ])

            // Registers all built-in groups, commands, and argument types
            // .registerDefaults()
            .registerDefaultCommands({
                help: true
            })
            .registerDefaultGroups()
            .registerDefaultTypes()

            .registerTypesIn(path.join(__dirname, 'Types'))

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'Commands/match'));
    })

    client.login(secrets.discordToken);
}

export default {
    init,
    getClient
}
