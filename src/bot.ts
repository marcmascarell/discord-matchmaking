const Commando = require('discord.js-commando');
const path = require('path');
import secrets from './secrets'
import utils from './Utilities/utils'
import {Guild, GuildChannel, TextChannel} from "discord.js"

let botReady = false

const client = new Commando.Client({
    owner: secrets.discordOwner,
    unknownCommandResponse: utils.isDevelopment()
});

const getClient = () => client

const isReady = () => botReady

const init = () => {
    client.on('ready', async () => {
        console.log('BOT is ready.')
        botReady = true

        client.user.setActivity('!help', { type: 'LISTENING' })

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
                ['misc', 'Other useful commands'],
                // ['some', 'Some group'],
                // ['other', 'Some other group']
            ])

            .registerTypesIn(path.join(__dirname, 'Types'))

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, 'Commands/misc'))
            .registerCommandsIn(path.join(__dirname, 'Commands/match'))

        // Create an event listener for new guild members
        client.on('guildMemberAdd', member => {
            // Send the message to a designated channel on a server:
            const channel : any = member.guild.channels.find('name', 'general');

            // Do nothing if the channel wasn't found on this server
            if (!channel) return;

            // Send the message, mentioning the member
            channel.send(`Welcome **${member}** to the **COD1 Community**! Stay tunned for future events.\n_Use \`!help\` to see what can I do for you._`, {
                files: ['https://cdn.discordapp.com/attachments/438725577831219210/484395447939629086/make-cod-great-again.jpg']
            });
        });
    })

    client.login(secrets.discordToken);
}

const getChannel = async (guildName, channelName) : Promise<TextChannel|GuildChannel|any> => {
    const guild : Guild = await getClient().guilds.find(guild => guild.name === guildName)

    if (!guild) return null

    return await guild.channels.find(channel => channel.name === channelName)
}

export default {
    init,
    getClient,
    getChannel,
    isReady
}
