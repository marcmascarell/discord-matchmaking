const Commando = require('discord.js-commando');
const path = require('path');
import secrets from './secrets'

const client = new Commando.Client({
    owner: secrets.discordOwner
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
            .registerDefaults()

            .registerTypesIn(path.join(__dirname, 'Types'))

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'Commands'));
    })

    client.login(secrets.discordToken);
}

export default {
    init,
    getClient
}
