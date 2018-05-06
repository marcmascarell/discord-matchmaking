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
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: true
            })
            // Registers all built-in groups, commands, and argument types
            // .registerDefaults()

            // Registers your custom command groups
            .registerGroups([
                ['match', 'Matchmaking commands'],
                // ['some', 'Some group'],
                // ['other', 'Some other group']
            ])

            .registerTypesIn(path.join(__dirname, 'Types'))

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'Commands/match'));

        // Create an event listener for new guild members
        client.on('guildMemberAdd', member => {
            // Send the message to a designated channel on a server:
            const channel = member.guild.channels.first();
            // Do nothing if the channel wasn't found on this server
            if (!channel) return;
            // Send the message, mentioning the member
            channel.send(`Welcome ${member}! Use \`!help\`.`);
        });
    })

    client.login(secrets.discordToken);
}

export default {
    init,
    getClient
}
